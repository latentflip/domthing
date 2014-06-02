# What is this?

A DOM-aware, mustache/handlebars-like, templating engine.

# How do i I use it?

```bash
npm install -g domthing
domthing path/to/templates/directory > templates.js
# Now go ask Phil because it's still kinda awkward
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

You've also now split the knowledge of where data goes into the dom in the template into two places, once in the template, and once somewhere in JavaScript land. Or you just do it in JavaScript land and your templates look a little empty. You also better hope nobody changes your html ina way that breaks your css selector code, or you'll be sad :(. _Also_ you've now made it harder for frontend devs who might be comfortable editing templates & styling, but less so tweaking css selector bindings, to actually edit where data goes in your templates.

So, what if your template engine actually understood how the dom worked, and actually returned DOM elements:

```
//warning, code for illustrative purposes only:
function template(context) {
    var element = document.createElement('a');
    element.setAttribute('href', context.me.url);
    element.appendChild(document.createTextNode('My Profile'));
    return element;
}
```

And now that you had actual references to real elements, you could just bind them to data changes directly, no css selectors required:

```
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
