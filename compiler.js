function indent(d, s) {
    if (!d) d = 1;
    return Array(d).join('  ') + s;
}


function precompileTextNode(element, o) {
    o = o || {};
    if (typeof element.content === 'string') {
        return [
            indent(o.depth, "var node = document.createTextNode('" + element.content + "');"),
            indent(o.depth, "parent.appendChild(node);")
        ];
    } else {
        return[
            indent(o.depth, "var node = document.createTextNode('');"),
            indent(o.depth, "runtime.helpers.textBinding.call(template, node, context, '" + element.content.expression + "');"),
            indent(o.depth, "parent.appendChild(node);")
        ];
    }
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
        if (element.attributes[attrName].type === 'CombineExpression') {
            var name = element.attributes[attrName].name;
            var args = element.attributes[attrName].arguments;

            body.push(
                indent(o.depth, "runtime.helpers.combine.call(template, element, context, '" + attrName + "', '" + name + "', " + JSON.stringify(args) + ');')
            );
        } else if (element.attributes[attrName].type === 'Expression') {
            var expression = element.attributes[attrName].expression;
            body.push(
                indent(o.depth, "runtime.helpers.attribute.call(template, element, context, '" + attrName + "', '" + expression + "');")
            );
        } else {
            body.push(
                indent(o.depth, "element.setAttribute('" + attrName + "', '" + element.attributes[attrName] + "');")
            );
        }
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
        indent(o.depth, "runtime.helpers['" + node.blockType + "'].call(template,"),
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
        indent(o.depth, "function (context, runtime) {"),
        indent(o.depth + 1, "runtime = runtime || this._runtime;"),
        indent(o.depth + 1, "var template = new runtime.Template();")
    ];

    var postlude = [
        indent(o.depth + 1, "var firstChild = template.html.firstChild;"),
        indent(o.depth + 1, "firstChild.update = template.update.bind(template);"),
        indent(o.depth + 1, "return firstChild;"),
        indent(o.depth, "}")
    ];

    var body = [];

    body.push(indent(o.depth + 1, "(function (parent) {"));
    ast.children.forEach(function (node) {
        body = body.concat(precompileNode(node, { depth: o.depth + 2 }));
    });
    body.push(indent(o.depth + 1, "})(template.html);"));

    return prelude.concat(body).concat(postlude).join('\n');
};
