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

        var latestDt = this.step(Scene.TIMESTEP);

        if (latestDt < Scene.TIMESTEP * .5) {
            // Try to do another step because the gained time was very small.
            latestDt += this.step(Scene.TIMESTEP - latestDt);
        }
        setTimeout(function() {
            self.view.update();
            self.play();
        }, latestDt * 1000);
    };

    /**
     * Takes a time step.
     * @param dt
     */
    this.step = function(dt) {
        this.frame++;
this.view.update();
        var i;

        // Apply speeds added during the last run.
        for (i = 0; i < this.objects.length; i++) {
            this.objects[i].applyAddedSpeed();
        }

        // Correct the speeds in the current model.
        this.speedAdjuster.adjust(dt);

        // Progress the model.
        var info = this.progress(dt);

        // Clean up collision points.
        this.speedAdjuster.cleanupCollisionPoints();

        // Go up to the progress time.
        this.setT(this.t + info.dt);

        // Add the newly found collision points.
        for (i = 0; i < info.collisions.length; i++) {
            // Remove duplicates in collision points.
            var exists = false;
            for (var j = 0; j < this.collisionPoints.length; j++) {
                if ((this.collisionPoints[j].edge == info.collisions[i].edge) && (this.collisionPoints[j].point == info.collisions[i].point)) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                this.collisionPoints.push(info.collisions[i]);
            }
        }

        return info.dt;
    };

    /**
     * Moves the model forward (in time) until something happens that requires a new collision recalculation. 
     * @param {Number} dt
     *   The maximum time step to move forward.
     * @return {{dt : Number, collisions: CollisionPoint[]}}
     *   Information about the progress end time step and possible occurring collisions.
     */
    this.progress = function(dt) {
        var i, j, cp;

        // No colliding solid object may rotate more than .5 * PI in 1 frame.
        for (i = 0; i < scene.collisionPoints.length; i++) {
            cp = scene.collisionPoints[i];
            if (cp.rotationSpeed * dt > Math.PI * .5) {
                dt = Math.PI * .5 / cp.rotationSpeed;
                Scene.log('limit dt to ' + dt);
            }
        }

        var foundCollisionPoints = [];

        var recursionCounter = 0;
        while(true) {
            recursionCounter++;

            var compensated = false;
            if (dt > Scene.TIMESTEP * .5) {
                // Look-ahead for current collision points.
                compensated = this.progressCollisionPoints(dt);
            }
            if (compensated) {
                // Decrease the possibility of under-compensation by decreasing the time step.
                dt *= .8;
            } else {
                // Detect collision.
                var maxTime = this.t + dt;
                var minT = null;
                var collisionPoints;

                for (i = 0; i < this.objects.length; i++) {
                    for (j = i + 1; j < this.objects.length; j++) {
                        var cps =  this.objects[i].getCollision(this.objects[j], this.t, maxTime);
                        if (cps.length > 0) {
                            if ((minT == null) || (this.objects[i].t < minT)) {
                                collisionPoints = cps;
                                minT = this.objects[i].t;
                            }
                        }
                    }
                }

                if (minT == null) {
                    // No (new) collisions found: we're done!
                    return {dt: dt, collisions: foundCollisionPoints};
                } else {
                    // A collision was found. Limit dt to that.
                    dt = minT - this.t;

                    // Reset all solid objects to the 'starting' time again.
                    for (i = 0; i < this.objects.length; i++) {
                        this.objects[i].setT(this.t);
                    }

                    // Remember last collision.
                    foundCollisionPoints = collisionPoints;
                }
            }
        };
        return {dt: dt, collisions: []};
    };

    /**
     * Checks if any of the collision points has penetrated the edge @maxTime and correct speeds to prevent this from
     * happening.
     * @param dt
     *   The time step to progress to.
     * @return {Boolean}
     *   True if correction was necessary.
     */
    this.progressCollisionPoints = function(dt) {

        var i, cp;
        
        var sa = this.speedAdjuster;
        
        // Check which points need compensation.
        var compensationNecessary = false;
        for (i = 0; i < scene.collisionPoints.length; i++) {
            cp = scene.collisionPoints[i];

            var dist2 = this.progressCollisionPointPeek(cp, dt);
            if (dist2 < 0) {
                compensationNecessary = true;
                var delta = dist2 - sa.info[i].dist;
                if (sa.items[i].disabled) {
                    // Re-enable point as it's going to collide after all.
                    sa.items[i].disabled = false;
                }
                sa.items[i].result = (-delta / dt);
            } else {
                sa.items[i].result = 0;
            }
        }
        
        if (compensationNecessary) {
            var result = sa.solve();
            
            // Apply results.
            for (i = 0; i < scene.collisionPoints.length; i++) {
                if (!sa.items[i].disabled) {
                    var r = result[i];
                    if (r != 0) {
                        sa.info[i].o1.speed.iadd(sa.info[i].dv1.mul(r));
                        sa.info[i].o2.speed.iadd(sa.info[i].dv2.mul(r));
                        sa.info[i].o1.rotationSpeed += sa.info[i].dw1 * r;
                        sa.info[i].o2.rotationSpeed += sa.info[i].dw2 * r;
                    }
                }
            }
        }

        return compensationNecessary;
    };

    /**
     * Peeks into the future and returns the distance between the collision point and the collision edge.
     * @param {CollisionPoint} cp
     *   The collision point to 'peek' for.
     * @param dt
     *   The amount of time to 'step'.
     * @returns {number}
     *   This distance, in m. Negative means that the cp has penetrated the edge.
     */
    this.progressCollisionPointPeek = function(cp, dt) {
        // Remember current situation.
        cp.pointSolidObject.saveSituation();
        cp.edgeSolidObject.saveSituation();

        // Step ahead to dt.
        cp.pointSolidObject.step(dt, true);
        cp.pointSolidObject.updateCornerPoint(cp.point);

        cp.edgeSolidObject.step(dt, true);
        cp.edgeSolidObject.updateCornerPoint(cp.edge);
        cp.edgeSolidObject.updateCornerPoint(cp.edge.next);

        // Get y relative to edge.
        var v = cp.edge.getPointDistanceRelativeToThis(cp.point);

        // Step back.
        cp.pointSolidObject.resetSituation();
        cp.edgeSolidObject.resetSituation();

        return v;
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
Scene.COLLISION_PROXIMITY = .01; // 1cm.

/**
 * The time step per iteration.
 * @type {number}
 */
Scene.TIMESTEP = .05;

var output = document.getElementById('output');
Scene.log = function(msg) {
    if (!output) {
        output = document.getElementById('output');
    }
    output.innerHTML += msg + "\n";
    $(output).scrollTop(1000000000);
};