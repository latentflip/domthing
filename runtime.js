var Template = require('./lib/runtime/template');
var hooks = require('./lib/runtime/hooks');
var helpers = require('./lib/runtime/helpers');
var expressions = require('./lib/runtime/expressions');

module.exports = {
    Template: Template,
    hooks: hooks,

    registerHelper: helpers.registerHelper,
    registerExpression: expressions.registerExpression
};
