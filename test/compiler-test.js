var compiler = require('../lib/compiler');
var parser = require('../lib/parser');
var test = require('tape');
var s = require('multiline');
var compile = compiler.precompileAST;
var deval = require('deval');
var jsdom = require('jsdom');
var builtinHelpers = require('../lib/runtime/helpers');
var fs = require('fs');
var AST = require('../lib/AST');

var visible = function (el) {
    return el;
};

var precompileAndAppend = function (ast, context, helpers, cb) {
    if (!cb && !helpers && typeof context === 'function') {
        cb = context;
        context = {};
    }
    var strFn = compile(ast);
    //console.log(strFn);

    var window = deval(function () {
        window._console = [];
        window.console = {
            log: function () {
                window._console.push([].slice.call(arguments));
            }
        };
        window.requestAnimationFrame = function (cb) { cb(); };
    });

    var inject = deval(function (strFn, context) {
        var tmpl = $strFn$;
        var fragment = tmpl($context$, window.RUNTIME);
        document.querySelector('#output').appendChild(fragment);
        window.templateUnderTest = fragment;
    }, strFn, JSON.stringify(context));

    jsdom.env({
        html: '<div id=output></div>',
        src: [
            window + ';' + fs.readFileSync(__dirname + '/../runtime.bundle.js').toString() + ';' +  inject
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

var parsePrecompileAndAppend = function (template, context, helpers, cb) {
    parser(template, function (err, ast) {
        precompileAndAppend(ast, context, helpers, cb);
    });
};

test('compiles simple nodes', function (t) {
    parsePrecompileAndAppend('<a></a>', function (err, window) {
        t.equal(window.document.querySelectorAll('a').length, 1);
        t.end();
    });
});

test('compiles attributes', function (t) {
    var template = '<a id="baz" class="bar" href="foo"></a>';
    parsePrecompileAndAppend(template, function (err, window) {
        var el = window.document.querySelector('a');
        t.equal(el.getAttribute('href'), 'foo');
        t.equal(el.getAttribute('class'), 'bar');
        t.equal(el.getAttribute('id'), 'baz');
        t.end();
    });
});

test('compiles textNodes', function (t) {
    parsePrecompileAndAppend('<a>foo</a>', function (err, window) {
        var el = window.document.querySelector('a');
        t.equal(el.innerHTML, 'foo');
        t.end();
    });
});

test('compiles textNode with simple bindings', function (t) {
    var template = '<a>{{foo}}</a>';
    var context = { foo: 'hello' };

    parsePrecompileAndAppend(template, context, builtinHelpers, function (err, window) {
        var el = window.document.querySelector('a');
        t.equal(el.innerHTML, 'hello');
        window.templateUnderTest.update('foo', 'goodbye');
        t.equal(el.innerHTML, 'goodbye');
        console.log(window._console);
        t.end();
    });
});

test('compiles attributes with bindings', function (t) {
    var template = '<a href="{{url}}">a link</a>';
    var context = { url: 'google.com' };

    parsePrecompileAndAppend(template, context, builtinHelpers, function (err, window) {
        var el = window.document.querySelector('a');
        t.equal(el.getAttribute('href'), 'google.com');
        window.templateUnderTest.update('url', 'yahoo.com');
        t.equal(el.getAttribute('href'), 'yahoo.com');
        console.log(window._console);
        t.end();
    });
});


test('compiles expressions', function (t) {
    var template = '<a>foo {{bar}} baz</a>';
    parsePrecompileAndAppend(template, { bar: 'hello!' }, builtinHelpers, function (err, window) {
        var el = window.document.querySelector('a');
        t.equal(el.innerHTML, 'foo hello! baz');
        window.templateUnderTest.update('bar', 'goodbye!');
        t.equal(el.innerHTML, 'foo goodbye! baz');
        t.end();
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


test('updates magical class bindings', function (t) {
    var tmpl = '<a class="static {{ foo }} {{ bar }}"></a>';
    var context = { foo: 'hello', bar: 'there' };

    parsePrecompileAndAppend(tmpl, context, builtinHelpers, function (err, window) {
        var el = window.document.querySelector('a');
        t.equal(el.getAttribute('class'), 'static hello there');
        window.templateUnderTest.update('foo', 'goodbye');
        t.equal(el.getAttribute('class'), 'static goodbye there');
        t.end();
    });
});

test('compiles simple if statements', function (t) {
    var tmpl = s(function () {/*
        <div>
            {{#if foo}}
                <a></a>
            {{#else}}
                <b></b>
            {{/if}}
        </div>
    */});
    var context = { foo: true };

    parsePrecompileAndAppend(tmpl, context, builtinHelpers, function (err, window) {
        t.ok(visible(window.document.querySelector('a')));
        t.notOk(visible(window.document.querySelector('b')));

        window.templateUnderTest.update('foo', false);

        t.notOk(visible(window.document.querySelector('a')));
        t.ok(visible(window.document.querySelector('b')));
        t.end();
    });
});

test('compiles if statements without wrappers', function (t) {
    var tmpl = s(function () {/*
        <ul>
            {{#if foo}}
                <li class='yes'>Hi!</li>
            {{#else}}
                <li class='no'>Hi!</li>
            {{/if}}
        </ul>
    */});

    var context = { foo: true };

    parsePrecompileAndAppend(tmpl, context, builtinHelpers, function (err, window) {
        t.ok(visible(window.document.querySelector('ul > li.yes')));
        t.notOk(visible(window.document.querySelector('ul > li.no')));

        window.templateUnderTest.update('foo', false);

        t.notOk(visible(window.document.querySelector('ul > li.yes')));
        t.ok(visible(window.document.querySelector('ul > li.no')));
        t.end();
    });
});

test('compiles unless statements without wrappers', function (t) {
    var tmpl = s(function () {/*
        <ul>
            {{#unless foo}}
                <li class='yes'>Hi!</li>
            {{#else}}
                <li class='no'>Hi!</li>
            {{/if}}
        </ul>
    */});

    var context = { foo: true };

    parsePrecompileAndAppend(tmpl, context, builtinHelpers, function (err, window) {
        t.notOk(visible(window.document.querySelector('ul > li.yes')));
        t.ok(visible(window.document.querySelector('ul > li.no')));

        window.templateUnderTest.update('foo', false);

        t.ok(visible(window.document.querySelector('ul > li.yes')));
        t.notOk(visible(window.document.querySelector('ul > li.no')));
        t.end();
    });
});

test('if statements dont die if only one sided', function (t) {
    var tmpl = s(function () {/*
        <ul>
            <li class='yet'>Hi!</li>
            {{#if foo}}
            {{#else}}
                <li class='no'>Hi!</li>
            {{/if}}
            <li class='yet'>There</li>
        </ul>
    */});

    var context = { foo: true };

    parsePrecompileAndAppend(tmpl, context, builtinHelpers, function (err, window) {
        console.log(window._console);
        //console.log(window.document.querySelector('ul > li.no').style.display);
        t.notOk(visible(window.document.querySelector('ul > li.no')));

        window.templateUnderTest.update('foo', false);

        t.notOk(visible(window.document.querySelector('ul > li.yes')));
        t.ok(visible(window.document.querySelector('ul > li.no')));
        t.end();
    });
});
