
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