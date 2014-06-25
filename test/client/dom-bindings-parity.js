var compiler = require('../../lib/compiler');
var parser = require('../../lib/parser');
var test = require('tape');
var s = require('multiline');
var compile = compiler.compile;
var builtinHelpers = require('../../lib/runtime/helpers');
var fs = require('fs');
var parsePrecompileAndAppend = require('../helpers/parsePrecompileAndAppend');
var async = require('async');


test('text bindings', function (t) {
    var tmpl = '<span>{{ foo }}</span>';

    testBinding(tmpl)
        .context({ foo: 'hello' }).assert(innerHTMLEqual('hello'))
        .update('foo', '').assert(innerHTMLEqual(''))
        .update('foo', 'there').assert(innerHTMLEqual('there'))
        .update('foo', NaN).assert(innerHTMLEqual(''))
        .update('foo', undefined).assert(innerHTMLEqual(''))
        .run(t);
});

test('class', function (t) {
    var tmpl = '<span class="bar {{foo}} baz"></span>';

    testBinding(tmpl)
        .context({ foo: 'active' }).assert(hasClasses('bar', 'active', 'baz'))
        .update('foo', '').assert(hasClasses('bar', 'baz'))
        .update('foo', 'blah').assert(hasClasses('bar', 'blah', 'baz'))
        .update('foo', undefined).assert(hasClasses('bar', 'baz'))
        .update('foo', NaN).assert(hasClasses('bar', 'baz'))
        .update('foo', null).assert(hasClasses('bar', 'baz'))
        .run(t);
});

test('set attribute', function (t) {
    var hasId = function (id) {
        return function (el) {
            var elId = el.id;
            if (elId !== id) console.log(elId, '!==', id);
            return el.getAttribute('id') === id;
        };
    };
    testBinding('<span id="{{ foo }}"></span>')
        .context({ foo: 'my-span' }).assert(hasId('my-span'))
        .update('foo', 'bar').assert(hasId('bar'))
        .update('foo', NaN).assert(hasId(''))
        .update('foo', undefined).assert(hasId(''))
        .update('foo', null).assert(hasId(''))
        .run(t);
});

test('booleanClass', function (t) {
    var tmpl = "<span class='bar {{ (sw foo \"a\" no ) }} baz'></span>";

    testBinding(tmpl)
        .context({ foo: true, no: "b" }).assert(hasClasses('bar', 'a', 'baz'))
        .update('foo', false).assert(hasClasses('bar', 'b', 'baz'))
        .update('foo', 'yes').assert(hasClasses('bar', 'a', 'baz'))
        .update('foo', null).assert(hasClasses('bar', 'b', 'baz'))
        //Can change bound expression argument
        .update('no', 'altered').assert(hasClasses('bar', 'altered', 'baz'))
        .run(t);
});


test('booleanAttribute - initially true', function (t) {
    var tmpl = "<input checked='{{foo}}'>";
    var isChecked = function (el) { return el.checked; };
    var isNotChecked = function (el) { return !el.checked; };

    testBinding(tmpl)
        .context({ foo: true }).assert(isChecked)
        .update('foo', false).assert(isNotChecked)
        .update('foo', 'checked').assert(isChecked)
        //FIXME should '' be truthy or falsy in this context?
        .update('foo', '').assert(isNotChecked)
        .update('foo', null).assert(isNotChecked)
        .update('foo', undefined).assert(isNotChecked)
        .update('foo', NaN).assert(isNotChecked)
        .run(t);
});

test('booleanAttribute - initially false', function (t) {
    var tmpl = "<input checked='{{foo}}'>";
    var isChecked = function (el) { return el.checked; };
    var isNotChecked = function (el) { return !el.checked; };

    testBinding(tmpl)
        .context({ foo: false }).assert(isNotChecked)
        .update('foo', true).assert(isChecked)
        .update('foo', false).assert(isNotChecked)
        .update('foo', 'checked').assert(isChecked)
        //FIXME should '' be truthy or falsy in this context?
        .update('foo', '').assert(isNotChecked)
        .update('foo', null).assert(isNotChecked)
        .update('foo', undefined).assert(isNotChecked)
        .update('foo', NaN).assert(isNotChecked)
        .run(t);
});


test('switch (equivalent)', function (t) {
    var tmpl = s(function () {/*
        <span>
            {{#if (equal foo "a")}} a content {{/if}}
            {{#if (equal foo "b")}} b content {{/if}}
            {{#if (equal foo "c")}} c content {{/if}}
        </span>
    */});

   testBinding(tmpl)
      .context({ foo: "a" }).assert(textContentEqual('a content', true))
      .update('foo', 'b').assert(textContentEqual('b content', true))
      .update('foo', 'c').assert(textContentEqual('c content', true))
      .update('foo', 'b').assert(textContentEqual('b content', true))
      .update('foo', 'a').assert(textContentEqual('a content', true))
      .run(t);
});

/// helpers

function wait(fn) {
    setTimeout(fn, 25);
}

function hasClasses() {
    var expected = [].slice.call(arguments);

    return function (el) {
        var classes = el.getAttribute('class') || '';
        classes = classes.split(' ').filter(function (s) { return s !== ''; });
        expected = JSON.stringify(expected);
        var actual = JSON.stringify(classes);

        if (actual !== expected) { console.log(actual, '!=', expected); }
        return actual === expected;
    };
}

function testBinding(tmpl) {
    return {
        _template: tmpl,
        _steps: [],
        _context: {},
        context: function (context) {
            this._context = context;
            return this;
        },
        assert: function (cb) {
            this._steps.push(['assert', cb]);
            return this;
        },
        update: function (key, val) {
            this._steps.push(['update', key, val]);
            return this;
        },
        log: function () {
            this._steps.push(['log']);
            return this;
        },
        run: function (t) {
            parsePrecompileAndAppend(this._template, this._context, builtinHelpers, function (err, window) {
                t.notOk(err);
                var tut = window.templateUnderTest;
                var el = window.document.querySelector('#output > *');

                async.eachSeries(this._steps, function (step, next) {
                    if (step[0] === 'assert') {
                        wait(function () {
                            t.ok(step[1](el));
                            next();
                        });
                    } else if (step[0] === 'update') {
                        tut.update(step[1], step[2]);
                        next();
                    } else if (step[0] === 'log') {
                        console.log(window._console);
                        next();
                    }
                }, function (err) {
                    t.notOk(err);
                    t.end();
                });
            }.bind(this));
        }
    };
}

function innerHTMLEqual(str) {
    return function (el) {
        if (el.innerHTML !== str) console.log(el.innerHTML, '!==', str);
        return el.innerHTML === str;
    };
}

function textContentEqual(expect, doTrim) {
    return function (el) {
        var actual = el.textContent;
        if (doTrim) actual = actual.trim();
        if (actual !== expect) console.log(actual, '!==', expect);
        return actual === expect;
    };
}
