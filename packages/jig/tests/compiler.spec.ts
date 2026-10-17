/*
 * edge.js
 *
 * (c) EdgeJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import './assert_extend.js'
import dedent from 'dedent-js'
import { join } from 'node:path'
import { test } from '@japa/runner'
// @ts-expect-error "untyped module"
import stringify from 'js-stringify'

import { Loader } from '../src/loader.js'
import { Compiler } from '../src/compiler.js'
import { Processor } from '../src/processor.js'
import { componentTag } from '../src/tags/component.js'
import { normalizeNewLines } from '../tests_helpers/index.js'

test.group('Compiler | Cache', () => {
  test('compile template', async ({ assert, fs }) => {
    await fs.create('foo.edge', 'Hello {{ username }}')

    const loader = new Loader()
    loader.mount('default', fs.basePath)

    const compiler = new Compiler(loader, {}, new Processor())
    const compiledTemplate = compiler.compile('foo')

    assert.stringEqual(
      compiledTemplate.toString(),
      normalizeNewLines(dedent`function anonymous(template,state,$context
      ) {
      let out = "";
      let $lineNumber = 1;
      let $filename = ${stringify(join(fs.basePath, 'foo.edge'))};
      try {
      out += "Hello ";
      out += \`\${state.username}\`;
      } catch (error) {
      template.reThrow(error, $filename, $lineNumber);
      }
      return out;
      }`)
    )
  })

  test('save template to cache when caching is turned on', async ({ assert, fs }) => {
    await fs.create('foo.edge', 'Hello {{ username }}')

    const loader = new Loader()
    loader.mount('default', fs.basePath)

    const compiler = new Compiler(loader, {}, new Processor(), { cache: true })
    assert.strictEqual(
      compiler.compile('foo'),
      compiler.cacheManager.get(join(fs.basePath, 'foo.edge'))
    )
  })

  test('do not cache template when caching is turned off', async ({ assert, fs }) => {
    await fs.create('foo.edge', 'Hello {{ username }}')

    const loader = new Loader()
    loader.mount('default', fs.basePath)

    const compiler = new Compiler(loader, {}, new Processor(), { cache: false })
    compiler.compile('foo')
    assert.isUndefined(compiler.cacheManager.get(join(fs.basePath, 'foo.edge')))
  })
})

test.group('Compiler | Processor', () => {
  test('execute raw processor function', async ({ assert, fs }) => {
    assert.plan(2)
    await fs.create('index.edge', dedent`Hello`)

    const loader = new Loader()
    loader.mount('default', fs.basePath)

    const processor = new Processor()
    processor.process('raw', ({ raw, path }) => {
      assert.equal(raw, 'Hello')
      assert.equal(path, join(fs.basePath, 'index.edge'))
    })

    const compiler = new Compiler(loader, {}, processor)

    compiler.compile('index')
  })

  test('use return value of the processor function', async ({ assert, fs }) => {
    assert.plan(5)
    await fs.create('index.edge', dedent`Hello`)

    const loader = new Loader()
    loader.mount('default', fs.basePath)

    const processor = new Processor()
    processor.process('raw', ({ raw, path }) => {
      assert.equal(raw, 'Hello')
      assert.equal(path, join(fs.basePath, 'index.edge'))
      return 'Hi'
    })

    processor.process('raw', ({ raw, path }) => {
      assert.equal(raw, 'Hi')
      assert.equal(path, join(fs.basePath, 'index.edge'))
      return 'Hey'
    })

    const compiler = new Compiler(loader, {}, processor)

    assert.stringEqual(
      compiler.compile('index.edge').toString(),
      normalizeNewLines(dedent`function anonymous(template,state,$context
      ) {
      let out = "";
      let $lineNumber = 1;
      let $filename = ${stringify(join(fs.basePath, 'index.edge'))};
      try {
      out += "Hey";
      } catch (error) {
      template.reThrow(error, $filename, $lineNumber);
      }
      return out;
      }`)
    )
  })

  test('do not run raw processor when template is cached', async ({ assert, fs }) => {
    assert.plan(2)
    await fs.create('index.edge', dedent`Hello`)

    const loader = new Loader()
    loader.mount('default', fs.basePath)

    const processor = new Processor()
    processor.process('raw', ({ raw, path }) => {
      assert.equal(raw, 'Hello')
      assert.equal(path, join(fs.basePath, 'index.edge'))
    })

    const compiler = new Compiler(loader, {}, processor, { cache: true })

    compiler.compile('index.edge')
    compiler.compile('index.edge')
    compiler.compile('index.edge')
  })

  test('run raw processor function when template is not cached', async ({ assert, fs }) => {
    assert.plan(6)
    await fs.create('index.edge', dedent`Hello`)

    const loader = new Loader()
    loader.mount('default', fs.basePath)

    const processor = new Processor()
    processor.process('raw', ({ raw, path }) => {
      assert.equal(raw, 'Hello')
      assert.equal(path, join(fs.basePath, 'index.edge'))
    })

    const compiler = new Compiler(loader, {}, processor, { cache: false })

    compiler.compile('index.edge')
    compiler.compile('index.edge')
    compiler.compile('index.edge')
  })

  test('run compiled processor function', async ({ assert, fs }) => {
    assert.plan(2)
    await fs.create('index.edge', dedent`Hello`)

    const loader = new Loader()
    loader.mount('default', fs.basePath)

    const processor = new Processor()
    processor.process('compiled', ({ compiled, path }) => {
      assert.stringEqual(
        compiled,
        normalizeNewLines(dedent`let out = "";
		      let $lineNumber = 1;
		      let $filename = ${stringify(join(fs.basePath, 'index.edge'))};
		      try {
		      out += "Hello";
		      } catch (error) {
		      template.reThrow(error, $filename, $lineNumber);
		      }
		      return out;
		    `)
      )
      assert.equal(path, join(fs.basePath, 'index.edge'))
    })

    const compiler = new Compiler(loader, {}, processor)

    compiler.compile('index.edge')
  })

  test('use return value of the compiled processor function', async ({ assert, fs }) => {
    assert.plan(5)
    await fs.create('index.edge', dedent`Hello`)

    const loader = new Loader()
    loader.mount('default', fs.basePath)

    const processor = new Processor()
    processor.process('compiled', ({ compiled, path }) => {
      assert.stringEqual(
        compiled,
        normalizeNewLines(dedent`let out = "";
		      let $lineNumber = 1;
		      let $filename = ${stringify(join(fs.basePath, 'index.edge'))};
		      try {
		      out += "Hello";
		      } catch (error) {
		      template.reThrow(error, $filename, $lineNumber);
		      }
		      return out;
    		`)
      )
      assert.equal(path, join(fs.basePath, 'index.edge'))
      return 'foo'
    })

    processor.process('compiled', ({ compiled, path }) => {
      assert.equal(compiled, 'foo')
      assert.equal(path, join(fs.basePath, 'index.edge'))
      return 'bar'
    })

    const compiler = new Compiler(loader, {}, processor)

    assert.equal(
      compiler.compile('index.edge').toString(),
      dedent`function anonymous(template,state,$context
      ) {
      bar
      }`
    )
  })

  test('do not run compiled function when template is called', async ({ assert, fs }) => {
    assert.plan(2)
    await fs.create('index.edge', dedent`Hello`)

    const loader = new Loader()
    loader.mount('default', fs.basePath)

    const processor = new Processor()
    processor.process('compiled', ({ compiled, path }) => {
      assert.stringEqual(
        compiled,
        normalizeNewLines(dedent`let out = "";
		      let $lineNumber = 1;
		      let $filename = ${stringify(join(fs.basePath, 'index.edge'))};
		      try {
		      out += "Hello";
		      } catch (error) {
		      template.reThrow(error, $filename, $lineNumber);
		      }
		      return out;
		    `)
      )
      assert.equal(path, join(fs.basePath, 'index.edge'))
    })

    const compiler = new Compiler(loader, {}, processor, { cache: true })

    compiler.compile('index.edge')
    compiler.compile('index.edge')
    compiler.compile('index.edge')
  })

  test('run tag processor function', async ({ assert, fs }) => {
    await fs.create(
      'modal.edge',
      dedent`
			This is a modal
    	`
    )

    await fs.create(
      'index.edge',
      dedent`
			@hl.modal()
			@end
    	`
    )

    const loader = new Loader()
    loader.mount('default', fs.basePath)

    const processor = new Processor()
    processor.process('tag', ({ tag }) => {
      if (tag.properties.name === 'hl.modal') {
        tag.properties.name = 'component'
        tag.properties.jsArg = `'modal'`
      }
    })

    const compiler = new Compiler(
      loader,
      {
        component: componentTag,
      },
      processor
    )

    compiler.claimTag((name) => {
      if (name === 'hl.modal') {
        return { seekable: true, block: true }
      }
      return null
    })

    assert.stringEqual(
      compiler.compile('index.edge').toString(),
      normalizeNewLines(dedent`function anonymous(template,state,$context
      ) {
      let out = "";
      let $lineNumber = 1;
      let $filename = ${stringify(join(fs.basePath, 'index.edge'))};
      try {
      out += template.compileComponent('modal')(template, template.getComponentState({}, { $context: Object.assign({}, $context), main: function () { return "" } }, { filename: $filename, line: $lineNumber, col: 0 }), $context);
      } catch (error) {
      template.reThrow(error, $filename, $lineNumber);
      }
      return out;
      }`)
    )
  })
})
