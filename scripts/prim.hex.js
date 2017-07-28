prim.hex = function(opts) {
    prim.poly.call(this, opts);

    this.internal.radius = 1;
    this.internal.poly.points = [];
    
    var sides = 6;
    for(var index = 0; index < sides; index++) {
        var angle = index * (360 / sides);
        var x = this.internal.radius * cos(angle);
        var y = this.internal.radius * sin(angle);

        var point = [x, y];

        this.internal.poly.points.push(point);
    }
};

prim.hex.prototype = Object.create(prim.poly.prototype);

prim.hex.radius = function (val) {
    if (val == undefined || val == null) { return this.internal.radius; }
    this.internal.radius = val;

    return this;
};