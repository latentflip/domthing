var reduceKeypath = require('../reduce-keypath');
var eventifyFn = require('../eventify-fn');
var property = require('../evented-property');

var HELPERS = module.exports;

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


module.exports.not = eventifyFn(function (inp) {
    return !inp;
});

module.exports.equal = eventifyFn(function (a, b) {
    return a == b;
});

module.exports.concat = eventifyFn(function (/*args...*/) {
    var truthy = function (a) { return !!a; };
    return [].slice.call(arguments).filter(truthy).join('');
});

//This should be if
module.exports.sw = eventifyFn(function (cond, yes, no) {
    if (cond) {
        return yes;
    } else {
        return no || '';
    }
});

module.exports.EXPRESSION = function (name, args) {
    if (!HELPERS[name]) throw new Error('Cannot find filter ' + name);
    return HELPERS[name].apply(HELPERS[name], args);
};


module.exports.unless = function (parent, context, expression, body, alternate) {
    HELPERS.if(parent, context, expression, alternate, body);
};

module.exports.if = function (parent, context, expression, body, alternate) {
    var anchor = document.createComment('if placeholder');
    var elements, newElements;
    //FIXME: need to wrap in a div, ugh

    var trueDiv = document.createElement('div');
    var falseDiv = document.createElement('div');

    parent.appendChild(anchor);

    body(trueDiv);
    alternate(falseDiv);

    var trueEls = [].slice.call(trueDiv.childNodes);
    var falseEls = [].slice.call(falseDiv.childNodes);

    var render = function (value, force) {
        first = false;
        if (value) {
            if (!first) {
                falseEls.forEach(function (el) {
                    if (el.parentNode) el.parentNode.removeChild(el);
                });
            }

            trueEls.forEach(function (el) {
                anchor.parentNode.insertBefore(el, parent.nextSibling);
            });
        } else {
            if (!first) {
                trueEls.forEach(function (el) {
                    if (el.parentNode) el.parentNode.removeChild(el);
                });
            }
            falseEls.forEach(function (el) {
                anchor.parentNode.insertBefore(el, parent.nextSibling);
            });

        }
    };

    render(expression.value, true);
    expression.on('change', render);
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
