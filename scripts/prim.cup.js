prim.cup = function(opts) {
    prim.tube.call(this, opts);

    this.internal.cup = {};
    this.internal.cup.baseThickness = 1;
};

prim.cup.prototype = Object.create(prim.tube.prototype);

prim.cup.prototype.baseThickness = function (val) {
    if (val === undefined || val === null) { return this.internal.cup.baseThickness; }

    this.internal.cup.baseThickness = val;

    return this;
};

prim.cup.prototype.render = function () {
    var item = new prim.cylinder().radius(this.outerRadius()).height(this.height()).render();

    var innerRad = this.innerRadius();
    if (this.innerRadius()) {
        var inner = new prim.cylinder().radius(this.innerRadius()).height(this.height());
        item = item.subtract(inner.render());
    }

    if (this.baseThickness() != null && this.baseThickness() > 0) {
        var bottom = new prim.cylinder().radius(this.outerRadius()).height(this.baseThickness());
        item = item.union(bottom.render().translate([0, 0, -this.height()/2+bottom.height()/2]));
    }

    return this.postRender(item);
};