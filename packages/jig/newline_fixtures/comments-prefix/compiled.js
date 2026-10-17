let out = "";
let $lineNumber = 1;
let $filename = "{{__dirname}}index.edge";
try {
out += "Hello";
out += "\n";
out += "world";
} catch (error) {
template.reThrow(error, $filename, $lineNumber);
}
return out;