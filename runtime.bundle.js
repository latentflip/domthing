!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.RUNTIME=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var reduceKeypath = _dereq_('./lib/reduce-keypath');

module.exports.textBinding = function (node, context, expression) {
    this.addCallback(expression, function (value) {
        node.data = value;
    });
    node.data = reduceKeypath(context, expression);
};

module.exports.attribute = function (node, context, attributeName, expression) {
    this.addCallback(expression, function (value) {
        node.setAttribute(attributeName, value);
    });
    node.setAttribute(attributeName, reduceKeypath(context, expression));
};

module.exports.if = function (parent, context, expression, body, alternate) {
    var elements, newElements;
    //FIXME: need to wrap in a div, ugh

    var trueDiv = document.createElement('div');
    var falseDiv = document.createElement('div');

    body(trueDiv);
    alternate(falseDiv);

    var previousValue;
    var currentElement;

    var render = function (value, force) {
        var newElement;
        value = !!value;

        if (previousValue !== value || force) {
            newElement = value ? trueDiv : falseDiv;

            if (!currentElement) {
                parent.appendChild(newElement);
            } else {
                currentElement.parentNode.replaceChild(newElement, currentElement);
            }

            currentElement = newElement;
            previousValue = value;
        }
    };

    render(reduceKeypath(context, expression), true);
    this.addCallback(expression, render);
};

},{"./lib/reduce-keypath":2}],2:[function(_dereq_,module,exports){
module.exports = function reduceKeypath(context, keypath) {
    var path = keypath.trim().split('.');
    return path.reduce(function (obj, path) {
        return obj && obj[path];
    }, context);
}

},{}],3:[function(_dereq_,module,exports){
function KeyTreeStore() {
    this.storage = {};
}

// add an object to the store
KeyTreeStore.prototype.add = function (keypath, obj) {
    var arr = this.storage[keypath] || (this.storage[keypath] = []);
    arr.push(obj);
};

// remove an object
KeyTreeStore.prototype.remove = function (obj) {
    var path, arr;
    for (path in this.storage) {
        arr = this.storage[path];
        arr.some(function (item, index) {
            if (item === obj) {
                arr.splice(index, 1);
                return true;
            }
        });
    }
};

// grab all relevant objects
KeyTreeStore.prototype.get = function (keypath) {
    var keys = Object.keys(this.storage);
    var res = [];

    keys.forEach(function (key) {
        if (key.indexOf(keypath) !== -1) {
            res = res.concat(this.storage[key]);
        }
    }, this);

    return res;
};

module.exports = KeyTreeStore;

},{}],4:[function(_dereq_,module,exports){
var KeyTreeStore = _dereq_('key-tree-store');
KeyTreeStore.prototype.keys = function (keypath) {
    var keys = Object.keys(this.storage);
    return keys.filter(function (k) {
        return (k.indexOf(keypath) === 0); 
    });
};

var reduceKeypath = _dereq_('./lib/reduce-keypath');

function relativeKeypath(from, to) {
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
    helpers: _dereq_('./helpers'),
    Template: Template
};

},{"./helpers":1,"./lib/reduce-keypath":2,"key-tree-store":3}]},{},[4])
(4)
});