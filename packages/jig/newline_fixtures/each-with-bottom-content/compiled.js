let out = "";
let $lineNumber = 1;
let $filename = "{{__dirname}}index.edge";
try {
template.loop(state.birds, function (bird) {
out += "\n";
out += "- ";
$lineNumber = 2;
out += `${bird}`;
});
out += "\n";
out += "Above are the birds";
} catch (error) {
template.reThrow(error, $filename, $lineNumber);
}
return out;