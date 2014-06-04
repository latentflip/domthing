/*
 * Given a string: "hello {name}, how are you this {dayOfWeek}"
 *
 * And a regex to split it on: /{[^}]*}/g
 *
 * And two functions, withMatch and withSpace
 *
 * This function will return an array of parts like so:
 * =>  [
 *       withSpace("hello "),
 *       withMatch("{name}")
 *       withSpace(", how are you this "),
 *       withMatch("{dayOfWeek}")
 *     ]
 */

module.exports = function (string, regex, withMatch, withSpace) {
    withSpace = withSpace || function (s) { return s; };
    withMatch = withMatch || function (s) { return s; };

    regex = new RegExp(regex);

    var result = [];
    var pos = 0;
    var match;
    var prior;
    var substr;
    var transformed;

    while(match = regex.exec(string)) {
        if (match.index > pos) {
            substr = string.substr(pos, match.index - pos);
            if (substr !== '') {
                transformed = withSpace(substr);
                if (transformed) result.push(transformed);
            }
        }

        if (string.substr(match.index, match[0].length).trim() !== '') {
            substr = string.substr(match.index, match[0].length);
            if (substr !== '') {
                transformed = withMatch(substr);
                if (transformed) result.push(transformed);
            }
        }
        pos = match.index + match[0].length;
    }

    if (pos < string.length) {
        substr = string.substr(pos, string.length - pos);
        if (substr.trim() !== '') result.push(withSpace(substr));
    }
    return result;
};
