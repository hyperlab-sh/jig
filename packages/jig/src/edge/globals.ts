/*
 * edge.js
 *
 * (c) EdgeJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// @ts-expect-error untyped module
import stringify from 'js-stringify'
// @ts-expect-error untyped module
import inspect from '@poppinss/inspect'
import string from '@poppinss/utils/string'

import type { EdgeGlobals } from '../types.js'

/**
 * Inbuilt globals
 */
export const edgeGlobals: EdgeGlobals = {
  /**
   * Inspect state
   */
  inspect: (value: any) => {
    return inspect.string(value)
  },

  /**
   * Truncate a sentence
   */
  truncate: (
    value: string,
    length: number = 20,
    options?: { completeWords?: boolean; strict?: boolean; suffix?: string }
  ) => {
    options = options || {}
    return string.truncate(value, length, {
      completeWords: options.completeWords !== undefined ? options.completeWords : !options.strict,
      suffix: options.suffix,
    })
  },

  /**
   * Generate an excerpt
   */
  excerpt: (
    value: string,
    length: number = 20,
    options?: { completeWords?: boolean; strict?: boolean; suffix?: string }
  ) => {
    options = options || {}
    return string.excerpt(value, length, {
      completeWords: options.completeWords !== undefined ? options.completeWords : !options.strict,
      suffix: options.suffix,
    })
  },

  /**
   * Helpers related to JavaScript
   */
  js: {
    stringify: stringify,
  },

  camelCase: string.camelCase,
  snakeCase: string.snakeCase,
  dashCase: string.dashCase,
  pascalCase: string.pascalCase,
  capitalCase: string.capitalCase,
  sentenceCase: string.sentenceCase,
  dotCase: string.dotCase,
  noCase: string.noCase,
  titleCase: string.titleCase,
  pluralize: string.pluralize,
  sentence: string.sentence,
  prettyMs: string.milliseconds.format,
  toMs: string.milliseconds.parse,
  prettyBytes: string.bytes.format,
  toBytes: string.bytes.parse,
  ordinal: string.ordinal,
}
