let out = "";
let $lineNumber = 1;
let $filename = "{{__dirname}}index.edge";
try {
let username = 'virk';
out += "Hello ";
$lineNumber = 2;
out += `${username}`;
} catch (error) {
template.reThrow(error, $filename, $lineNumber);
}
return out;