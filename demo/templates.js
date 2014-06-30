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
        runtime.helpers.STREAMIFY_BINDING.call(template, context, 'me.leftStyle')
      );
      element.setAttribute('style', expr.value ? runtime.helpers.ESCAPE_FOR_ATTRIBUTE('style', expr.value) : '');
      expr.on('change', function (v) {
        element.setAttribute('style', v ? runtime.helpers.ESCAPE_FOR_ATTRIBUTE('style', v) : '');
      });
      (function (parent) {
        (function (parent) {
          var node = document.createTextNode('');
          var expr = (
            runtime.helpers.STREAMIFY_BINDING.call(template, context, 'me.name')
          );
          node.data = expr.value ? expr.value : '';
          expr.on('change', function (text) { node.data = text ? text : ''; });
          parent.appendChild(node);
        })(parent);
      })(element);
      parent.appendChild(element);
    })(parent);
    (function (parent) {
      var node = document.createTextNode('');
      var expr = (
        runtime.helpers.STREAMIFY_LITERAL.call(template, " ")
      );
      node.data = expr.value ? expr.value : '';
      expr.on('change', function (text) { node.data = text ? text : ''; });
      parent.appendChild(node);
    })(parent);
    runtime.helpers['if'].call(template,
      parent,
      context,
      (
        runtime.helpers.STREAMIFY_BINDING.call(template, context, 'me.profile')
      ),
      function (parent) {
        (function (parent) {
          var node = document.createTextNode('');
          var expr = (
            runtime.helpers.STREAMIFY_LITERAL.call(template, " ")
          );
          node.data = expr.value ? expr.value : '';
          expr.on('change', function (text) { node.data = text ? text : ''; });
          parent.appendChild(node);
        })(parent);
        (function (parent) {
          var element = document.createElement('h2');
          var expr;
          (function (parent) {
            (function (parent) {
              var node = document.createTextNode('');
              var expr = (
                runtime.helpers.STREAMIFY_LITERAL.call(template, "Profile")
              );
              node.data = expr.value ? expr.value : '';
              expr.on('change', function (text) { node.data = text ? text : ''; });
              parent.appendChild(node);
            })(parent);
          })(element);
          parent.appendChild(element);
        })(parent);
        (function (parent) {
          var node = document.createTextNode('');
          var expr = (
            runtime.helpers.STREAMIFY_LITERAL.call(template, " ")
          );
          node.data = expr.value ? expr.value : '';
          expr.on('change', function (text) { node.data = text ? text : ''; });
          parent.appendChild(node);
        })(parent);
        (function (parent) {
          var element = document.createElement('ul');
          var expr;
          expr = (
            runtime.helpers.STREAMIFY_BINDING.call(template, context, 'me.profile.style')
          );
          element.setAttribute('style', expr.value ? runtime.helpers.ESCAPE_FOR_ATTRIBUTE('style', expr.value) : '');
          expr.on('change', function (v) {
            element.setAttribute('style', v ? runtime.helpers.ESCAPE_FOR_ATTRIBUTE('style', v) : '');
          });
          (function (parent) {
            (function (parent) {
              var node = document.createTextNode('');
              var expr = (
                runtime.helpers.STREAMIFY_LITERAL.call(template, " ")
              );
              node.data = expr.value ? expr.value : '';
              expr.on('change', function (text) { node.data = text ? text : ''; });
              parent.appendChild(node);
            })(parent);
            (function (parent) {
              var element = document.createElement('li');
              var expr;
              (function (parent) {
                (function (parent) {
                  var node = document.createTextNode('');
                  var expr = (
                    runtime.helpers.STREAMIFY_LITERAL.call(template, "age: ")
                  );
                  node.data = expr.value ? expr.value : '';
                  expr.on('change', function (text) { node.data = text ? text : ''; });
                  parent.appendChild(node);
                })(parent);
                (function (parent) {
                  var node = document.createTextNode('');
                  var expr = (
                    runtime.helpers.STREAMIFY_BINDING.call(template, context, 'me.profile.age')
                  );
                  node.data = expr.value ? expr.value : '';
                  expr.on('change', function (text) { node.data = text ? text : ''; });
                  parent.appendChild(node);
                })(parent);
                (function (parent) {
                  var node = document.createTextNode('');
                  var expr = (
                    runtime.helpers.STREAMIFY_LITERAL.call(template, " ")
                  );
                  node.data = expr.value ? expr.value : '';
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
                  var node = document.createTextNode('');
                  var expr = (
                    runtime.helpers.STREAMIFY_LITERAL.call(template, "height: ")
                  );
                  node.data = expr.value ? expr.value : '';
                  expr.on('change', function (text) { node.data = text ? text : ''; });
                  parent.appendChild(node);
                })(parent);
                (function (parent) {
                  var node = document.createTextNode('');
                  var expr = (
                    runtime.helpers.STREAMIFY_BINDING.call(template, context, 'me.profile.height')
                  );
                  node.data = expr.value ? expr.value : '';
                  expr.on('change', function (text) { node.data = text ? text : ''; });
                  parent.appendChild(node);
                })(parent);
                (function (parent) {
                  var node = document.createTextNode('');
                  var expr = (
                    runtime.helpers.STREAMIFY_LITERAL.call(template, " ")
                  );
                  node.data = expr.value ? expr.value : '';
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
          var node = document.createTextNode('');
          var expr = (
            runtime.helpers.STREAMIFY_LITERAL.call(template, " ")
          );
          node.data = expr.value ? expr.value : '';
          expr.on('change', function (text) { node.data = text ? text : ''; });
          parent.appendChild(node);
        })(parent);
      },
      function (parent) {
      }
    );
    (function (parent) {
      var node = document.createTextNode('');
      var expr = (
        runtime.helpers.STREAMIFY_LITERAL.call(template, " ")
      );
      node.data = expr.value ? expr.value : '';
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
          var node = document.createTextNode('');
          var expr = (
            runtime.helpers.STREAMIFY_LITERAL.call(template, " ")
          );
          node.data = expr.value ? expr.value : '';
          expr.on('change', function (text) { node.data = text ? text : ''; });
          parent.appendChild(node);
        })(parent);
        (function (parent) {
          var element = document.createElement('input');
          var expr;
          element.setAttribute('type', 'checkbox');
          expr = (
            runtime.helpers.STREAMIFY_BINDING.call(template, context, 'foo')
          );
          element[ expr.value ? 'setAttribute' : 'removeAttribute']('checked', '');
          expr.on('change', function (v) {
            element[ v ? 'setAttribute' : 'removeAttribute']('checked', '');
          });
          parent.appendChild(element);
        })(parent);
        (function (parent) {
          var node = document.createTextNode('');
          var expr = (
            runtime.helpers.STREAMIFY_LITERAL.call(template, " ")
          );
          node.data = expr.value ? expr.value : '';
          expr.on('change', function (text) { node.data = text ? text : ''; });
          parent.appendChild(node);
        })(parent);
        (function (parent) {
          var element = document.createElement('div');
          var expr;
          expr = (
            runtime.helpers.EXPRESSION('concat', [
              runtime.helpers.STREAMIFY_LITERAL.call(template, "foo"),
              runtime.helpers.STREAMIFY_LITERAL.call(template, " ")
            ])
          );
          element.setAttribute('class', expr.value ? runtime.helpers.ESCAPE_FOR_ATTRIBUTE('class', expr.value) : '');
          expr.on('change', function (v) {
            element.setAttribute('class', v ? runtime.helpers.ESCAPE_FOR_ATTRIBUTE('class', v) : '');
          });
          parent.appendChild(element);
        })(parent);
        (function (parent) {
          var node = document.createTextNode('');
          var expr = (
            runtime.helpers.STREAMIFY_LITERAL.call(template, " ")
          );
          node.data = expr.value ? expr.value : '';
          expr.on('change', function (text) { node.data = text ? text : ''; });
          parent.appendChild(node);
        })(parent);
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
              var node = document.createTextNode('');
              var expr = (
                runtime.helpers.STREAMIFY_LITERAL.call(template, " ")
              );
              node.data = expr.value ? expr.value : '';
              expr.on('change', function (text) { node.data = text ? text : ''; });
              parent.appendChild(node);
            })(parent);
            (function (parent) {
              var element = document.createElement('a');
              var expr;
              (function (parent) {
                (function (parent) {
                  var node = document.createTextNode('');
                  var expr = (
                    runtime.helpers.STREAMIFY_LITERAL.call(template, "hi")
                  );
                  node.data = expr.value ? expr.value : '';
                  expr.on('change', function (text) { node.data = text ? text : ''; });
                  parent.appendChild(node);
                })(parent);
              })(element);
              parent.appendChild(element);
            })(parent);
            (function (parent) {
              var node = document.createTextNode('');
              var expr = (
                runtime.helpers.STREAMIFY_LITERAL.call(template, " ")
              );
              node.data = expr.value ? expr.value : '';
              expr.on('change', function (text) { node.data = text ? text : ''; });
              parent.appendChild(node);
            })(parent);
          },
          function (parent) {
            (function (parent) {
              var node = document.createTextNode('');
              var expr = (
                runtime.helpers.STREAMIFY_LITERAL.call(template, " ")
              );
              node.data = expr.value ? expr.value : '';
              expr.on('change', function (text) { node.data = text ? text : ''; });
              parent.appendChild(node);
            })(parent);
            (function (parent) {
              var element = document.createElement('b');
              var expr;
              (function (parent) {
                (function (parent) {
                  var node = document.createTextNode('');
                  var expr = (
                    runtime.helpers.STREAMIFY_LITERAL.call(template, "there")
                  );
                  node.data = expr.value ? expr.value : '';
                  expr.on('change', function (text) { node.data = text ? text : ''; });
                  parent.appendChild(node);
                })(parent);
              })(element);
              parent.appendChild(element);
            })(parent);
            (function (parent) {
              var node = document.createTextNode('');
              var expr = (
                runtime.helpers.STREAMIFY_LITERAL.call(template, " ")
              );
              node.data = expr.value ? expr.value : '';
              expr.on('change', function (text) { node.data = text ? text : ''; });
              parent.appendChild(node);
            })(parent);
          }
        );
        (function (parent) {
          var node = document.createTextNode('');
          var expr = (
            runtime.helpers.STREAMIFY_LITERAL.call(template, " ")
          );
          node.data = expr.value ? expr.value : '';
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