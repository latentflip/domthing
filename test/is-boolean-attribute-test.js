var isBooleanAttribute = require('../lib/is-boolean-attribute');

var test = require('tape');

test('returns correctly', function (t) {
    t.ok(isBooleanAttribute('checked'));
    t.notOk(isBooleanAttribute('href'));

    t.end();
});
