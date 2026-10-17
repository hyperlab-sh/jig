/*
 * edge.js
 *
 * (c) EdgeJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { ComponentProps } from '../src/component/props.js'

test.group('ComponentProps', () => {
  test('get all props', ({ assert }) => {
    const props = ComponentProps.create({ title: 'Hello' })
    assert.deepEqual(props.all(), { title: 'Hello' })
  })

  test('get value for a given key', ({ assert }) => {
    const props = ComponentProps.create({ title: 'Hello' })
    assert.equal(props.get('title'), 'Hello')
    assert.equal(props.title, 'Hello')
  })

  test('cherry pick values from the props', ({ assert }) => {
    const props = ComponentProps.create({
      title: 'Hello',
      label: 'Hello world',
      actionText: 'Confirm',
    })

    assert.deepEqual(props.only(['label', 'actionText']).all(), {
      label: 'Hello world',
      actionText: 'Confirm',
    })
  })

  test('get values except for the defined keys from the props', ({ assert }) => {
    const props = ComponentProps.create({
      title: 'Hello',
      label: 'Hello world',
      actionText: 'Confirm',
    })

    assert.deepEqual(props.except(['label', 'actionText']).all(), {
      title: 'Hello',
    })
  })

  test('merge defaults with props', ({ assert }) => {
    const props = ComponentProps.create({
      class: ['foo', 'bar'],
      onclick: 'foo = bar',
    })
    const merged = props.merge({ id: '1' })
    assert.deepEqual(merged.all(), {
      id: '1',
      class: ['foo', 'bar'],
      onclick: 'foo = bar',
    })
  })

  test('props override defaults in merge', ({ assert }) => {
    const props = ComponentProps.create({
      class: 'user-class',
    })
    const merged = props.merge({ class: 'default-class', id: '1' })
    assert.deepEqual(merged.all(), {
      class: 'user-class',
      id: '1',
    })
  })

  test('mergeUnless skips merge when condition is true', ({ assert }) => {
    const props = ComponentProps.create({ title: 'Hello' })
    const result = props.mergeUnless(true, { id: '1' })
    assert.strictEqual(result, props)
  })

  test('mergeUnless merges when condition is false', ({ assert }) => {
    const props = ComponentProps.create({ title: 'Hello' })
    const result = props.mergeUnless(false, { id: '1' })
    assert.deepEqual(result.all(), { id: '1', title: 'Hello' })
  })

  test('mergeIf merges when condition is true', ({ assert }) => {
    const props = ComponentProps.create({ title: 'Hello' })
    const result = props.mergeIf(true, { id: '1' })
    assert.deepEqual(result.all(), { id: '1', title: 'Hello' })
  })

  test('mergeIf skips merge when condition is false', ({ assert }) => {
    const props = ComponentProps.create({ title: 'Hello' })
    const result = props.mergeIf(false, { id: '1' })
    assert.strictEqual(result, props)
  })

  test('has checks key existence', ({ assert }) => {
    const props = ComponentProps.create({ title: 'Hello' })
    assert.isTrue(props.has('title'))
    assert.isFalse(props.has('missing'))
  })
})
