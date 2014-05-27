var s = require('./s');

var template = s(function () {/*
    <a href='{{ foo.bar.href }}' class='{{ foo.bar.class }}'>
        {{# if true }}
            <em>Hello!</em>
        {{#/if }}
    </a>
*/});


var reduceKeypath = function (tree, keypath) {
    return keypath.reduce(function (t, key) {
        if (!t) return undefined;
        return t[key];
    }, tree);
};

var lib = require('./lib');

var t = lib.compile(template);

var context = {
    foo: {
        bar: {
            class: 'a class!',
            href: 'an href!'
        }
    }
};

var helpers = {
    ATTRIBUTE: function (node, attrName, context, binding) {
        node.setAttribute(attrName, reduceKeypath(context, binding.keypath));
    }
};

document.addEventListener('DOMContentLoaded', function () {
    var domEl = t(context, helpers);
    document.body.appendChild(domEl);
    console.log('Rendered', domEl);
});
