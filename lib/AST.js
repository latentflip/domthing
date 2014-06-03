var AST = module.exports;

module.exports.Template = function (children) {
    return {
        type: 'Template',
        children: children || []
    };
};

//class='42'
module.exports.Literal = function (literal) {
    return {
        type: 'Literal',
        value: literal
    };
};

//class='{{foo}}'
module.exports.Binding = function (keypath) {
    return {
        type: 'Binding',
        keypath: keypath
    };
};

module.exports.SEXP = function (body) {
    return {
        type: "SEXP",
        body: body || []
    };
};

//class='{{ (toggle "is-active" (invert active)) }}'
//class='foo {{bar}} baz' => {{ (concat 'foo' bar 'baz') }}
module.exports.Expression = function (name, args) {
    return {
        type: 'Expression',
        name: name,
        arguments: args
    };
};

module.exports.Element = function (tagName, attributes, children) {
    if (!children && Array.isArray(attributes)) {
        children = attributes;
        attributes = undefined;
    }
    attributes = attributes || {};
    children = children || [];

    return {
        type: 'Element',
        tagName: tagName,
        attributes: attributes,
        children: children
    };
};

module.exports.TextNode = function (contents) {
    contents = contents || AST.Literal('');
    return {
        type: 'TextNode',
        content: contents
    };
};

module.exports.BlockStatement = function (type, expression, body, alternate) {
    return {
        type: 'BlockStatement',
        blockType: type,
        blockExpression: expression,
        body: body || [],
        alternate: alternate || []
    };
};
module.exports.BlockStart = function (blockType, blockExpression) {
    return { 
        type: 'BlockStart',
        blockType: blockType,
        blockExpression: blockExpression
    };
};
module.exports.BlockElse = function () {
    return { 
        type: 'BlockElse',
    };
};
module.exports.BlockEnd = function (blockType) {
    return { 
        type: 'BlockEnd',
        blockType: blockType,
    };
};
