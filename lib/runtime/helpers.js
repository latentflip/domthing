var HELPERS = {};

function registerHelper(name, fn) {
    HELPERS[name] = fn;
}

function lookupHelper(name) {
    if (!HELPERS[name]) throw new Error('Cannot find helper ' + name);
    return HELPERS[name];
}

module.exports = {
    registerHelper: registerHelper,
    lookupHelper: lookupHelper
};

//Builtin helpers:
registerHelper('if', function (parent, context, expression, body, alternate) {
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
});

registerHelper('unless', function (parent, context, expression, body, alternate) {
    lookupHelper('if')(parent, context, expression, alternate, body);
});
