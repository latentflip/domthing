var parse = require('../lib/sexp-parser').parse;
var test = require('tape');
var AST = require('../lib/ast');

test('simple functions', function (t) {
    t.deepEqual(
        parse('(concat "foo" "bar")'),
        AST.Expression('concat', [
            AST.Literal('foo'),
            AST.Literal('bar')
        ])
    );

    t.deepEqual(
        parse("(concat 'foo' 'bar')"),
        AST.Expression('concat', [
            AST.Literal('foo'),
            AST.Literal('bar')
        ])
    );

    t.deepEqual(
        parse('(concat "fo\'o" "ba\\"r")'),
        AST.Expression('concat', [
            AST.Literal('fo\'o'),
            AST.Literal('ba"r')
        ])
    );

    t.deepEqual(
        parse("(concat 'fo\\'o' 'ba\"r')"),
        AST.Expression('concat', [
            AST.Literal('fo\'o'),
            AST.Literal('ba"r')
        ])
    );

    t.deepEqual(
        parse('(sw foo "bar" baz)'),
        AST.Expression('sw', [
            AST.Binding('foo'),
            AST.Literal('bar'),
            AST.Binding('baz')
        ])
    );

    t.deepEqual(
        parse('(not true false)'),
        AST.Expression('not', [
            AST.Literal(true),
            AST.Literal(false)
        ])
    );

    t.deepEqual(
        parse('(concat "foo" bar)'),
        AST.Expression('concat', [
            AST.Literal('foo'),
            AST.Binding('bar')
        ])
    );

    t.deepEqual(
        parse('(  concat    "foo"   bar  )'),
        AST.Expression('concat', [
            AST.Literal('foo'),
            AST.Binding('bar')
        ])
    );

    t.deepEqual(
        parse('(concat "foo" bar.baz.bux)'),
        AST.Expression('concat', [
            AST.Literal('foo'),
            AST.Binding('bar.baz.bux')
        ])
    );

    t.deepEqual(
        parse('(concat "foo" (not foo) (toStr (mult 2 foo.bar)))'),
        AST.Expression('concat', [
            AST.Literal('foo'),
            AST.Expression('not', [
                AST.Binding('foo')
            ]),
            AST.Expression('toStr', [
                AST.Expression('mult', [
                    AST.Literal(2),
                    AST.Binding('foo.bar')
                ])
            ])
        ])
    );

    t.end();
});
