module.exports = function relativeKeypath(from, to) {
    from = from.trim();
    to = to.trim();

    if (to.indexOf(from + '.') !== 0) {
        throw new Error('Cannot get to "' + to + '" from "' + from + '"');
    }
    return to.substr(from.length + 1);
};
