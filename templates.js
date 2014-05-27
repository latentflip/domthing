module.exports['test'] = function (context, helpers) {
  var element = document.createDocumentFragment();
  (function (parent) {
    helpers['if'](
      parent,
      context,
      'foo',
      function (parent) {
        var element = document.createElement('a');
        (function (parent) {
          var node = document.createTextNode('Hello!');
          parent.appendChild(node);
        })(element);
        parent.appendChild(element);
      },
      function (parent) {
        var element = document.createElement('b');
        (function (parent) {
          var node = document.createTextNode('There!');
          parent.appendChild(node);
        })(element);
        parent.appendChild(element);
      }
    )
  })(element);
  return element
};