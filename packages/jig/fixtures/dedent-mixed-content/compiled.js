let out = "";
let $lineNumber = 1;
let $filename = "{{__dirname}}index.edge";
try {
out += "before";
$lineNumber = 2;
if (state.show) {
out += "\n";
out += "  inside";
}
out += "\n";
out += "after";
} catch (error) {
template.reThrow(error, $filename, $lineNumber);
}
return out;