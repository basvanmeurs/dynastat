var initScene = function (scene) {
    var obj;

    obj = new SolidObject();
    obj.init(
        scene,
        200,
        new Vector(10, 50),
        [new Vector(-5, -4), new Vector(-5, 2), new Vector(0, 8), new Vector(5, 2), new Vector(5, -4)]
    );
    obj.rotationSpeed = -.125 * Math.PI;
    obj.inertia = 5000;
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
        100,
        new Vector(15, 30),
        [new Vector(-7, 5), new Vector(0, 8), new Vector(7, 5), new Vector(7, -5), new Vector(0, -8), new Vector(-7, -5)]
    );
    obj.rotationSpeed = 1.125 * Math.PI;
    obj.speed.x = 1;
    obj.inertia = 10000;
    scene.addObject(obj);

    obj = new SolidObject();
    obj.init(
        scene,
        1e8,
        new Vector(-45, 12),
        [new Vector(-17, 1), new Vector(0, 3), new Vector(17, 1), new Vector(17, -1), new Vector(0, -3), new Vector(-17, -1)]
    );
    obj.rotationSpeed = 4 * Math.PI;
    obj.inertia = 1e8;
    scene.addObject(obj);

    obj = new SolidObject();
    obj.init(
        scene,
        1e8,
        new Vector(45, 12),
        [new Vector(-17, 1), new Vector(0, 3), new Vector(17, 1), new Vector(17, -1), new Vector(0, -3), new Vector(-17, -1)]
    );
    obj.rotationSpeed = -4 * Math.PI;
    obj.inertia = 1e8;
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
     };*/


    //var start = {"objects":[{"pos":{"x":44.85374757752617,"y":-2.0234338731756045},"speed":{"x":-2.0558814858107635,"y":-35.59344911062198},"rotation":-8.405652856925407,"rotationSpeed":1.5670926952160282},{"pos":{"x":60.21094173842708,"y":-2.5110403415080116},"speed":{"x":-0.8994663978912935,"y":-2.483142486320145},"rotation":-0.29311978283716184,"rotationSpeed":0.33287448434602596},{"pos":{"x":92.7943882429746,"y":5.972687956161973},"speed":{"x":-0.3538919143269428,"y":-0.4081325705471316},"rotation":-4.685186585176324,"rotationSpeed":0.060045859629349496},{"pos":{"x":76.95168327022668,"y":-9.943628529888061},"speed":{"x":-0.47849744720424237,"y":0.15316826618633061},"rotation":9.41684694840285,"rotationSpeed":-0.09422705716668306},{"pos":{"x":90.99084968809855,"y":-6.999004894917081},"speed":{"x":-0.024362541171445942,"y":-0.4989581757982498},"rotation":9.424236843555272,"rotationSpeed":0.0021831044808638582},{"pos":{"x":-71.328116217393,"y":28.72185532206116},"speed":{"x":-1.1250180403012386,"y":4.607258760518487},"rotation":117.382377168653,"rotationSpeed":3.7387635549581617},{"pos":{"x":5.5703601671429e-7,"y":-20.000003222771262},"speed":{"x":4.263046901240756e-8,"y":-2.761435187086772e-7},"rotation":-6.490356378026792e-9,"rotationSpeed":-4.3040652732307507e-10}],"cps":[{"e":[6,4],"p":[4,1]},{"e":[6,4],"p":[3,0]},{"e":[6,4],"p":[1,2]},{"e":[6,5],"p":[4,0]},{"e":[6,4],"p":[3,1]},{"e":[1,1],"p":[3,2]},{"e":[6,5],"p":[4,5]},{"e":[2,4],"p":[4,4]},{"e":[6,5],"p":[2,4]},{"e":[1,3],"p":[0,1]},{"e":[3,3],"p":[4,2]},{"e":[4,2],"p":[3,3]}]}

    var start = {"objects":[{"pos":{"x":80.69612136544737,"y":4.970810263855765},"speed":{"x":-10.371675302054934,"y":1.028351504216648},"rotation":5.0168280574681186,"rotationSpeed":0.48936331202333166},{"pos":{"x":-82.81646428793007,"y":1.4719027477837356},"speed":{"x":13.520838396477734,"y":-9.45161969006772},"rotation":87.103185807559,"rotationSpeed":2.070642630263654},{"pos":{"x":45.12331129871436,"y":-9.47989500377682},"speed":{"x":-418.00744825615385,"y":-77.80985587619415},"rotation":21.912537140745357,"rotationSpeed":27.71690306786273},{"pos":{"x":92.73046197669615,"y":-7.999214591695361},"speed":{"x":-0.0000036315312737640476,"y":-0.10008558000375294},"rotation":4.712389816396962,"rotationSpeed":3.5123678563754275e-7},{"pos":{"x":78.0840254737038,"y":-7.999340991509639},"speed":{"x":-0.7096168100250473,"y":-0.10009195527078868},"rotation":20.420375915026373,"rotationSpeed":0.0058530928095010416},{"pos":{"x":14.849682784982827,"y":-7.999279952794504},"speed":{"x":28.048592092526494,"y":-0.10008912220877003},"rotation":20.420353084345983,"rotationSpeed":-0.0013996559471111086},{"pos":{"x":-44.99851552349747,"y":14.857500146867624},"speed":{"x":0.0011294762814591745,"y":1.1640500560584244},"rotation":195.85364566498757,"rotationSpeed":0.10817721878720327},{"pos":{"x":45.00020577092308,"y":12.041285445626933},"speed":{"x":-0.005422338943345738,"y":0.009540341910948564},"rotation":-224.34546937332632,"rotationSpeed":-12.319017168167068},{"pos":{"x":-1.8516661334234674e-7,"y":-20.00029211550398},"speed":{"x":4.693753650699376e-7,"y":-0.00011760223053649269},"rotation":8.360122728258928e-7,"rotationSpeed":3.4532618527275394e-7}],"cps":[{"e":[8,4],"p":[3,1]},{"e":[8,4],"p":[5,0]},{"e":[8,4],"p":[5,5]},{"e":[8,4],"p":[3,2]},{"e":[8,4],"p":[4,0]},{"e":[8,4],"p":[4,5]},{"e":[8,4],"p":[2,0]},{"e":[4,2],"p":[0,4]},{"e":[2,3],"p":[7,0]}]};


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

    scene.view.update();

    scene.stepCallback = function (object, dt) {
        if (object.index < scene.objects.length - 3) {
            //object.addSpeed(object.speed.x * -.01 * dt, object.speed.y * -.01 * dt, object.rotationSpeed * -.01);
            object.addSpeed(0, -20 * dt, 0);
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
        scene.objects[0].applyImpulse(new Vector(0, -5), new Vector(0, 1), 250);
    }
    if (keys['39']) {
        scene.objects[0].applyImpulse(new Vector(0, -5), new Vector(1, 0), -150);
        scene.objects[0].applyImpulse(new Vector(0, 0), new Vector(1, 0), 150);
    }
    if (keys['40']) {
        scene.objects[0].applyImpulse(new Vector(0, -5), new Vector(0, 1), -450);
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

