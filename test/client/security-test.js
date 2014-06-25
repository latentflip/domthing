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
        foo: "<script>window.hacked=true</script>"
    };

    parsePrecompileAndAppend(tmpl, context, builtinHelpers, function (err, window) {
        var el = window.document.querySelector('#output');
        t.equal(el.innerHTML, '<div>&lt;script&gt;window.hacked=true&lt;/script&gt;</div>');
        t.notOk(window.hacked);
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
        console.log(window._console);
        var el = window.document.querySelector('a');
        t.equal(el.getAttribute('href'), 'unsafe:javascript:alert(1)');
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
