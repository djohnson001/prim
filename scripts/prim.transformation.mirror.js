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