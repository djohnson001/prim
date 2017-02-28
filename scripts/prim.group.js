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
