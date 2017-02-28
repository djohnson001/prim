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
