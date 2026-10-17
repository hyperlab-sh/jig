let out = "";
let $lineNumber = 1;
let $filename = "{{__dirname}}index.edge";
try {
if (!state.age) {
out += "\n";
out += "Hello ";
$lineNumber = 2;
out += `${state.username}`;
}
} catch (error) {
template.reThrow(error, $filename, $lineNumber);
}
return out;