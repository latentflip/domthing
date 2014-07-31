/*jshint scripturl:true*/

var compiler = require('../../lib/compiler');
var parser = require('../../lib/parser');
var test = require('tape');
var s = require('multiline');
var compile = compiler.compile;
var builtinHelpers = require('../../lib/runtime/helpers');
var fs = require('fs');
var parsePrecompileAndAppend = require('../helpers/parsePrecompileAndAppend');
var async = require('async');

test('html is escaped with double-curlies', function (t) {
    var tmpl = '<div>{{ foo }}</div>';
    var context = {
        foo: "<a><b></b></a>"
    };

    parsePrecompileAndAppend(tmpl, context, builtinHelpers, function (err, window) {
        var el = window.document.querySelector('#output');
        t.notOk(el.querySelector('b'));
        t.end();
    });
});

test('html is unescaped with triple-curlies', function (t) {
    var tmpl = '<div>{{{ foo }}}</div>';
    var context = {
        foo: "<a><b></b></a>"
    };

    parsePrecompileAndAppend(tmpl, context, builtinHelpers, function (err, window) {
        var el = window.document.querySelector('#output');
        t.ok(el.querySelector('b'));
        t.end();
    });
});

test('href is escaped with double-curlies', function (t) {
    var tmpl = '<a href="{{foo}}"></a>';
    var context = {
        //   done like this because jshint doesnt like it
        foo: 'javascript' + ':' + 'alert(1)'
    };

    parsePrecompileAndAppend(tmpl, context, builtinHelpers, function (err, window) {
        var el = window.document.querySelector('a');
        t.equal(el.getAttribute('href'), 'unsafe:javascript:alert(1)');
        t.end();
    });
});

test('href is unescaped with triple-curlies', function (t) {
    var tmpl = '<a href="{{{foo}}}"></a>';
    var context = {
        //   done like this because jshint doesnt like it
        foo: 'javascript' + ':' + 'alert(1)'
    };

    parsePrecompileAndAppend(tmpl, context, builtinHelpers, function (err, window) {
        var el = window.document.querySelector('a');
        t.equal(el.getAttribute('href'), 'javascript:alert(1)');
        t.end();
    });
});

test('src is escaped with double-curlies', function (t) {
    var tmpl = '<img src="{{foo}}">';
    var context = {
        //   done like this because jshint doesnt like it
        foo: 'javascript' + ':' + 'alert(1)'
    };

    parsePrecompileAndAppend(tmpl, context, builtinHelpers, function (err, window) {
        var el = window.document.querySelector('img');
        t.equal(el.getAttribute('src'), 'unsafe:javascript:alert(1)');
        t.end();
    });
});

test('src is unescaped with double-curlies', function (t) {
    var tmpl = '<img src="{{{foo}}}">';
    var context = {
        //   done like this because jshint doesnt like it
        foo: 'javascript' + ':' + 'alert(1)'
    };

    parsePrecompileAndAppend(tmpl, context, builtinHelpers, function (err, window) {
        var el = window.document.querySelector('img');
        t.equal(el.getAttribute('src'), 'javascript:alert(1)');
        t.end();
    });
});
