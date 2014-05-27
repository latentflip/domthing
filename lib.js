var domify = require('domify');
var regex = /{{(.*)}}/;

function buildBinding(str) {
    var match = str.match(regex);
    var keypath = match[1].trim().split('.');
    return {
        type: 'replace',
        keypath: keypath
    };
}


function compileElement(element) {
    var attrs = {};
    var data = [element.nodeName, attrs, [].map.call(element.childNodes, compileElement)];
    if (data[0] === '#text') {
        attrs.content = element.textContent;
    } else {
        [].forEach.call(element.attributes, function (attr) {
            var binding;

            if (attr.value.match(regex)) {
                binding = buildBinding(attr.value);
                attrs[attr.name] = ['bindable', binding];
            } else {
                attrs[attr.name] = attr.value;
            }
        });
    }
    return data;
}

module.exports.compile = function (str) {
    var dom = domify(str);
    var tree = [compileElement(dom)];

    return function (context, helpers) {
        return renderNode(tree[0], context, helpers);
    };
};

function renderNode (nodeData, context, helpers) {
    var node;
    if (nodeData[0] === '#text') {
        node = document.createTextNode(nodeData[1].content);
    } else {
        node = document.createElement(nodeData[0]);

        Object.keys(nodeData[1]).forEach(function (attrName) {
            if (Array.isArray(nodeData[1][attrName]) && nodeData[1][attrName][0] === 'bindable') {
                helpers.ATTRIBUTE(node, attrName, context, nodeData[1][attrName][1]);
            } else {
                node.setAttribute(attrName, nodeData[1][attrName]);
            }
        });

        nodeData[2].forEach(function (child) {
            node.appendChild(renderNode(child, context, helpers));
        });
    }
    return node;
}
