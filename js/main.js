var initScene = function (scene) {
    var obj;

    obj = new SolidObject();
    obj.init(
        scene,
        100,
        new Vector(10, 50),
        [new Vector(-5, -4), new Vector(0, 5), new Vector(5, -4)]
    );
    obj.rotationSpeed = -.125 * Math.PI;
    obj.inertia = 10000;
    scene.addObject(obj);

    obj = new SolidObject();
     obj.init(
     scene,
     100,
     new Vector(0, 10),
     [new Vector(-10, 10), new Vector(10, 10), new Vector(10, -10), new Vector(-10, -10)]
     );
     obj.speed.x = 1;
     scene.addObject(obj);

     obj = new SolidObject();
     obj.init(
     scene,
     100,
     new Vector(-15, 30),
     [new Vector(-4, 5), new Vector(0, -4.5), new Vector(4, 5), new Vector(7, -5), new Vector(-7, -5)]
     );
     obj.rotationSpeed = 0;
     obj.speed.x = 0;
     obj.inertia = 10000;
     scene.addObject(obj);

     obj = new SolidObject();
     obj.init(
     scene,
     100,
     new Vector(29, 30),
     [new Vector(-7, 5), new Vector(7, 5), new Vector(7, -5), new Vector(-7, -5)]
     );
     obj.rotationSpeed = 1.125 * Math.PI;
     obj.speed.x = 0;
     obj.inertia = 10000;
     scene.addObject(obj);

     obj = new SolidObject();
     obj.init(
     scene,
     100,
     new Vector(45, 30),
     [new Vector(-7, 5), new Vector(0, 8), new Vector(7, 5), new Vector(7, -5), new Vector(0, -8), new Vector(-7, -5)]
     );
     obj.rotationSpeed = 1.125 * Math.PI;
     obj.speed.x = 1;
     obj.inertia = 10000;
     scene.addObject(obj);

     obj = new SolidObject();
     obj.init(
     scene,
     1e4,
     new Vector(-45, 13),
     [new Vector(-17, 1), new Vector(0, 3), new Vector(17, 1), new Vector(17, -1), new Vector(0, -3), new Vector(-17, -1)]
     );
     obj.rotationSpeed = 2 * Math.PI;
     obj.inertia = 100000;
     scene.addObject(obj);

    obj = new SolidObject();
    obj.init(
        scene,
        1e12,
        new Vector(0, -20),
        [new Vector(-100, 100), new Vector(-5, 100), new Vector(-5, 98), new Vector(-98, 98), new Vector(-98, 5), new Vector(98, 5), new Vector(98, 98), new Vector(5, 98), new Vector(5, 100), new Vector(100, 100), new Vector(100, -5), new Vector(-100, -5)]
    );
    obj.rotationSpeed = 0;
    obj.speed.x = 0;
    obj.speed.y = 0;
    scene.addObject(obj);

    // Start.
    /*    var start = [{
     "pos": {"x": 49.5651541243947, "y": 3.510703713450554},
     "speed": {"x": 1.5627083845642753, "y": 1.6217348024723193},
     "rotation": 1.1079099800861245,
     "rotationSpeed": 0.038666341862783005
     }, {
     "pos": {"x": 63.662253373273266, "y": -4.999366241358262},
     "speed": {"x": 0.5908439568075687, "y": -1.0707118985875397e-7},
     "rotation": -0.00003651767847567749,
     "rotationSpeed": -1.8301981371399156e-10
     }, {
     "pos": {"x": -53.12715529579904, "y": 69.490377486687265},
     "speed": {"x": 7.080551125663003, "y": 7.991480143074257},
     "rotation": -2.433275818224548,
     "rotationSpeed": 0.49709853289430117
     }, {
     "pos": {"x": 78.89454098940449, "y": -7.999198836970292},
     "speed": {"x": -0.0927996485444344, "y": -1.0900491134724355e-7},
     "rotation": 14.137127391597751,
     "rotationSpeed": -1.819267878705455e-10
     }, {
     "pos": {"x": 90.99971759305606, "y": -6.99900111533321},
     "speed": {"x": -0.0007407753158916442, "y": -1.6512173621234985e-7},
     "rotation": 28.2743839276328,
     "rotationSpeed": 0.00014816702761260734
     }, {
     "pos": {"x": -45.000000097603966, "y": 13.00000004157928},
     "speed": {"x": -5.689224816133642e-9, "y": 2.423595642911739e-9},
     "rotation": 122.80413319878545,
     "rotationSpeed": 6.281083483666611
     }, {
     "pos": {"x": 6.830846897513274e-8, "y": -20.000000989453493},
     "speed": {"x": 1.4134033076366474e-8, "y": -9.467685941584561e-8},
     "rotation": -1.2756149701366104e-9,
     "rotationSpeed": -1.8301982829865708e-10
     }];*/
    /*var start = {
        "objects": [{
            "pos": {"x": -92.99328713792033, "y": -9.999000064118501},
            "speed": {"x": -36.95615133607065, "y": -0.2816542877501632},
            "rotation": -3.1415926543388997,
            "rotationSpeed": -1.3352359495844013e-10
        }, {
            "pos": {"x": 7.48745262821115e-8, "y": -20.00000013225355},
            "speed": {"x": 1.1157001723560722e-8, "y": -3.059268864540471e-8},
            "rotation": -7.491059947601461e-10,
            "rotationSpeed": -1.3352358538357677e-10
        }],
        "cps": [{"e": [1, 4], "p": [0, 1]}, {"e": [1, 4], "p": [0, 2]}, {"e": [1, 3], "p": [0, 2]}, {
            "e": [1, 3],
            "p": [0, 3]
        }]
    };

    for (var i = 0; i < start.objects.length; i++) {
        var k = start.objects[i];
        scene.objects[i].step(0, true);
        scene.objects[i].position.x = k.pos.x;
        scene.objects[i].position.y = k.pos.y;
        scene.objects[i].speed.x = k.speed.x;
        scene.objects[i].speed.y = k.speed.y;
        scene.objects[i].rotationSpeed = k.rotationSpeed;
        scene.objects[i].rotation = k.rotation;
        scene.objects[i].updateCornerPoints();
    }
    for (var i = 0; i < start.cps.length; i++) {
        var k = start.cps[i];
        var cp = new CollisionPoint(
            scene.objects[k.p[0]],
            scene.objects[k.p[0]].cornerPoints[k.p[1]],
            scene.objects[k.e[0]],
            scene.objects[k.e[0]].cornerPoints[k.e[1]]
        );
        scene.collisionPoints.push(cp);
    }*/

//    keys['40'] = true;

    scene.view.update();

    scene.stepCallback = function (object, dt) {
        if (object.index < scene.objects.length - 2) {
            //object.addSpeed(object.speed.x * -.01 * dt, object.speed.y * -.01 * dt, object.rotationSpeed * -.01);
            object.addSpeed(0, -29.81 * dt, 0);
        }

        if (object.index == 0) {
//            object.applyImpulse(new Vector(0, -5), new Vector(0, 1), -60);
        }

    };
};

var keys = {};
var keyTimeout = function () {
    if (keys['37']) {
        scene.objects[0].applyImpulse(new Vector(0, -5), new Vector(1, 0), 150);
        scene.objects[0].applyImpulse(new Vector(0, 0), new Vector(1, 0), -150);
    }
    if (keys['38']) {
        scene.objects[0].applyImpulse(new Vector(0, -5), new Vector(0, 1), 150);
    }
    if (keys['39']) {
        scene.objects[0].applyImpulse(new Vector(0, -5), new Vector(1, 0), -150);
        scene.objects[0].applyImpulse(new Vector(0, 0), new Vector(1, 0), 150);
    }
    if (keys['40']) {
        scene.objects[0].applyImpulse(new Vector(0, -5), new Vector(0, 1), -60);
    }
    if (keys['90']) {
        scene.objects[0].applyImpulse(new Vector(0, 0), new Vector(1, 0), -60);
    }
    if (keys['88']) {
        scene.objects[0].applyImpulse(new Vector(0, 0), new Vector(1, 0), 60);
    }
    setTimeout(keyTimeout, 20);
};
keyTimeout();

var logSituation = function () {
    var obj = {objects: [], cps: []};
    for (var i = 0; i < scene.collisionPoints.length; i++) {
        var cp = scene.collisionPoints[i];
        obj.cps.push({e: [cp.edgeSolidObject.index, cp.edge.index], p: [cp.pointSolidObject.index, cp.point.index]});
    }
    for (var i = 0; i < scene.objects.length; i++) {
        obj.objects.push({
            pos: scene.objects[i].position,
            speed: scene.objects[i].speed,
            rotation: scene.objects[i].rotation,
            rotationSpeed: scene.objects[i].rotationSpeed
        });
    }
    console.log(JSON.stringify(obj));
};
window.logSituation = logSituation;

$(document).keydown(function (e) {
    if (keys['32'] && e.keyCode == 40) {
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
    $(document.body).append(scene.view.container);

    /*var ct = new CollisionTester(scene);
     ct.manual = false;
     $(document.body).append(ct.container);
     ct.start(function() {});*/

    initScene(scene);
    scene.play();
});

