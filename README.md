# prim
Primitive Library for OpenJSCad - Clone, group, and stack shapes.
Creator: Doug Johnson
License: GPL - https://www.gnu.org/licenses/gpl-3.0.en.html

I am not affliated with OpenJSCad.

Try it out at http://openjscad.org

Scripts should be combined into a single javascript file.
Then in the OpenJSCad script, add an include statement at the top.

```javascript
// This script renders a AA Battery.
include('prim.js');

var battery = function () {
    var cathodeHeight = (1.2).mm();
    var cathodeRadius = (2.5).mm();

    var anodeRadius = (3.5).mm();
    var anodeHeight = (0.4).mm();

    var batteryHeight = (50).mm(); // end of cathode to end of anode
    var batteryBodyHeight = batteryHeight - cathodeHeight - anodeHeight;    
    var batteryRadius = (7.05).mm();
    
    var batteryBody = new prim.cylinder().radius(batteryRadius).height(batteryBodyHeight).color([0.8, 0.8, 1]);
    var cathode = new prim.cylinder().radius(cathodeRadius).height(cathodeHeight).color([1, 0, 0]);
    var anode = new prim.cylinder().radius(anodeRadius).height(anodeHeight).color([0.7, 0.7, 0.7]);

    var model = new prim.stack()
        .append(anode)
        .append(batteryBody)
        .append(cathode);
        
    return model;
}

var main = function () {
    return new battery().rotateX(90).render();
};
```

Combine scripts in this order.
```javascript
[
    "prim.units",
    "prim.primitive",
    "prim.transformation.base",        
    "prim.transformation.translate",
    "prim.transformation.rotate",
    "prim.transformation.mirror",
    "prim.cube",
    "prim.cylinder",
    "prim.semi-cylinder",
    "prim.poly",
    "prim.hex",
    "prim.tube",
    "prim.cup",
    "prim.util",
    "prim.group",
    "prim.stack"
    ]
```    

TODO: Add a grunt script so that this can be done on the fly.
TODO: Add minification
