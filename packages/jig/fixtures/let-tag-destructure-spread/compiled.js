let out = "";
let $lineNumber = 1;
let $filename = "{{__dirname}}index.edge";
try {
let {username, age, ...rest} = state.user;
$lineNumber = 2;
out += `${username}`;
out += ", ";
out += `${age}`;
out += " ";
out += `${rest}`;
} catch (error) {
template.reThrow(error, $filename, $lineNumber);
}
return out;