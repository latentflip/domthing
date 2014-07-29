var Events = require('backbone-events-standalone');

/* A really simple evented property
 *
 * var prop = property(10);
 *
 * prop.on('change', function (newValue) { console.log('got:', newValue); });
 * prop.value = 100 //=> logs "got: 100"
 * prop.value //=> 100
 */

function property(value) {
    var prop = Events.mixin({});
    var _value = value;

    Object.defineProperty(prop, 'value', {
        get: function () {
            return _value;
        },
        set: function (newValue) {
            var oldValue = _value;
            _value = newValue;
            if (_value !== oldValue) {
                prop.trigger('change', _value, { previous: oldValue });
            }
        }
    });

    return prop;
}

module.exports = property;
