module.exports.if = function (parent, context, expression, body, alternate) {

    var elements, newElements;

    var render = function () {
        var fragment = document.createDocumentFragment();
        
        if (context[expression]) {
            body(fragment);
        } else {
            alternate(fragment);       
        }

        newElements = [].map.call(fragment.children, function (el) {
            return el;
        });

        if (!elements || !elements.length) {
            parent.appendChild(fragment);
        } else {
            parent = elements[0].parentNode;
            parent.insertBefore(fragment, elements[0]);
            elements.forEach(parent.removeChild.bind(parent));
        }
        elements = window.e = newElements;
    };

    Object.observe(context, function (changes) {
        changes.forEach(function () {
            render();
        });
    });

    setInterval(function () {
        context.foo = !context.foo;
    }, 1000);

    setInterval(function () {
        context.bar = !context.bar;
    }, 250);

    render();
};
