var parse = require('../lib/parser');
var test = require('tape');
var AST = require('../lib/AST');

var s = require('multiline');

test.Test.prototype.astEqual = function (tmpl, expected, noplan) {
    var t = this;
    if (!noplan) {
        t.plan(2);
    }
    parse(tmpl, function (err, ast) {
        //console.log(JSON.stringify(expected, null, 2));
        //console.log(JSON.stringify(ast, null, 2));
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
    var template = [
        "<div>",
        "  <strong></strong>   message: {{ model.payload }} ",
        "</div>"
    ].join('\n');

    t.astEqual(template, AST.Template([
        AST.Element('div', [
            AST.TextNode(AST.Literal(' ')),
            AST.Element('strong'),
            AST.TextNode(AST.Literal(' message: ')),
            AST.TextNode(AST.Binding('model.payload')),
            AST.TextNode(AST.Literal(' ')),
        ]),
    ]));
});

test('parses this properly', function (t) {
    var tmpl = [
        "<li>",
        "    <a>hello</a>",
        "    {{foo}}",
        "    <a>there</a>",
        "</li>",
    ].join('\n');

    t.astEqual(tmpl, AST.Template([
        AST.Element('li', [
            AST.TextNode(AST.Literal(' ')),

            AST.Element('a', [
                AST.TextNode(AST.Literal('hello'))
            ]),
            AST.TextNode(AST.Literal(' ')),
            AST.TextNode(AST.Binding('foo')),
            AST.TextNode(AST.Literal(' ')),
            AST.Element('a', [
                AST.TextNode(AST.Literal('there'))
            ]),

            AST.TextNode(AST.Literal(' ')),
        ]),
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

test('parses raw html bindings', function (t) {
    t.astEqual('<div>{{{ foo }}}</div>', AST.Template([
        AST.Element('div', [
            AST.DocumentFragment(AST.Binding('foo'))
        ])
    ]));
});

test('parses raw expressions in attributes', function (t) {
    t.astEqual("<a href='{{{ (if model.foo \"a\" \"b\") }}}'></a>", AST.Template([
        AST.Element('a', {
            href: AST.Expression('safe', [
                AST.Expression('if', [
                    AST.Binding('model.foo'),
                    AST.Literal('a'),
                    AST.Literal('b')
                ])
            ])
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
    t.astEqual([
        "{{#if foo }}",
        "    <a></a><b></b>",
        "{{/if}}",
    ].join('\n'), AST.Template([
        AST.BlockStatement('if', AST.Binding('foo'), [
            AST.TextNode(AST.Literal(' ')),
            AST.Element('a'),
            AST.Element('b'),
            AST.TextNode(AST.Literal(' ')),
        ]),
    ]));
});

test('parses if/else statements', function (t) {
    var tmpl = [
        "{{#if foo }}",
        "    <a></a>",
        "{{#else }}",
        "    <b></b>",
        "{{/if}}",
    ].join('\n');

    t.astEqual(tmpl, AST.Template([
        AST.BlockStatement('if', AST.Binding('foo'), [
            AST.TextNode(AST.Literal(' ')),
            AST.Element('a'),
            AST.TextNode(AST.Literal(' ')),
        ], [
            AST.TextNode(AST.Literal(' ')),
            AST.Element('b'),
            AST.TextNode(AST.Literal(' ')),
        ])
    ]));
});

test('handles blocks in text', function (t) {
    var tmpl = [
        "<p>",
        "    {{#if foo }}",
        "        hello",
        "    {{#else }}",
        "        goodbye",
        "    {{/if}}",
        "</p>",
    ].join('\n');

    t.astEqual(tmpl, AST.Template([
        AST.Element('p', [
            AST.TextNode(AST.Literal(' ')),
            AST.BlockStatement('if', AST.Binding('foo'), [
                AST.TextNode( AST.Literal(' hello ') )
            ], [
                AST.TextNode( AST.Literal(' goodbye ') )
            ]),
            AST.TextNode(AST.Literal(' ')),
        ])
    ]));
});

test('parses nested if/else statements', function (t) {
    var tmpl = [
        "{{#if foo }}",
        "    <div>",
        "        {{#if bar }}",
        "            <a></a>",
        "        {{#else }}",
        "            <c></c>",
        "        {{/if}}",
        "    </div>",
        "{{#else }}",
        "    <b></b>",
        "{{/if}}",
    ].join('\n');

    t.astEqual(tmpl, AST.Template([
        AST.BlockStatement('if', AST.Binding('foo'), [
            AST.TextNode(AST.Literal(' ')),
            AST.Element('div', [
                AST.TextNode(AST.Literal(' ')),
                AST.BlockStatement('if', AST.Binding('bar'), [
                    AST.TextNode(AST.Literal(' ')),
                    AST.Element('a'),
                    AST.TextNode(AST.Literal(' ')),
                ], [
                    AST.TextNode(AST.Literal(' ')),
                    AST.Element('c'),
                    AST.TextNode(AST.Literal(' ')),
                ]),
                AST.TextNode(AST.Literal(' ')),
            ]),
            AST.TextNode(AST.Literal(' ')),
        ], [
            AST.TextNode(AST.Literal(' ')),
            AST.Element('b'),
            AST.TextNode(AST.Literal(' ')),
        ])
    ]));
});

test('parses unless statements', function (t) {
    var tmpl = [
        "{{#unless foo }}",
        "    <a></a>",
        "{{#else }}",
        "    <b></b>",
        "{{/if}}",
    ].join('\n');

    t.astEqual(tmpl, AST.Template([
        AST.BlockStatement('unless', AST.Binding('foo'), [
            AST.TextNode(AST.Literal(' ')),
            AST.Element('a'),
            AST.TextNode(AST.Literal(' ')),
        ], [
            AST.TextNode(AST.Literal(' ')),
            AST.Element('b'),
            AST.TextNode(AST.Literal(' ')),
        ])
    ]));
});

test('parses sub-expressions', function (t) {
    var tmpl = [
        "{{#if (not foo)}}",
        "    <a></a>",
        "{{/if}}",
    ].join('\n');

    t.astEqual(tmpl, AST.Template([
        AST.BlockStatement(
            'if',
            AST.Expression('not', [AST.Binding('foo')]),
            [
                AST.TextNode(AST.Literal(' ')),
                AST.Element('a'),
                AST.TextNode(AST.Literal(' ')),
            ]
        )
    ]));
});

test('parses expressions in bindings', function (t) {
    var tmpl = "<span class='{{ (sw foo \"bar\" baz)}}'></span>";

    t.astEqual(tmpl, AST.Template([
        AST.Element('span', {
            class: AST.Expression('sw', [AST.Binding('foo'), AST.Literal("bar"), AST.Binding("baz")])
        })
    ]));
});

test('parses expressions in text nodes', function (t) {
    var tmpl = '<span>{{ (if foo "bar" baz) }}</span>';

    t.astEqual(tmpl, AST.Template([
        AST.Element('span', [
            AST.TextNode(
                AST.Expression('if', [AST.Binding('foo'), AST.Literal("bar"), AST.Binding("baz")])
            )
        ])
    ]));
});

test('parses log expressions in bindings', function (t) {
    var tmpl = "<span class='{{ (log foo.bar )}}'></span>";

    t.astEqual(tmpl, AST.Template([
        AST.Element('span', {
            class: AST.Expression('log', [AST.Binding('foo.bar')])
        })
    ]));
});

test('handles hyphens somehow in bindings', function (t) {
    var tmpl = [
        '<li><input data-grid="{{data-grid}}" type="checkbox" /></li>'
    ].join('\n');

    t.astEqual(tmpl, AST.Template([
        AST.Element('li', [
            AST.Element('input', {
                'data-grid': AST.Binding('data-grid'),
                type: AST.Literal('checkbox')
            })
        ])
    ]));
});

test('parses bindings without quotes', function (t) {
    t.plan(6);

    t.astEqual('<a href={{ foo }}></a>', AST.Template([
        AST.Element('a', {
            href: AST.Binding('foo')
        })
    ]), true);

    t.astEqual('<a href={{ (foo "foo" bar) }}></a>', AST.Template([
        AST.Element('a', {
            href: AST.Expression('foo', [
                AST.Literal('foo'),
                AST.Binding('bar')
            ])
        })
    ]), true);

    t.astEqual('<a href="/thing" class="{{ (if (eq aString "HELLO\\"") "active" \'foo\' bar) }}" bar="baz">{{foo}}</a>', AST.Template([
        AST.Element('a', {
            href: AST.Literal('/thing'),
            class: AST.Expression('if', [
                AST.Expression('eq', [
                    AST.Binding('aString'),
                    AST.Literal('HELLO"')
                ]),
                AST.Literal('active'),
                AST.Literal('foo'),
                AST.Binding('bar')
            ]),
            bar: AST.Literal("baz")
        }, [
            AST.TextNode(AST.Binding('foo'))
        ])
    ]), true);
});
