var runtime = require('./runtime');
var templates = require('./templates');

var data = { foo: true };

document.addEventListener('DOMContentLoaded', function () {
    console.log(data);
    document.body.appendChild(templates.test(data, runtime.helpers));
});
