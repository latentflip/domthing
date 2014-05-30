var runtime = require('./runtime');
var templates = require('./templates');

var data = {
    foo: true,
    bar: true,
    aString: "hello",
    aModel: {
        foo: 'foo'
    }
};

document.addEventListener('DOMContentLoaded', function () {
    var template = templates.test(data, runtime);
    document.body.appendChild(template.html);
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
        template.update('aModel.foo', Date.now());
    }, 250);
});
