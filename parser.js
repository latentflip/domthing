var DomHandler = require('domhandler');
var htmlparser = require('htmlparser2');

var REGEXES = {
    block: /{{\s*(#|\/)\s*([^}]*)}}/,
    splitter: /{{\s*(#|\/)\s*([^}]*)}}/g
};

function parseHelper(node) {
    var match = node.data.match(REGEXES.block);
    var start = match[1] === '#';
    var innerMatch = match[2].trim();
    var blockType, expression;

    if (start) {
        var parts = innerMatch.split(' ');
        blockType = parts.shift();
        expression = parts.join(' ');
        if (blockType === 'else') {
            return {
                type: 'BlockElse'
            };
        } else {
            return {
                type: 'BlockStart',
                blockType: blockType,
                expression: expression
            };
        }
    } else {
        blockType = innerMatch;
        return {
            type: 'BlockEnd',
            blockType: blockType
        };
    }
}

var splitter = require('./split-and-keep-splitter');

//FIXME: probably won't handle whitespace in {{foo}} {{bar}}
function parseTextNode(node) {
    return splitter(
        node.data.trim(),
        REGEXES.splitter,
        function (str) {
            return parseHelper({ data: str.trim() });
        },
        function (str) {
            return {
                type: 'TextNode',
                content: str.trim()
            };
        }
    );
}

function parseElement(el) {
    var attributes = el.attribs;
    var children = [];

    el.children.forEach(function (node) {
        children = children.concat(parseNode(node));
    });
    
    return {
        type: 'Element',
        tagName: el.name,
        attributes: attributes,
        children: children
    };
}

function parseNode(node) {
    var map = {
        tag: parseElement,
        text: parseTextNode
    };

    var parsed = map[node.type](node);
    if (!Array.isArray(parsed)) parsed = [parsed];

    return parsed;
}

function collectBlocks(node) {
    if (!node.children) return node;
    var newChildren = [];
    var blocks = [];
    var targetBlock;

    node.children.forEach(function (child) {
        var block;

        if (child.type === 'BlockStart') {
            block = {
                type: 'BlockStatement',
                body: [],
                alternate: [],
                state: 'body'
            };

            Object.keys(child).forEach(function (key) {
                block[key] = block[key] || child[key];
            });

            blocks.push(block);

            return;
        }

        if (child.type === 'BlockElse') {
            blocks[blocks.length - 1].state = 'alternate';
            return;
        }

        if (child.type === 'BlockEnd') {
            block = blocks.pop();
            delete block.state;

            if (blocks.length > 0) {
                targetBlock = blocks[blocks.length - 1];
                targetBlock[targetBlock.state].push(block);
            } else {
                newChildren.push(block);
            }
            return;
        }

        if (blocks[blocks.length - 1]) {
            block = blocks[blocks.length - 1];
            block[block.state].push(child);
        } else {
            newChildren.push(child);
        }
    });

    node.children = newChildren.map(collectBlocks);
    return node;
}


function parse(tmpl, cb) {
    var ast = { type: 'Template', children: [] };

    var handler = new DomHandler(function (err, dom) {
        dom.forEach(function (node) {
            ast.children = ast.children.concat(parseNode(node));
        });
        collectBlocks(ast);
        cb(null, ast);
    }, { normalizeWhitespace: true });

    var parser = new htmlparser.Parser(handler);
    parser.write(tmpl);
    parser.done();
}

module.exports = parse;
