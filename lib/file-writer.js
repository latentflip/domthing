function FileWriter () {
    this.content = [];
    this.depth = 1;
}

FileWriter.prototype.appendToLastLine = function (str) {
    this.content[this.content.length - 1] += str;
};

FileWriter.prototype.write = function (lines) {
    if (arguments.length > 1) {
        lines = [].slice.call(arguments);
    }

    if (!Array.isArray(lines)) lines = [lines];

    lines = lines.map(this.indentString.bind(this));
    this.content = this.content.concat(lines);
};

FileWriter.prototype.indent = function (depth) {
    depth = depth || 1;
    this.depth += depth;
};

FileWriter.prototype.outdent = function (depth) {
    depth = depth || 1;
    this.depth -= depth;
};

FileWriter.prototype.toString = function () {
    return this.content.join('\n');
};

FileWriter.prototype.indentString = function (string) {
    return Array(this.depth).join('  ') + string;
};

module.exports = FileWriter;
