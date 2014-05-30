var runtime = require('../runtime');
var State = require('ampersand-state');

var Profile = State.extend({
    props: {
        age: 'number',
        height: 'number',
        style: 'string'
    }
});

var Person = State.extend({
    props: {
        id: 'string',
        name: 'string',
        profile: 'state',
        showProfile: 'boolean'
    }
});

var myProfile = new Profile({
    age: 27,
    height: 190
});


var me = new Person({
    id: '1',
    name: 'Phil',
    profile: myProfile,
    showProfile: true
});

var newProfile = new Profile({
    age: 30,
    height: 200
});

var s = 0;
setInterval(function () {
    s = (s + 1) % 3;
    switch(s) {
    case 0:
        me.profile = myProfile;
        break;
    case 1:
        me.profile = newProfile;
        break;
    case 2:
        me.profile = undefined;
        break;
    }
}, 1);


function addPerson () {
    var t = templates.person({
        me: me
    });
    window.t = t;

    document.body.appendChild(t);

    me.on('all', function (name, model, value) {
        if (name.match(/^change:/)) {
            t.update('me.' + name.split(':')[1], value);
        }
    });
}

var templates = require('../templates');
templates._runtime = runtime;
addPerson();
