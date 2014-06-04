function logProxy (fn, name) {
    return function () {
        console.log('Called', name, 'with', [].slice.call(arguments));
        fn.apply(this, arguments);
    };
}

module.exports = function (object) {
    for (var prop in object) {
        if (object.hasOwnProperty(prop) && typeof object[prop] === 'function') {
            object[prop] = logProxy(object[prop], prop);
        }
    }
};
