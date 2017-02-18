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