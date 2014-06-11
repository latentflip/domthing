var parse = require('../lib/parser');
var test = require('tape');
var AST = require('../lib/AST');

var s = require('multiline');

test.Test.prototype.astEqual = function (tmpl, expected) {
    var t = this;
    t.plan(2);
    parse(tmpl, function (err, ast) {
        t.notOk(err);
        t.deepEqual(ast, expected);
    });
};

test('parses a template', function (t) {
    t.astEqual('', AST.Template());
});


test('parses simple tags', function (t) {
    t.astEqual('<a></a>', AST.Template([
        AST.Element('a')
    ]));
});

test('parses spaces', function (t) {
    var template = s(function () {/*
    <div>
        <strong></strong>    message: {{ model.payload }}
    </div>
    */});

   t.astEqual(template, AST.Template([
        AST.Element('div', [
            AST.Element('strong'),
            AST.TextNode(AST.Literal(' message: ')),
            AST.TextNode(AST.Binding('model.payload'))
        ])
    ]));
});



test('parses attributes', function (t) {
    t.astEqual("<a href='foo' class='bar' id='baz'></a>", AST.Template([
        AST.Element('a', {
            href: AST.Literal('foo'),
            class: AST.Literal('bar'),
            id: AST.Literal('baz'),
        })
    ]));
});

test('parses expressions in attributes', function (t) {
    t.astEqual("<a href='{{foo}}' id='{{ baz}}' class='bar'></a>", AST.Template([
        AST.Element('a', {
            href: AST.Binding('foo'),
            id: AST.Binding('baz'),
            class: AST.Literal('bar')
        })
    ]));
});

test('parses concat expressions in attributes', function (t) {
    t.astEqual("<a class='foo {{foo}} bar {{bar}} {{baz}}'></a>", AST.Template([
        AST.Element('a', {
            class: AST.Expression('concat', [
                AST.Literal('foo '),
                AST.Binding('foo'),
                AST.Literal(' bar '),
                AST.Binding('bar'),
                AST.Literal(' '),
                AST.Binding('baz')
            ])
        })
    ]));
});

test('parses text nodes', function (t) {
    t.astEqual("<a>foo</a>", AST.Template([
        AST.Element('a', [
            AST.TextNode( AST.Literal('foo') )
        ])
    ]));
});

test('parses simple bindings in text nodes', function (t) {
    t.astEqual('<a>foo {{bar}} baz</a>', AST.Template([
        AST.Element('a', [
            AST.TextNode( AST.Literal('foo ') ),
            AST.TextNode( AST.Binding('bar') ),
            AST.TextNode( AST.Literal(' baz') ),
        ])
    ]));
});

test('parses child nodes', function (t) {
    t.astEqual('<a><em>foo</em></a>', AST.Template([
        AST.Element('a', [
            AST.Element('em', [
                AST.TextNode( AST.Literal('foo') )
            ])
        ])
    ]));
});

test('parses siblings', function (t) {
    t.astEqual('<a><em>foo</em><strong>bar</strong>baz</a>', AST.Template([
        AST.Element('a', [
            AST.Element('em', [
                AST.TextNode( AST.Literal('foo') )
            ]),
            AST.Element('strong', [
                AST.TextNode( AST.Literal('bar') )
            ]),
            AST.TextNode( AST.Literal('baz') )
        ])
    ]));
});


test('parses if statements', function (t) {
    t.astEqual(s(function () {/*
        {{#if foo }}
            <a></a><b></b>
        {{/if}}
    */}), AST.Template([
        AST.BlockStatement('if', AST.Binding('foo'), [
            AST.Element('a'),
            AST.Element('b'),
        ])
    ]));
});

test('parses if/else statements', function (t) {
    t.astEqual(s(function () {/*
        {{#if foo }}
            <a></a>
        {{#else }}
            <b></b>
        {{/if}}
    */}), AST.Template([
        AST.BlockStatement('if', AST.Binding('foo'), [
            AST.Element('a')
        ], [
            AST.Element('b')
        ])
    ]));
});

test('handles blocks in text', function (t) {
    t.astEqual(s(function () {/*
        <p>
            {{#if foo }}
                hello
            {{#else }}
                goodbye
            {{/if}}
        </p>
    */}), AST.Template([
        AST.Element('p', [
            AST.BlockStatement('if', AST.Binding('foo'), [
                AST.TextNode( AST.Literal(' hello ') )
            ], [
                AST.TextNode( AST.Literal(' goodbye ') )
            ])
        ])
    ]));
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
    */}), AST.Template([
        AST.BlockStatement('if', AST.Binding('foo'), [
            AST.BlockStatement('if', AST.Binding('bar'), [
                AST.Element('a')
            ], [
                AST.Element('c')
            ])
        ], [
            AST.Element('b')
        ])
    ]));
});

test('parses unless statements', function (t) {
    t.astEqual(s(function () {/*
        {{#unless foo }}
            <a></a>
        {{#else }}
            <b></b>
        {{/if}}
    */}), AST.Template([
        AST.BlockStatement('unless', AST.Binding('foo'), [
            AST.Element('a')
        ], [
            AST.Element('b')
        ])
    ]));
});

test('parses sub-expressions', function (t) {
    t.astEqual(s(function () {/*
        {{#if (not foo)}}
            <a></a>
        {{/if}}
    */}), AST.Template([
        AST.BlockStatement(
            'if',
            AST.Expression('not', [AST.Binding('foo')]),
            [
                AST.Element('a')
            ]
        )
    ]));
});
