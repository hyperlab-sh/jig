/*
* edge-parser
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

/**
 * Returns Acorn complaint AST for a collable expression
 */
export function makeCallableExpression (fnName: string, args: object[]): any {
  return {
    type: 'CallExpression',
    callee: {
      type: 'Identifier',
      name: fnName,
    },
    arguments: args,
  }
}
