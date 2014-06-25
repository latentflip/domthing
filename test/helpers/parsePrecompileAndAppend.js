var fs = require('fs');
var compiler = require('../../lib/compiler');
var compile = compiler.compile;
var parser = require('../../lib/parser');
//var jsdom = require('jsdom');
var deval = require('deval');


var precompileAndAppend = function (ast, context, helpers, cb) {
    if (!cb && !helpers && typeof context === 'function') {
        cb = context;
        context = {};
    }
    var strFn = compile(ast);

    window.RUNTIME = require('../../runtime');

    eval("window.TEMPLATE = " + strFn);

    var output = document.querySelector('#output');

    if (!output) {
        output = document.createElement('div');
        output.setAttribute('id', 'output');
        document.body.appendChild(output);
    } else {
        output.innerHTML = '';
    }

    var fragment = window.TEMPLATE(context, require('../../runtime'));
    output.appendChild(fragment);
    window.templateUnderTest = fragment;

    cb(null, window);

    //useful for debug
    //console.log(JSON.stringify(ast, null, 2));
    //console.log(strFn);

    //var window = deval(function () {
    //    window._console = [];
    //    window.console = {
    //        log: function () {
    //            window._console.push([].slice.call(arguments));
    //        }
    //    };
    //    window.requestAnimationFrame = function (cb) { setTimeout(cb, 0); };
    //});

    //var inject = deval(function (strFn, context) {
    //    var tmpl = $strFn$;
    //    var fragment = tmpl($context$, window.RUNTIME);
    //    document.querySelector('#output').appendChild(fragment);
    //    window.templateUnderTest = fragment;
    //}, strFn, JSON.stringify(context));

    //jsdom.env({
    //    html: '<div id=output></div>',
    //    src: [
    //        window + ';' + fs.readFileSync(__dirname + '/../../runtime.bundle.js').toString() + ';' +  inject
    //    ],
    //    done: function (err, window) {
    //        if (err) {
    //            console.log('JSDOM Errors:', err);
    //            console.log(err[0].data.error);
    //            throw err;
    //        }
    //        cb(null, window);
    //    }
    //});
};

var parsePrecompileAndAppend = function (template, context, helpers, cb) {
    parser(template, function (err, ast) {
        precompileAndAppend(ast, context, helpers, cb);
    });
};

module.exports = parsePrecompileAndAppend;
