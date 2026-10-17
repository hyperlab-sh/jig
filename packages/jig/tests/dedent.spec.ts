/*
 * edge.js
 *
 * (c) EdgeJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import type { Token } from '@jig-lang/lexer/types'

import { computeDedent, dedentRaw } from '../src/utils.js'
import { Template } from '../src/template.js'
import { Compiler } from '../src/compiler.js'
import { Loader } from '../src/loader.js'
import { Edge } from '../src/edge/main.js'
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

  test('does not indent after a trailing newline', ({ assert }) => {
    const template = makeTemplate()
    assert.equal(template.indentOutput('a\nb\n', '  '), 'a\n  b\n')
  })

  test('does not indent blank lines', ({ assert }) => {
    const template = makeTemplate()
    assert.equal(template.indentOutput('a\n\nb', '  '), 'a\n\n  b')
    assert.equal(template.indentOutput('a\r\n\r\nb\r\n', '  '), 'a\r\n\r\n  b\r\n')
  })
})

test.group('nested block dedent', (group) => {
  let edge: Edge

  group.each.setup(() => {
    edge = new Edge()
    edge.registerTemplate('partial', { template: 'line1\nline2\n' })
    edge.registerTemplate('partial_no_newline', { template: 'line1\nline2' })
  })

  async function render(template: string, state: Record<string, any> = {}) {
    edge.registerTemplate('main', { template })
    return edge.render('main', state)
  }

  test('nested @if is dedented by the enclosing block too', async ({ assert }) => {
    const output = await render('@if(true)\n  @if(true)\n    deep\n  @end\n  after\n@end\n')
    assert.equal(output, 'deep\nafter')
  })

  test('nested @if does not add a blank line', async ({ assert }) => {
    const output = await render('before\n@if(true)\n  @if(true)\n    deep\n  @end\n@end\nafter\n')
    assert.equal(output, 'before\ndeep\nafter')
  })

  test('@if inside @each is dedented and has no blank lines', async ({ assert }) => {
    const output = await render(
      'before\n@each(i in [1, 2])\n  @if(true)\n    {{ i }}\n  @end\n@end\nafter\n'
    )
    assert.equal(output, 'before\n1\n2\nafter')
  })

  test('three levels of nesting', async ({ assert }) => {
    const output = await render(
      '@if(true)\n  @each(i in [1])\n    @unless(false)\n      deep {{ i }}\n    @end\n  @end\n@end\nafter\n'
    )
    assert.equal(output, 'deep 1\nafter')
  })

  test('empty nested block does not leave a stray newline', async ({ assert }) => {
    const output = await render('before\n@if(true)\n  @if(false)\n    x\n  @end\n@end\nafter\n')
    assert.equal(output, 'before\nafter')
  })

  test('include inside a block is indented relative to the dedented block', async ({ assert }) => {
    const output = await render("@if(true)\n  @include('partial_no_newline')\n  x\n@end\n")
    assert.equal(output, 'line1\nline2\nx')
  })

  test('include nested two levels deep is dedented by both enclosing blocks', async ({
    assert,
  }) => {
    const output = await render(
      "@if(true)\n  @if(true)\n    @include('partial_no_newline')\n  @end\n@end\n"
    )
    assert.equal(output, 'line1\nline2')
  })

  test('partial ending in a newline leaves no whitespace-only line', async ({ assert }) => {
    const output = await render("@if(true)\n  @include('partial')\n  x\n@end\n")
    assert.notMatch(output, /^[ \t]+$/m)
    assert.equal(output, 'line1\nline2\n\nx')
  })

  test('top-level include still indents continuation lines', async ({ assert }) => {
    const output = await render("before\n  @include('partial_no_newline')\nafter\n")
    assert.equal(output, 'beforeline1\n  line2\nafter')
  })

  test('@includeIf follows the same dedent rules', async ({ assert }) => {
    const output = await render("@if(true)\n  @includeIf(true, 'partial_no_newline')\n  x\n@end\n")
    assert.equal(output, 'line1\nline2\nx')
  })
})
