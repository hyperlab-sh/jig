/*
 * edge.js
 *
 * (c) EdgeJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { EdgeError } from 'edge-error'
import Macroable from '@poppinss/macroable'

import Stacks from './edge/stacks.js'
import { type Compiler } from './compiler.js'
import { type Processor } from './processor.js'
import type { CompiledTemplate } from './types.js'
import { ComponentProps } from './component/props.js'

/**
 * The template is used to compile and run templates. Also the instance
 * of template is passed during runtime to render `dynamic partials`
 * and `dynamic components`.
 */
export class Template extends Macroable {
  #compiler: Compiler
  #processor: Processor

  /**
   * The shared state is used to hold the globals and locals,
   * since it is shared with components too.
   */
  #sharedState: Record<string, any>

  /**
   * Template stacks holds a collection of placeholders
   * and their content to be filled before returning
   * the output.
   */
  stacks = new Stacks()

  constructor(compiler: Compiler, globals: any, locals: any, processor: Processor) {
    super()
    this.#compiler = compiler
    this.#processor = processor
    this.#sharedState = {
      ...globals,
      ...locals,
    }
  }

  /**
   * Trims top and bottom new lines from the content
   */
  #trimTopBottomNewLines(value: string) {
    return value.replace(/^\n|^\r\n/, '').replace(/\n$|\r\n$/, '')
  }

  /**
   * Render a compiled template with state
   */
  #renderCompiled(compiledTemplate: CompiledTemplate, state: any) {
    const templateState = { ...this.#sharedState, ...state }
    const $context = {}

    /**
     * Process template as a promise.
     */
    if (this.#compiler.async) {
      return compiledTemplate(this, templateState, $context).then((output: string) => {
        output = this.#trimTopBottomNewLines(output)
        output = this.stacks.fillPlaceholders(output)
        return this.#processor.executeOutput({ output, template: this, state: templateState })
      })
    }

    let output = this.#trimTopBottomNewLines(compiledTemplate(this, templateState, $context))
    output = this.stacks.fillPlaceholders(output)
    return this.#processor.executeOutput({ output, template: this, state: templateState })
  }

  /**
   * Render a partial
   *
   * ```js
   * const partialFn = template.compilePartial('includes/user')
   *
   * // render and use output
   * partialFn(template, state, ctx)
   * ```
   */
  compilePartial(templatePath: string, ...localVariables: string[]): CompiledTemplate {
    return this.#compiler.compile(templatePath, localVariables)
  }

  /**
   * Render a component
   *
   * ```js
   * const componentFn = template.compileComponent('components/button')
   *
   * // render and use output
   * componentFn(template, template.getComponentState(props, slots, caller), ctx)
   * ```
   */
  compileComponent(templatePath: string): CompiledTemplate {
    return this.#compiler.compile(templatePath)
  }

  /**
   * Returns the isolated state for a given component
   */
  getComponentState(
    props: { [key: string]: any },
    slots: { [key: string]: any },
    caller: { filename: string; line: number; col: number }
  ) {
    return {
      ...this.#sharedState,
      ...props,
      $slots: slots,
      $caller: caller,
      $props: new ComponentProps(props),
    }
  }

  /**
   * Render a template with it's state.
   *
   * ```js
   * template.render('welcome', { key: 'value' })
   * ```
   */
  render<T extends Promise<string> | string>(template: string, state: any): T {
    let compiledTemplate = this.#compiler.compile(template)
    return this.#renderCompiled(compiledTemplate, state)
  }

  /**
   * Render template from a raw string
   *
   * ```js
   * template.renderRaw('Hello {{ username }}', { username: 'virk' })
   * ```
   */
  renderRaw<T extends Promise<string> | string>(
    contents: string,
    state: any,
    templatePath?: string
  ): T {
    let compiledTemplate = this.#compiler.compileRaw(contents, templatePath)
    return this.#renderCompiled(compiledTemplate, state)
  }

  /**
   * Indents every line of output by the given prefix string.
   * The first line is only indented when `indentFirstLine` is set (include
   * tags start on a fresh line, so it needs the tag's indent too). Blank
   * lines and a trailing newline are left alone so no whitespace-only lines
   * are produced.
   */
  indentOutput(output: string, indent: string, indentFirstLine: boolean = false): string {
    if (!indent || !output) return output
    const indented = output.replace(/\n(?![\r\n]|$)/g, '\n' + indent)
    return indentFirstLine && !/^[\r\n]/.test(indented) ? indent + indented : indented
  }

  /**
   * Converts input to string.
   * Kept for backward compatibility with cached compiled templates.
   */
  escape(input: any): string {
    return String(input)
  }

  /**
   * Creates an instance of the EdgeError
   */
  createError(errorMessage: string, filename: string, lineNumber: number, column: number) {
    return new EdgeError(errorMessage, 'E_RUNTIME_EXCEPTION', {
      filename: filename,
      line: lineNumber,
      col: column,
    })
  }

  /**
   * Throws EdgeError. Use "createError" to create a new
   * error instance
   */
  newError(errorMessage: string, filename: string, lineNumber: number, column: number) {
    throw this.createError(errorMessage, filename, lineNumber, column)
  }

  /**
   * Rethrows the runtime exception by re-constructing the error message
   * to point back to the original filename
   */
  reThrow(error: any, filename: string, lineNumber: number): never {
    if (
      error instanceof Error &&
      typeof (error as any).filename === 'string' &&
      typeof (error as any).line === 'number' &&
      typeof (error as any).col === 'number'
    ) {
      throw error
    }

    const message = error.message.replace(/state\./, '')
    throw new EdgeError(message, 'E_RUNTIME_EXCEPTION', {
      filename: filename,
      line: lineNumber,
      col: 0,
    })
  }
}
