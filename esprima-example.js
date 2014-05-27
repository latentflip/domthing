var s = require('./s');
var esprima = require('esprima');

var ast = esprima.parse(s(function () {/*
    var a;
    if (true) {
        a = 42;
    } else {
        a = 0;
    }

    while (true) {
        a = 10;
    }
*/}));

console.log(ast);
