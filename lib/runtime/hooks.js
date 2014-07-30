var helpers = require('./helpers');
var expressions = require('./expressions');
var property = require('../evented-property');
var reduceKeypath = require('../reduce-keypath');


module.exports.EVENTIFY_LITERAL = function (value) {
    return property(value);
};

module.exports.EVENTIFY_BINDING = function (context, keypath) {
    var value = reduceKeypath(context, keypath);
    var s = property(value);

    this.addCallback(keypath, function (value) {
        s.value = value;
    });

    return s;
};

module.exports.EXPRESSION = function (name, args) {
    var expression = expressions.lookupExpression(name);
    return expression.apply(expression, args);
};

module.exports.HELPER = function (name, args) {
    var helper = helpers.lookupHelper(name);
    return helper.apply(helper, args);
};

module.exports.ESCAPE_FOR_ATTRIBUTE = function (attrName, value) {
    var sanitationNode, normalisedValue;
    var protocolRegex = /^\s*(https?|ftp|mailto):/;

    if (attrName === 'href') {
        sanitationNode = document.createElement('a');
        sanitationNode.setAttribute('href', value);
        normalisedValue = sanitationNode.href;

        if (normalisedValue.match(protocolRegex)) {
            return normalisedValue;
        } else {
            return 'unsafe:' + normalisedValue;
        }
    }

    if (attrName === 'src') {
        sanitationNode = document.createElement('a');
        sanitationNode.setAttribute('href', value);
        normalisedValue = sanitationNode.href;

        if (normalisedValue.match(protocolRegex)) {
            return normalisedValue;
        } else {
            return 'unsafe:' + normalisedValue;
        }
    }

    return value;
};
