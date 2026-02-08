/*
 * edge.js
 *
 * (c) EdgeJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { EdgeError } from 'edge-error'
import type { TagToken, Token } from 'edge-lexer/types'
import { type EdgeBuffer, type expressions as expressionsList, type Parser } from 'edge-parser'

type ExpressionList = readonly (keyof typeof expressionsList | 'ObjectPattern' | 'ArrayPattern')[]

/**
 * Raise an `E_UNALLOWED_EXPRESSION` exception. Filename and expression is
 * required to point the error stack to the correct file
 */
export function unallowedExpression(
  message: string,
  filename: string,
  loc: { line: number; col: number }
) {
  throw new EdgeError(message, 'E_UNALLOWED_EXPRESSION', {
    line: loc.line,
    col: loc.col,
    filename: filename,
  })
}

/**
 * Validates the expression type to be part of the allowed
 * expressions only.
 *
 * The filename is required to report errors.
 *
 * ```js
 * isNotSubsetOf(expression, ['Literal', 'Identifier'], () => {})
 * ```
 */
export function isSubsetOf(
  expression: any,
  expressions: ExpressionList,
  errorCallback: () => void
) {
  if (!expressions.includes(expression.type)) {
    errorCallback()
  }
}

/**
 * Validates the expression type not to be part of the disallowed
 * expressions.
 *
 * The filename is required to report errors.
 *
 * ```js
 * isNotSubsetOf(expression, 'SequenceExpression', () => {})
 * ```
 */
export function isNotSubsetOf(
  expression: any,
  expressions: ExpressionList,
  errorCallback: () => void
) {
  if (expressions.includes(expression.type)) {
    errorCallback()
  }
}

/**
 * Parses the jsArg by generating and transforming its AST
 */
export function parseJsArg(parser: Parser, token: TagToken) {
  return parser.utils.transformAst(
    parser.utils.generateAST(token.properties.jsArg, token.loc, token.filename),
    token.filename,
    parser
  )
}

/**
 * Each loop. A soft replacement for `lodash.each` that we were using earlier
 */
export function each(collection: any, iteratee: (value: any, key: any) => void) {
  if (Array.isArray(collection)) {
    for (let [key, value] of collection.entries()) {
      iteratee(value, key)
    }
    return
  }

  if (typeof collection === 'string') {
    let index = 0
    for (let value of collection) {
      iteratee(value, index++)
    }
    return
  }

  if (collection && typeof collection === 'object') {
    for (let [key, value] of Object.entries(collection)) {
      iteratee(value, key)
    }
  }
}

/**
 * Async each loop. A soft replacement for `lodash.each` that we were
 * using earlier with support for async await
 */
export async function asyncEach(
  collection: any,
  iteratee: (value: any, key: any) => Promise<void>
) {
  if (Array.isArray(collection)) {
    for (let [key, value] of collection.entries()) {
      await iteratee(value, key)
    }
    return
  }

  if (typeof collection === 'string') {
    let index = 0
    for (let value of collection) {
      await iteratee(value, index++)
    }
    return
  }

  if (collection && typeof collection === 'object') {
    for (let [key, value] of Object.entries(collection)) {
      await iteratee(value, key)
    }
  }
}

/**
 * This class generates a valid object as a string, which is written to the template
 * output. The reason we need a string like object, since we don't want it's
 * properties to be evaluated during the object creation, instead it must
 * be evaluated when the compiled output is invoked.
 */
export class StringifiedObject {
  #obj: string = ''

  addSpread(key: string) {
    this.#obj += this.#obj.length ? `, ${key}` : `${key}`
  }

  /**
   * Add key/value pair to the object.
   *
   * ```js
   * stringifiedObject.add('username', `'virk'`)
   * ```
   */
  add(key: any, value: any, isComputed: boolean = false) {
    key = isComputed ? `[${key}]` : key
    this.#obj += this.#obj.length ? `, ${key}: ${value}` : `${key}: ${value}`
  }

  /**
   * Returns the object alike string back.
   *
   * ```js
   * stringifiedObject.flush()
   *
   * // returns
   * `{ username: 'virk' }`
   * ```
   */
  flush(): string {
    const obj = `{ ${this.#obj} }`
    this.#obj = ''
    return obj
  }
}

/**
 * Copy-pasted from
 * https://github.com/ai/nanoid/blob/main/nanoid.js
 */
const seed = 'useandom26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'
export let nanoid = (length = 15) => {
  let output = ''
  const random = crypto.getRandomValues(new Uint8Array(length))
  for (let n = 0; n < length; n++) {
    output += seed[63 & random[n]]
  }
  return output
}

/**
 * Computes the number of spaces to dedent from block tag children.
 *
 * Rule: dedent = firstContentLineIndent - tagIndent
 *
 * Scans children to find the first raw or tag token after a newline
 * boundary, measures its leading whitespace, and returns the difference
 * from the tag's own indent.
 */
export function computeDedent(children: Token[], tagIndent: number): number {
  let afterNewline = true

  for (const child of children) {
    if (child.type === 'newline') {
      afterNewline = true
      continue
    }

    if (!afterNewline) {
      continue
    }

    if (child.type === 'raw') {
      const match = child.value.match(/^( *)/)
      const leadingSpaces = match ? match[1].length : 0
      return Math.max(0, leadingSpaces - tagIndent)
    }

    if ('indent' in child) {
      return Math.max(0, (child as TagToken).indent - tagIndent)
    }

    afterNewline = false
  }

  return 0
}

/**
 * Strips up to `amount` leading space characters from a string.
 */
export function dedentRaw(text: string, amount: number): string {
  if (amount <= 0) return text
  const regex = new RegExp(`^ {0,${amount}}`)
  return text.replace(regex, '')
}

/**
 * Processes block tag children with automatic dedentation.
 * Strips `dedent` leading spaces from raw tokens that follow newlines.
 */
export function processChildrenDedented(
  parser: Parser,
  buffer: EdgeBuffer,
  children: Token[],
  dedent: number
): void {
  let afterNewline = true

  for (const child of children) {
    if (child.type === 'newline') {
      parser.processToken(child, buffer)
      afterNewline = true
      continue
    }

    if (child.type === 'raw' && afterNewline && dedent > 0) {
      buffer.outputRaw(dedentRaw(child.value, dedent))
      afterNewline = false
      continue
    }

    parser.processToken(child, buffer)
    afterNewline = false
  }
}
