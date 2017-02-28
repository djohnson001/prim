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
