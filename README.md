# dömthing

(pronounced with as many diphthongs as possible, e.g: do-wum-thay-ang)

## What is this?

A DOM-aware, mustache/handlebars-like, templating engine. Heavily inspired by HTMLBars.

## How do i I use it?

Check out the demo repo at http://github.com/latentflip/domthing-demo

```bash
npm install -g domthing
```

Now create a directory of templates, ending in `.dom`, like 'foo.dom':

```html
<!-- foo.dom -->
<h1>{{ greeting }}</h1>
```

```javascript
domthing path/to/templates > path/to/templates.js
```

now in your app you can do:
```javascript
var templates = require('./path/to/templates.js');

document.addEventListener('DOMContentLoaded', function () {

    //render the template (returns a dom node);
    var rendered = templates.foo({ greeting: 'Hello!' });

    //append the node
    document.body.appendChild(rendered);

    //trigger updates to context options:
    setInterval(function () {
        //or whatever
        rendered.update('greeting', 'Goodbye!');
    }, 5000);
});
```

# Why?

Most templating engines are just string interpolation, precompiling this:

```html
<a href="<%= me.url %>">My profile</a>
```

generates a function like this:

```js
function template(context) {
    return '<a href="' + context.me.url + '">My profile</a>';
}
```

which you call like this:

```js
someElement.innerHTML = template({ me: { url: 'twitter.com/philip_roberts' } });
```

This works, but it's not very smart. If you want to update your page if the context data changes you have to rerender the template (slow), or you have to insert css selector hooks everywhere so that you can update specific elements, a la: `<a role="profile-link" href="<%= me.url %>">My Profile</a>` and then `$('[role=profile-link]').text(me.url)`.

You've also now split the knowledge of where data goes into the dom in the template into two places, once in the template, and once somewhere in JavaScript land. Or you just do it in JavaScript land and your templates look a little empty. You also better hope nobody changes your html in a way that breaks your css selector code, or you'll be sad :(. _Also_ you've now made it harder for frontend devs who might be comfortable editing templates & styling, but less so tweaking css selector bindings, to actually edit where data goes in your templates.

So, what if your template engine actually understood how the dom worked, and actually returned DOM elements:

```js
//warning, code for illustrative purposes only:
function template(context) {
    var element = document.createElement('a');
    element.setAttribute('href', context.me.url);
    element.appendChild(document.createTextNode('My Profile'));
    return element;
}
```

And now that you had actual references to real elements, you could just bind them to data changes directly, no css selectors required:

```js
//warning, code for illustrative purposes only:
function template(context) {
    var element = document.createElement('a');
    bindAttribute(element, 'href', 'context.me.url'); //updates href when context changes
    element.appendChild(document.createTextNode('My Profile'));
    return element;
}
```

If you had that you could trivially write templates that did this:

```html
<a class="call-to-action {{model.active}} {{model.linkType}}">Buy Stuff!</a>
```

and the classes would all just work, and update with the data, or this:

```html
<a class="call-to-action">
    {{#if user.hasBought }}
        BUY MORE!
    {{#else }}
        BUY SOMETHING!
    {{/if }}
</a>
```

and the output would update as soon as user.hasBought changed.
