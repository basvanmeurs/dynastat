var initScene = function(scene) {
    var obj;
/*
    obj = new SolidObject();
    obj.init(
        scene,
        100,
        new Vector(0,10),
        [new Vector(-10, 10), new Vector(10, 10), new Vector(10, -10), new Vector(-10, -10)]
    );
    obj.speed.x = 1;
    scene.addObject(obj);
*/
    obj = new SolidObject();
    obj.init(
        scene,
        100,
        new Vector(10, 30),
        [new Vector(-13, 5), new Vector(13, 5), new Vector(13, -5), new Vector(-13, -5)]
    );
    obj.rotationSpeed = -.25 * Math.PI;
    obj.inertia = 10000;
    scene.addObject(obj);

    obj = new SolidObject();
    obj.init(
        scene,
        100,
        new Vector(-15, 30),
        [new Vector(-7, 5), new Vector(7, 5), new Vector(7, -5), new Vector(-7, -5)]
    );
    obj.rotationSpeed = .125 * Math.PI;
    obj.speed.x = 1;
    obj.inertia = 10000;
    scene.addObject(obj);

    obj = new SolidObject();
    obj.init(
        scene,
        100,
        new Vector(19, 30),
        [new Vector(-7, 5), new Vector(7, 5), new Vector(7, -5), new Vector(-7, -5)]
    );
    obj.rotationSpeed = 1.125 * Math.PI;
    obj.speed.x = -1;
    obj.inertia = 10000;
    scene.addObject(obj);

    obj = new SolidObject();
    obj.init(
        scene,
        1e12,
        new Vector(0, -20),
        [new Vector(-200, 5), new Vector(200, 5), new Vector(200, -5), new Vector(-200, -5)]
    );
    obj.rotationSpeed = 0;
    obj.speed.x = 0;
    obj.speed.y = 0;
    scene.addObject(obj);

    scene.stepCallback = function(object, dt) {
        if (object.index != scene.objects.length - 1) {
            object.addSpeed(0, -9.81 * dt, 0);
        }
    };
};

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

