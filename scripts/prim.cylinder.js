prim.cylinder = function(opts) {
    prim.primitive.call(this, opts);
    this.internal.cylinder = {};
    this.internal.cylinder.radius2 = null;
    this.internal.cylinder.fn = 50;
};

prim.cylinder.prototype = Object.create(prim.primitive.prototype);

prim.cylinder.prototype.fn = function (val) {
    return 50;
    if (val === undefined || val === null) {
        this.internal.cylinder.fn;
    }

    this.internal.cylinder.fn = val;

    return this;
}

prim.cylinder.prototype.radius = function (val) {
    if (val === undefined || val === null) { return this.sizeX()/2; }

    this.sizeX(2*val);
    this.sizeY(2*val);

    return this;
};

prim.cylinder.prototype.diameter = function (val) {
    if (val === undefined || val === null) { return 2 * this.radius(); }
    return this.radius(val / 2);
};

prim.cylinder.prototype.radius2 = function (val) {
    if (val === undefined || val === null) { 
        if (this.internal.cylinder.radius2 !== undefined && this.internal.cylinder.radius2 !== null) {
            return this.internal.cylinder.radius2;
        }

        return this.radius();
    }

    this.internal.cylinder.radius2 = val;

    return this;
};

prim.cylinder.prototype.diameter2 = function (val) {
    if (val === undefined || val === null) { return 2 * this.radius2(); }
    return this.radius2(val / 2);
};

prim.cylinder.prototype.render = function () {
    var item = cylinder({r1:this.radius(), r2:this.radius2(), center:this.center(), h:this.height(), fn:this.fn()});
    return this.postRender(item);
};

prim.cylinder.prototype.cylinderBaseClone = prim.primitive.prototype.clone;

prim.cylinder.prototype.clone = function (ctor) {
    var dest = this.cylinderBaseClone(ctor || prim.cylinder);

    return dest;
};

