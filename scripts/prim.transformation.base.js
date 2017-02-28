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