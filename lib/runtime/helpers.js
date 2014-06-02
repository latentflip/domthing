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

    var parts = keypath.split('.');
    var model = parts.shift();
    keypath = parts.join('.');

    context[model].on('change:' + keypath, function (_, v) {
        s.value = v;
    });

    return s;
};


module.exports.concat = function (/*args...*/) {
    var fn = streamifyFn(function (/*args...*/) {
        console.log([].slice.call(arguments));
        return [].slice.call(arguments).join(' ');
    });

    return fn.apply(fn, arguments);
};

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
                    el.parentNode.removeChild(el);
                });
            }

            trueEls.forEach(function (el) {
                anchor.parentNode.insertBefore(el, parent.nextSibling);
            });
        } else {
            if (!first) {
                trueEls.forEach(function (el) {
                    el.parentNode.removeChild(el);
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
