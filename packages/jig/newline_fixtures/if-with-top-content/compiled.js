let out = "";
let $lineNumber = 1;
let $filename = "{{__dirname}}index.edge";
try {
out += "Hello";
$lineNumber = 2;
if (state.birds) {
out += "\n";
out += "- ";
$lineNumber = 3;
out += `${state.birds[0]}`;
}
} catch (error) {
template.reThrow(error, $filename, $lineNumber);
}
return out;