var Events = require('backbone-events-standalone');

module.exports = function (keys, initialValues, combine) {
    var emitter = Events.mixin({});
    var values = {};

    var update = function (options) {
        options = options || {};

        var newValue = combine.apply(combine, keys.map(function (k) { return emitter[k]; }));

        if (newValue !== emitter.value) {
            if (!options.silent) {
                emitter.trigger('change', newValue, { previous: emitter.value });
            }
            emitter.value = newValue;
        }
    };

    keys.forEach(function (key, i) {
        values[key] = initialValues[i];
        Object.defineProperty(emitter, key, {
            get: function () {
                return values[key];
            },
            set: function (newValue) {
                values[key] = newValue;
                update();
            }
        });
    });

    update({ silent: true });

    return emitter;
};
