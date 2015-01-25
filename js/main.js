var initScene = function(scene) {
    var obj;

    obj = new SolidObject();
    obj.init(
        scene,
        100,
        new Vector(10, 50),
        [new Vector(-5, -3), new Vector(0, 7), new Vector(5, -3)]
    );
    obj.rotationSpeed = -.125 * Math.PI;
    obj.inertia = 1000;
    scene.addObject(obj);

    obj = new SolidObject();
    obj.init(
        scene,
        100,
        new Vector(0,10),
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
        1e12,
        new Vector(-45, 13),
        [new Vector(-17, 1), new Vector(0, 5), new Vector(17, 1), new Vector(17, -1), new Vector(0, -5), new Vector(-17, -1)]
    );
    obj.rotationSpeed = 2 * Math.PI;
    obj.inertia = 10000000;
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


    scene.stepCallback = function(object, dt) {
        if (object.index < scene.objects.length - 2) {
            object.addSpeed(object.speed.x * -.01 * dt, object.speed.y * -.01 * dt, object.rotationSpeed * -.01);
            object.addSpeed(0, -8 * dt, 0);
        }
    };
};

var keys = {};
var keyTimeout = function() {
    if (keys['37']) {
        scene.objects[0].applyImpulse(new Vector(0, -5), new Vector(1, 0), 50);
        scene.objects[0].applyImpulse(new Vector(0, 0), new Vector(1, 0), -50);
    }
    if (keys['38']) {
        scene.objects[0].applyImpulse(new Vector(0, -5), new Vector(0, 1), 150);
    }
    if (keys['39']) {
        scene.objects[0].applyImpulse(new Vector(0, -5), new Vector(1, 0), -50);
        scene.objects[0].applyImpulse(new Vector(0, 0), new Vector(1, 0), 50);
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

$(document).keydown(function(e) {
    keys['' + e.keyCode] = true;
});

$(document).keyup(function(e) {
    keys['' + e.keyCode] = false;
});

$(document).ready(function() {
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

