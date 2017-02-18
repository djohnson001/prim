prim.group = function(opts) {    
    prim.primitive.call(this, opts);
    this.internal = {};
    this.internal.group = {};
    this.internal.group.items = [];
    this.internal.group.stackDirection = 1;

    if (opts !== undefined && opts !== null && opts.constructor === Array) {
        this.internal.group.items = opts;
    }
};

prim.group.prototype = Object.create(prim.primitive.prototype);

prim.group.prototype.append = function (item) {
    this.internal.group.items.push(item);
    return this;
};

prim.group.prototype.preRender = function () {
    var result = null;

    for (var index = 0; index < this.internal.group.items.length; index++) {
        var item = this.internal.group.items[index];
        var renderedItem = item.render ? item.render() : item;

        result = index === 0
            ? renderedItem
            : result.union(renderedItem);
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
