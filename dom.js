var Htmlparser = require('htmlparser2');
var Domhandler = require('domhandler');

var handler = new Domhandler(function (err, dom) {
    if (err) throw err;
    console.log(dom[0]);
});

var parser = new Htmlparser.Parser(handler);

parser.write('{{#if true }}<a>foo</a>{{/if }}');
parser.done();

