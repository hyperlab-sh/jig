let out = "";
let $lineNumber = 1;
let $filename = "{{__dirname}}index.edge";
try {
state.user.username = state.user.username.toUpperCase();
out += "Hello ";
$lineNumber = 2;
out += `${state.user.username}`;
} catch (error) {
template.reThrow(error, $filename, $lineNumber);
}
return out;