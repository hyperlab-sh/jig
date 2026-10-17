/*
 * edge.js
 *
 * (c) EdgeJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Parser, EdgeBuffer, Stack } from '@jig-lang/parser'
import { MustacheTypes } from '@jig-lang/lexer'
import type { Token, MustacheToken } from '@jig-lang/lexer/types'

import { type Processor } from './processor.js'
import { CacheManager } from './cache_manager.js'
import type {
  ClaimTagFn,
  TagsContract,
  LoaderContract,
  CompilerOptions,
  CompiledTemplate,
} from './types.js'

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor

/**
 * Compiler is to used to compile templates using the `@jig-lang/parser`. Along with that
 * it natively merges the contents of a layout with a parent template.
 */
export class Compiler {
  /**
   * The variables someone can access inside templates. All other
   * variables will get prefixed with `state` property name
   */
  #inlineVariables: string[] = ['$filename', 'state', '$context']

  /**
   * A fixed set of params to pass to the template every time.
   */
  #templateParams = ['template', 'state', '$context']

  #claimTagFn?: ClaimTagFn
  #loader: LoaderContract
  #tags: TagsContract
  #processor: Processor

  /**
   * Caches compiled templates
   */
  cacheManager: CacheManager

  /**
   * Know if compiler is compiling in the async mode or not
   */
  async: boolean

  constructor(
    loader: LoaderContract,
    tags: TagsContract,
    processor: Processor,
    options: CompilerOptions = {
      cache: true,
      async: false,
    }
  ) {
    this.#processor = processor
    this.#loader = loader
    this.#tags = tags

    this.async = !!options.async
    this.cacheManager = new CacheManager(!!options.cache)
  }

  /**
   * Generates an array of lexer tokens from the template string.
   */
  #templateContentToTokens(content: string, parser: Parser, absPath: string): Token[] {
    return parser.tokenize(content, { filename: absPath })
  }

  /**
   * Regex to parse filter syntax: `mode :: expr`
   */
  static #filterRegex = /^(\w+)\s*::\s*([\s\S]+)$/

  /**
   * Hook called for every mustache token before parsing.
   * - Converts MUSTACHE → SMUSTACHE so escape wrapping is never applied
   * - Parses `{{ mode :: expr }}` filter syntax
   */
  static #onMustache(token: MustacheToken) {
    if (token.type === MustacheTypes.MUSTACHE) {
      token.type = MustacheTypes.SMUSTACHE
    }

    const match = Compiler.#filterRegex.exec(token.properties.jsArg.trim())
    if (match) {
      const [, mode, expr] = match
      token.properties.jsArg = `$filters.${mode}(${expr})`
    }
  }

  /**
   * Returns the parser instance for a given template
   */
  #getParserFor(templatePath: string, localVariables?: string[]) {
    const parser = new Parser(this.#tags, new Stack(), {
      claimTag: this.#claimTagFn,
      async: this.async,
      statePropertyName: 'state',
      escapeCallPath: ['template', 'escape'],
      localVariables: this.#inlineVariables,
      onTag: (tag) => this.#processor.executeTag({ tag, path: templatePath }),
      onMustache: Compiler.#onMustache,
    })

    /**
     * Define local variables on the parser. This is helpful when trying to compile
     * a partail and we want to share the local state of the parent template
     * with it
     */
    if (localVariables) {
      localVariables.forEach((localVariable) => parser.stack.defineVariable(localVariable))
    }

    return parser
  }

  /**
   * Returns the parser instance for a given template
   */
  #getBufferFor(templatePath: string) {
    return new EdgeBuffer(templatePath, {
      outputVar: 'out',
      rethrowCallPath: ['template', 'reThrow'],
    })
  }

  /**
   * Wraps template output to a function along with local variables
   */
  #wrapToFunction(template: string, localVariables?: string[]): CompiledTemplate {
    const args = localVariables ? this.#templateParams.concat(localVariables) : this.#templateParams

    if (this.async) {
      return new AsyncFunction(...args, template)
    }

    return new Function(...args, template) as CompiledTemplate
  }

  /**
   * Define a function to claim tags
   */
  claimTag(fn: ClaimTagFn): this {
    this.#claimTagFn = fn
    return this
  }

  /**
   * Converts the template content to an array of lexer tokens. The method is
   * same as the `parser.tokenize`, but it also handles layouts natively.
   *
   * ```
   * compiler.tokenize('<template-path>')
   * ```
   */
  tokenize(templatePath: string, parser?: Parser): Token[] {
    const absPath = this.#loader.makePath(templatePath)
    let { template } = this.#loader.resolve(absPath)
    return this.tokenizeRaw(template, absPath, parser)
  }

  /**
   * Tokenize a raw template
   */
  tokenizeRaw(contents: string, templatePath: string = 'eval.edge', parser?: Parser): Token[] {
    contents = this.#processor.executeRaw({ path: templatePath, raw: contents })
    return this.#templateContentToTokens(
      contents,
      parser || this.#getParserFor(templatePath),
      templatePath
    )
  }

  /**
   * Compiles the template contents to string. The output is same as the `@jig-lang/parser`,
   * it's just that the compiler uses the loader to load the templates and also
   * handles layouts.
   *
   * ```js
   * compiler.compile('welcome')
   * ```
   */
  compile(templatePath: string, localVariables?: string[]): CompiledTemplate {
    const absPath = this.#loader.makePath(templatePath)
    let cachedResponse = localVariables ? null : this.cacheManager.get(absPath)

    /**
     * Process the template and cache it
     */
    if (!cachedResponse) {
      const parser = this.#getParserFor(absPath, localVariables)
      const buffer = this.#getBufferFor(absPath)

      /**
       * Generate tokens and process them
       */
      const templateTokens = this.tokenize(absPath, parser)
      templateTokens.forEach((token) => parser.processToken(token, buffer))

      /**
       * Processing template via hook
       */
      const template = this.#processor.executeCompiled({
        path: absPath,
        compiled: buffer.flush(),
      })

      const compiledTemplate = this.#wrapToFunction(template, localVariables)
      if (!localVariables) {
        this.cacheManager.set(absPath, compiledTemplate)
      }

      cachedResponse = compiledTemplate
    }

    return cachedResponse!
  }

  /**
   * Compiles the template contents to string. The output is same as the `@jig-lang/parser`,
   * it's just that the compiler uses the loader to load the templates and also
   * handles layouts.
   *
   * ```js
   * compiler.compileRaw('welcome')
   * ```
   */
  compileRaw(contents: string, templatePath: string = 'eval.edge'): CompiledTemplate {
    const parser = this.#getParserFor(templatePath)
    const buffer = this.#getBufferFor(templatePath)
    const templateTokens = this.tokenizeRaw(contents, templatePath, parser)

    templateTokens.forEach((token) => parser.processToken(token, buffer))

    const template = this.#processor.executeCompiled({
      path: templatePath,
      compiled: buffer.flush(),
    })

    return this.#wrapToFunction(template)
  }
}
