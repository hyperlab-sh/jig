let out = "";
let $lineNumber = 1;
let $filename = "{{__dirname}}index.edge";
try {
out += template.compileComponent('component-custom-slots/alert')(template, template.getComponentState({}, { $context: Object.assign({}, $context), main: function () { const $context = this.$context;
let slot_main = "";
try {
slot_main += "hello ";
$lineNumber = 5;
slot_main += `${state.username}`;
} catch (error) {
template.reThrow(error, $filename, $lineNumber);
}
return slot_main;
}, 'heading': function () { const $context = this.$context;
let slot_1 = "";
try {
slot_1 += "  This is heading";
} catch (error) {
template.reThrow(error, $filename, $lineNumber);
}
return slot_1;
} }, { filename: $filename, line: $lineNumber, col: 0 }), $context);
} catch (error) {
template.reThrow(error, $filename, $lineNumber);
}
return out;