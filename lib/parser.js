var AST = require('./AST');
var DomHandler = require('domhandler');
var htmlparser = require('htmlparser2');
var splitter = require('./split-and-keep-splitter');
var sexpParser = require('./sexp-parser');

var REGEXES = {
    block: /{{{?\s*(#|\/)?\s*([^}]*)}?}}/,
    curlyId: /{{(c\d+)}}/g,
    splitter: /{{{?([^}]*)}?}}/g,
    simpleExpression: /{{{?\s*([^}]*)\s*}?}}/,
    safeExpression: /{{{\s*([^}]*)\s*}}}/,
};

/* Parsing:
 * - Given a template of html + {{ }} bindings
 * - First parse the html with an html parser into a dom
 * - Iterate over the dom, building a JSON AST of nodes
 *   - For each node, check if it's attributes have {{ }} bindings, and build an AST for those expressions
 *   - For each node with content, check if it's contents contain {{# }} bindings, and build an AST of those expressions too
 */
function parse(tmpl, cb) {
    preParse(tmpl, function (err, tmpl, curlies) {
        parseHTML(tmpl, function (err, dom) {
            var ast = AST.Template();

            if (err) return cb(err);

            dom.forEach(function (node) {
                ast.children = ast.children.concat(parseNode(node, curlies));
            });
            collectBlocks(ast);
            cb(null, ast);
        });
    });
}

function preParse(tmpl, cb) {
    var curlies = {};
    var curlyId = 0;

    tmpl = tmpl.replace(new RegExp(REGEXES.block.source, 'g'), function (match) {
        curlyId++;
        curlies['c' + curlyId] = match;
        return "{{c" + curlyId + "}}";
    });

    cb(null, tmpl, curlies);
}

//Parse template into a dom tree
function parseHTML(tmpl, cb) {
    tmpl = tmpl.trim();
    var handler = new DomHandler(cb, { normalizeWhitespace: true });
    var htmlParser = new htmlparser.Parser(handler);

    htmlParser.write(tmpl.trim());
    htmlParser.done();
}

function parseNode(node, curlies) {
    var NODE_PARSERS = {
        tag: parseElement,
        text: parseTextNode
    };
    var parsed;

    if (!NODE_PARSERS[node.type]) return [];

    parsed = NODE_PARSERS[node.type](node, curlies);

    if (!Array.isArray(parsed)) parsed = [parsed];
    return parsed;
}

//build AST node from element
function parseElement(el, curlies) {
    var attributes = {};
    var children = [];

    Object.keys(el.attribs).forEach(function (attrName) {
        var attr = el.attribs[attrName].replace(REGEXES.curlyId, function (match, id) {
            return curlies[id];
        });
        attributes[attrName] = parseSimpleExpression(attr);
    });

    el.children.forEach(function (node) {
        children = children.concat(parseNode(node, curlies));
    });

    return AST.Element(el.name, attributes, children);
}

function parseSimpleExpression(string) {
    string = string.trim();
    var match = string.match(REGEXES.simpleExpression);

    //class="foo"
    if (!match) return AST.Literal(string);

    //class="{{foo}}"
    if (match[0] === string) {
        var expr;

        if (match[1].indexOf('(') > -1) {
            expr = sexpParser.parse(match[1]);
        } else {
            expr = AST.Binding(match[1].trim());
        }

        if (match[0].match(REGEXES.safeExpression)) {
            return AST.Expression('safe', [ expr ]);
        } else {
            return expr;
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

function parseTextNode(node, curlies) {
    var data = node.data.replace(REGEXES.curlyId, function (match, id) {
        return curlies[id];
    });

    return splitter(
        data,
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

function parseSafeExpression(string) {
    var match = string.match(REGEXES.safeExpression);
    return AST.DocumentFragment(parseBlockExpression(match[1].trim()));
}

function parseMustaches(string) {
    if (string.match(REGEXES.safeExpression)) {
        return parseSafeExpression(string);
    }
    var match = string.match(REGEXES.block);
    var tagType = match[1];
    var blockType;
    var blockExpression = match[2].trim();

    switch(tagType) {
    case undefined:
        return AST.TextNode( parseBlockExpression(blockExpression) );
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

function parseBlockExpression(string) {
    if (string.indexOf('(') > -1) {
        return sexpParser.parse(string);
    } else {
        return AST.Binding(string);
    }
}

function collectBlocks(node) {
    if (!node.children) return node;

    var newChildren = [];
    var blockStack = [];

    node.children.forEach(function (node) {
        var block;

        if (node.type === 'BlockStart') {
            block = AST.BlockStatement(node.blockType, node.blockExpression);
            block.state = 'body';
            blockStack.push(block);
        }
        else if (node.type === 'BlockElse') {
            last(blockStack).state = 'alternate';
        }
        else {
            if (node.type === 'BlockEnd') {
                node = blockStack.pop();
                node.body = node.body.map(collectBlocks);
                node.alternate = node.alternate.map(collectBlocks);
                delete node.state;
            }

            var currentNodeList;
            if (blockStack.length) {
                block = last(blockStack);
                currentNodeList = block[block.state];
            }
            else {
                currentNodeList = newChildren;
            }

            currentNodeList.push(node);
        }
    });

    node.children = newChildren.map(collectBlocks);
    return node;
}

function last(arr) {
    return arr[arr.length - 1];
}
module.exports = parse;
module.exports.parseHTML = parseHTML;
