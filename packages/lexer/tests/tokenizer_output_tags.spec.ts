import { test } from '@japa/runner'
import dedent from 'dedent'

import { Tokenizer } from '../src/tokenizer.js'

const tags = {
  include: class Include {
    static block = false
    static seekable = true
    static outputsContent = true
  },
  let: class Let {
    static block = false
    static seekable = true
    static noNewLine = true
  },
  if: class If {
    static block = true
    static seekable = true
  },
}

function types(template: string) {
  const tokenizer = new Tokenizer(template, tags, { filename: 'eval.edge' })
  tokenizer.parse()
  return tokenizer.tokens.map((token) =>
    token.type === 'tag' ? `tag:${token.properties.name}` : token.type
  )
}

test.group('Tokenizer | tags that output content', () => {
  test('push a newline before the tag when it follows raw text', ({ assert }) => {
    assert.deepEqual(
      types(dedent`
      class X {
      @include('p')
    `),
      ['raw', 'newline', 'tag:include']
    )
  })

  test('push a newline between a tag that outputs content and the next raw line', ({ assert }) => {
    assert.deepEqual(
      types(dedent`
      a
      @include('p')
      b
    `),
      ['raw', 'newline', 'tag:include', 'newline', 'raw']
    )
  })

  test('do not push a newline on the first line', ({ assert }) => {
    assert.deepEqual(types(`@include('p')\nb`), ['tag:include', 'newline', 'raw'])
  })

  test('do not push a second newline after a block tag opening', ({ assert }) => {
    const tokenizer = new Tokenizer(`@if(x)\n@include('p')\n@end`, tags, { filename: 'eval.edge' })
    tokenizer.parse()
    const [block] = tokenizer.tokens as any[]
    assert.deepEqual(
      block.children.map((token: any) => token.type),
      ['newline', 'tag']
    )
  })

  test('keep a newline between two output tags', ({ assert }) => {
    assert.deepEqual(types(`@include('a')\n@include('b')`), [
      'tag:include',
      'newline',
      'tag:include',
    ])
  })

  test('tags without the flag still add no newline before them', ({ assert }) => {
    assert.deepEqual(types(`a\n@let(x = 1)\nb`), ['raw', 'tag:let', 'raw'])
  })

  test('noNewLine on the previous tag still drops the newline', ({ assert }) => {
    assert.deepEqual(types(`a\n@let(x = 1)\n@include('p')`), ['raw', 'tag:let', 'tag:include'])
  })
})
