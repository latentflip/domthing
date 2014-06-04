var stream = require('./tiny-stream');

module.exports = function (fn) {
    return function (/*args...*/) {
        var args = [].slice.call(arguments);

        var runFn = function () {
            return fn.apply(fn, args.map(function (a) { return a.value; }));
        };

        var s = stream(runFn());

        args.forEach(function (a) {
            a.on('change', function () {
                s.value = runFn();
            });
        });

        return s;
    };
};
