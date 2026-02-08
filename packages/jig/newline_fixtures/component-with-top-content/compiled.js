let out = "";
let $lineNumber = 1;
let $filename = "{{__dirname}}index.edge";
try {
out += "Alert";
out += "\n";
out += "";
$lineNumber = 3;
out += template.compileComponent('component-with-top-content/alert')(template, template.getComponentState({}, { $context: Object.assign({}, $context), main: function () { const $context = this.$context;
let slot_main = "";
try {
slot_main += "hello ";
$lineNumber = 4;
slot_main += `${state.username}`;
} catch (error) {
template.reThrow(error, $filename, $lineNumber);
}
return slot_main;
} }, { filename: $filename, line: $lineNumber, col: 0 }), $context);
} catch (error) {
template.reThrow(error, $filename, $lineNumber);
}
return out;