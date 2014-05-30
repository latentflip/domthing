module.exports = function reduceKeypath(context, keypath) {
    var path = keypath.trim().split('.');
    return path.reduce(function (obj, path) {
        return obj && obj[path];
    }, context);
}
