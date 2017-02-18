prim.poly = function(opts) {
    prim.primitive.call(this, opts);

    this.internal.poly = {};
    this.internal.poly.points = [[-0.5,-0.5], [0, 0.5], [0.5, -0.5]];
    this.internal.poly.height = 1;
};

prim.poly.prototype = Object.create(prim.primitive.prototype);

prim.poly.prototype.points = function (val) {
    if (val === undefined || val === null) {
        return this.internal.poly.points;
    }

    this.internal.poly.points = val;

    return this;
};

prim.poly.prototype.size = function () {
    var min = [null, null];
    var max = [null, null];


    for (var index = 0; index < this.internal.poly.points.length; index++) {
        var point = this.internal.poly.points[index];
        if (index == 0 || point[0]<min[0]) {
            min[0] = point[0];
        }

        if (index == 0 || point[1]<min[1]) {
            min[1] = point[1];
        }

        if (index == 0 || point[0]>max[0]) {
            max[0] = point[0];
        }

        if (index == 0 || point[1]>max[1]) {
            max[1] = point[1];
        }
    }

    return [
        max[0] - min[0],
        max[1] - min[1],
        this.height()
    ]
};

prim.poly.prototype.scale = function(val) {
    if (val === undefined || val === null) {
        return null;
    }

    if (!isNaN(val)) {
        return this.scale([val, val, val]);

    } else if (val.constructor === Array) {
        if (val.length >= 1) {
            for (var index = 0; index < this.internal.poly.points.length; index++) {
                this.internal.poly.points[index][0] = val[0] * this.internal.poly.points[index][0];
                if (val.length >= 2) {
                    this.internal.poly.points[index][1] = val[1] * this.internal.poly.points[index][1];
                }
            }

            if (val.length >= 3) {
                this.height(val[2] * this.height());
            }
        }
    }

    return this;
};

prim.poly.prototype.width = function (val) {
    if (val !== undefined && val !== null) {
        var currentWidth = this.size()[0];
        if (currentWidth != 0 && val != 0) {
            var ratio = val/currentWidth;
            for (var index = 0; index < this.internal.poly.points.length; index++) {
                this.internal.poly.points[index][0] = ratio * this.internal.poly.points[index][0];
            }
        }

        return this;
    }

    return this.size()[0];
};

prim.poly.prototype.breadth = function (val) {
    if (val !== undefined && val !== null) {
        var currentBreadth = this.size()[1];
        if (currentBreadth != 0 && val != 0) {
            var ratio = val/currentBreadth;
            for (var index = 0; index < this.internal.poly.points.length; index++) {
                this.internal.poly.points[index][1] = ratio * this.internal.poly.points[index][1];
            }
        }

        return this;
    }

    return this.size()[1];    
}

prim.poly.prototype.height = function (val) {
    if (val !== undefined && val !== null) {
        this.internal.poly.height = val;
        return this;
    }

    return this.internal.poly.height;
};

prim.poly.prototype.preRender = function () {
    var height = this.height();
    var poly = CAG.fromPoints(this.points());
    return linear_extrude({ height: height }, poly).translate([0, 0, -height/2]);
};

prim.poly.prototype.cylinderBaseClone = prim.primitive.prototype.clone;

prim.poly.prototype.clone = function (ctor) {
    var dest = this.cylinderBaseClone(ctor || prim.poly);

    return dest;
};