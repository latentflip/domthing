!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.RUNTIME=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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

},{}],2:[function(_dereq_,module,exports){
module.exports = {
    helpers: _dereq_('./helpers')
};

},{"./helpers":1}]},{},[2])
(2)
});