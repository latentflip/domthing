var templates = {};
templates['person'] = function (context, runtime) {
  runtime = runtime || this._runtime;
  var template = new runtime.Template();
  (function (parent) {
    var element = document.createElement('h1');
    element.setAttribute('class', 'foo');
    runtime.helpers.attribute.call(template, element, context, 'style', 'me.leftStyle');
    (function (parent) {
      var node = document.createTextNode('');
      runtime.helpers.textBinding.call(template, node, context, 'me.name');
      parent.appendChild(node);
    })(element);
    parent.appendChild(element);
    runtime.helpers['if'].call(template,
      parent,
      context,
      'me.profile',
      function (parent) {
        var element = document.createElement('h2');
        (function (parent) {
          var node = document.createTextNode('Profile');
          parent.appendChild(node);
        })(element);
        parent.appendChild(element);
        var element = document.createElement('ul');
        runtime.helpers.attribute.call(template, element, context, 'style', 'me.profile.style');
        (function (parent) {
          var element = document.createElement('li');
          (function (parent) {
            var node = document.createTextNode('age: ');
            parent.appendChild(node);
            var node = document.createTextNode('');
            runtime.helpers.textBinding.call(template, node, context, 'me.profile.age');
            parent.appendChild(node);
          })(element);
          parent.appendChild(element);
          var element = document.createElement('li');
          (function (parent) {
            var node = document.createTextNode('height: ');
            parent.appendChild(node);
            var node = document.createTextNode('');
            runtime.helpers.textBinding.call(template, node, context, 'me.profile.height');
            parent.appendChild(node);
          })(element);
          parent.appendChild(element);
        })(element);
        parent.appendChild(element);
      },
      function (parent) {
      }
    )
    var element = document.createElement('div');
    element.setAttribute('role', 'collection');
    parent.appendChild(element);
  })(template.html);
  var firstChild = template.html.firstChild;
  firstChild.update = template.update.bind(template);
  return firstChild;
}.bind(templates);
templates['test'] = function (context, runtime) {
  runtime = runtime || this._runtime;
  var template = new runtime.Template();
  (function (parent) {
    var element = document.createElement('a');
    runtime.helpers.combine.call(template, element, context, 'class', 'concat', [{"type":"Literal","value":"static "},{"type":"Expression","expression":"foo"},{"type":"Expression","expression":"bar"}]);
    parent.appendChild(element);
  })(template.html);
  var firstChild = template.html.firstChild;
  firstChild.update = template.update.bind(template);
  return firstChild;
}.bind(templates);
module.exports = templates;