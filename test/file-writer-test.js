var FileWriter = require('../lib/file-writer');

var test = require('tape');

test('works correctly', function (t) {
    var fw = new FileWriter();

    fw.write('function (a, b) {');
    fw.indent();
    fw.write(['console.log(a);', 'console.log(b);']);
    fw.outdent();
    fw.write('}');

    var expected = [
        'function (a, b) {',
        '  console.log(a);',
        '  console.log(b);',
        '}'
    ];

    t.equal(fw.toString(), expected.join('\n'));
    t.end();
});
