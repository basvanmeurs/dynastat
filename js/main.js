var initScene = function (scene) {
    var obj;

    obj = new SolidObject();
    obj.init(
        scene,
        200,
        5000,
        new Vector(10, 50),
        [new Vector(-5, -6), new Vector(-5, 8), new Vector(5, 8), new Vector(5, -6)]
    );
    obj.rotationSpeed = 1 * Math.PI;
    scene.addObject(obj);

    var parent = obj;
    obj = new SolidObject();
    obj.initChild(
        scene,
        5,
        10000,
        parent,
        new Vector(-5, -5),
        null,
        [new Vector(-1, -2), new Vector(-1, 2), new Vector(1, 2), new Vector(1, -2)],
        true
    );
    scene.addObject(obj);

    obj = new SolidObject();
    obj.initChild(
        scene,
        5,
        10000,
        parent,
        new Vector(5, -5),
        new Vector(0, 0),
        [new Vector(-1, -2), new Vector(-1, 2), new Vector(1, 2), new Vector(1, -2)],
        true
    );
    scene.addObject(obj);
/*
    obj = new SolidObject();
    obj.initChild(
        scene,
        5,
        100,
        parent,
        new Vector(0, -5),
        new Vector(0, 4),
        [new Vector(-3, -5), new Vector(-1, 5), new Vector(1, 5), new Vector(3, -5)],
        false
    );
    scene.addObject(obj);

    var parent = obj;
    obj = new SolidObject();
    obj.initChild(
        scene,
        5,
        100,
        parent,
        new Vector(0, -4),
        new Vector(0, 4),
        [new Vector(-3, -5), new Vector(-1, 5), new Vector(1, 5), new Vector(3, -5)],
        false
    );
    obj.rotationSpeed = .1;
    scene.addObject(obj);
*/
/*
    var parent = obj;
    obj = new SolidObject();
    obj.initChild(
        scene,
        5,
        100,
        parent,
        new Vector(0, -4),
        new Vector(0, 4),
        [new Vector(-3, -5), new Vector(-1, 5), new Vector(1, 5), new Vector(3, -5)],
        false
    );
    scene.addObject(obj);
*/
    obj = new SolidObject();
    obj.init(
        scene,
        100,
        null,
        new Vector(0, 10),
        [new Vector(-10, 10), new Vector(10, 10), new Vector(10, -10), new Vector(-10, -10)]
    );
    obj.speed.x = 1;
    scene.addObject(obj);
/*
    obj = new SolidObject();
    obj.init(
        scene,
        100,
        10000,
        new Vector(-15, 30),
        [new Vector(-4, 5), new Vector(0, -4.5), new Vector(4, 5), new Vector(7, -5), new Vector(-7, -5)]
    );
    obj.rotationSpeed = 0;
    obj.speed.x = 0;
    scene.addObject(obj);
*/
/*
    for (var i = 0; i < 5; i++) {
        obj = new SolidObject();
        obj.init(
            scene,
            100,
            100,
            new Vector(29, 30),
            [new Vector(-7, 5), new Vector(7, 5), new Vector(7, -5), new Vector(-7, -5)]
        );
        obj.rotationSpeed = 1.125 * Math.PI;
        obj.position.x += Math.random() * 100 - 50;
        obj.position.y += Math.random() * 100 - 50;
        obj.speed.x = 0 + Math.random() * 40 - 20;
        obj.speed.y = 0 + Math.random() * 40 - 20;
        scene.addObject(obj);
    }*/
/*
    obj = new SolidObject();
    obj.init(
        scene,
        100,
        10000,
        new Vector(45, 30),
        [new Vector(-7, 5), new Vector(0, 8), new Vector(7, 5), new Vector(7, -5), new Vector(0, -8), new Vector(-7, -5)]
    );
    obj.rotationSpeed = 1.125 * Math.PI;
    obj.speed.x = 1;
    scene.addObject(obj);

    obj = new SolidObject();
    obj.init(
        scene,
        1e4,
        1e5,
        new Vector(-45, 12),
        [new Vector(-17, 1), new Vector(0, 3), new Vector(17, 1), new Vector(17, -1), new Vector(0, -3), new Vector(-17, -1)]
    );
    obj.rotationSpeed = 4 * Math.PI;
    scene.addObject(obj);

    obj = new SolidObject();
    obj.init(
        scene,
        1e4,
        1e5,
        new Vector(45, 12),
        [new Vector(-17, 1), new Vector(0, 3), new Vector(17, 1), new Vector(17, -1), new Vector(0, -3), new Vector(-17, -1)]
    );
    obj.rotationSpeed = -4 * Math.PI;
    scene.addObject(obj);
*/
    obj = new SolidObject();
    obj.init(
        scene,
        1e20,
        null,
        new Vector(0, -20),
        [new Vector(-150, 100), new Vector(-1, 100), new Vector(-1, 96), new Vector(-148, 96), new Vector(-148, 1), new Vector(148, 1), new Vector(148, 96), new Vector(1, 96), new Vector(1, 100), new Vector(150, 100), new Vector(150, -5), new Vector(-150, -5)]
    );
    obj.rotationSpeed = 0;
    obj.speed.x = 0;
    obj.speed.y = 0;
    scene.addObject(obj);
};

var keys = {};
var keyTimeout = function () {
    if (keys['37']) {
        scene.objects[0].applyImpulse(new Vector(0, -5), new Vector(1, 0), 450);
        scene.objects[0].applyImpulse(new Vector(0, 0), new Vector(1, 0), -450);
    }
    if (keys['38']) {
        scene.objects[0].applyImpulse(new Vector(0, -5), new Vector(0, 1), 450);
    }
    if (keys['39']) {
        scene.objects[0].applyImpulse(new Vector(0, -5), new Vector(1, 0), -450);
        scene.objects[0].applyImpulse(new Vector(0, 0), new Vector(1, 0), 450);
    }
    if (keys['40']) {
        scene.objects[0].applyImpulse(new Vector(0, -5), new Vector(0, 1), -400);
    }
    if (keys['90']) {
//        scene.objects[0].applyImpulse(new Vector(0, 0), new Vector(1, 0), -300);
        scene.objects[1].addFixedChildRotationSpeed(.1, false);
        scene.objects[2].addFixedChildRotationSpeed(.1, false);
    }
    if (keys['88']) {
//        scene.objects[0].applyImpulse(new Vector(0, 0), new Vector(1, 0), 300);
        scene.objects[1].addFixedChildRotationSpeed(-.1, false);
        scene.objects[2].addFixedChildRotationSpeed(-.1, false);
    }
    if (keys['32']) {
        logSituation();
    }

/*    var brake = -0.05 * scene.objects[1].rotationSpeed;
    scene.objects[1].addFixedChildRotationSpeed(brake, false);

    brake = -0.05 * scene.objects[2].rotationSpeed;
    scene.objects[2].addFixedChildRotationSpeed(brake, false);
*/

    setTimeout(keyTimeout, 20);
};

var logSituation = function () {
    console.log('frame: ' + scene.frame);
    console.log(JSON.stringify(scene.export()));
};
window.logSituation = logSituation;

$(document).keydown(function (e) {
    if (keys['32']) {
        logSituation();
    }
    keys['' + e.keyCode] = true;
});

$(document).keyup(function (e) {
    keys['' + e.keyCode] = false;
});

$(document).ready(function () {
    var scene = new Scene();
    window.scene = scene;

    /*
     frame: 1231
     {"objects":[{"mass":200,"inertia":5000,"position":{"x":-50.640910942486755,"y":-11.71265433166115},"speed":{"x":-8.681294531270446,"y":-3.5209831036976693},"rotation":0.004895343056127464,"rotationSpeed":-0.005178446564611304,"cornerPointCoordinates":[{"x":-5,"y":-6},{"x":-5,"y":8},{"x":5,"y":8},{"x":5,"y":-6}],"parent":null,"fixed":false,"parentMountPoint":null,"childMountPoint":null,"addedSpeed":{"x":0,"y":-1.1799999999999748},"addedRotationSpeed":0},{"mass":5,"inertia":10000,"position":{"x":-55.61637441412812,"y":-16.73707103834089},"speed":null,"rotation":34.40799999999875,"rotationSpeed":6.299999999999994,"cornerPointCoordinates":[{"x":-1,"y":-2},{"x":-1,"y":2},{"x":1,"y":2},{"x":1,"y":-2}],"parent":0,"fixed":true,"parentMountPoint":{"x":-5,"y":-5},"childMountPoint":{"x":0,"y":0},"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0},{"mass":5,"inertia":10000,"position":{"x":-45.61649423580702,"y":-16.688117803302514},"speed":null,"rotation":34.40799999999876,"rotationSpeed":6.299999999999994,"cornerPointCoordinates":[{"x":-1,"y":-2},{"x":-1,"y":2},{"x":1,"y":2},{"x":1,"y":-2}],"parent":0,"fixed":true,"parentMountPoint":{"x":5,"y":-5},"childMountPoint":{"x":0,"y":0},"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0},{"mass":100,"inertia":46666.666666666664,"position":{"x":-126.11053084650626,"y":0.25402250771336654},"speed":{"x":7.021009809193126,"y":-8.968630612226862},"rotation":10.008946373922827,"rotationSpeed":0.30151960635689984,"cornerPointCoordinates":[{"x":-10,"y":10},{"x":10,"y":10},{"x":10,"y":-10},{"x":-10,"y":-10}],"parent":null,"fixed":false,"parentMountPoint":null,"childMountPoint":null,"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0},{"mass":100000000000000000000,"inertia":3.5187500000000005e+24,"position":{"x":9.959221839885716e-17,"y":-20},"speed":{"x":-2.9596705230403347e-18,"y":-2.884669912165557e-15},"rotation":-2.0853275568073433e-18,"rotationSpeed":6.005851458143706e-19,"cornerPointCoordinates":[{"x":-150,"y":100},{"x":-1,"y":100},{"x":-1,"y":96},{"x":-148,"y":96},{"x":-148,"y":1},{"x":148,"y":1},{"x":148,"y":96},{"x":1,"y":96},{"x":1,"y":100},{"x":150,"y":100},{"x":150,"y":-5},{"x":-150,"y":-5}],"parent":null,"fixed":false,"parentMountPoint":null,"childMountPoint":null,"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0}],"cps":[{"e":[4,4],"p":[1,1]},{"e":[4,4],"p":[2,1]}],"speedAdjuster":{"lastCollisionsTimes":{"3-0_0-1":0.6600000000000004,"0-0_3-1":0.7700000000000005,"3-1_1-1":0.8800000000000006,"4-4_3-2":0.9800000000000006,"4-4_3-3":1.0700000000000007,"4-4_2-3":11.259999999999804,"4-4_0-2":1.184531250000001,"4-4_2-2":10.99999999999981,"4-4_1-0":11.4999999999998,"4-4_2-0":11.4999999999998,"4-4_2-1":11.699999999999795,"4-4_1-1":11.699999999999795,"4-4_1-2":10.99999999999981,"4-4_1-3":11.259999999999804,"4-2_3-1":5.989999999999917,"4-3_3-2":10.229999999999826,"4-4_0-0":11.4999999999998},"lastLookAheadCps":{}}}
     frame: 1232
     {"objects":[{"mass":200,"inertia":5000,"position":{"x":-50.728317491884894,"y":-11.756348471472945},"speed":{"x":-8.740654939814284,"y":-4.369413981179537},"rotation":0.004843771829807184,"rotationSpeed":-0.005157122632028041,"cornerPointCoordinates":[{"x":-5,"y":-6},{"x":-5,"y":8},{"x":5,"y":8},{"x":5,"y":-6}],"parent":null,"fixed":false,"parentMountPoint":null,"childMountPoint":null,"addedSpeed":{"x":0,"y":-1.1799999999999748},"addedRotationSpeed":0},{"mass":5,"inertia":10000,"position":{"x":-55.7040400722409,"y":-16.780508580718607},"speed":null,"rotation":34.470999999998746,"rotationSpeed":6.299999999999994,"cornerPointCoordinates":[{"x":-1,"y":-2},{"x":-1,"y":2},{"x":1,"y":2},{"x":1,"y":-2}],"parent":0,"fixed":true,"parentMountPoint":{"x":-5,"y":-5},"childMountPoint":{"x":0,"y":0},"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0},{"mass":5,"inertia":10000,"position":{"x":-45.70415738263923,"y":-16.73207105182895},"speed":null,"rotation":34.47099999999875,"rotationSpeed":6.299999999999994,"cornerPointCoordinates":[{"x":-1,"y":-2},{"x":-1,"y":2},{"x":1,"y":2},{"x":1,"y":-2}],"parent":0,"fixed":true,"parentMountPoint":{"x":5,"y":-5},"childMountPoint":{"x":0,"y":0},"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0},{"mass":100,"inertia":46666.666666666664,"position":{"x":-126.04032074841433,"y":0.16433620159109985},"speed":{"x":7.021009809193126,"y":-8.968630612226862},"rotation":10.011961569986395,"rotationSpeed":0.30151960635689984,"cornerPointCoordinates":[{"x":-10,"y":10},{"x":10,"y":10},{"x":10,"y":-10},{"x":-10,"y":-10}],"parent":null,"fixed":false,"parentMountPoint":null,"childMountPoint":null,"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0},{"mass":100000000000000000000,"inertia":3.5187500000000005e+24,"position":{"x":9.956380890179763e-17,"y":-20},"speed":{"x":-2.840949705952657e-18,"y":-2.8853662073228448e-15},"rotation":-2.079311964368907e-18,"rotationSpeed":6.015592438436153e-19,"cornerPointCoordinates":[{"x":-150,"y":100},{"x":-1,"y":100},{"x":-1,"y":96},{"x":-148,"y":96},{"x":-148,"y":1},{"x":148,"y":1},{"x":148,"y":96},{"x":1,"y":96},{"x":1,"y":100},{"x":150,"y":100},{"x":150,"y":-5},{"x":-150,"y":-5}],"parent":null,"fixed":false,"parentMountPoint":null,"childMountPoint":null,"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0}],"cps":[{"e":[4,4],"p":[1,1]},{"e":[4,4],"p":[2,1]}],"speedAdjuster":{"lastCollisionsTimes":{"3-0_0-1":0.6600000000000004,"0-0_3-1":0.7700000000000005,"3-1_1-1":0.8800000000000006,"4-4_3-2":0.9800000000000006,"4-4_3-3":1.0700000000000007,"4-4_2-3":11.259999999999804,"4-4_0-2":1.184531250000001,"4-4_2-2":10.99999999999981,"4-4_1-0":11.4999999999998,"4-4_2-0":11.4999999999998,"4-4_2-1":11.709999999999795,"4-4_1-1":11.709999999999795,"4-4_1-2":10.99999999999981,"4-4_1-3":11.259999999999804,"4-2_3-1":5.989999999999917,"4-3_3-2":10.229999999999826,"4-4_0-0":11.4999999999998},"lastLookAheadCps":{}}}
     frame: 1233
     {"objects":[{"mass":200,"inertia":5000,"position":{"x":-50.81635064352846,"y":-11.808348027185659},"speed":{"x":-8.803315164356336,"y":-5.199955571271385},"rotation":0.004792051711464045,"rotationSpeed":-0.005172011834314051,"cornerPointCoordinates":[{"x":-5,"y":-6},{"x":-5,"y":8},{"x":5,"y":8},{"x":5,"y":-6}],"parent":null,"fixed":false,"parentMountPoint":null,"childMountPoint":null,"addedSpeed":{"x":0,"y":-1.1799999999999748},"addedRotationSpeed":0},{"mass":5,"inertia":10000,"position":{"x":-55.79233306738482,"y":-16.832250784750997},"speed":null,"rotation":34.53399999999874,"rotationSpeed":6.299999999999994,"cornerPointCoordinates":[{"x":-1,"y":-2},{"x":-1,"y":2},{"x":1,"y":2},{"x":1,"y":-2}],"parent":0,"fixed":true,"parentMountPoint":{"x":-5,"y":-5},"childMountPoint":{"x":0,"y":0},"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0},{"mass":5,"inertia":10000,"position":{"x":-45.79244788596312,"y":-16.784330451042017},"speed":null,"rotation":34.53399999999875,"rotationSpeed":6.299999999999994,"cornerPointCoordinates":[{"x":-1,"y":-2},{"x":-1,"y":2},{"x":1,"y":2},{"x":1,"y":-2}],"parent":0,"fixed":true,"parentMountPoint":{"x":5,"y":-5},"childMountPoint":{"x":0,"y":0},"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0},{"mass":100,"inertia":46666.666666666664,"position":{"x":-125.9701106503224,"y":0.07464989546883315},"speed":{"x":7.021009809193126,"y":-8.968630612226862},"rotation":10.014976766049964,"rotationSpeed":0.30151960635689984,"cornerPointCoordinates":[{"x":-10,"y":10},{"x":10,"y":10},{"x":10,"y":-10},{"x":-10,"y":-10}],"parent":null,"fixed":false,"parentMountPoint":null,"childMountPoint":null,"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0},{"mass":100000000000000000000,"inertia":3.5187500000000005e+24,"position":{"x":9.953665260922894e-17,"y":-20},"speed":{"x":-2.7156292568685533e-18,"y":-2.8861000699836517e-15},"rotation":-2.073286085532062e-18,"rotationSpeed":6.025878836845055e-19,"cornerPointCoordinates":[{"x":-150,"y":100},{"x":-1,"y":100},{"x":-1,"y":96},{"x":-148,"y":96},{"x":-148,"y":1},{"x":148,"y":1},{"x":148,"y":96},{"x":1,"y":96},{"x":1,"y":100},{"x":150,"y":100},{"x":150,"y":-5},{"x":-150,"y":-5}],"parent":null,"fixed":false,"parentMountPoint":null,"childMountPoint":null,"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0}],"cps":[{"e":[4,4],"p":[1,1]},{"e":[4,4],"p":[2,1]}],"speedAdjuster":{"lastCollisionsTimes":{"3-0_0-1":0.6600000000000004,"0-0_3-1":0.7700000000000005,"3-1_1-1":0.8800000000000006,"4-4_3-2":0.9800000000000006,"4-4_3-3":1.0700000000000007,"4-4_2-3":11.259999999999804,"4-4_0-2":1.184531250000001,"4-4_2-2":10.99999999999981,"4-4_1-0":11.4999999999998,"4-4_2-0":11.4999999999998,"4-4_2-1":11.719999999999795,"4-4_1-1":11.719999999999795,"4-4_1-2":10.99999999999981,"4-4_1-3":11.259999999999804,"4-2_3-1":5.989999999999917,"4-3_3-2":10.229999999999826,"4-4_0-0":11.4999999999998},"lastLookAheadCps":{}}}
     frame: 1234
     {"objects":[{"mass":200,"inertia":5000,"position":{"x":-50.90504951282451,"y":-11.868441362997066},"speed":{"x":-8.869886929605164,"y":-6.009333581140841},"rotation":0.004739883876091945,"rotationSpeed":-0.005216783537210114,"cornerPointCoordinates":[{"x":-5,"y":-6},{"x":-5,"y":8},{"x":5,"y":8},{"x":5,"y":-6}],"parent":null,"fixed":false,"parentMountPoint":null,"childMountPoint":null,"addedSpeed":{"x":0,"y":-1.1799999999999748},"addedRotationSpeed":0},{"mass":5,"inertia":10000,"position":{"x":-55.88129401604171,"y":-16.892084527494386},"speed":null,"rotation":34.59699999999874,"rotationSpeed":6.299999999999994,"cornerPointCoordinates":[{"x":-1,"y":-2},{"x":-1,"y":2},{"x":1,"y":2},{"x":1,"y":-2}],"parent":0,"fixed":true,"parentMountPoint":{"x":-5,"y":-5},"childMountPoint":{"x":0,"y":0},"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0},{"mass":5,"inertia":10000,"position":{"x":-45.88140634832719,"y":-16.844685866214263},"speed":null,"rotation":34.596999999998744,"rotationSpeed":6.299999999999994,"cornerPointCoordinates":[{"x":-1,"y":-2},{"x":-1,"y":2},{"x":1,"y":2},{"x":1,"y":-2}],"parent":0,"fixed":true,"parentMountPoint":{"x":5,"y":-5},"childMountPoint":{"x":0,"y":0},"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0},{"mass":100,"inertia":46666.666666666664,"position":{"x":-125.89990055223046,"y":-0.015036410653433557},"speed":{"x":7.021009809193126,"y":-8.968630612226862},"rotation":10.017991962113532,"rotationSpeed":0.30151960635689984,"cornerPointCoordinates":[{"x":-10,"y":10},{"x":10,"y":10},{"x":10,"y":-10},{"x":-10,"y":-10}],"parent":null,"fixed":false,"parentMountPoint":null,"childMountPoint":null,"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0},{"mass":100000000000000000000,"inertia":3.5187500000000005e+24,"position":{"x":9.951082775196524e-17,"y":-20},"speed":{"x":-2.5824857263708972e-18,"y":-2.886878376162926e-15},"rotation":-2.067249276037218e-18,"rotationSpeed":6.036809494844314e-19,"cornerPointCoordinates":[{"x":-150,"y":100},{"x":-1,"y":100},{"x":-1,"y":96},{"x":-148,"y":96},{"x":-148,"y":1},{"x":148,"y":1},{"x":148,"y":96},{"x":1,"y":96},{"x":1,"y":100},{"x":150,"y":100},{"x":150,"y":-5},{"x":-150,"y":-5}],"parent":null,"fixed":false,"parentMountPoint":null,"childMountPoint":null,"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0}],"cps":[{"e":[4,4],"p":[1,1]},{"e":[4,4],"p":[2,1]}],"speedAdjuster":{"lastCollisionsTimes":{"3-0_0-1":0.6600000000000004,"0-0_3-1":0.7700000000000005,"3-1_1-1":0.8800000000000006,"4-4_3-2":0.9800000000000006,"4-4_3-3":1.0700000000000007,"4-4_2-3":11.259999999999804,"4-4_0-2":1.184531250000001,"4-4_2-2":10.99999999999981,"4-4_1-0":11.4999999999998,"4-4_2-0":11.4999999999998,"4-4_2-1":11.729999999999794,"4-4_1-1":11.729999999999794,"4-4_1-2":10.99999999999981,"4-4_1-3":11.259999999999804,"4-2_3-1":5.989999999999917,"4-3_3-2":10.229999999999826,"4-4_0-0":11.4999999999998},"lastLookAheadCps":{}}}
     frame: 1235
     {"objects":[{"mass":200,"inertia":5000,"position":{"x":-50.952548418538434,"y":-11.904536406307113},"speed":{"x":-8.940970487326862,"y":-6.794361093654938},"rotation":0.004711803469806664,"rotationSpeed":-0.00528572353605225,"cornerPointCoordinates":[{"x":-5,"y":-6},{"x":-5,"y":8},{"x":5,"y":8},{"x":5,"y":-6}],"parent":null,"fixed":false,"parentMountPoint":null,"childMountPoint":null,"addedSpeed":{"x":0,"y":-0.6268750000000587},"addedRotationSpeed":0},{"mass":5,"inertia":10000,"position":{"x":-55.928933985734794,"y":-16.92803983385643},"speed":null,"rotation":34.63046874999874,"rotationSpeed":6.299999999999994,"cornerPointCoordinates":[{"x":-1,"y":-2},{"x":-1,"y":2},{"x":1,"y":2},{"x":1,"y":-2}],"parent":0,"fixed":true,"parentMountPoint":{"x":-5,"y":-5},"childMountPoint":{"x":0,"y":0},"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0},{"mass":5,"inertia":10000,"position":{"x":-45.92904499098911,"y":-16.880921973503476},"speed":null,"rotation":34.630468749998755,"rotationSpeed":6.299999999999994,"cornerPointCoordinates":[{"x":-1,"y":-2},{"x":-1,"y":2},{"x":1,"y":2},{"x":1,"y":-2}],"parent":0,"fixed":true,"parentMountPoint":{"x":5,"y":-5},"childMountPoint":{"x":0,"y":0},"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0},{"mass":100,"inertia":46666.666666666664,"position":{"x":-125.86260143761912,"y":-0.06268226078089321},"speed":{"x":7.021009809193126,"y":-8.968630612226862},"rotation":10.019593785022304,"rotationSpeed":0.30151960635689984,"cornerPointCoordinates":[{"x":-10,"y":10},{"x":10,"y":10},{"x":10,"y":-10},{"x":-10,"y":-10}],"parent":null,"fixed":false,"parentMountPoint":null,"childMountPoint":null,"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0},{"mass":100000000000000000000,"inertia":3.5187500000000005e+24,"position":{"x":9.949786355934471e-17,"y":-20},"speed":{"x":-2.4403186109275007e-18,"y":-2.8877078183866467e-15},"rotation":-2.0640360203405782e-18,"rotationSpeed":6.048481311322032e-19,"cornerPointCoordinates":[{"x":-150,"y":100},{"x":-1,"y":100},{"x":-1,"y":96},{"x":-148,"y":96},{"x":-148,"y":1},{"x":148,"y":1},{"x":148,"y":96},{"x":1,"y":96},{"x":1,"y":100},{"x":150,"y":100},{"x":150,"y":-5},{"x":-150,"y":-5}],"parent":null,"fixed":false,"parentMountPoint":null,"childMountPoint":null,"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0}],"cps":[{"e":[4,4],"p":[1,1]},{"e":[4,4],"p":[2,1]},{"e":[4,4],"p":[1,2]}],"speedAdjuster":{"lastCollisionsTimes":{"3-0_0-1":0.6600000000000004,"0-0_3-1":0.7700000000000005,"3-1_1-1":0.8800000000000006,"4-4_3-2":0.9800000000000006,"4-4_3-3":1.0700000000000007,"4-4_2-3":11.259999999999804,"4-4_0-2":1.184531250000001,"4-4_2-2":10.99999999999981,"4-4_1-0":11.4999999999998,"4-4_2-0":11.4999999999998,"4-4_2-1":11.739999999999794,"4-4_1-1":11.739999999999794,"4-4_1-2":10.99999999999981,"4-4_1-3":11.259999999999804,"4-2_3-1":5.989999999999917,"4-3_3-2":10.229999999999826,"4-4_0-0":11.4999999999998},"lastLookAheadCps":{}}}
     frame: 1235
     {"objects":[{"mass":200,"inertia":5000,"position":{"x":-50.95407785757465,"y":-11.862056157065878},"speed":{"x":-10.440970487326862,"y":289.99850148754194},"rotation":0.01611021102261189,"rotationSpeed":77.81312889400579,"cornerPointCoordinates":[{"x":-5,"y":-6},{"x":-5,"y":8},{"x":5,"y":8},{"x":5,"y":-6}],"parent":null,"fixed":false,"parentMountPoint":null,"childMountPoint":null,"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0},{"mass":5,"inertia":10000,"position":{"x":-55.872881453557056,"y":-16.94195489465411},"speed":null,"rotation":34.63139160156125,"rotationSpeed":6.299999999999994,"cornerPointCoordinates":[{"x":-1,"y":-2},{"x":-1,"y":2},{"x":1,"y":2},{"x":1,"y":-2}],"parent":0,"fixed":true,"parentMountPoint":{"x":-5,"y":-5},"childMountPoint":{"x":0,"y":0},"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0},{"mass":5,"inertia":10000,"position":{"x":-45.87417911998642,"y":-16.780859753048283},"speed":null,"rotation":34.63139160156126,"rotationSpeed":6.299999999999994,"cornerPointCoordinates":[{"x":-1,"y":-2},{"x":-1,"y":2},{"x":1,"y":2},{"x":1,"y":-2}],"parent":0,"fixed":true,"parentMountPoint":{"x":5,"y":-5},"childMountPoint":{"x":0,"y":0},"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0},{"mass":100,"inertia":46666.666666666664,"position":{"x":-125.86260143761912,"y":-0.06268226078089321},"speed":{"x":7.021009809193126,"y":-8.968630612226862},"rotation":10.019593785022304,"rotationSpeed":0.30151960635689984,"cornerPointCoordinates":[{"x":-10,"y":10},{"x":10,"y":10},{"x":10,"y":-10},{"x":-10,"y":-10}],"parent":null,"fixed":false,"parentMountPoint":null,"childMountPoint":null,"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0},{"mass":100000000000000000000,"inertia":3.5187500000000005e+24,"position":{"x":9.949794554392318e-17,"y":-20},"speed":{"x":5.596813890724992e-19,"y":-3.5122892673066792e-15},"rotation":-2.063831236108466e-18,"rotationSpeed":1.3979936912258683e-18,"cornerPointCoordinates":[{"x":-150,"y":100},{"x":-1,"y":100},{"x":-1,"y":96},{"x":-148,"y":96},{"x":-148,"y":1},{"x":148,"y":1},{"x":148,"y":96},{"x":1,"y":96},{"x":1,"y":100},{"x":150,"y":100},{"x":150,"y":-5},{"x":-150,"y":-5}],"parent":null,"fixed":false,"parentMountPoint":null,"childMountPoint":null,"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0}],"cps":[{"e":[4,4],"p":[1,1]},{"e":[4,4],"p":[2,1]},{"e":[4,4],"p":[1,2]}],"speedAdjuster":{"lastCollisionsTimes":{"3-0_0-1":0.6600000000000004,"0-0_3-1":0.7700000000000005,"3-1_1-1":0.8800000000000006,"4-4_3-2":0.9800000000000006,"4-4_3-3":1.0700000000000007,"4-4_2-3":11.259999999999804,"4-4_0-2":1.184531250000001,"4-4_2-2":10.99999999999981,"4-4_1-0":11.4999999999998,"4-4_2-0":11.4999999999998,"4-4_2-1":11.745312499999795,"4-4_1-1":11.745312499999795,"4-4_1-2":11.745312499999795,"4-4_1-3":11.259999999999804,"4-2_3-1":5.989999999999917,"4-3_3-2":10.229999999999826,"4-4_0-0":11.4999999999998},"lastLookAheadCps":{}}}


     */
    //var obj = {"objects":[{"mass":200,"inertia":5000,"position":{"x":42.68008539431117,"y":-13.312905326381282},"speed":{"x":-74.42797453714154,"y":265.6227625993197},"rotation":-1.6306973747118632,"rotationSpeed":81.17686618084554,"cornerPointCoordinates":[{"x":-5,"y":-6},{"x":-5,"y":8},{"x":5,"y":8},{"x":5,"y":-6}],"parent":null,"fixed":false,"parentMountPoint":null,"childMountPoint":null,"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0},{"mass":5,"inertia":10000,"position":{"x":38.09734409297295,"y":-7.9985979508927825},"speed":null,"rotation":6.375312499999887,"rotationSpeed":3.3000000000000016,"cornerPointCoordinates":[{"x":-1,"y":-2},{"x":-1,"y":2},{"x":1,"y":2},{"x":1,"y":-2}],"parent":0,"fixed":true,"parentMountPoint":{"x":-5,"y":-5},"childMountPoint":{"x":0,"y":0},"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0},{"mass":5,"inertia":10000,"position":{"x":37.38972689043657,"y":-18.00461150862263},"speed":null,"rotation":6.376021484374887,"rotationSpeed":3.3000000000000016,"cornerPointCoordinates":[{"x":-1,"y":-2},{"x":-1,"y":2},{"x":1,"y":2},{"x":1,"y":-2}],"parent":0,"fixed":true,"parentMountPoint":{"x":5,"y":-5},"childMountPoint":{"x":0,"y":0},"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0},{"mass":100,"inertia":46666.666666666664,"position":{"x":94.35871376023569,"y":18.71665666924469},"speed":{"x":30.56649488978616,"y":0.6400436817684811},"rotation":2.414122730875309,"rotationSpeed":0.6412810973146645,"cornerPointCoordinates":[{"x":-10,"y":10},{"x":10,"y":10},{"x":10,"y":-10},{"x":-10,"y":-10}],"parent":null,"fixed":false,"parentMountPoint":null,"childMountPoint":null,"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0},{"mass":100000000000000000000,"inertia":3.5187500000000005e+24,"position":{"x":-1.2272992730273847e-15,"y":-20},"speed":{"x":-9.792301597619939e-17,"y":-2.1640781966202846e-15},"rotation":-8.984691080698615e-18,"rotationSpeed":-1.0404105284389269e-18,"cornerPointCoordinates":[{"x":-150,"y":100},{"x":-1,"y":100},{"x":-1,"y":96},{"x":-148,"y":96},{"x":-148,"y":1},{"x":148,"y":1},{"x":148,"y":96},{"x":1,"y":96},{"x":1,"y":100},{"x":150,"y":100},{"x":150,"y":-5},{"x":-150,"y":-5}],"parent":null,"fixed":false,"parentMountPoint":null,"childMountPoint":null,"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0}],"cps":[{"e":[4,4],"p":[2,2]},{"e":[4,4],"p":[0,2]},{"e":[4,4],"p":[2,3]}],"speedAdjuster":{"lastCollisionsTimes":{"3-0_0-1":0.8500000000000005,"3-0_0-2":1.320000000000001,"4-4_3-2":1.7500000000000013,"3-0_2-3":1.410000000000001,"0-2_3-1":1.6300000000000012,"3-0_2-2":1.7000000000000013,"4-4_3-3":1.8000000000000014,"4-4_0-2":4.473124999999949,"4-4_2-3":4.473124999999949,"4-4_2-2":4.473124999999949,"4-5_0-2":4.249999999999954,"4-5_2-2":4.269999999999953,"4-4_1-0":9.949999999999832,"4-4_1-3":1.6600000000000013,"4-4_2-0":3.5299999999999687,"4-5_2-3":3.1999999999999758,"4-3_1-1":8.939999999999854,"4-3_0-1":9.09999999999985,"4-3_1-0":10.54999999999982,"1-0_3-3":0.7200000000000004,"4-4_2-1":4.049999999999958},"lastLookAheadCps":{}}};
    //var obj = {"objects":[{"mass":200,"inertia":5000,"position":{"x":84.30137586279825,"y":-12.53074880096692},"speed":{"x":-15.825204515424225,"y":6.79050343481659},"rotation":1.7485369748395432,"rotationSpeed":0.9621910458835936,"cornerPointCoordinates":[{"x":-5,"y":-6},{"x":-5,"y":8},{"x":5,"y":8},{"x":5,"y":-6}],"parent":null,"fixed":false,"parentMountPoint":null,"childMountPoint":null,"addedSpeed":{"x":0,"y":-0.5800000000000907},"addedRotationSpeed":0},{"mass":5,"inertia":10000,"position":{"x":90.10663556962366,"y":-16.56794581576684},"speed":null,"rotation":107.4580000000022,"rotationSpeed":6.999999999999991,"cornerPointCoordinates":[{"x":-1,"y":-2},{"x":-1,"y":2},{"x":1,"y":2},{"x":1,"y":-2}],"parent":0,"fixed":true,"parentMountPoint":{"x":-5,"y":-5},"childMountPoint":{"x":0,"y":0},"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0},{"mass":5,"inertia":10000,"position":{"x":88.33857287759818,"y":-6.725489094141514},"speed":null,"rotation":107.45800000000223,"rotationSpeed":6.999999999999991,"cornerPointCoordinates":[{"x":-1,"y":-2},{"x":-1,"y":2},{"x":1,"y":2},{"x":1,"y":-2}],"parent":0,"fixed":true,"parentMountPoint":{"x":5,"y":-5},"childMountPoint":{"x":0,"y":0},"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0},{"mass":100,"inertia":46666.666666666664,"position":{"x":-63.079571925138694,"y":59.18481798104951},"speed":{"x":-2.379508352662522,"y":-0.3381064349792382},"rotation":7.0491803964050535,"rotationSpeed":0.3576879962172528,"cornerPointCoordinates":[{"x":-10,"y":10},{"x":10,"y":10},{"x":10,"y":-10},{"x":-10,"y":-10}],"parent":null,"fixed":false,"parentMountPoint":null,"childMountPoint":null,"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0},{"mass":100000000000000000000,"inertia":3.5187500000000005e+24,"position":{"x":8.833052530393502e-16,"y":-20},"speed":{"x":3.2090838920679303e-16,"y":-2.5401892089397186e-15},"rotation":-8.26511955507338e-18,"rotationSpeed":-1.5398376213446293e-18,"cornerPointCoordinates":[{"x":-150,"y":100},{"x":-1,"y":100},{"x":-1,"y":96},{"x":-148,"y":96},{"x":-148,"y":1},{"x":148,"y":1},{"x":148,"y":96},{"x":1,"y":96},{"x":1,"y":100},{"x":150,"y":100},{"x":150,"y":-5},{"x":-150,"y":-5}],"parent":null,"fixed":false,"parentMountPoint":null,"childMountPoint":null,"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0}],"cps":[{"e":[4,4],"p":[0,1]}],"speedAdjuster":{"lastCollisionsTimes":{"3-0_0-1":0.8500000000000005,"3-0_0-2":1.320000000000001,"4-4_3-2":1.7200000000000013,"3-0_2-0":1.7300000000000013,"0-2_3-1":1.6400000000000012,"4-4_3-3":1.7700000000000014,"4-4_0-1":21.04000000000049,"4-4_1-0":20.800000000000452,"4-4_1-1":21.04000000000049,"4-4_1-2":13.479999999999757,"4-4_1-3":20.73000000000044,"4-4_2-3":16.709999999999813,"4-4_2-0":16.74999999999982,"4-4_2-1":16.929999999999847,"4-4_2-2":16.37999999999976,"4-2_3-3":12.88999999999977,"4-4_0-2":16.529999999999784,"4-5_1-1":17.699999999999967,"4-5_2-1":17.70999999999997},"lastLookAheadCps":{}}}
    var obj = {"objects":[{"mass":200,"inertia":5000,"position":{"x":-43.09478593251115,"y":-11.913842217549789},"speed":{"x":5.759449961565087,"y":0.17656813222808282},"rotation":-0.008001435675830199,"rotationSpeed":0.44837377368667136,"cornerPointCoordinates":[{"x":-5,"y":-6},{"x":-5,"y":8},{"x":5,"y":8},{"x":5,"y":-6}],"parent":null,"fixed":false,"parentMountPoint":null,"childMountPoint":null,"addedSpeed":{"x":0,"y":-1.1799999999999748},"addedRotationSpeed":0},{"mass":5,"inertia":10000,"position":{"x":-48.13463262741701,"y":-16.873675409487447},"speed":null,"rotation":31.382468750000307,"rotationSpeed":-2.900000000000002,"cornerPointCoordinates":[{"x":-1,"y":-2},{"x":-1,"y":2},{"x":1,"y":2},{"x":1,"y":-2}],"parent":0,"fixed":true,"parentMountPoint":{"x":-5,"y":-5},"childMountPoint":{"x":0,"y":0},"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0},{"mass":5,"inertia":10000,"position":{"x":-38.134952740573496,"y":-16.953688912455647},"speed":null,"rotation":31.382468750000374,"rotationSpeed":-2.900000000000002,"cornerPointCoordinates":[{"x":-1,"y":-2},{"x":-1,"y":2},{"x":1,"y":2},{"x":1,"y":-2}],"parent":0,"fixed":true,"parentMountPoint":{"x":5,"y":-5},"childMountPoint":{"x":0,"y":0},"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0},{"mass":100,"inertia":46666.666666666664,"position":{"x":-93.18978222950966,"y":6.7213057022949},"speed":{"x":4.839480708343153,"y":1.9390148920230035},"rotation":11.530055025118987,"rotationSpeed":0.22579490991265821,"cornerPointCoordinates":[{"x":-10,"y":10},{"x":10,"y":10},{"x":10,"y":-10},{"x":-10,"y":-10}],"parent":null,"fixed":false,"parentMountPoint":null,"childMountPoint":null,"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0},{"mass":100000000000000000000,"inertia":3.5187500000000005e+24,"position":{"x":-3.5506212444025e-17,"y":-20},"speed":{"x":-2.980682987618926e-17,"y":-4.45439654137884e-15},"rotation":1.1026670229354292e-17,"rotationSpeed":3.177481458050602e-18,"cornerPointCoordinates":[{"x":-150,"y":100},{"x":-1,"y":100},{"x":-1,"y":96},{"x":-148,"y":96},{"x":-148,"y":1},{"x":148,"y":1},{"x":148,"y":96},{"x":1,"y":96},{"x":1,"y":100},{"x":150,"y":100},{"x":150,"y":-5},{"x":-150,"y":-5}],"parent":null,"fixed":false,"parentMountPoint":null,"childMountPoint":null,"addedSpeed":{"x":0,"y":0},"addedRotationSpeed":0}],"cps":[{"e":[4,4],"p":[1,0]},{"e":[4,4],"p":[2,0]},{"e":[4,4],"p":[2,3]}],"speedAdjuster":{"lastCollisionsTimes":{"3-0_0-1":0.6600000000000004,"0-0_3-1":0.7700000000000005,"3-1_1-1":0.8800000000000006,"4-4_3-2":0.9800000000000006,"4-4_3-3":1.0700000000000007,"4-4_2-3":6.499999999999906,"4-4_0-2":1.184531250000001,"4-4_2-2":5.329999999999931,"4-4_1-0":6.499999999999906,"4-4_2-0":6.499999999999906,"4-4_2-1":5.979999999999917,"4-4_1-1":5.979999999999917,"4-4_1-2":5.339999999999931,"4-4_1-3":4.89999999999994,"4-2_3-1":5.989999999999917,"4-3_3-2":10.229999999999826,"4-4_0-0":11.4999999999998,"4-4_3-1":0.6500000000000004},"lastLookAheadCps":{}}}





    scene.import(obj);

    //initScene(scene);

    $(document.body).append(scene.view.container);

    /*var ct = new CollisionTester(scene);
     ct.manual = false;
     $(document.body).append(ct.container);
     ct.start(function() {});*/

    scene.stepCallback = function (object, dt) {
        if (object.index < scene.objects.length - 3) {
            //object.addSpeed(object.speed.x * -.01 * dt, object.speed.y * -.01 * dt, object.rotationSpeed * -.01);
            object.addSpeed(0, -59 * dt, 0);
        }

        if (object.index == scene.objects.length - 2) {
            if (scene.objects[scene.objects.length - 2].rotationSpeed < 10) {
//                object.addSpeed(0, 0, .1, false);
            }
        }
    };

    scene.play();

    keyTimeout();

});

