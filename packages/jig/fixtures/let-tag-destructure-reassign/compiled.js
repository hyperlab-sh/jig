let out = "";
let $lineNumber = 1;
let $filename = "{{__dirname}}index.edge";
try {
let {username, age: userAge} = state.user;
$lineNumber = 2;
out += `${username}`;
out += ", ";
out += `${userAge}`;
} catch (error) {
template.reThrow(error, $filename, $lineNumber);
}
return out;