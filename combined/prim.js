// Mon Feb 27 2017 20:16:47 GMT-0500 (Eastern Standard Time)


// BEGIN prim.units.js

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


// END prim.units.js


// BEGIN prim.primitive.js
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


// END prim.primitive.js


// BEGIN prim.vector.js
prim.vector = function (opts) {
    this.internal = {};
    this.internal.v = [];

    if (opts === undefined || opts === null) {
    }
    else if (!isNaN(opts)) {
        this.internal.v = [];
        for(var index = 0; index < opts; index++) {
            this.internal.v.push(0);
        }
    }
    else if (typeof(opts) === "object") {
        if (opts.type !== undefined && opts.type !== null && opts.type() === "vector") {
            this.internal.v = opts.render();
        }
    }
};

prim.vector.prototype.index = function (i, val) {
    if (val === undefined || val === null) {
        return this.internal.v.length > i ? this.internal.v[i] : 0;
    }

    while (this.internal.v.length < i){
        this.internal.v.push(0);
    }

    this.internal.v[i] = val;

    return this;
};

prim.vector.prototype.x = function (val) {
    return this.index(0, val);
};

prim.vector.prototype.y = function (val) {
    return this.index(1, val);
};

prim.vector.prototype.z = function (val) {
    return this.index(2, val);
};

prim.vector.prototype.add = function (val) {
    if (val !== undefined && val !== null) {
        if (!isNaN(val)) {
            for (var index = 0; index < this.internal.v.length; index++) {
                this.internal.v[index] += val;
            }
        } else if (typeof(val) === "object") {
            var ar = (val.type !== undefined && val.type !== null && val.type() === "vector")
                ? val.render()
                : val;

            for (var index = 0; index < val.length ; index++) {
                if (index >= this.internal.v.length) {
                    this.internal.v.push(val[index]);
                } else {
                    this.internal.v[index] += val[index];
                }
            }
        }
    }

    return this;
};

prim.vector.prototype.type = function () {
    return "vector";
};

prim.vector.prototype.clone = function () {
    return new prim.vector(this);
};

prim.vector.prototype.render = function () {
    var v = [];
    for(var index = 0; index < this.internal.v.length; index++){
        v.push(this.internal.v[index]);
    }

    return v;
};

// END prim.vector.js


// BEGIN prim.transformation.base.js
prim.transformation = {};

prim.transformation.base = function (opts) {
    this.internal = {};
    this.internal.transformation = {};
    this.internal.transformation.matrix = [0, 0, 0];
    this.internal.transformation.type = "base";

    if (opts !== undefined && opts !== null) {
        this.matrix(opts);
    }

    return this;
};

prim.transformation.base.prototype.matrix = function (val) {
    if (val === undefined || val === null) { return this.internal.transformation.matrix; }

    this.internal.transformation.matrix = [0, 0, 0];

    if (!isNaN(val)) {
        this.internal.transformation.matrix = [val, 0, 0];
        return this;
    }

    if (val.constructor === Array){
        for(var index = 0; index < val.length; index++){
            this.internal.transformation.matrix[index] = val[index];
        }
    }

    this.internal.transformation.matrix = val;

    return this;   
}

prim.transformation.base.prototype.apply = function (val) {
    return val;
};

prim.transformation.base.prototype.clone = function () {
    return new this.constructor().matrix(this.matrix());
};

prim.transformation.base.prototype.type = function () {
    return this.internal.transformation.type;
};
// END prim.transformation.base.js


// BEGIN prim.transformation.translate.js
prim.transformation.translate = function (opts) {
    prim.transformation.base.call(this, opts);
    this.internal = new prim.transformation.base(opts).internal;
    this.internal.transformation.type = "translate";
};

prim.transformation.translate.prototype = Object.create(prim.transformation.base.prototype);

prim.transformation.translate.prototype.apply = function (item) {
    var matrix = this.matrix();
    return item.translate(matrix);
}

prim.transformation.translate.prototype.clone = function () {
    return new prim.transformation.translate().matrix(this.matrix());
};

// END prim.transformation.translate.js


// BEGIN prim.transformation.rotate.js
prim.transformation.rotate = function (opts) {
    prim.transformation.base.call(this, opts);    
    this.internal = new prim.transformation.base(opts).internal;
    this.internal.transformation.type = "rotate";
};

prim.transformation.rotate.prototype = Object.create(prim.transformation.base.prototype);

prim.transformation.rotate.prototype.apply = function (item) {
    var matrix = this.matrix();
    return item.rotateX(matrix[0]).rotateY(matrix[1]).rotateZ(matrix[2]);
};

prim.transformation.rotate.prototype.clone = function () {
    return new prim.transformation.rotate().matrix(this.matrix());
};
// END prim.transformation.rotate.js


// BEGIN prim.transformation.mirror.js
prim.transformation.mirror = function (opts) {
    prim.transformation.base.call(this, opts);    
    this.internal = new prim.transformation.base(opts).internal;
    this.internal.transformation.type = "mirror";
};

prim.transformation.mirror.prototype = Object.create(prim.transformation.base.prototype);

prim.transformation.mirror.prototype.apply = function (item) {
    var dict = ["mirroredX", "mirroredY", "mirroredZ"];
    var matrix = this.matrix();
    
    var transformationStack = this.internal;
    
    console.log(JSON.stringify(item));
    /*
    for(var index = 0; index < item.internal.primitive.transformationStack; index++) {
        var transformation = item.internal.primitive.transformationStack[index];
        if (transformation.type() === "translate") {
            var translationMatrix = transformation.matrix();
                for (var index = 0; index < matrix.length; index++) {
                    if (matrix[index] == 1) {
                        translationMatrix[index] = -translationMatrix[index];
                    }
                }
            
            transformation.matrix(translationMatrix);
            
        }
    }*/

    for (var index = 0; index < matrix.length; index++) {
        if (matrix[index] == 1) {
            return item[dict[index]]();
        }
    }    

    return item;
};

prim.transformation.mirror.prototype.clone = function () {
    return new prim.transformation.mirror().matrix(this.matrix());
};
// END prim.transformation.mirror.js


// BEGIN prim.cube.js
prim.cube = function(opts) {
    prim.primitive.call(this, opts);
};

prim.cube.prototype = Object.create(prim.primitive.prototype);

// END prim.cube.js


// BEGIN prim.cylinder.js
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
    dest.internal.cylinder.radius2 = this.internal.cylinder.radius2;
    dest.internal.cylinder.fn = this.internal.cylinder.fn;

    return dest;
};


// END prim.cylinder.js


// BEGIN prim.semi-cylinder.js

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
// END prim.semi-cylinder.js


// BEGIN prim.poly.js
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
// END prim.poly.js


// BEGIN prim.hex.js
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
// END prim.hex.js


// BEGIN prim.tube.js
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
// END prim.tube.js


// BEGIN prim.cup.js
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
// END prim.cup.js


// BEGIN prim.util.js

prim.util = {};
prim.util.mirrorCopyX = function(item) {
    return item.union(item.mirroredX());
};

prim.util.unionAll = function (items) {
    var result = null;

    for (var index = 0; index < items.length; index++) {
        var item = items[index];
        var renderedItem = item.render ? item.render() : item;            

        result = index === 0
            ? renderedItem
            : result.union(renderedItem);
    }

    return result;
};
// END prim.util.js


// BEGIN prim.group.js
prim.group = function(opts) {    
    prim.primitive.call(this, opts);
    this.internal = {};
    this.internal.group = {};
    this.internal.group.items = [];
    this.internal.group.stackDirection = 1;
    this.internal.group.negatives = [];

    if (opts !== undefined && opts !== null && opts.constructor === Array) {
        this.internal.group.items = opts;
    }
};

prim.group.prototype = Object.create(prim.primitive.prototype);

prim.group.prototype.append = function (item) {
    var itemContainer = {
        model: item,
        isNegative: false
    };

    this.internal.group.items.push(itemContainer);
    
    return this;
};

prim.group.prototype.union = prim.group.prototype.append;

prim.group.prototype.subtract = function (item) {
    var itemContainer = {
        model: item,
        isNegative: true
    };

    this.internal.group.items.push(itemContainer);

    return this;
};

prim.group.prototype.preRender = function () {
    var result = null;

    for (var index = 0; index < this.internal.group.items.length; index++) {
        // var item = this.internal.group.items[index];
        var container = this.internal.group.items[index];
        var item = container.model;

        var renderedItem = item.render ? item.render() : item;

        result = index === 0
            ? renderedItem
            : (container.isNegative ? result.subtract(renderedItem) : result.union(renderedItem));
    }

    return result;
};

prim.group.prototype.clone = function () {
    var result = new prim.group();
    
    for (var index = 0; index < this.internal.group.items.length; index++) {
        var item = this.internal.group.items[index];
        var clonedItem = item.clone();
        result.append(clonedItem);
    }

    return result;
};

// END prim.group.js


// BEGIN prim.stack.js
prim.stack = function(opts) {
    prim.primitive.call(this, opts);

    this.internal.stack = {};
    this.internal.stack.items = [];
    this.internal.stack.stackDirection = 2;
};

prim.stack.prototype = Object.create(prim.primitive.prototype);

prim.stack.prototype.append = function (item) {
    this.internal.stack.items.push(item);
    return this;
};

prim.stack.prototype.direction = function (val) {
    if (val === undefined || val === null) {
        return this.internal.stack.stackDirection;
    }

    this.internal.stack.stackDirection = val;
    return this;
};

prim.stack.prototype.width = function () {
    var maxWidth = 0;

    for (var index = 0; index < this.internal.stack.items.length; index++) {
        var item = this.internal.stack.items[index];
        var width = item.width();
        if (width !== undefined && width !== null && width > maxWidth) {
            maxWidth = width;
        }
    }

    return maxWidth;
};

prim.stack.prototype.breadth = function () {
    var maxBreadth = 0;

    for (var index = 0; index < this.internal.stack.items.length; index++) {
        var item = this.internal.stack.items[index];
        var breadth = item.breadth();
        if (breadth !== undefined && breadth !== null && breadth > maxBreadth) {
            maxBreadth = breadth;
        }
    }

    return maxBreadth;
};

prim.stack.prototype.height = function () {
    var totalHeight = 0;

    for (var index = 0; index < this.internal.stack.items.length; index++) {
        var item = this.internal.stack.items[index];
        totalHeight += item.height();
    }

    return totalHeight;
};

prim.stack.prototype.preRender = function () {
    var result = null;

    var dir = this.direction();
    var items = this.internal.stack.items;

    var cursor = [0, 0, 0];
    cursor[dir] -= items[0].size()[dir]/2;

    for (var index = 0; index < items.length; index++) {
        var item = items[index];
        var itemSize = item.size();

        var translation = [cursor[0], cursor[1], cursor[2]];
        translation[dir] += itemSize[dir]/2;

        var renderedItem = item.render().translate(translation);

        result = index == 0 ? renderedItem : result.union(renderedItem);

        cursor[dir] += itemSize[dir];
    }

    var dist = [0, 0, 0];
    dist[dir] -= cursor[dir]/2;
    dist[dir] += items[0].size()[dir]/2;

    result = result.translate(dist);

    return result;
};
// END prim.stack.js
