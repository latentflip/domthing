function SafeString(value) {
    this.value = value.toString();
}

SafeString.prototype.isSafeString = true;
SafeString.prototype.toString = function () {
    return this.value;
};

module.exports = SafeString;

