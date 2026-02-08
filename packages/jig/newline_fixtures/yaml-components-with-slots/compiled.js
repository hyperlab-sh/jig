let out = "";
let $lineNumber = 1;
let $filename = "{{__dirname}}index.edge";
try {
template.loop(state.users, function (user) {
out += "\n";
out += "-";
out += "\n";
out += "  username: ";
$lineNumber = 3;
out += `${user.username}`;
out += "\n";
out += "  name: ";
$lineNumber = 4;
out += `${user.name}`;
out += "\n";
out += "  job: ";
$lineNumber = 5;
out += `${user.job}`;
out += "\n";
out += "  skills:";
$lineNumber = 7;
out += template.compileComponent('yaml-components/skills')(template, template.getComponentState({
  skills: user.skills
}, { $context: Object.assign({}, $context), main: function () { return "" }, 'skill': function (skill) { const $context = this.$context;
let slot_1 = "";
try {
slot_1 += "    - ";
$lineNumber = 9;
slot_1 += `${skill}`;
} catch (error) {
template.reThrow(error, $filename, $lineNumber);
}
return slot_1;
} }, { filename: $filename, line: $lineNumber, col: 0 }), $context);
});
} catch (error) {
template.reThrow(error, $filename, $lineNumber);
}
return out;