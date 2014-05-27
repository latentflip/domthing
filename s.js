function s (fn) {
    var str = fn.toString();
    var lines = str.split('\n');
    lines.shift();
    lines.pop();
    str = lines.join('\n');
    return str;
}
module.exports = s;
