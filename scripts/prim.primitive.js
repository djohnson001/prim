var prim = {};

prim.primitive = function (opts) {
    this.internal = {};
    this.internal.primitive = {};
    this.internal.primitive.size = [1, 1, 1];
    this.internal.primitive.color = null;
    this.internal.primitive.transformationStack = [];

    return this;
}

prim.primitive.prototype.getType = function () {
    return "prim.primitive";
};

prim.primitive.prototype.clone = function (ctor) {
    if (!this.internal.primitive) { this.internal.primitive = {}; }

    var result = ctor ? new ctor() : new this.constructor();
    if (this.size) { result.size(this.size().slice(0)); }
    
    result.color(this.color());
    result.internal.primitive.size = this.internal.primitive.size.slice(0);
    result.internal.primitive.color = this.internal.primitive.color;
    
    for (var index = 0; this.internal.primitive.transformationStack && index < this.internal.primitive.transformationStack.length; index++) {
        var clonedTransformation = this.internal.primitive.transformationStack[index].clone();
        console.log(clonedTransformation.apply);
        result.transform(clonedTransformation);
    }

    return result;
};

prim.primitive.prototype.preRender = function () {
    return cube({size: this.size(), center: this.center()});
};

prim.primitive.prototype.render = function () {
    return this.postRender(this.preRender());
};

prim.primitive.prototype.postRender = function (item) {
    var result = item;

    if (this.internal.primitive && this.internal.primitive.transformationStack) {
        for(var index = 0; index < this.internal.primitive.transformationStack.length; index++) {       
            var transformation = this.internal.primitive.transformationStack[index];
            var result = transformation.apply(result);
        }
    }

    if (item.color !== undefined && item.color !== null) {
        var color = item.color();    
        if (color !== undefined && color !== null) {
            result = result.setColor(color);
        }
    }

    return result;
}

prim.primitive.prototype.color = function (val) {
    if (val === undefined || val === null) {
        return this.internal.primitive.color;
    }

    this.internal.primitive.color = val;

    return this;
}

prim.primitive.prototype.sizeAxis = function(axis, val) {
    if (axis === undefined || axis === null) { 
        return this.internal.primitive.size;
    }

    if (val === undefined || val === null) {
        return this.internal.primitive.size[axis];
    }

    this.internal.primitive.size[axis] = val;

    return this;
};

prim.primitive.prototype.sizeX = function (val) { return this.sizeAxis(0, val); };
prim.primitive.prototype.sizeY = function (val) { return this.sizeAxis(1, val); };
prim.primitive.prototype.sizeZ = function (val) { return this.sizeAxis(2, val); };
prim.primitive.prototype.width = function (val) { return this.sizeX(val); }
prim.primitive.prototype.breadth = function (val) { return this.sizeY(val); }
prim.primitive.prototype.height = function (val) { return this.sizeZ(val); }

prim.primitive.prototype.size = function (val) {
    if (val === undefined || val === null) {
        if (!this.internal.primitive) { this.internal.primitive = {}; }
        if (this.internal.primitive.size === undefined || this.internal.primitive.size === null) {
            this.internal.primitive.size = [1,1,1];
        }

        return this.internal.primitive.size;
    }

    if (!isNaN(val)) {
       return this.sizeX(val);
    }

    if (val.constructor == Array) {
        if(val.length >= 1) { this.sizeX(val[0]); }
        if(val.length >= 2) { this.sizeY(val[1]); }
        if(val.length >= 3) { this.sizeZ(val[2]); }
    }

    return this;
};

prim.primitive.prototype.translate = function (val) {    
    return this.transform(new prim.transformation.translate(val));
};

prim.primitive.prototype.rotate = function (val) {
    return this.transform(new prim.transformation.rotate(val));
};

prim.primitive.prototype.rotateX = function (val) {
    return this.transform(new prim.transformation.rotate([val, 0, 0]));
};

prim.primitive.prototype.rotateY = function (val) {
    return this.transform(new prim.transformation.rotate([0, val, 0]));
};

prim.primitive.prototype.rotateZ = function (val) {
    return this.transform(new prim.transformation.rotate([0, 0, val]));
};

prim.primitive.prototype.mirror = function (axis) {
    return this.transform(new prim.transformation.mirror(axis));
}

prim.primitive.prototype.mirrorDup = function (axis) {
    var result = new prim.group()
        .append(this.clone())
        .append(this.clone().mirror(axis));

    return result;
};

prim.primitive.prototype.mirrorX = function () {
    return this.mirror([1, 0, 0]);
}

prim.primitive.prototype.mirrorDupX = function () {
    return this.mirrorDup([1, 0, 0]);
}

prim.primitive.prototype.mirrorY = function () {
    return this.mirror([0, 1, 0]);
}

prim.primitive.prototype.mirrorDupY = function () {
    return this.mirrorDup([0, 1, 0]);
}

prim.primitive.prototype.mirrorZ = function () {
    return this.mirror([0, 0, 1]);
}

prim.primitive.prototype.mirrorDupZ = function () {
    return this.mirrorDup([0, 0, 1]);
}

prim.primitive.prototype.transform = function (val) {
    if (val === undefined || val === null) { return this; }

    if (this.internal.primitive === undefined || this.internal.primitive === null) { this.internal.primitive = {}; }

    if (this.internal.primitive.transformationStack === undefined || this.internal.primitive.transformationStack === null) {
        this.internal.primitive.transformationStack = [];
    }

    this.internal.primitive.transformationStack.push(val);
    return this;
}

prim.primitive.prototype.center = function (val) {
    if (val === undefined || val === null) {
        if (this._center === undefined || this._center === null) {
            return true;
        };

        return this._center;
    }

    this._center = val;

    return this;
};

prim.primitive.prototype.union = function (model) {
    return new prim.group().append(this).append(model);
};

prim.primitive.prototype.subtract = function (model) {
    return new prim.group().append(this).subtract(model);
};

prim.primitive.prototype.log = function () {
    console.log(JSON.stringify(this));
};

