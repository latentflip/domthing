/* jshint evil: true */
var eventifyFn = require('../eventify-fn');
var SafeString = require('./safe-string');

var EXPRESSIONS = {};

function registerExpression (name, fn) {
    EXPRESSIONS[name] = eventifyFn(fn);
}

function lookupExpression (name) {
    if (!EXPRESSIONS[name]) throw new Error('Cannot find expression ' + name);
    return EXPRESSIONS[name];
}

module.exports = {
    lookupExpression: lookupExpression,
    registerExpression: registerExpression
};


//Builtin expressions:

function makeBinaryOperatorFunction(op) {
    registerExpression(op, new Function("a", "b", "return a " + op + " b"));
}
function aliasBinaryOperatorFunction(name, op) {
    registerExpression(name, new Function("a", "b", "return a " + op + " b"));
}

['*', '+', '-', '/', '%', '<', '==', '===', '>'].forEach(makeBinaryOperatorFunction);

aliasBinaryOperatorFunction("leq", "<=");
aliasBinaryOperatorFunction("lteq", "<=");
aliasBinaryOperatorFunction("geq", ">=");
aliasBinaryOperatorFunction("gteq", ">=");

registerExpression('!', function (inp) { return !inp; });
registerExpression('not', function (inp) { return !inp; });


registerExpression('if', function (cond, yes, no) {
    if (cond) {
        return yes;
    } else {
        return no || '';
    }
});

registerExpression('concat', function (/*args...*/) {
    var truthy = function (a) { return !!a; };
    return [].slice.call(arguments).filter(truthy).join('');
});

registerExpression('safe', function (value) {
    return new SafeString(value);
});

registerExpression('call', function (object, fn/*, args...*/) {
    return object[fn].apply(object, [].slice.call(arguments, 2));
});

registerExpression('apply', function (object, fn, argArray) {
    return object[fn].apply(object, argArray);
});
