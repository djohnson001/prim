prim.hex = function(opts) {
    prim.poly.call(this, opts);

    this.internal.poly.points = [];
    
    var sides = 6;
    for(var index = 0; index < sides; index++) {
        var angle = index * (360 / sides);
        var x = cos(angle);
        var y = sin(angle);

        var point = [x, y];

        this.internal.poly.points.push(point);
    }
};

prim.hex.prototype = Object.create(prim.poly.prototype);