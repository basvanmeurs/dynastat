var Scene = function() {

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

    /**
     * Takes a time step.
     * @param dt
     */
    this.step = function(dt) {
        this.recursionCounter++;
        // Correct the speeds in the current model.
        this.speedAdjuster.adjust();

        var maxTime = this.t + dt;
        var info = this.getNextCollision(maxTime);

        //@todo: check for collision at info.t. if so, use this and check again.
if (info) {
    console.log(info.t);
}
        if (info == null) {
            this.setT(maxTime);
        } else {
            // Go up to the collision time.
            this.setT(info.t);

            // Add collision points.
            for (var i = 0; i < info.collision.length; i++) {
                // Remove duplicates in collision points.
                var exists = false;
                for (var j = 0; j < this.collisionPoints.length; j++) {
                    if ((this.collisionPoints[j].edge == info.collision[i].edge) && (this.collisionPoints[j].point == info.collision[i].point)) {
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    this.collisionPoints.push(info.collision[i]);
                }
            }

            // Perform the remaining step as well.
            this.step(maxTime - info.t);
        }
        this.recursionCounter = 0;
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

    /**
     * Returns the collision that occurs first between the current time and maxT.
     * @param {Number} maxTime
     * @return {{t : Number, collision: CollisionPoint[]}}
     *   Information about the collision, or null if there is no collision up to maxT.
     */
    this.getNextCollision = function(maxTime) {
        var t = this.t;

        var minT = null;
        var collisionPoints;

        for (var i = 0; i < this.objects.length; i++) {
            for (var j = i + 1; j < this.objects.length; j++) {
                var cps =  this.objects[i].getCollision(this.objects[j], t, maxTime);
                if (cps.length > 0) {
                    if ((minT == null) || (this.objects[i].t < minT)) {
                        collisionPoints = cps;
                        minT = this.objects[i].t;
                    }
                }
            }
        }

        if (minT == null) {
            return null;
        } else {
            return {t : minT, collision: collisionPoints};
        }
    };


    this.play = function() {
        var self = this;
        setTimeout(function() {
            self.step(Scene.TIMESTEP);
            self.view.update();
            self.play();
        }, Scene.TIMESTEP * 1000)
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
Scene.COLLISION_PROXIMITY = .001; // 1mm.

/**
 * The time step per iteration.
 * @type {number}
 */
Scene.TIMESTEP = .1;