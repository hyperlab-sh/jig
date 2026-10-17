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
template.loop(user.skills, function (skill) {
out += "\n";
$lineNumber = 8;
out += template.indentOutput(template.compilePartial('yaml-partials/skills',"user","skill")(template,state,$context,user,skill), "  ");
});
});
} catch (error) {
template.reThrow(error, $filename, $lineNumber);
}
return out;