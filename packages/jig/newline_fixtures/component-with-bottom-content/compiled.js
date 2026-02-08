let out = "";
let $lineNumber = 1;
let $filename = "{{__dirname}}index.edge";
try {
out += template.compileComponent('component-with-bottom-content/alert')(template, template.getComponentState({}, { $context: Object.assign({}, $context), main: function () { const $context = this.$context;
let slot_main = "";
try {
slot_main += "hello ";
$lineNumber = 2;
slot_main += `${state.username}`;
} catch (error) {
template.reThrow(error, $filename, $lineNumber);
}
return slot_main;
} }, { filename: $filename, line: $lineNumber, col: 0 }), $context);
out += "\n";
out += "Above is an alert";
} catch (error) {
template.reThrow(error, $filename, $lineNumber);
}
return out;