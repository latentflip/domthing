var s = require('./s');
var esprima = require('esprima');

var ast = esprima.parse(s(function () {/*
    console.log(42, 43, 44, 45*46);
*/}));

console.log(JSON.stringify(ast, null, 2));
