var Scene = function() {

    var self = this;

    /**
     * An array of objects in the scene.
     * @type {SolidObject[]}
     */
    this.objects = [];

    /**
     * An array of collision points between objects.
     * @type {CollisionPoint[]}
     */
    this.collisionPoints = [];

    /**
     * View for the scene.
     * @type {View}
     */
    this.view = new View(this);

    /**
     * The simulated time from the start.
     * @type {number}
     */
    this.t = 0;

    /**
     * The step callback, in which speeds can be applied and modified.
     * @type {Function}
     */
    this.stepCallback = null;

    /**
     * The speed adjuster, which makes sure that speed at collisions points are adjusted properly.
     * @type {SpeedAdjuster}
     */
    this.speedAdjuster = new SpeedAdjuster(this);

    this.recursionCounter = 0;

    /**
     * The next object index to assign when adding an object.
     * @type {number}
     */
    this.nextObjectIndex = 0;

    this.frame = 0;
    this.totalAdjustTime = 0;
    this.totalCollisionTime = 0;

    this.play = function() {
        this.simulate();
        this.updateView();
    };

    this.updateView = function() {
        this.view.update();
        requestAnimationFrame(function() {
            self.updateView();
        });
    };

    this.simulate = function() {
        var maxT = scene.t + Scene.TIMESTEP;
        var t = scene.t;

        var count = 0;
        while (t < maxT - 1e-6) {
            count++;
            t = this.step(maxT - t);
        }
        setTimeout(function() {
            self.simulate();
        }, Scene.TIMESTEP * 1000);
    };

    /**
     * Takes a time step.
     * @param dt
     */
    this.step = function(dt) {
        this.frame++;

        // Apply speeds added during the last run.
        for (i = 0; i < this.objects.length; i++) {
            this.objects[i].applyAddedSpeed();
        }

        // Correct the speeds in the current model.
        dt = this.speedAdjuster.adjust(dt);

        // Progress the model.
        var info = this.progress(dt);

        // Go up to the progress time.
        this.setT(info.t);

        // Add the newly found collision points.
        for (var i = 0; i < info.collisions.length; i++) {
            // Remove duplicates in collision points.
            this.collisionPoints.push(info.collisions[i]);
        }

        return info.t;
    };

    /**
     * Moves the model forward (in time) until something happens that requires a new collision recalculation. 
     * @param {Number} dt
     *   The maximum time step to move forward.
     * @return {{t : Number, collisions: CollisionPoint[]}}
     *   Information about the progress end time step and possible occurring collisions.
     */
    this.progress = function(dt) {
        var i, j;

        // Detect collision.
        var maxT = this.t + dt;
        var minT = null;
        var collisionPoints = [];
        for (i = 0; i < this.objects.length; i++) {
            for (j = i + 1; j < this.objects.length; j++) {
                var cps = this.objects[i].getCollision(this.objects[j], this.t, maxT);
                if (cps.length > 0) {
                    if ((minT == null) || (this.objects[i].t < minT)) {
                        collisionPoints = cps;
                        minT = this.objects[i].t;
                    }
                }
            }
        }
        return {t: minT ? minT : maxT, collisions: collisionPoints};
    };

    /**
     * Sets the time. The time can't be reversed after this because speeds have been applied.
     * @param {Number} t
     */
    this.setT = function(t) {
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].setT(t);
        }
        for (i = 0; i < this.objects.length; i++) {
            this.objects[i].confirmT(t);
        }
        this.t = t;
    };

    this.addObject = function(o) {
        o.index = this.nextObjectIndex++;
        this.objects.push(o);
    };

    this.reset = function() {
        this.objects = [];
        this.collisionPoints = [];
        this.t = 0;
        this.nextObjectIndex = 1;
    };

};

/**
 * The max. proximity of the collision, in m.
 * A collision will only occur within this threshold.
 * @type {Number}
 */
Scene.COLLISION_PROXIMITY = .01;

/**
 * The time step per iteration.
 * @type {number}
 */
Scene.TIMESTEP = .01;

var output = document.getElementById('output');
Scene.log = function(msg) {
    if (!output) {
        output = document.getElementById('output');
    }
    output.innerHTML += msg + "\n";
    $(output).scrollTop(1000000000);
};