var s = require('./s');
var esprima = require('esprima');
var x = 4

var ast = esprima.parse(s(function () {/*
    if (x===4) {

    } else {

    }
    while(x==4) {

    }
    for(;;) {

    }
*/}));

console.log(JSON.stringify(ast, null, 2));
