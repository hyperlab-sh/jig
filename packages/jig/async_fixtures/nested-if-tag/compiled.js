let out = "";
let $lineNumber = 1;
let $filename = "{{__dirname}}index.edge";
try {
if (state.username) {
$lineNumber = 2;
if (state.age > 18) {
out += "\n";
out += "Hello ";
$lineNumber = 3;
out += `${state.username}`;
}
}
} catch (error) {
template.reThrow(error, $filename, $lineNumber);
}
return out;