let out = "";
let $lineNumber = 1;
let $filename = "{{__dirname}}index.edge";
try {
out += "Here are the birds";
$lineNumber = 2;
template.loop(state.birds, function (bird) {
out += "\n";
out += "- ";
$lineNumber = 3;
out += `${bird}`;
});
} catch (error) {
template.reThrow(error, $filename, $lineNumber);
}
return out;