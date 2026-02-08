let out = "";
let $lineNumber = 1;
let $filename = "{{__dirname}}index.edge";
try {
if (state.birds) {
out += "\n";
out += "- ";
$lineNumber = 2;
out += `${state.birds[0]}`;
}
out += "\n";
out += "says hello";
} catch (error) {
template.reThrow(error, $filename, $lineNumber);
}
return out;