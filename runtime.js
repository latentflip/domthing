var KeyTreeStore = require('key-tree-store');
KeyTreeStore.prototype.keys = function (keypath) {
    var keys = Object.keys(this.storage);
    return keys.filter(function (k) {
        return (k.indexOf(keypath) === 0); 
    });
};

var reduceKeypath = require('./lib/reduce-keypath');

function relativeKeypath(from, to) {
    from = from.trim();
    to = to.trim();

    if (to.indexOf(from + '.') !== 0) {
        throw new Error('Cannot get to "' + to + '" from "' + from + '"');
    }
    return to.substr(from.length + 1);
}

function Template () {
    this._callbacks = new KeyTreeStore();
    this._changes = {};
    this.html = document.createDocumentFragment();
    this.renderQueued = false;
    window.templates = window.templates || [];
    window.templates.push(this);
}

Template.prototype.update = function (keypath, value) {
    var keys = this._callbacks.keys(keypath);
    var self = this;

    keys.forEach(function (key) {
        if (key === keypath) {
            self._changes[key] = value;
        } else {
            self._changes[key] = reduceKeypath(value, relativeKeypath(keypath, key));
        }
    });

    if (!this.renderQueued) this.queueRender();
};

Template.prototype.queueRender = function () {
    window.requestAnimationFrame(this.doRender.bind(this));
    this.renderQueued = true;
};

Template.prototype._update = function (keypath, value) {
    if (this._callbacks.storage[keypath]) {
        this._callbacks.storage[keypath].forEach(function (cb) {
            cb(value);
        });
    }
};

Template.prototype.doRender = function () {
    var self = this;
    Object.keys(this._changes).forEach(function (keypath) {
        self._update(keypath, self._changes[keypath]);
    });
    this._changes = {};
    this.renderQueued = false;
};

Template.prototype.addCallback = function(keypath, cb) {
    this._callbacks.add(keypath, cb);
};

module.exports = {
    helpers: require('./helpers'),
    Template: Template
};
