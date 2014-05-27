module.exports = function (string, regex, withMatch, withSpace) {
    withSpace = withSpace || function (s) { return s; };
    withMatch = withMatch || function (s) { return s; };

    regex = new RegExp(regex);

    var result = [];
    var pos = 0;
    var match;
    var prior;
    var substr;

    while(match = regex.exec(string)) {
        if (match.index > pos) {
            substr = string.substr(pos, match.index - pos);
            if (substr.trim() !== '') result.push(withSpace(substr));
        }

        if (string.substr(match.index, match[0].length).trim() !== '') {
            substr = string.substr(match.index, match[0].length);
            if (substr.trim() !== '') result.push(withMatch(substr));
        }
        pos = match.index + match[0].length;
    }

    if (pos < string.length) {
        substr = string.substr(pos, string.length - pos);
        if (substr.trim() !== '') result.push(withSpace(substr));
    }
    return result;
};
