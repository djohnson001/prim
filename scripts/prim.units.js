
Number.prototype.inch = function() {
    return 25.4*this;   //.valueOf() / 2;
};

Number.prototype.mm = function() {
    return this;   //.valueOf() / 2;
};

Number.prototype.inches = function () {
    return this.inch();
}
