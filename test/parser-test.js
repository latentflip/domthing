var parse = require('../parser');
var test = require('tape');

var s = require('../s');

test.Test.prototype.astEqual = function (tmpl, expected) {
    var t = this;
    t.plan(2);
    parse(tmpl, function (err, ast) {
        t.notOk(err);
        t.deepEqual(ast, expected);
    });
};

test('parses a template', function (t) {
    t.astEqual('', { type: 'Template', children: [] });
});


test('parses simple tags', function (t) {
    t.astEqual('<a></a>', {
        type: 'Template',
        children: [
            {
                type: 'Element',
                tagName: 'a',
                attributes: {},
                children: []
            }
        ]
    });
});

test('parses attributes', function (t) {
    t.astEqual("<a href='foo' class='bar' id='baz'></a>", {
        type: 'Template',
        children: [
            {
                type: 'Element',
                tagName: 'a',
                attributes: {
                    href: 'foo',
                    class: 'bar',
                    id: 'baz'
                },
                children: []
            }
        ]
    });
});

test('parses text nodes', function (t) {
    t.astEqual("<a>foo</a>", {
        type: 'Template',
        children: [
            {
                type: 'Element',
                tagName: 'a',
                attributes: {},
                children: [
                    {
                        type: 'TextNode',
                        content: 'foo'
                    }
                ]
            }
        ]
    });
});

test('parses child nodes', function (t) {
    t.astEqual('<a><em>foo</em></a>', {
        type: 'Template',
        children: [
            {
                type: 'Element',
                tagName: 'a',
                attributes: {},
                children: [
                    {
                        type: 'Element',
                        tagName: 'em',
                        attributes: {},
                        children: [
                            {
                                type: 'TextNode',
                                content: 'foo'
                            }
                        ]
                    }
                ]
            }
        ]
    });
});

test('parses siblings', function (t) {
    t.astEqual('<a><em>foo</em><strong>bar</strong>baz</a>', {
        type: 'Template',
        children: [
            {
                type: 'Element',
                tagName: 'a',
                attributes: {},
                children: [
                    {
                        type: 'Element',
                        tagName: 'em',
                        attributes: {},
                        children: [
                            {
                                type: 'TextNode',
                                content: 'foo'
                            }
                        ]
                    },
                    {
                        type: 'Element',
                        tagName: 'strong',
                        attributes: {},
                        children: [
                            {
                                type: 'TextNode',
                                content: 'bar'
                            }
                        ]
                    },
                    {
                        type: 'TextNode',
                        content: 'baz',
                    },
                ]
            }
        ]
    });
});


test('parses if statements', function (t) {
    t.astEqual(s(function () {/*
        {{#if foo }}
            <a></a><b></b>
        {{/if}}
    */}), {
        type: 'Template',
        children: [
            {
                type: 'BlockStatement',
                blockType: 'if',
                expression: 'foo',
                body: [
                    {
                        type: 'Element',
                        tagName: 'a',
                        attributes: {},
                        children: []
                    },
                    {
                        type: 'Element',
                        tagName: 'b',
                        attributes: {},
                        children: []
                    }
                ],
                alternate: []
            }
        ]
    });
});

test('parses if/else statements', function (t) {
    t.astEqual(s(function () {/*
        {{#if foo }}
            <a></a>
        {{#else }}
            <b></b>
        {{/if}}
    */}), {
        type: 'Template',
        children: [
            {
                type: 'BlockStatement',
                blockType: 'if',
                expression: 'foo',
                body: [
                    {
                        type: 'Element',
                        tagName: 'a',
                        attributes: {},
                        children: []
                    }
                ],
                alternate: [
                    {
                        type: 'Element',
                        tagName: 'b',
                        attributes: {},
                        children: []
                    }
                ]
            }
        ]
    });
});

test('handles blocks in text', function (t) {
    t.astEqual(s(function () {/*
        {{#if foo }}
            hello
        {{#else }}
            goodbye
        {{/if}}
    */}), {
        type: 'Template',
        children: [
            {
                type: 'BlockStatement',
                blockType: 'if',
                expression: 'foo',
                body: [
                    {
                        type: 'TextNode',
                        content: 'hello'
                    }
                ],
                alternate: [
                    {
                        type: 'TextNode',
                        content: 'goodbye'
                    }
                ]
            }
        ]
    });
});

test('parses nested if/else statements', function (t) {
    t.astEqual(s(function () {/*
        {{#if foo }}
            {{#if bar }}
                <a></a>
            {{#else }}
                <c></c>
           {{/if}}
        {{#else }}
            <b></b>
        {{/if}}
    */}), {
        type: 'Template',
        children: [
            {
                type: 'BlockStatement',
                blockType: 'if',
                expression: 'foo',
                body: [
                    {
                        type: 'BlockStatement',
                        blockType: 'if',
                        expression: 'bar',
                        body: [
                            {
                                type: 'Element',
                                tagName: 'a',
                                attributes: {},
                                children: []
                            }
                        ],
                        alternate: [
                            {
                                type: 'Element',
                                tagName: 'c',
                                attributes: {},
                                children: []
                            }
                        ]
                    }
                ],
                alternate: [
                    {
                        type: 'Element',
                        tagName: 'b',
                        attributes: {},
                        children: []
                    }
                ]
            }
        ]
    });
});

test('parses unless statements', function (t) {
    t.astEqual(s(function () {/*
        {{#unless foo }}
            <a></a>
        {{#else }}
            <b></b>
        {{/if}}
    */}), {
        type: 'Template',
        children: [
            {
                type: 'BlockStatement',
                blockType: 'unless',
                expression: 'foo',
                body: [
                    {
                        type: 'Element',
                        tagName: 'a',
                        attributes: {},
                        children: []
                    }
                ],
                alternate: [
                    {
                        type: 'Element',
                        tagName: 'b',
                        attributes: {},
                        children: []
                    }
                ]
            }
        ]
    });
});


