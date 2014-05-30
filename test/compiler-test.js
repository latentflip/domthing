var compiler = require('../compiler');
var parser = require('../parser');
var test = require('tape');
var s = require('../s');
var precompileAST = compiler.precompileAST;
var deval = require('deval');
var jsdom = require('jsdom');
var builtinHelpers = require('../helpers');
var fs = require('fs');

var precompileAndAppend = function (ast, context, helpers, cb) {
    if (!cb && !helpers && typeof context === 'function') {
        cb = context;
        context = {};
    }
    var strFn = precompileAST(ast);
    console.log(strFn);

    var inject = deval(function (strFn, context) {
        window.requestAnimationFrame = function (cb) { cb(); };
        var tmpl = $strFn$;
        var fragment = tmpl($context$, window.RUNTIME);
        document.querySelector('#output').appendChild(fragment);
        window.templateUnderTest = fragment;
    }, strFn, JSON.stringify(context));

    jsdom.env({
        html: '<div id=output></div>',
        src: [
            fs.readFileSync(__dirname + '/../runtime.bundle.js').toString() + ';' +  inject
        ],
        done: function (err, window) {
            if (err) {
                console.log('JSDOM Errors:', err);
                throw err;
            }
            cb(null, window);
        }
    });
};

test('compiles simple ast', function (t) {
    precompileAndAppend({
        type: 'Template',
        children: [
            {
                type: 'Element',
                tagName: 'a',
                attributes: {},
                children: []
            }
        ]
    }, function (err, window) {
        t.equal(window.document.querySelectorAll('a').length, 1);
        t.end();
    });
});

test('compiles attributes', function (t) {
    parser('<a id="baz" class="bar" href="foo"></a>', function (err, ast) {
        precompileAndAppend(ast, function (err, window) {
            var el = window.document.querySelector('a');
            t.equal(el.getAttribute('href'), 'foo');
            t.equal(el.getAttribute('class'), 'bar');
            t.equal(el.getAttribute('id'), 'baz');
            t.end();
        });
    });
});

test('compiles textNodes', function (t) {
    parser('<a>foo</a>', function (err, ast) {

        precompileAndAppend(ast, function (err, window) {
            var el = window.document.querySelector('a');
            t.equal(el.innerHTML, 'foo');
            t.end();
        });
    });
});


test('compiles expressions', function (t) {
    parser('<a>foo {{bar}} baz</a>', function (err, ast) {
        precompileAndAppend(ast, {bar: 'Hello!'}, builtinHelpers, function (err, window) {
            var el = window.document.querySelector('a');
            t.equal(el.innerHTML, 'foo Hello! baz');
            t.end();
        });
   });
});

test('compiles siblings', function (t) {
    parser('<div><a id=one>foo</a><a id=two>bar</a></div>', function (err, ast) {
        precompileAndAppend(ast, function (err, window) {
            var el1 = window.document.querySelector('#one');
            t.equal(el1.innerHTML, 'foo');

            var el2 = window.document.querySelector('#two');
            t.equal(el2.innerHTML, 'bar');

            t.end();
        });
    });
});

test('compiles nested', function (t) {
    parser('<a><span>foo</span></a>', function (err, ast) {
        precompileAndAppend(ast, function (err, window) {
            var span = window.document.querySelector('a span');
            t.equal(span.innerHTML, 'foo');
            t.end();
        });
    });
});

test('compiles simple if statements', function (t) {
    parser(s(function () {/*
        {{#if foo}}
            <a></a>
        {{#else}}
            <b></b>
        {{/if}}
    */}), function (err, ast) {
        t.plan(4);
        precompileAndAppend(ast, { foo: true }, builtinHelpers, function (err, window) {
            t.ok(window.document.querySelector('a'));
            t.notOk(window.document.querySelector('b'));
        });

        precompileAndAppend(ast, { foo: false }, builtinHelpers, function (err, window) {
            t.notOk(window.document.querySelector('a'));
            t.ok(window.document.querySelector('b'));
        });
    });
});

test('updates basic bindings', function (t) {
    parser(s(function () {/*
        <a>{{ foo }}</a>
    */}), function (err, ast) {
        t.plan(2);

        precompileAndAppend(ast, { foo: 'hello' }, builtinHelpers, function (err, window) {
            var el = window.document.querySelector('a');
            t.equal(el.innerHTML, 'hello');
            window.templateUnderTest.update('foo', 'goodbye');
            t.equal(el.innerHTML, 'goodbye');
        });
    });
});



test('updates basic bindings', function (t) {
    parser(s(function () {/*
        <a class="{{ foo }}"></a>
    */}), function (err, ast) {
        t.plan(2);

        precompileAndAppend(ast, { foo: 'hello' }, builtinHelpers, function (err, window) {
            var el = window.document.querySelector('a');
            t.equal(el.getAttribute('class'), 'hello');
            window.templateUnderTest.update('foo', 'goodbye');
            t.equal(el.getAttribute('class'), 'goodbye');
        });
    });
});

test.only('updates magical class bindings', function (t) {
    parser(s(function () {/*
        <a class="static {{ foo }} {{ bar }}"></a>
    */}), function (err, ast) {
        t.plan(2);

        precompileAndAppend(ast, { foo: 'hello', bar: 'there' }, builtinHelpers, function (err, window) {
            var el = window.document.querySelector('a');
            t.equal(el.getAttribute('class'), 'static hello there');
            window.templateUnderTest.update('foo', 'goodbye');
            t.equal(el.getAttribute('class'), 'goodbye');
        });
    });

});
