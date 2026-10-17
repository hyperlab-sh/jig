let out = "";
let $lineNumber = 1;
let $filename = "{{__dirname}}index.edge";
try {
out += "Hello";
$lineNumber = 2;
if (state.username) {
out += "\n";
out += "- ";
$lineNumber = 3;
out += `${state.username}`;
} else {
out += "\n";
out += "- Guest";
}
} catch (error) {
template.reThrow(error, $filename, $lineNumber);
}
return out;