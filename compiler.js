function indent(d, s) {
    if (!d) d = 1;
    return Array(d).join('  ') + s;
}


function precompileTextNode(element, o) {
    o = o || {};
    return [
        indent(o.depth, "var node = document.createTextNode('" + element.content + "');"),
        indent(o.depth, "parent.appendChild(node);")
    ];
}

function precompileElement(element, o) {
    o = o || {};

    var prelude = [
        indent(o.depth, "var element = document.createElement('" + element.tagName + "');"),
    ];

    var postlude = [
        indent(o.depth, "parent.appendChild(element);")
    ];
    
    var body = [];

    Object.keys(element.attributes).forEach(function (attrName) {
        body.push(
            indent(o.depth, "element.setAttribute('" + attrName + "', '" + element.attributes[attrName] + "');")
        );
    });

    if (element.children.length) {
        body.push(indent(o.depth, "(function (parent) {"));
        element.children.forEach(function (child) {
            body = body.concat(precompileNode(child, { depth: o.depth + 1 }));
        });
        body.push(indent(o.depth, "})(element);"));
    }

    return prelude.concat(body).concat(postlude);
}

function precompileBlock(node, o) {
    o = o || {};
    var prelude = [
        indent(o.depth, "helpers['" + node.blockType + "']("),
        indent(o.depth + 1, "parent,"),
        indent(o.depth + 1, "context,"),
        indent(o.depth + 1, "'" + node.expression + "',")
    ];

    var body = [];
    body.push(indent(o.depth + 1, "function (parent) {"));
    node.body.forEach(function (node) {
        body = body.concat(precompileNode(node, { depth: o.depth + 2 }));
    });
    body.push(indent(o.depth + 1, "},"));

    body.push(indent(o.depth + 1, "function (parent) {"));
    node.alternate.forEach(function (node) {
        body = body.concat(precompileNode(node, { depth: o.depth + 2 }));
    });
    body.push(indent(o.depth + 1, "}"));

    var postlude = [
        indent(o.depth, ")")
    ];

    return prelude.concat(body).concat(postlude);
}

function precompileNode(node, options) {
    if (node.type === 'Element') return precompileElement(node, options);
    if (node.type === 'TextNode') return precompileTextNode(node, options);
    if (node.type === 'BlockStatement') return precompileBlock(node, options);
}

module.exports.precompileAST = function (ast, o) {
    o = o || {};
    o.depth = o.depth || 1;

    var prelude = [
        indent(o.depth, "function (context, helpers) {"),
        indent(o.depth + 1, "var element = document.createDocumentFragment();")
    ];
    
    var postlude = [
        indent(o.depth + 1, "return element"),
        indent(o.depth, "}")
    ];

    var body = [];

    body.push(indent(o.depth + 1, "(function (parent) {"));
    ast.children.forEach(function (node) {
        body = body.concat(precompileNode(node, { depth: o.depth + 2 }));
    });
    body.push(indent(o.depth + 1, "})(element);"));

    return prelude.concat(body).concat(postlude).join('\n');
};
