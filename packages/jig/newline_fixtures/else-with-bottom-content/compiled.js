let out = "";
let $lineNumber = 1;
let $filename = "{{__dirname}}index.edge";
try {
if (state.username) {
out += "\n";
out += "- ";
$lineNumber = 2;
out += `${state.username}`;
} else {
out += "\n";
out += "- Guest";
}
out += "\n";
out += "says hello";
} catch (error) {
template.reThrow(error, $filename, $lineNumber);
}
return out;