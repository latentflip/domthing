var splitter = require('../lib/split-and-keep-splitter');
var test = require('tape');

var regex = /{[^}]*}/g;

test('splits and keeps the bits', function (t) {
    var parts = splitter("foo {bar} baz {bux} qux", regex);

    t.deepEqual(parts, ['foo ', '{bar}', ' baz ', '{bux}', ' qux']);
    t.end();
});


test('works with neighbouring things', function (t) {
    var parts = splitter("foo {bar} {bux}{qux}", regex);

    t.deepEqual(parts, ['foo ', '{bar}', ' ', '{bux}', '{qux}']);
    t.end();
});

test('splits even at the start', function (t) {
    var parts = splitter("{bar} baz {bux}", regex);

    t.deepEqual(parts, ['{bar}', ' baz ', '{bux}']);
    t.end();
});

test('it calls first function on matches and second on spaces', function (t) {
    var questionIt = function (s) {
        return '??' + s + '??';
    };

    var exclaimIt = function (s) {
        return '!!' + s + '!!';
    };

    var parts = splitter("foo {bar} baz {bux} qux", regex, exclaimIt, questionIt);

    t.deepEqual(parts, ['??foo ??', '!!{bar}!!', '?? baz ??', '!!{bux}!!', '?? qux??']);
    t.end();
});

test('it splits this properly', function (t) {
    var regex =/{{*([^}]*)}}/g;
    var withStache = function (s) { return '{}'; };
    var withSpace = function (s) { return 's'; };

    var parts = splitter(' {{foo}} ', regex, withStache, withSpace);
    t.deepEqual(parts, ['s', '{}', 's']);
    t.end();
});
