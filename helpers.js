var reduceKeypath = require('./lib/reduce-keypath');
var streamCombiner = require('./lib/tiny-stream-combiner');

var combinators = module.exports.combinators = {
    concat: function (/*args...*/) {
        return [].join.apply(arguments, ' ');
    }
};

module.exports.combine = function (node, context, attributeName, method, args) {
    var expressions = [];
    var keys = args;
    var vals = args.map(function (v) {
        if (v.type === 'Literal') return v.value;
        if (v.type === 'Expression') {
            expressions.push(v.expression);
            return reduceKeypath(context, v.expression);
        }
    });
    
    if (!combinators[method]) throw new Error('Unknown combinator: "' + method + '"');

    var combiner = streamCombiner(keys, vals, combinators[method]);
    combiner.on('change', function (newValue) {
        node.setAttribute(attributeName, newValue);
    });
    node.setAttribute(attributeName, combiner.value);

    expressions.forEach(function () {
        this.addCallback(expression, function (value) {
            combiner[expression] = value;
        });
    }.bind(this));
};

module.exports.textBinding = function (node, context, keypath) {
    this.addCallback(keypath, function (value) {
        node.data = value;
    });
    node.data = reduceKeypath(context, keypath);
};

module.exports.attribute = function (node, context, attributeName, expression) {
    this.addCallback(expression, function (value) {
        node.setAttribute(attributeName, value);
    });
    node.setAttribute(attributeName, reduceKeypath(context, expression));
};

module.exports.if = function (parent, context, expression, body, alternate) {
    var elements, newElements;
    //FIXME: need to wrap in a div, ugh

    var trueDiv = document.createElement('div');
    var falseDiv = document.createElement('div');

    body(trueDiv);
    alternate(falseDiv);

    var previousValue;
    var currentElement;

    var render = function (value, force) {
        var newElement;
        value = !!value;

        if (previousValue !== value || force) {
            newElement = value ? trueDiv : falseDiv;

            if (!currentElement) {
                parent.appendChild(newElement);
            } else {
                currentElement.parentNode.replaceChild(newElement, currentElement);
            }

            currentElement = newElement;
            previousValue = value;
        }
    };

    render(reduceKeypath(context, expression), true);
    this.addCallback(expression, render);
};
