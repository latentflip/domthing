module.exports['person'] = function (context, runtime) {
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
  })(template.html);
  return template;
};
module.exports['test'] = function (context, runtime) {
  var template = new runtime.Template();
  (function (parent) {
    var element = document.createElement('p');
    (function (parent) {
      var node = document.createTextNode('aString: ');
      parent.appendChild(node);
      var node = document.createTextNode('');
      runtime.helpers.textBinding.call(template, node, context, 'aString');
      parent.appendChild(node);
    })(element);
    parent.appendChild(element);
    var element = document.createElement('p');
    (function (parent) {
      var node = document.createTextNode('aModel.foo: ');
      parent.appendChild(node);
      var node = document.createTextNode('');
      runtime.helpers.textBinding.call(template, node, context, 'aModel.foo');
      parent.appendChild(node);
    })(element);
    parent.appendChild(element);
    runtime.helpers['if'].call(template,
      parent,
      context,
      'foo',
      function (parent) {
        runtime.helpers['if'].call(template,
          parent,
          context,
          'bar',
          function (parent) {
            var element = document.createElement('p');
            (function (parent) {
              var node = document.createTextNode('Hello!');
              parent.appendChild(node);
            })(element);
            parent.appendChild(element);
            var element = document.createElement('p');
            (function (parent) {
              var node = document.createTextNode('aString: ');
              parent.appendChild(node);
              var node = document.createTextNode('');
              runtime.helpers.textBinding.call(template, node, context, 'aString');
              parent.appendChild(node);
            })(element);
            parent.appendChild(element);
          },
          function (parent) {
            var element = document.createElement('p');
            (function (parent) {
              var element = document.createElement('b');
              (function (parent) {
                var node = document.createTextNode('Other!');
                parent.appendChild(node);
              })(element);
              parent.appendChild(element);
            })(element);
            parent.appendChild(element);
            var element = document.createElement('p');
            (function (parent) {
              var node = document.createTextNode('aString: ');
              parent.appendChild(node);
              var node = document.createTextNode('');
              runtime.helpers.textBinding.call(template, node, context, 'aString');
              parent.appendChild(node);
            })(element);
            parent.appendChild(element);
          }
        )
      },
      function (parent) {
        var element = document.createElement('p');
        (function (parent) {
          var element = document.createElement('b');
          (function (parent) {
            var node = document.createTextNode('There!');
            parent.appendChild(node);
          })(element);
          parent.appendChild(element);
          var node = document.createTextNode('aString: ');
          parent.appendChild(node);
          var node = document.createTextNode('');
          runtime.helpers.textBinding.call(template, node, context, 'aString');
          parent.appendChild(node);
        })(element);
        parent.appendChild(element);
      }
    )
  })(template.html);
  return template;
};