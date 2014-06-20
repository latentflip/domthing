var isBooleanAttribute = require('./is-boolean-attribute');

function indent(d, s) {
    if (!d) d = 1;
    return Array(d).join('  ') + s;
}

function precompileExpression(ast, o) {
    o = o || {};
    if (ast.type === 'Literal') {
        return [
            indent(o.depth, "runtime.helpers.STREAMIFY_LITERAL.call(template, " + JSON.stringify(ast.value) + ")")
        ];
    }

    if (ast.type === 'Binding') {
        return [
            indent(o.depth, "runtime.helpers.STREAMIFY_BINDING.call(template, context, '" + ast.keypath + "')")
        ];
    }

    if (ast.type === 'Expression') {
        var name = ast.name;

        var args = ast.arguments.map(function (expr) {
            return precompileExpression(expr, { depth: o.depth + 1 });
        }).join(',\n');

        return [
            indent(o.depth, "runtime.helpers.EXPRESSION('" + name + "', ["),
        ].concat(args).concat([
            indent(o.depth, "])")
        ]).join('\n');
    }
}

function precompileTextNode(element, o) {
    o = o || {};

    var expression = precompileExpression(element.content, { depth: o.depth + 2 });

    return [
        indent(o.depth, "(function (parent) {"),
        indent(o.depth + 1, "var node = document.createTextNode('');"),
        indent(o.depth + 1, "var expr = ("),
    ].concat(expression).concat([
        indent(o.depth + 1, ");"),
        indent(o.depth + 1, "node.data = expr.value;"),
        indent(o.depth + 1, "expr.on('change', function (text) { node.data = text; });"),
        indent(o.depth + 1, "parent.appendChild(node);"),
        indent(o.depth, "})(parent);")
    ]);
}

function precompileElement(element, o) {
    o = o || {};

    var prelude = [
        indent(o.depth, "(function (parent) {"),
        indent(o.depth + 1, "var element = document.createElement('" + element.tagName + "');"),
    ];


    var postlude = [
        indent(o.depth + 1, "parent.appendChild(element);"),
        indent(o.depth, "})(parent);")
    ];

    o.depth += 1;

    var body = [];

    body.push(indent(o.depth, 'var expr;'));

    Object.keys(element.attributes).forEach(function (attrName) {
        var attr = element.attributes[attrName];

        if (attr.type === 'Literal') {
            body.push(
                indent(o.depth, "element.setAttribute('" + attrName + "', '" + attr.value.replace(/\n/g, '') + "');")
            );
            return;
        }

        var expression = precompileExpression(attr, { depth: o.depth + 1 });

        body = body.concat([
            indent(o.depth, "expr = (")
        ]).concat(expression).concat([
            indent(o.depth, ");"),
        ]);

        if (isBooleanAttribute(attrName)) {
            body = body.concat([
                indent(o.depth, "element[ expr.value ? 'setAttribute' : 'removeAttribute']('" + attrName + "', '');"),
                indent(o.depth, "expr.on('change', function (v) {"),
                indent(o.depth + 1, "element[ v ? 'setAttribute' : 'removeAttribute']('" + attrName + "', '');"),
                indent(o.depth, "});")
            ]);
        } else {
            body = body.concat([
                indent(o.depth, "element.setAttribute('" + attrName + "', expr.value);"),
                indent(o.depth, "expr.on('change', element.setAttribute.bind(element, '" + attrName +"'));")
            ]);
        }
        return;
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

    var expr = precompileExpression(node.blockExpression, { depth: o.depth + 2 });
    var prelude = [
        indent(o.depth, "runtime.helpers['" + node.blockType + "'].call(template,"),
        indent(o.depth + 1, "parent,"),
        indent(o.depth + 1, "context,"),
        indent(o.depth + 1, "("),
    ].concat(expr).concat([
        indent(o.depth + 1, "),")
    ]);

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
        indent(o.depth, ");")
    ];

    return prelude.concat(body).concat(postlude);
}

function precompileNode(node, options) {
    if (node.type === 'Element') return precompileElement(node, options);
    if (node.type === 'TextNode') return precompileTextNode(node, options);
    if (node.type === 'BlockStatement') return precompileBlock(node, options);
}

module.exports.compile = function (ast, o) {
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
