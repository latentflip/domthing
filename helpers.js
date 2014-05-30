var reduceKeypath = require('./lib/reduce-keypath');

module.exports.textBinding = function (node, context, expression) {
    this.addCallback(expression, function (value) {
        node.data = value;
    });
    node.data = reduceKeypath(context, expression);
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
