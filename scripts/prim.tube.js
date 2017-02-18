prim.tube = function(opts) {
    prim.cylinder.call(this, opts);
    this.internal.tube = {};
    this.internal.tube.innerRadius = 0.9;
    this.internal.tube.baseThickness = 0.1;
};

prim.tube.prototype = Object.create(prim.cylinder.prototype);

prim.tube.prototype.outerRadius = function (val) {
    return this.radius(val);
}

prim.tube.prototype.outerDiameter = function (val) {
    return this.diameter(val);
};

prim.tube.prototype.innerRadius = function (val) {
    if (val === undefined || val === null) { 
        if (this.internal.tube.innerRadius === null) {
            return 0;
        }

        return this.internal.tube.innerRadius;
    }

    this.internal.tube.innerRadius = val;
    return this;
};

prim.tube.prototype.innerDiameter = function (val) {
    if (val === undefined || val === null) { return 2*this.innerRadius();  }
    this.innerRadius(val / 2);

    return this;
};

prim.tube.prototype.thickness = function(val) {
    if (val === undefined || val === null) {
        var innerRadius = this.innerRadius();
        if (innerRadius === undefined || innerRadius === null || innerRadius <= 0) {
            return this.outerRadius();
        }
        
        return this.outerRadius() - this.innerRadius();
    }
    
    return this.innerRadius(this.outerRadius()-val);
};

prim.tube.prototype.render = function () {
    var item = new prim.cylinder().radius(this.outerRadius()).height(this.height()).render();

    var innerRad = this.innerRadius();
    if (this.innerRadius()) {
        var inner = new prim.cylinder().radius(this.innerRadius()).height(this.height());
        item = item.subtract(inner.render());
    }

    return this.postRender(item);
};

prim.tube.prototype.renderInside = function () {
    var effectiveRadius = this.innerRadius() || this.radius();

    var renderedItem = new prim.cylinder().radius(effectiveRadius).height(this.height()).render();

    return this.postRender(renderedItem);
};