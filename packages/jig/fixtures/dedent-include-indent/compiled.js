let out = "";
let $lineNumber = 1;
let $filename = "{{__dirname}}index.edge";
try {
if (true) {
out += "\n";
$lineNumber = 2;
out += template.indentOutput(template.compilePartial('dedent-include-indent/partial')(template,state,$context), "  ");
}
} catch (error) {
template.reThrow(error, $filename, $lineNumber);
}
return out;