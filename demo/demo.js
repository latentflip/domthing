var runtime = require('../runtime');
var templates = require('./templates');
templates._runtime = runtime;

var data = {
    foo: true,
    bar: true,
    aString: "hello",
    aModel: {
        foo: 'foo'
    },
    active: true,
    things: [1,2,3],
    joinArgs: [" | "]
};

document.addEventListener('DOMContentLoaded', function () {
    var template = templates.test(data, runtime);
    document.body.appendChild(template);
    setInterval(function () {
        template.update('aString', "hello" + Date.now());
    }, 500);

    setInterval(function () {
        data.bar = !data.bar;
        template.update('bar', data.bar);
    }, 100);

    setInterval(function () {
        data.foo = !data.foo;
        template.update('foo', data.foo);
    }, 750);

    setInterval(function () {
        template.update('aModel.foo', "a string: " + Date.now());
    }, 250);

    var i = 0;
    setInterval(function () {
        i++;
        template.update('joinArgs', i % 2 === 0 ? [" / "] : [" | "]);
    }, 600);
});
