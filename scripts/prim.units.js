
Number.prototype.inch = function() {
    return 25.4*this;
};

Number.prototype.inches = function () {
    return this.inch();
}

Number.prototype.foot = function() {
    return (12*this).inch();
};

Number.prototype.feet = function() {
    return (12*this).inch();
};

Number.prototype.mile = function() {
    return (5280*this).foot();
};

Number.prototype.mm = function() {
    return this;
};

Number.prototype.cm = function() {
    return 1000 * this;
};

Number.prototype.m = function() {
    return 1000 * this;
};

Number.prototype.meter = function() {
    return 1000 * this;
};

Number.prototype.meters = function() {
    return (this).meter();
};

Number.prototype.km = function() {
    return (1000 * this).meter();
};

Number.prototype.kilometer = function() {
    return (this).km();
};

Number.prototype.kilometers = function() {
    return (this).km();
};

