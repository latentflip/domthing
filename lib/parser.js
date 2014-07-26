var AST = require('./AST');
var DomHandler = require('domhandler');
var htmlparser = require('htmlparser2');
var splitter = require('./split-and-keep-splitter');
var sexpParser = require('./sexp-parser');

var REGEXES = {
    block: /{{\s*(#|\/)?\s*([^}]*)}}/,
    splitter: /{{([^}]*)}}/g,
    simpleExpression: /{{\s*([^}]*)\s*}}/,
};

function parse(tmpl, cb) {
    tmpl = tmpl.trim();
    var ast = AST.Template();

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

function parseSimpleExpression(string) {
    string = string.trim();
    var match = string.match(REGEXES.simpleExpression);

    //class="foo"
    if (!match) return AST.Literal(string);

    //class="{{foo}}"
    if (match[0] === string) {
        if (match[1].indexOf('(') > -1) {
            return sexpParser.parse(match[1]);
        } else {
            return AST.Binding(match[1].trim());
        }
    }

    //class="baz {{foo}} bar"
    var args = splitter(
        string,
        REGEXES.splitter,
        function (str) {
            return parseSimpleExpression(str);
        },
        function (str) {
            return AST.Literal(str);
        }
    );

    return AST.Expression('concat', args);
}

function parseBlockExpression(string) {
    if (string.indexOf('(') > -1) {
        return sexpParser.parse(string);
    } else {
        return AST.Binding(string);
    }
}

function parseMustaches(string) {
    var match = string.match(REGEXES.block);
    var tagType = match[1];
    var blockType;
    var blockExpression = match[2].trim();

    switch(tagType) {
    case undefined:
        return AST.TextNode( AST.Binding(blockExpression) );
    case "#":
        var parts = blockExpression.split(' ');
        blockType = parts.shift();
        blockExpression = parseBlockExpression(parts.join(' '));
        if (blockType === 'else') {
            return AST.BlockElse();
        } else {
            return AST.BlockStart(blockType, blockExpression);
        }
        break;
    case "/":
        blockType = blockExpression.split(' ')[0].trim();
        return AST.BlockEnd(blockType);
    }
}

function parseTextNode(node) {
    return splitter(
        node.data,
        REGEXES.splitter,
        function (str) {
            return parseMustaches(str);
        },
        function (str) {
            if (str.trim() === '') return AST.TextNode( AST.Literal(' ') );
            return AST.TextNode( AST.Literal(str) );
        }
    );
}

function parseElement(el) {
    var attributes = {};
    var children = [];

    el.children.forEach(function (node) {
        children = children.concat(parseNode(node));
    });

    Object.keys(el.attribs).forEach(function (attrName) {
        attributes[attrName] = parseSimpleExpression(el.attribs[attrName]);
    });

    return AST.Element(el.name, attributes, children);
}

function parseNode(node) {
    var map = {
        tag: parseElement,
        text: parseTextNode
    };

    var parsed;
    if (!map[node.type]) return [];
    parsed = map[node.type](node);
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
            block = AST.BlockStatement(child.blockType, child.blockExpression);
            block.state = 'body';

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

module.exports = parse;
