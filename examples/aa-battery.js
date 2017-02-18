include('https://raw.githubusercontent.com/djohnson001/prim/master/combined/prim.js');

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