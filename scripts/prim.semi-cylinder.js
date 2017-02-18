
prim.semiCylinder = function(opts) {
    prim.cylinder.call(this, opts);
};

prim.semiCylinder.prototype = Object.create(prim.cylinder.prototype);

prim.semiCylinder.prototype.render = function () {
    var r1 = this.radius();
    var r2 = this.radius2();
    var height = this.height();

    var largerRadius = r2 > r1 ? r2 : r1;

    var cutout = new prim.cube().width(2*largerRadius).breadth(2*largerRadius).height(height)
        .translate([largerRadius, 0, 0]);

    var item = cylinder({r1:r1, r2:r2, h:height, center:true})
        .subtract(cutout.render())
        .translate([largerRadius/2, 0, 0]);

    return this.postRender(item);
};

prim.cylinder.prototype.radius = function (val) {
    if (val === undefined || val === null) { return this.sizeY()/2; }
    this.sizeY(2*val);

    // cutting the right half cylinder off in the X-directin.
    this.sizeX(val);

    return this;
};

prim.semiCylinder.prototype.semiCylinderBaseClone = prim.cylinder.prototype.clone;

prim.semiCylinder.prototype.clone = function (ctor) {
    return this.semiCylinderBaseClone(ctor || prim.semiCylinder);
};