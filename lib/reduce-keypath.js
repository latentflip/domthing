/*
 * Given a context object { a: {
 *                            b: {
 *                              c: 'hello'
 *                            },
 *                          d: {
 *                            e: 'goodbye'
 *                          }
 *                        }
 *
 * And keypaths, like "a.b.c" or "d.e", or "a.b"
 *
 * This function returns the value at the keypath:
 * reduceKeypath(context, "a.b.c") //=> 'hello'
 * reduceKeypath(context, "d.e") //=> 'goodbye'
 * reduceKeypath(context, "a.b") //=> { c: 'hello' }
 *
 * Will return undefined if the keypath doesn't exist.
 */

module.exports = function reduceKeypath(context, keypath) {
    var path = keypath.trim().split('.');

    return path.reduce(function (obj, path) {
        return obj && obj[path];
    }, context);
};
