var templates = {};
templates._runtime = require('domthing/runtime');
templates['person'] = function (context, runtime) {
  runtime = runtime || this._runtime;
  var template = new runtime.Template();
  (function (parent) {
    (function (parent) {
      var element = document.createElement('h1');
      var expr;
      element.setAttribute('class', 'foo');
      expr = (
        runtime.helpers.STREAMIFY_BINDING.call(template, context, 'me.leftStyle')
      );
      element.setAttribute('style', expr.value);
      expr.on('change', element.setAttribute.bind(element, 'style'));
      (function (parent) {
        (function (parent) {
          var node = document.createTextNode('');
          var expr = (
            runtime.helpers.STREAMIFY_BINDING.call(template, context, 'me.name')
          );
          node.data = expr.value;
          expr.on('change', function (text) { node.data = text; });
          parent.appendChild(node);
        })(parent);
      })(element);
      parent.appendChild(element);
    })(parent);
    runtime.helpers['if'].call(template,
      parent,
      context,
      (
        runtime.helpers.STREAMIFY_BINDING.call(template, context, 'me.profile')
      ),
      function (parent) {
        (function (parent) {
          var element = document.createElement('h2');
          var expr;
          (function (parent) {
            (function (parent) {
              var node = document.createTextNode('');
              var expr = (
                runtime.helpers.STREAMIFY_LITERAL.call(template, "Profile")
              );
              node.data = expr.value;
              expr.on('change', function (text) { node.data = text; });
              parent.appendChild(node);
            })(parent);
          })(element);
          parent.appendChild(element);
        })(parent);
        (function (parent) {
          var element = document.createElement('ul');
          var expr;
          expr = (
            runtime.helpers.STREAMIFY_BINDING.call(template, context, 'me.profile.style')
          );
          element.setAttribute('style', expr.value);
          expr.on('change', element.setAttribute.bind(element, 'style'));
          (function (parent) {
            (function (parent) {
              var element = document.createElement('li');
              var expr;
              (function (parent) {
                (function (parent) {
                  var node = document.createTextNode('');
                  var expr = (
                    runtime.helpers.STREAMIFY_LITERAL.call(template, "age: ")
                  );
                  node.data = expr.value;
                  expr.on('change', function (text) { node.data = text; });
                  parent.appendChild(node);
                })(parent);
                (function (parent) {
                  var node = document.createTextNode('');
                  var expr = (
                    runtime.helpers.STREAMIFY_BINDING.call(template, context, 'me.profile.age')
                  );
                  node.data = expr.value;
                  expr.on('change', function (text) { node.data = text; });
                  parent.appendChild(node);
                })(parent);
              })(element);
              parent.appendChild(element);
            })(parent);
            (function (parent) {
              var element = document.createElement('li');
              var expr;
              (function (parent) {
                (function (parent) {
                  var node = document.createTextNode('');
                  var expr = (
                    runtime.helpers.STREAMIFY_LITERAL.call(template, "height: ")
                  );
                  node.data = expr.value;
                  expr.on('change', function (text) { node.data = text; });
                  parent.appendChild(node);
                })(parent);
                (function (parent) {
                  var node = document.createTextNode('');
                  var expr = (
                    runtime.helpers.STREAMIFY_BINDING.call(template, context, 'me.profile.height')
                  );
                  node.data = expr.value;
                  expr.on('change', function (text) { node.data = text; });
                  parent.appendChild(node);
                })(parent);
              })(element);
              parent.appendChild(element);
            })(parent);
          })(element);
          parent.appendChild(element);
        })(parent);
      },
      function (parent) {
      }
    );
    (function (parent) {
      var element = document.createElement('div');
      var expr;
      element.setAttribute('role', 'collection');
      parent.appendChild(element);
    })(parent);
  })(template.html);
  var firstChild = template.html.firstChild;
  firstChild.update = template.update.bind(template);
  return firstChild;
}.bind(templates);
templates['test'] = function (context, runtime) {
  runtime = runtime || this._runtime;
  var template = new runtime.Template();
  (function (parent) {
    (function (parent) {
      var element = document.createElement('div');
      var expr;
      (function (parent) {
        runtime.helpers['if'].call(template,
          parent,
          context,
          (
            runtime.helpers.EXPRESSION('not', [
              runtime.helpers.EXPRESSION('not', [
                runtime.helpers.STREAMIFY_BINDING.call(template, context, 'foo')
              ])
            ])
          ),
          function (parent) {
            (function (parent) {
              var element = document.createElement('a');
              var expr;
              (function (parent) {
                (function (parent) {
                  var node = document.createTextNode('');
                  var expr = (
                    runtime.helpers.STREAMIFY_LITERAL.call(template, "hi")
                  );
                  node.data = expr.value;
                  expr.on('change', function (text) { node.data = text; });
                  parent.appendChild(node);
                })(parent);
              })(element);
              parent.appendChild(element);
            })(parent);
          },
          function (parent) {
            (function (parent) {
              var element = document.createElement('b');
              var expr;
              (function (parent) {
                (function (parent) {
                  var node = document.createTextNode('');
                  var expr = (
                    runtime.helpers.STREAMIFY_LITERAL.call(template, "there")
                  );
                  node.data = expr.value;
                  expr.on('change', function (text) { node.data = text; });
                  parent.appendChild(node);
                })(parent);
              })(element);
              parent.appendChild(element);
            })(parent);
          }
        );
      })(element);
      parent.appendChild(element);
    })(parent);
  })(template.html);
  var firstChild = template.html.firstChild;
  firstChild.update = template.update.bind(template);
  return firstChild;
}.bind(templates);
module.exports = templates;