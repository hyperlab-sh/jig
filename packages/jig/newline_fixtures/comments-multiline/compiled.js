let out = "";
let $lineNumber = 1;
let $filename = "{{__dirname}}index.edge";
try {
out += "\n";
out += "Hello world";
} catch (error) {
template.reThrow(error, $filename, $lineNumber);
}
return out;