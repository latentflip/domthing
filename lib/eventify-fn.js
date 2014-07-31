var property = require('./evented-property');

module.exports = function (fn) {
    return function (/*args...*/) {
        var args = [].slice.call(arguments);

        var getNewValueFromFn = function () {
            return fn.apply(fn, args.map(function (a) { return a.value; }));
        };

        var prop = property(getNewValueFromFn());

        args.forEach(function (a) {
            a.on('change', function () {
                prop.value = getNewValueFromFn();
            });
        });

        return prop;
    };
};
