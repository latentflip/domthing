var reduceKeypath = require('../reduce-keypath');
var streamifyFn = require('../streamify-fn');
var streamCombiner = require('../tiny-stream-combiner');
var stream = require('../tiny-stream');

var HELPERS = module.exports;

module.exports.STREAMIFY_LITERAL = function (value) {
    return stream(value);
};

module.exports.STREAMIFY_BINDING = function (context, keypath) {
    var value = reduceKeypath(context, keypath);
    var s = stream(value);

    this.addCallback(keypath, function (value) {
        s.value = value;
    });

    return s;
};


module.exports.not = streamifyFn(function (inp) {
    return !inp;
});

module.exports.equal = streamifyFn(function (a, b) {
    return a == b;
});

module.exports.concat = streamifyFn(function (/*args...*/) {
    var truthy = function (a) { return !!a; };
    return [].slice.call(arguments).filter(truthy).join('');
});

//This should be if 
module.exports.sw = streamifyFn(function (cond, yes, no) {
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
        var first = false;
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
