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