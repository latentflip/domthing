runtime = require('../runtime');
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
        profile: 'state'
    },
    derived: {
        leftStyle: {
            deps: ['profile.height'],
            fn: function () {
                var left = this.profile.height % 500;
                return "position: relative; left: " + left + "px;";
            }
        }
    },
    session: {
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

setInterval(function () {
    myProfile.height += 1;
}, 1);

setInterval(function () {
    me.showProfile = !me.showProfile;
}, 5000);

var red = true;

setInterval(function () {
    red = !red;
    if (red) {
        myProfile.style = 'color: red;';
    } else {
        myProfile.style = 'color: green;';
    }
}, 1000);

var templates = require('../templates');

function addPerson () {
    var t = templates.person({
        me: me
    }, window.runtime);

    document.body.appendChild(t);

    me.on('all', function (name, model, value) {
        t.update('me.' + name.split(':')[1], value);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    for (var i=0; i<100; i++) addPerson();
});
