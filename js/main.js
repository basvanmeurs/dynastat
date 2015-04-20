var initScene = function (scene) {
    var obj;

    obj = new SolidObject();
    obj.init(
        scene,
        200,
        new Vector(10, 50),
        [new Vector(-5, -6), new Vector(-5, 8), new Vector(5, 8), new Vector(5, -6)]
    );
    obj.rotationSpeed = -.125 * Math.PI;
    obj.inertia = 5000;
    scene.addObject(obj);

    var parent = obj;
    obj = new SolidObject();
    obj.initChild(
        scene,
        5,
        parent,
        new Vector(0, -5),
        new Vector(0, 10),
        [new Vector(-3, -15), new Vector(-3, 15), new Vector(3, 15), new Vector(3, -15)]
    );
    obj.inertia = 100;
    scene.addObject(obj);

    obj = new SolidObject();
    obj.init(
        scene,
        200,
        new Vector(30, 50),
        [new Vector(-5, -6), new Vector(-5, 8), new Vector(5, 8), new Vector(5, -6)]
    );
    obj.rotationSpeed = -.125 * Math.PI;
    obj.inertia = 5000;
    scene.addObject(obj);

    var parent = obj;
    obj = new SolidObject();
    obj.initChild(
        scene,
        10,
        parent,
        new Vector(0, -5),
        new Vector(0, 10),
        [new Vector(-3, -15), new Vector(-3, 15), new Vector(3, 15), new Vector(3, -15)]
    );
    obj.inertia = 10;
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
        new Vector(-45, 12),
        [new Vector(-17, 1), new Vector(0, 3), new Vector(17, 1), new Vector(17, -1), new Vector(0, -3), new Vector(-17, -1)]
    );
    obj.rotationSpeed = 4 * Math.PI;
    obj.inertia = 1e5;
    scene.addObject(obj);

    obj = new SolidObject();
    obj.init(
        scene,
        1e4,
        new Vector(45, 12),
        [new Vector(-17, 1), new Vector(0, 3), new Vector(17, 1), new Vector(17, -1), new Vector(0, -3), new Vector(-17, -1)]
    );
    obj.rotationSpeed = -4 * Math.PI;
    obj.inertia = 1e5;
    scene.addObject(obj);

    obj = new SolidObject();
    obj.init(
        scene,
        1e20,
        new Vector(0, -20),
        [new Vector(-150, 100), new Vector(-1, 100), new Vector(-1, 96), new Vector(-148, 96), new Vector(-148, 1), new Vector(148, 1), new Vector(148, 96), new Vector(1, 96), new Vector(1, 100), new Vector(150, 100), new Vector(150, -5), new Vector(-150, -5)]
    );
    obj.rotationSpeed = 0;
    obj.speed.x = 0;
    obj.speed.y = 0;
    obj.anchored = true;
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
     };*/


    //var start = {"objects":[{"pos":{"x":44.85374757752617,"y":-2.0234338731756045},"speed":{"x":-2.0558814858107635,"y":-35.59344911062198},"rotation":-8.405652856925407,"rotationSpeed":1.5670926952160282},{"pos":{"x":60.21094173842708,"y":-2.5110403415080116},"speed":{"x":-0.8994663978912935,"y":-2.483142486320145},"rotation":-0.29311978283716184,"rotationSpeed":0.33287448434602596},{"pos":{"x":92.7943882429746,"y":5.972687956161973},"speed":{"x":-0.3538919143269428,"y":-0.4081325705471316},"rotation":-4.685186585176324,"rotationSpeed":0.060045859629349496},{"pos":{"x":76.95168327022668,"y":-9.943628529888061},"speed":{"x":-0.47849744720424237,"y":0.15316826618633061},"rotation":9.41684694840285,"rotationSpeed":-0.09422705716668306},{"pos":{"x":90.99084968809855,"y":-6.999004894917081},"speed":{"x":-0.024362541171445942,"y":-0.4989581757982498},"rotation":9.424236843555272,"rotationSpeed":0.0021831044808638582},{"pos":{"x":-71.328116217393,"y":28.72185532206116},"speed":{"x":-1.1250180403012386,"y":4.607258760518487},"rotation":117.382377168653,"rotationSpeed":3.7387635549581617},{"pos":{"x":5.5703601671429e-7,"y":-20.000003222771262},"speed":{"x":4.263046901240756e-8,"y":-2.761435187086772e-7},"rotation":-6.490356378026792e-9,"rotationSpeed":-4.3040652732307507e-10}],"cps":[{"e":[6,4],"p":[4,1]},{"e":[6,4],"p":[3,0]},{"e":[6,4],"p":[1,2]},{"e":[6,5],"p":[4,0]},{"e":[6,4],"p":[3,1]},{"e":[1,1],"p":[3,2]},{"e":[6,5],"p":[4,5]},{"e":[2,4],"p":[4,4]},{"e":[6,5],"p":[2,4]},{"e":[1,3],"p":[0,1]},{"e":[3,3],"p":[4,2]},{"e":[4,2],"p":[3,3]}]}

    var start = {"objects":[{"pos":{"x":12.976650818980104,"y":-1.6186274877287732},"speed":{"x":10.994235260682355,"y":-15.47996769789834},"rotation":3.1041343547124294,"rotationSpeed":-1.5246591618331302},{"pos":{"x":-39.78829141086724,"y":-4.962439922468965},"speed":{"x":-0.16785468239485107,"y":-0.12656169679809362},"rotation":-0.0037463474782438613,"rotationSpeed":-0.013665117451664665},{"pos":{"x":-22.802418574127003,"y":-9.999069959895488},"speed":{"x":-0.009202735452588463,"y":-0.3486014162847799},"rotation":-6.283180744698451,"rotationSpeed":0.0023042228430198426},{"pos":{"x":-13.024348917123286,"y":-6.857255636969765},"speed":{"x":-2.455969342072375,"y":0.40077449231229534},"rotation":1.8623384213532876,"rotationSpeed":0.277384866213333},{"pos":{"x":24.187216103662724,"y":-7.996988352878163},"speed":{"x":17.67715233378342,"y":-0.13549608178770473},"rotation":4.712725892795033,"rotationSpeed":0.0778808807558583},{"pos":{"x":24.936560137991762,"y":-7.999070491809371},"speed":{"x":17.106409128076976,"y":-0.4125032578463499},"rotation":4.712382427644317,"rotationSpeed":-0.005774999025104404},{"pos":{"x":24.101436196258916,"y":-7.999070498690058},"speed":{"x":16.58586557490805,"y":-0.6376803171073485},"rotation":4.712382427644598,"rotationSpeed":0.005485756324331757},{"pos":{"x":24.163354692364912,"y":-7.811388171840408},"speed":{"x":18.46219491272092,"y":0.5426266966848048},"rotation":4.679425841098807,"rotationSpeed":-0.6031767376655148},{"pos":{"x":1.355432001522966,"y":-7.572190400714056},"speed":{"x":-0.6944760430234936,"y":-0.02892717593782257},"rotation":2.7198151626157094,"rotationSpeed":-0.24660946927003055},{"pos":{"x":-66.81247902620814,"y":-12.019587228132119},"speed":{"x":-0.10980056761658447,"y":-0.38498427578404365},"rotation":12.683481073905687,"rotationSpeed":0.026644605233299392},{"pos":{"x":-0.0000010456754155795684,"y":-20.000037892249733},"speed":{"x":-9.645276167842677e-8,"y":-0.000003422645284896908},"rotation":8.240889319563341e-9,"rotationSpeed":9.623437853070627e-10}],"cps":[{"e":[10,4],"p":[9,5]},{"e":[10,4],"p":[9,4]},{"e":[10,4],"p":[2,3]},{"e":[10,4],"p":[2,4]},{"e":[10,4],"p":[6,3]},{"e":[10,4],"p":[5,3]},{"e":[10,4],"p":[1,3]},{"e":[10,4],"p":[4,2]},{"e":[10,4],"p":[1,2]},{"e":[10,4],"p":[6,2]},{"e":[10,4],"p":[7,2]},{"e":[10,4],"p":[5,2]},{"e":[10,4],"p":[8,1]},{"e":[10,4],"p":[4,3]},{"e":[10,4],"p":[3,0]},{"e":[10,4],"p":[8,0]},{"e":[1,3],"p":[9,3]},{"e":[2,4],"p":[1,2]},{"e":[3,0],"p":[2,3]},{"e":[2,2],"p":[3,0]},{"e":[6,4],"p":[0,1]},{"e":[4,4],"p":[0,1]},{"e":[7,4],"p":[0,1]},{"e":[3,2],"p":[8,2]},{"e":[0,2],"p":[8,5]},{"e":[3,0],"p":[2,2]}]};

/*
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
     }
*/
    scene.view.update();

    scene.stepCallback = function (object, dt) {
        if (object.index < scene.objects.length - 3) {
            //object.addSpeed(object.speed.x * -.01 * dt, object.speed.y * -.01 * dt, object.rotationSpeed * -.01);
            object.addSpeed(0, -19 * dt, 0);
        }

        if (object.index == scene.objects.length - 2) {
            if (scene.objects[scene.objects.length - 2].rotationSpeed < 10) {
                object.addSpeed(0, 0, .1, false);
            }
        }

    };
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
        scene.objects[0].applyImpulse(new Vector(0, 0), new Vector(1, 0), -300);
    }
    if (keys['88']) {
        scene.objects[0].applyImpulse(new Vector(0, 0), new Vector(1, 0), 300);
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
    $(document.body).append(scene.view.container);

    /*var ct = new CollisionTester(scene);
     ct.manual = false;
     $(document.body).append(ct.container);
     ct.start(function() {});*/

    initScene(scene);
    scene.play();
});

