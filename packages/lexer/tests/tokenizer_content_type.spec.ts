/**
 * edge-lexer
 *
 * (c) Jig
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import dedent from 'dedent'
import { test } from '@japa/runner'

import { Tokenizer } from '../src/tokenizer.js'
import { TagTypes } from '../src/enums.js'

const tagsDef = {
  if: class If {
    static block = true
    static seekable = true
  },
  else: class Else {
    static block = false
    static seekable = false
  },
  include: class Include {
    static block = false
    static seekable = true
  },
  each: class Each {
    static block = true
    static seekable = true
  },
}

test.group('Tokenizer | Content Type Suffix', () => {
  test('parse content type suffix on a seekable tag', ({ assert }) => {
    const template = dedent`
    @if(x): markdown
    @endif
    `

    const tokenizer = new Tokenizer(template, tagsDef, { filename: 'eval.edge' })
    tokenizer.parse()

    assert.isNull(tokenizer.tagStatement)
    assert.equal(tokenizer.tokens.length, 1)

    const tag = tokenizer.tokens[0]
    assert.equal(tag.type, TagTypes.TAG)
    assert.deepEqual((tag as any).properties, {
      name: 'if',
      jsArg: 'x',
      selfclosed: false,
      contentType: 'markdown',
    })
  })

  test('parse content type suffix with tilde on a seekable tag', ({ assert }) => {
    const template = dedent`
    @if(x): ts~
    Hello
    @endif
    `

    const tokenizer = new Tokenizer(template, tagsDef, { filename: 'eval.edge' })
    tokenizer.parse()

    const tag = tokenizer.tokens[0]
    assert.equal(tag.type, TagTypes.TAG)
    assert.deepEqual((tag as any).properties, {
      name: 'if',
      jsArg: 'x',
      selfclosed: false,
      contentType: 'ts',
    })

    // Tilde should have swallowed the newline — children start with raw, not newline
    const children = (tag as any).children
    assert.equal(children[0].type, 'raw')
    assert.equal(children[0].value, 'Hello')
  })

  test('parse content type with special characters (c++)', ({ assert }) => {
    const template = dedent`
    @if(x): c++
    @endif
    `

    const tokenizer = new Tokenizer(template, tagsDef, { filename: 'eval.edge' })
    tokenizer.parse()

    assert.deepEqual((tokenizer.tokens[0] as any).properties, {
      name: 'if',
      jsArg: 'x',
      selfclosed: false,
      contentType: 'c++',
    })
  })

  test('parse content type with special characters (c#)', ({ assert }) => {
    const template = dedent`
    @if(x): c#
    @endif
    `

    const tokenizer = new Tokenizer(template, tagsDef, { filename: 'eval.edge' })
    tokenizer.parse()

    assert.deepEqual((tokenizer.tokens[0] as any).properties, {
      name: 'if',
      jsArg: 'x',
      selfclosed: false,
      contentType: 'c#',
    })
  })

  test('parse content type with special characters (objective-c)', ({ assert }) => {
    const template = dedent`
    @if(x): objective-c
    @endif
    `

    const tokenizer = new Tokenizer(template, tagsDef, { filename: 'eval.edge' })
    tokenizer.parse()

    assert.deepEqual((tokenizer.tokens[0] as any).properties, {
      name: 'if',
      jsArg: 'x',
      selfclosed: false,
      contentType: 'objective-c',
    })
  })

  test('parse content type with extra whitespace after colon', ({ assert }) => {
    const template = dedent`
    @if(x):   markdown
    @endif
    `

    const tokenizer = new Tokenizer(template, tagsDef, { filename: 'eval.edge' })
    tokenizer.parse()

    assert.deepEqual((tokenizer.tokens[0] as any).properties, {
      name: 'if',
      jsArg: 'x',
      selfclosed: false,
      contentType: 'markdown',
    })
  })

  test('parse content type on multiline jsArg with suffix on closing line', ({ assert }) => {
    const template = dedent`
    @if(
      x
    ): markdown
    @endif
    `

    const tokenizer = new Tokenizer(template, tagsDef, { filename: 'eval.edge' })
    tokenizer.parse()

    assert.deepEqual((tokenizer.tokens[0] as any).properties, {
      name: 'if',
      jsArg: '\n  x\n',
      selfclosed: false,
      contentType: 'markdown',
    })
  })

  test('parse content type on a non-seekable tag', ({ assert }) => {
    const template = dedent`
    @if(x)
      @else: markdown
    @endif
    `

    const tokenizer = new Tokenizer(template, tagsDef, { filename: 'eval.edge' })
    tokenizer.parse()

    const ifTag = tokenizer.tokens[0] as any
    const elseTag = ifTag.children.find((c: any) => c.type === TagTypes.TAG)
    assert.deepEqual(elseTag.properties, {
      name: 'else',
      jsArg: '',
      selfclosed: false,
      contentType: 'markdown',
    })
  })

  test('parse content type with tilde on a non-seekable tag', ({ assert }) => {
    const template = dedent`
    @if(x)
      @else: ts~
      Hello
    @endif
    `

    const tokenizer = new Tokenizer(template, tagsDef, { filename: 'eval.edge' })
    tokenizer.parse()

    const ifTag = tokenizer.tokens[0] as any
    const elseTag = ifTag.children.find((c: any) => c.type === TagTypes.TAG)
    assert.deepEqual(elseTag.properties, {
      name: 'else',
      jsArg: '',
      selfclosed: false,
      contentType: 'ts',
    })
  })

  test('no contentType key when suffix is absent on seekable tag', ({ assert }) => {
    const template = dedent`
    @if(x)
    @endif
    `

    const tokenizer = new Tokenizer(template, tagsDef, { filename: 'eval.edge' })
    tokenizer.parse()

    const props = (tokenizer.tokens[0] as any).properties
    assert.deepEqual(props, {
      name: 'if',
      jsArg: 'x',
      selfclosed: false,
    })
    assert.notProperty(props, 'contentType')
  })

  test('no contentType key when tilde is used without suffix', ({ assert }) => {
    const template = dedent`
    @if(x)~
    Hello
    @endif
    `

    const tokenizer = new Tokenizer(template, tagsDef, { filename: 'eval.edge' })
    tokenizer.parse()

    const props = (tokenizer.tokens[0] as any).properties
    assert.notProperty(props, 'contentType')

    // Tilde still swallows newline
    const children = (tokenizer.tokens[0] as any).children
    assert.equal(children[0].type, 'raw')
    assert.equal(children[0].value, 'Hello')
  })

  test('no contentType key when suffix is absent on non-seekable tag', ({ assert }) => {
    const template = dedent`
    @if(x)
      @else
    @endif
    `

    const tokenizer = new Tokenizer(template, tagsDef, { filename: 'eval.edge' })
    tokenizer.parse()

    const ifTag = tokenizer.tokens[0] as any
    const elseTag = ifTag.children.find((c: any) => c.type === TagTypes.TAG)
    assert.deepEqual(elseTag.properties, {
      name: 'else',
      jsArg: '',
      selfclosed: false,
    })
    assert.notProperty(elseTag.properties, 'contentType')
  })

  test('no contentType key on non-seekable tag with tilde only', ({ assert }) => {
    const template = dedent`
    @if(x)
      @else~
      Hello
    @endif
    `

    const tokenizer = new Tokenizer(template, tagsDef, { filename: 'eval.edge' })
    tokenizer.parse()

    const ifTag = tokenizer.tokens[0] as any
    const elseTag = ifTag.children.find((c: any) => c.type === TagTypes.TAG)
    assert.notProperty(elseTag.properties, 'contentType')
  })

  test('throw error for invalid suffix (inline content)', ({ assert }) => {
    assert.plan(1)
    const template = dedent`@include('foo') hello`

    const tokenizer = new Tokenizer(template, tagsDef, { filename: 'eval.edge' })
    try {
      tokenizer.parse()
    } catch ({ message }: any) {
      assert.equal(message, 'Unexpected token " hello"')
    }
  })

  test('throw error for colon with no identifier', ({ assert }) => {
    assert.plan(1)
    const template = dedent`@include('foo'): `

    const tokenizer = new Tokenizer(template, tagsDef, { filename: 'eval.edge' })
    try {
      tokenizer.parse()
    } catch ({ message }: any) {
      assert.equal(message, 'Unexpected token ":"')
    }
  })

  test('children are still collected correctly when content type is present', ({ assert }) => {
    const template = dedent`
    @if(x): markdown
      Hello {{ name }}
    @endif
    `

    const tokenizer = new Tokenizer(template, tagsDef, { filename: 'eval.edge' })
    tokenizer.parse()

    const tag = tokenizer.tokens[0] as any
    assert.equal(tag.properties.contentType, 'markdown')
    assert.isAbove(tag.children.length, 0)

    // The raw text child should be present
    const rawChild = tag.children.find((c: any) => c.type === 'raw')
    assert.ok(rawChild)
    assert.include(rawChild.value, 'Hello')
  })

  test('tilde before colon is treated as invalid suffix', ({ assert }) => {
    assert.plan(1)
    const template = dedent`@include('foo')~: markdown`

    const tokenizer = new Tokenizer(template, tagsDef, { filename: 'eval.edge' })
    try {
      tokenizer.parse()
    } catch ({ message }: any) {
      assert.equal(message, 'Unexpected token "~: markdown"')
    }
  })

  test('content type with dot notation (es6.proxy)', ({ assert }) => {
    const template = dedent`
    @if(x): es6.proxy
    @endif
    `

    const tokenizer = new Tokenizer(template, tagsDef, { filename: 'eval.edge' })
    tokenizer.parse()

    assert.deepEqual((tokenizer.tokens[0] as any).properties.contentType, 'es6.proxy')
  })

  test('content type with underscore (source_map)', ({ assert }) => {
    const template = dedent`
    @if(x): source_map
    @endif
    `

    const tokenizer = new Tokenizer(template, tagsDef, { filename: 'eval.edge' })
    tokenizer.parse()

    assert.deepEqual((tokenizer.tokens[0] as any).properties.contentType, 'source_map')
  })
})
