/*
 * edge.js
 *
 * (c) EdgeJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import type { Token } from 'edge-lexer/types'

import { computeDedent, dedentRaw } from '../src/utils.js'
import { Template } from '../src/template.js'
import { Compiler } from '../src/compiler.js'
import { Loader } from '../src/loader.js'
import { Processor } from '../src/processor.js'

test.group('computeDedent', () => {
  test('returns 0 when children is empty', ({ assert }) => {
    assert.equal(computeDedent([], 0), 0)
  })

  test('returns 0 when no raw tokens follow newlines', ({ assert }) => {
    const children: Token[] = [{ type: 'newline', line: 1, filename: 'test.edge' }]
    assert.equal(computeDedent(children, 0), 0)
  })

  test('computes dedent from first raw token after newline', ({ assert }) => {
    const children: Token[] = [
      { type: 'newline', line: 1, filename: 'test.edge' },
      { type: 'raw', value: '    Hello', line: 2, filename: 'test.edge' },
    ]
    // content at indent 4, tag at indent 2 → dedent = 2
    assert.equal(computeDedent(children, 2), 2)
  })

  test('returns 0 when content indent equals tag indent', ({ assert }) => {
    const children: Token[] = [
      { type: 'newline', line: 1, filename: 'test.edge' },
      { type: 'raw', value: '  Hello', line: 2, filename: 'test.edge' },
    ]
    assert.equal(computeDedent(children, 2), 0)
  })

  test('returns 0 when content indent is less than tag indent', ({ assert }) => {
    const children: Token[] = [
      { type: 'newline', line: 1, filename: 'test.edge' },
      { type: 'raw', value: 'Hello', line: 2, filename: 'test.edge' },
    ]
    assert.equal(computeDedent(children, 2), 0)
  })

  test('uses tag token indent field for tag children', ({ assert }) => {
    const children: Token[] = [
      { type: 'newline', line: 1, filename: 'test.edge' },
      {
        type: 'tag',
        filename: 'test.edge',
        properties: { name: 'if', jsArg: 'true', selfClosing: false },
        loc: { start: { line: 2, col: 6 }, end: { line: 2, col: 12 } },
        children: [],
        indent: 6,
      } as any,
    ]
    // tag child at indent 6, parent tag at indent 2 → dedent = 4
    assert.equal(computeDedent(children, 2), 4)
  })

  test('skips non-raw, non-tag tokens when looking for first content', ({ assert }) => {
    const children: Token[] = [
      { type: 'newline', line: 1, filename: 'test.edge' },
      { type: 'newline', line: 2, filename: 'test.edge' },
      { type: 'raw', value: '      content', line: 3, filename: 'test.edge' },
    ]
    // content at indent 6, tag at indent 2 → dedent = 4
    assert.equal(computeDedent(children, 2), 4)
  })
})

test.group('dedentRaw', () => {
  test('strips up to N leading spaces', ({ assert }) => {
    assert.equal(dedentRaw('    Hello', 2), '  Hello')
  })

  test('strips all leading spaces when amount exceeds them', ({ assert }) => {
    assert.equal(dedentRaw('  Hello', 4), 'Hello')
  })

  test('returns text unchanged when amount is 0', ({ assert }) => {
    assert.equal(dedentRaw('  Hello', 0), '  Hello')
  })

  test('returns text unchanged when amount is negative', ({ assert }) => {
    assert.equal(dedentRaw('  Hello', -1), '  Hello')
  })

  test('handles text with no leading spaces', ({ assert }) => {
    assert.equal(dedentRaw('Hello', 2), 'Hello')
  })

  test('handles empty string', ({ assert }) => {
    assert.equal(dedentRaw('', 2), '')
  })

  test('only strips spaces, not tabs', ({ assert }) => {
    assert.equal(dedentRaw('\tHello', 2), '\tHello')
  })
})

test.group('template.indentOutput', () => {
  function makeTemplate(): Template {
    const loader = new Loader()
    loader.mount('default', '/tmp')
    const compiler = new Compiler(loader, {}, new Processor(), { async: false })
    return new Template(compiler, {}, {}, new Processor())
  }

  test('indents subsequent lines with given indent string', ({ assert }) => {
    const template = makeTemplate()
    assert.equal(template.indentOutput('line1\nline2\nline3', '  '), 'line1\n  line2\n  line3')
  })

  test('returns empty string for empty input', ({ assert }) => {
    const template = makeTemplate()
    assert.equal(template.indentOutput('', '  '), '')
  })

  test('returns single line unchanged', ({ assert }) => {
    const template = makeTemplate()
    assert.equal(template.indentOutput('hello', '  '), 'hello')
  })

  test('returns output unchanged when indent is empty', ({ assert }) => {
    const template = makeTemplate()
    assert.equal(template.indentOutput('line1\nline2', ''), 'line1\nline2')
  })

  test('handles multiple levels of indentation', ({ assert }) => {
    const template = makeTemplate()
    assert.equal(template.indentOutput('a\nb\nc', '    '), 'a\n    b\n    c')
  })
})
