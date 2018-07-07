(function (template, ctx) {
  let out = ''
  out += template.renderWithState('components-state/alert', {}, { 'main': (function (template, ctx) {
return function (props) {
  let out = ''
  ctx.newFrame()
  ctx.setOnFrame('props', props)
  out += '  Hello '
  out += `${ctx.escape(ctx.resolve('username'))}`
  out += '\n'
  ctx.removeFrame()
  return out
}
})(template, ctx) })
  return out
})(template, ctx)