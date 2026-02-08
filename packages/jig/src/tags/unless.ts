/*
 * edge.js
 *
 * (c) EdgeJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { expressions } from 'edge-parser'

import { type TagContract } from '../types.js'
import {
  isNotSubsetOf,
  unallowedExpression,
  parseJsArg,
  computeDedent,
  processChildrenDedented,
} from '../utils.js'

/**
 * Inverse of the `if` condition. The term `unless` is more readable and logical
 * vs using `@if(!expression)`.
 *
 * ```edge
 * @unless(auth.user)
 *   <a href="/login"> Login </a>
 * @endunless
 * ```
 */
export const unlessTag: TagContract = {
  block: true,
  seekable: true,
  tagName: 'unless',

  /**
   * Compiles the if block node to a Javascript if statement
   */
  compile(parser, buffer, token) {
    const parsed = parseJsArg(parser, token)

    /**
     * Disallow sequence expressions
     */
    isNotSubsetOf(parsed, [expressions.SequenceExpression], () => {
      unallowedExpression(
        `"${token.properties.jsArg}" is not a valid argument type for the @unless tag`,
        token.filename,
        parser.utils.getExpressionLoc(parsed)
      )
    })

    /**
     * Start if block
     */
    buffer.writeStatement(
      `if (!${parser.utils.stringify(parsed)}) {`,
      token.filename,
      token.loc.start.line
    )

    /**
     * Process of all children recursively with dedentation
     */
    const dedent = computeDedent(token.children, token.indent)
    processChildrenDedented(parser, buffer, token.children, dedent)

    /**
     * Close if block
     */
    buffer.writeStatement('}', token.filename, -1)
  },
}
