let out = "";
let $lineNumber = 1;
let $filename = "{{__dirname}}index.edge";
try {
if (state.show) {
out += "\n";
out += "  Hello ";
$lineNumber = 2;
out += `${state.name}`;
}
} catch (error) {
template.reThrow(error, $filename, $lineNumber);
}
return out;