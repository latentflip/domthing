
The question is this:

This is easy: 

```
<a class="{{foo.bar}}">
```

element.setAttribute('class', context.foo.bar);


This is almost as easy:

```
<a class="{{ (concat foo.bar foo.baz "hello" with=" ") }}">
```

element.setAttribute('class', helpers.concat(foo.bar, foo.baz, "hello", { with: ' ' }));

But how do you do this:

```
<a class="{{foo.bar}} {{foo.baz}} hello"></a>
```

```
<a class="{{ (concat foo.bar foo.baz "hello" with=" ") }}">
```

and make concat an internal helper


