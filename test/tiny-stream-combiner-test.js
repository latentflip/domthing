var combiner = require('../lib/tiny-stream-combiner');
var test = require('tape');

test('make a combiner', function (t) {
    var c = combiner(
        [ 'key1', 'key2', 'key3' ],
        [1, 2, 3],
        function (key1, key2, key3) { 
            return key1 + ' ' + key2 + ' ' + key3;
        }
    );
    
    t.plan(3);

    t.equal(c.value, '1 2 3');

    c.once('change', function (newValue, options) {
        t.equal(newValue, '1 2 a');
        t.equal(options.previous, '1 2 3');
    });
    
    c.key3 = 'a';
});

