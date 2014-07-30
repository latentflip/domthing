var templates = {};

templates['person'] = function (context, runtime) {
  runtime = runtime || this._runtime;
  var template = new runtime.Template();

  (function (parent) {
    (function (parent) {
      var element = document.createElement('h1');
      var expr;
      element.setAttribute('class', 'foo');
      expr = (
        runtime.hooks.EVENTIFY_BINDING.call(template, context, 'me.leftStyle')
      );
      element.setAttribute('style', expr.value ? runtime.hooks.ESCAPE_FOR_ATTRIBUTE('style', expr.value) : '');
      expr.on('change', function (v) {
        element.setAttribute('style', v ? runtime.hooks.ESCAPE_FOR_ATTRIBUTE('style', v) : '');
      });
      (function (parent) {
        (function (parent) {
          var expr = (
            runtime.hooks.EVENTIFY_BINDING.call(template, context, 'me.name')
          );
          var node = document.createTextNode(expr.value || '');
          expr.on('change', function (text) { node.data = text ? text : ''; });
          parent.appendChild(node);
        })(parent);
      })(element);
      parent.appendChild(element);
    })(parent);
    (function (parent) {
      var expr = (
        runtime.hooks.EVENTIFY_LITERAL.call(template, " ")
      );
      var node = document.createTextNode(expr.value || '');
      expr.on('change', function (text) { node.data = text ? text : ''; });
      parent.appendChild(node);
    })(parent);
    runtime.hooks.HELPER('if', [
      parent,
      context,
      (
        runtime.hooks.EVENTIFY_BINDING.call(template, context, 'me.profile')
      ),
      function (parent) {
        (function (parent) {
          var expr = (
            runtime.hooks.EVENTIFY_LITERAL.call(template, " ")
          );
          var node = document.createTextNode(expr.value || '');
          expr.on('change', function (text) { node.data = text ? text : ''; });
          parent.appendChild(node);
        })(parent);
        (function (parent) {
          var element = document.createElement('h2');
          var expr;
          (function (parent) {
            (function (parent) {
              var expr = (
                runtime.hooks.EVENTIFY_LITERAL.call(template, "Profile")
              );
              var node = document.createTextNode(expr.value || '');
              expr.on('change', function (text) { node.data = text ? text : ''; });
              parent.appendChild(node);
            })(parent);
          })(element);
          parent.appendChild(element);
        })(parent);
        (function (parent) {
          var expr = (
            runtime.hooks.EVENTIFY_LITERAL.call(template, " ")
          );
          var node = document.createTextNode(expr.value || '');
          expr.on('change', function (text) { node.data = text ? text : ''; });
          parent.appendChild(node);
        })(parent);
        (function (parent) {
          var element = document.createElement('ul');
          var expr;
          expr = (
            runtime.hooks.EVENTIFY_BINDING.call(template, context, 'me.profile.style')
          );
          element.setAttribute('style', expr.value ? runtime.hooks.ESCAPE_FOR_ATTRIBUTE('style', expr.value) : '');
          expr.on('change', function (v) {
            element.setAttribute('style', v ? runtime.hooks.ESCAPE_FOR_ATTRIBUTE('style', v) : '');
          });
          (function (parent) {
            (function (parent) {
              var expr = (
                runtime.hooks.EVENTIFY_LITERAL.call(template, " ")
              );
              var node = document.createTextNode(expr.value || '');
              expr.on('change', function (text) { node.data = text ? text : ''; });
              parent.appendChild(node);
            })(parent);
            (function (parent) {
              var element = document.createElement('li');
              var expr;
              (function (parent) {
                (function (parent) {
                  var expr = (
                    runtime.hooks.EVENTIFY_LITERAL.call(template, "age: ")
                  );
                  var node = document.createTextNode(expr.value || '');
                  expr.on('change', function (text) { node.data = text ? text : ''; });
                  parent.appendChild(node);
                })(parent);
                (function (parent) {
                  var expr = (
                    runtime.hooks.EVENTIFY_BINDING.call(template, context, 'me.profile.age')
                  );
                  var node = document.createTextNode(expr.value || '');
                  expr.on('change', function (text) { node.data = text ? text : ''; });
                  parent.appendChild(node);
                })(parent);
                (function (parent) {
                  var expr = (
                    runtime.hooks.EVENTIFY_LITERAL.call(template, " ")
                  );
                  var node = document.createTextNode(expr.value || '');
                  expr.on('change', function (text) { node.data = text ? text : ''; });
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
                  var expr = (
                    runtime.hooks.EVENTIFY_LITERAL.call(template, "height: ")
                  );
                  var node = document.createTextNode(expr.value || '');
                  expr.on('change', function (text) { node.data = text ? text : ''; });
                  parent.appendChild(node);
                })(parent);
                (function (parent) {
                  var expr = (
                    runtime.hooks.EVENTIFY_BINDING.call(template, context, 'me.profile.height')
                  );
                  var node = document.createTextNode(expr.value || '');
                  expr.on('change', function (text) { node.data = text ? text : ''; });
                  parent.appendChild(node);
                })(parent);
                (function (parent) {
                  var expr = (
                    runtime.hooks.EVENTIFY_LITERAL.call(template, " ")
                  );
                  var node = document.createTextNode(expr.value || '');
                  expr.on('change', function (text) { node.data = text ? text : ''; });
                  parent.appendChild(node);
                })(parent);
              })(element);
              parent.appendChild(element);
            })(parent);
          })(element);
          parent.appendChild(element);
        })(parent);
        (function (parent) {
          var expr = (
            runtime.hooks.EVENTIFY_LITERAL.call(template, " ")
          );
          var node = document.createTextNode(expr.value || '');
          expr.on('change', function (text) { node.data = text ? text : ''; });
          parent.appendChild(node);
        })(parent);
      },
      function (parent) {
    }]);
    (function (parent) {
      var expr = (
        runtime.hooks.EVENTIFY_LITERAL.call(template, " ")
      );
      var node = document.createTextNode(expr.value || '');
      expr.on('change', function (text) { node.data = text ? text : ''; });
      parent.appendChild(node);
    })(parent);
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
        (function (parent) {
          var expr = (
            runtime.hooks.EVENTIFY_LITERAL.call(template, " ")
          );
          var node = document.createTextNode(expr.value || '');
          expr.on('change', function (text) { node.data = text ? text : ''; });
          parent.appendChild(node);
        })(parent);
        (function (parent) {
          var element = document.createElement('input');
          var expr;
          element.setAttribute('type', 'checkbox');
          expr = (
            runtime.hooks.EVENTIFY_BINDING.call(template, context, 'foo')
          );
          element[ expr.value ? 'setAttribute' : 'removeAttribute']('checked', '');
          expr.on('change', function (v) {
            element[ v ? 'setAttribute' : 'removeAttribute']('checked', '');
          });
          parent.appendChild(element);
        })(parent);
        (function (parent) {
          var expr = (
            runtime.hooks.EVENTIFY_LITERAL.call(template, " ")
          );
          var node = document.createTextNode(expr.value || '');
          expr.on('change', function (text) { node.data = text ? text : ''; });
          parent.appendChild(node);
        })(parent);
        (function (parent) {
          var element = document.createElement('div');
          var expr;
          expr = (
            runtime.hooks.EXPRESSION('concat', [
              runtime.hooks.EVENTIFY_LITERAL.call(template, "foo"),
              runtime.hooks.EVENTIFY_LITERAL.call(template, " "),
            ])
          );
          element.setAttribute('class', expr.value ? runtime.hooks.ESCAPE_FOR_ATTRIBUTE('class', expr.value) : '');
          expr.on('change', function (v) {
            element.setAttribute('class', v ? runtime.hooks.ESCAPE_FOR_ATTRIBUTE('class', v) : '');
          });
          parent.appendChild(element);
        })(parent);
        (function (parent) {
          var expr = (
            runtime.hooks.EVENTIFY_LITERAL.call(template, " ")
          );
          var node = document.createTextNode(expr.value || '');
          expr.on('change', function (text) { node.data = text ? text : ''; });
          parent.appendChild(node);
        })(parent);
        runtime.hooks.HELPER('if', [
          parent,
          context,
          (
            runtime.hooks.EXPRESSION('not', [
              runtime.hooks.EXPRESSION('not', [
                runtime.hooks.EVENTIFY_BINDING.call(template, context, 'foo'),
              ]),
            ])
          ),
          function (parent) {
            (function (parent) {
              var expr = (
                runtime.hooks.EVENTIFY_LITERAL.call(template, " ")
              );
              var node = document.createTextNode(expr.value || '');
              expr.on('change', function (text) { node.data = text ? text : ''; });
              parent.appendChild(node);
            })(parent);
            (function (parent) {
              var element = document.createElement('a');
              var expr;
              (function (parent) {
                (function (parent) {
                  var expr = (
                    runtime.hooks.EVENTIFY_LITERAL.call(template, "hi")
                  );
                  var node = document.createTextNode(expr.value || '');
                  expr.on('change', function (text) { node.data = text ? text : ''; });
                  parent.appendChild(node);
                })(parent);
              })(element);
              parent.appendChild(element);
            })(parent);
            (function (parent) {
              var expr = (
                runtime.hooks.EVENTIFY_LITERAL.call(template, " ")
              );
              var node = document.createTextNode(expr.value || '');
              expr.on('change', function (text) { node.data = text ? text : ''; });
              parent.appendChild(node);
            })(parent);
          },
          function (parent) {
            (function (parent) {
              var expr = (
                runtime.hooks.EVENTIFY_LITERAL.call(template, " ")
              );
              var node = document.createTextNode(expr.value || '');
              expr.on('change', function (text) { node.data = text ? text : ''; });
              parent.appendChild(node);
            })(parent);
            (function (parent) {
              var element = document.createElement('b');
              var expr;
              (function (parent) {
                (function (parent) {
                  var expr = (
                    runtime.hooks.EVENTIFY_LITERAL.call(template, "there")
                  );
                  var node = document.createTextNode(expr.value || '');
                  expr.on('change', function (text) { node.data = text ? text : ''; });
                  parent.appendChild(node);
                })(parent);
              })(element);
              parent.appendChild(element);
            })(parent);
            (function (parent) {
              var expr = (
                runtime.hooks.EVENTIFY_LITERAL.call(template, " ")
              );
              var node = document.createTextNode(expr.value || '');
              expr.on('change', function (text) { node.data = text ? text : ''; });
              parent.appendChild(node);
            })(parent);
        }]);
        (function (parent) {
          var expr = (
            runtime.hooks.EVENTIFY_LITERAL.call(template, " ")
          );
          var node = document.createTextNode(expr.value || '');
          expr.on('change', function (text) { node.data = text ? text : ''; });
          parent.appendChild(node);
        })(parent);
      })(element);
      parent.appendChild(element);
    })(parent);
  })(template.html);
  var firstChild = template.html.firstChild;
  firstChild.update = template.update.bind(template);
  return firstChild;
}.bind(templates);
module.exports = templates;