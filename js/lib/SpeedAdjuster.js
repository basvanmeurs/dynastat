/**
 * Makes sure that speeds are correctly adjusted at all collision points.
 * @param {Scene} scene
 * @constructor
 */
var SpeedAdjuster = function(scene) {

    var self = this;

    /**
     * Used for solving the matrix of speed effects.
     * @type {StaticSolverEngine}
     */
    this.staticSolverEngine = new StaticSolverEngine(100);

    /**
     * The scene.
     * @param {Scene}
     */
    this.scene = scene;

    /**
     * A hashmap of the last collision times.
     * @type {object}
     */
    this.lastCollisionsTimes = {};

    /**
     * The collision points that were last look-ahead..
     * @type {object}
     */
    this.lastLookAheadCps = {};

    /**
     * Frame time delta, used in order to compensate proximity.
     */
    this.frameDt = 0;

    /**
     * Collision point physics info.
     * @type {Object[]}
     */
    this.info = null;

    /**
     * Initialize the meta info.
     */
    this.initCollisionPoints = function() {
        var i;

        this.info = [];

        for (i = 0; i < this.scene.collisionPoints.length; i++) {
            // Set physics info object for later use.
            this.info[i] = this.getCollisionPointInfo(this.scene.collisionPoints[i]);
        }

        // Push virtual connection for child objects.
        for (i = 0; i < this.scene.objects.length; i++) {
            if (this.scene.objects[i].parent) {
                this.info.push(this.getConnectionPointInfo(this.scene.objects[i], new Vector(1, 0)));
                this.info.push(this.getConnectionPointInfo(this.scene.objects[i], new Vector(0, 1)));
            }
        }

        // Per collision point, get other collision points that are affected directly by an opposite speed application.
        for (i = 0; i < this.info.length; i++) {
            var c1 = this.info[i];
            this.info[i].fx = [];
            for (var k = 0; k < this.info.length; k++) {
                if (i == k) continue;
                var c2 = this.info[k];

                // Calculate effect of 1 m/s on c1 on c2's collision point.
                var effect = this.getCollisionPointEffect(c1, c2);

                if (effect < -1e-12 || effect > 1e-12) {
                    this.info[i].fx.push({index: k, effect: effect});
                }
            }
        }
    };

    /**
     * Returns the collision point effect between the two collision point meta (this.info) objects.
     * @param {Object} c1
     * @param {Object} c2
     */
    this.getCollisionPointEffect = function(c1, c2) {
        var effect = 0;
        if (c1.o1 == c2.o1) {
            effect -= (c2.r1.getPerp().mul(c1.dw1).add(c1.dv1)).d(c2.n);
        } else if (c1.o1 == c2.o2) {
            effect += (c2.r2.getPerp().mul(c1.dw1).add(c1.dv1)).d(c2.n);
        }

        if (c1.o2 == c2.o1) {
            effect -= (c2.r1.getPerp().mul(c1.dw2).add(c1.dv2)).d(c2.n);
        } else if (c1.o2 == c2.o2) {
            effect += (c2.r2.getPerp().mul(c1.dw2).add(c1.dv2)).d(c2.n);
        }

        return effect;
    };

    /**
     * Gets physics info about the collision point.
     * @param {CollisionPoint} c
     * @returns {{o1: SolidObject, o2: SolidObject, dv1: Vector, dv2: Vector, dw1: number, dw2: number, r1: Vector, r2: Vector, n: Vector}}
     */
    this.getCollisionPointInfo = function(c) {
        // Get collision info.
        var o1 = c.edgeSolidObject;
        var o2 = c.pointSolidObject;
        var p = c.point;
        var e = c.edge;

        // Calculate speed normal increase components.

        // Collision point coordinates.
        var cp = p.getAbsoluteCoordinates();

        // Vectors from center of mass for both solid objects.
        var r1 = cp.sub(o1.position);
        var r2 = cp.sub(o2.position);

        // Collision edge normal.
        var n = new Vector(e.getAbsoluteCoordinates().y - e.next.getAbsoluteCoordinates().y, e.next.getAbsoluteCoordinates().x - e.getAbsoluteCoordinates().x);
        n = n.mul(1 / n.getLength());

        // Get dv1, dv2, dw1 and dw2 per 1 unit of moment.
        var dv1 = n.mul(-1 / o1.mass);
        var dv2 = n.mul(1 / o2.mass);
        var dw1 = -r1.crossProduct(n) / o1.inertia;
        var dw2 = r2.crossProduct(n) / o2.inertia;

        // Scale all speed components so that they total to 1 m/s of unit speed difference.
        var j = 1 / ((dv2.add(r2.getPerp().mul(dw2))).d(n) - (dv1.add(r1.getPerp().mul(dw1))).d(n));
        dv1 = dv1.mul(j);
        dv2 = dv2.mul(j);
        dw1 *= j;
        dw2 *= j;

        // Get distance between point and edge.
        var dist = e.getPointDistanceRelativeToThis(p);

        var key = "" + c.edgeSolidObject.index + "-" + c.edge.index + "_" + c.pointSolidObject.index + "-" + c.point.index;

        // Return physics info about the collision.
        return {cp: c, abs: cp, key: key, o1: o1, o2: o2, dv1: dv1, dv2: dv2, dw1: dw1, dw2: dw2, r1: r1, r2: r2, n: n, dist: dist, impulsePerSpeedDiff: j};
    };

    /**
     * Gets physics info about the connection point.
     * @param {SolidObject} c
     * @param {Vector} n
     * @returns {{o1: SolidObject, o2: SolidObject, dv1: Vector, dv2: Vector, dw1: number, dw2: number, r1: Vector, r2: Vector, n: Vector}}
     */
    this.getConnectionPointInfo = function(c, n) {
        n = c.parent.getRotatedCoordinates(n);

        // Get collision info.
        var o1 = c.parent;
        var o2 = c;

        // Calculate speed normal increase components.

        // Collision point coordinates.
        var cp = c.parent.getAbsoluteCoordinates(c.parentMountPoint);

        // Vectors from center of mass for both solid objects.
        var r1 = cp.sub(o1.position);
        var r2 = cp.sub(o2.getChildPosition());

        // Get dv1, dv2, dw1 and dw2 per 1 unit of moment.
        var dv1 = n.mul(-1 / o1.mass);
        var dv2 = n.mul(1 / o2.mass);
        var dw1 = -r1.crossProduct(n) / o1.inertia;
        var dw2 = r2.crossProduct(n) / o2.inertia;

        // Scale all speed components so that they total to 1 m/s of unit speed difference.
        var j = 1 / ((dv2.add(r2.getPerp().mul(dw2))).d(n) - (dv1.add(r1.getPerp().mul(dw1))).d(n));
        dv1 = dv1.mul(j);
        dv2 = dv2.mul(j);
        dw1 *= j;
        dw2 *= j;

        var key = "" + c.index + "-" + c.parent.index;

        // Return physics info about the collision.
        return {cp: null, abs: cp, key: key, o1: o1, o2: o2, dv1: dv1, dv2: dv2, dw1: dw1, dw2: dw2, r1: r1, r2: r2, n: n, dist: 0, impulsePerSpeedDiff: j, connection: true};
    };

    /**
     * Splits the collision points into groups.
     * @return {Array[][]}
     *   Array with groups, and for each group the collision points.
     */
    this.getCollisionPointGroups = function() {
        var i,j;
        var groups = [];

        var n = this.info.length;

        if (n == 0) {
            return groups;
        }

        // Initialize.
        var done = new Array(n);
        for (i = 0; i < n; i++) {
            done[i] = false;
        }

        var todo = new Array(n);

        var infoIndexMapping = new Array(n);

        while(true) {
            // Get first not done collision point.
            var firstNotDoneIndex = -1;
            for (i = 0; i < n; i++) {
                if (!done[i]) {
                    firstNotDoneIndex = i;
                    break;
                }
            }

            if (firstNotDoneIndex == -1) {
                // Done.
                break;
            }

            var group = [];

            var todoIndex = 0;
            todo[0] = firstNotDoneIndex;
            done[firstNotDoneIndex] = true;
            var todoLength = 1;
            while (todoIndex < todoLength) {
                // Add to the group.
                var index = todo[todoIndex++];
                infoIndexMapping[index] = group.length;
                group.push(this.info[index]);

                var effects = this.info[index].fx;
                for (j = 0; j < effects.length; j++) {
                    var fxIndex = effects[j].index;
                    if (!done[fxIndex]) {
                        todo[todoLength++] = fxIndex;
                        done[fxIndex] = true;
                    }
                }
            }

            groups.push(group);
        }

        // Replace info indices per group.
        var k;
        for (i = 0; i < groups.length; i++) {
            for (j = 0; j < groups[i].length; j++) {
                var fx = groups[i][j].fx;
                for (k = 0; k < fx.length; k++) {
                    fx[k].index = infoIndexMapping[fx[k].index];
                }
            }
        }

        return groups;
    };

    /**
     * Adjusts the speeds in the model.
     * @param dt
     * @returns {Number}
     *   The corrected dt during which extrapolation of speeds is safe.
     */
    this.adjust = function(dt) {
        this.frameDt = dt;

        // Remove collision points that have slided away from the collision edge.
        if (this.scene.collisionPoints.length > 0) {
            this.scene.collisionPoints = this.scene.collisionPoints.filter(function (cp) {
                var x = cp.edge.getPointLateralPositionRelativeToThis(cp.point);
                var correct = true;
                if (x < 0) {
                    correct = -x * cp.edge.edgeLength <= Scene.COLLISION_PROXIMITY;
                } else if (x > 1) {
                    correct = (x - 1) * cp.edge.edgeLength <= Scene.COLLISION_PROXIMITY;
                }
                return correct;
            });
        }

        // Initialize collision point meta information.
        this.initCollisionPoints();

        if (this.info.length == 0) {
            return dt;
        }

        // Split collision points into connected groups.
        var groups = this.getCollisionPointGroups();
        var newInfo = [];

        for (var i = 0; i < groups.length; i++) {
            var group = new SpeedAdjusterGroup(this, groups[i]);
            var obj = group.adjust();
            var newInfoObjects = obj.info;

            if (obj.dt < dt) {
                // Adjust max dt.
                dt = obj.dt;
            }

            // Combine point info for look-ahead correction.
            newInfo = newInfo.concat(newInfoObjects);
        }

        // Set new collision points.
        this.scene.collisionPoints = newInfo.map(function(item) {return item.cp});
        this.info = newInfo;

        return dt;
    };

};

/**
 * A group of speed-adjusted items.
 * @param speedAdjuster
 * @param info
 *   Point info.
 * @constructor
 */
var SpeedAdjusterGroup = function(speedAdjuster, info) {

    var self = this;

    /**
     * The speed adjuster.
     */
    this.speedAdjuster = speedAdjuster;

    /**
     * Collision point speed component info.
     * @type {Object[]}
     */
    this.info = info;

};

/**
 * Returns the items to be used in the matrix solver
 * @return Array
 */
SpeedAdjusterGroup.prototype.getSolverItems = function() {
    var items = [];

    // Use matrix solver to get result.
    for (var i = 0; i < this.info.length; i++) {
        // Get vd.
        var vd = this.getNormalSpeedDiff(
            this.info[i].o1.speed,
            this.info[i].o1.rotationSpeed,
            this.info[i].r1,
            this.info[i].o2.speed,
            this.info[i].o2.rotationSpeed,
            this.info[i].r2,
            this.info[i].n
        );

        var key = this.info[i].key;
        var time = this.info[i].o1.t;
        var bounce = false;
        if (!this.speedAdjuster.lastCollisionsTimes.hasOwnProperty(key) || (time > this.speedAdjuster.lastCollisionsTimes[key] + 0.25 || (time == this.speedAdjuster.lastCollisionsTimes[key]))) {
            bounce = true;
        } else {
            bounce = false;
        }

        this.speedAdjuster.lastCollisionsTimes[key] = time;

        var d;
        if (this.info[i].connection) {
            d = -vd;
        } else {
            if (bounce) {
                d = -vd * 1.2;
            } else {
                // In case that there is a distance between the edge and the point, let some of the speed
                // remain so that the distance will decrease.
                if (this.info[i].dist > .1 * Scene.COLLISION_PROXIMITY) {

                    // Get required speed in order to compensate during dt timeframe.
                    var s = (.1 * Scene.COLLISION_PROXIMITY - this.info[i].dist) / this.speedAdjuster.frameDt;

                    if (vd > 0) {
                        d = -vd;
                    } else {
                        if (vd > s) {
                            d = -vd;
                        } else {
                            d = s - vd;
                        }
                    }
                } else {
                    if (this.info[i].dist < 0) {
                        if (this.info[i].dist < -Scene.COLLISION_PROXIMITY) {
                            console.log('large collision overlap: ' + this.info[i].dist);
                        }
                        // Correct by applying extra impulse.
                        // Get required speed in order to compensate during dt timeframe.
                        var s = (.1 * Scene.COLLISION_PROXIMITY - this.info[i].dist) / this.speedAdjuster.frameDt;
                        d = s - vd;
                    } else {
                        d = -vd;
                    }
                }
            }
        }

        var item = {diff: d, fx: this.info[i].fx, conn: this.info[i].connection};

        items.push(item);
    }

    return items;
};

/**
 * Checks the existing scene and adjust speeds. Deletes collision points that are no longer valid.
 * @return {{info: Array, dt: Number}}
 *   The collision points that remain and the max time step to be valid.
 */
SpeedAdjusterGroup.prototype.adjust = function() {
    var i;

    var items = this.getSolverItems();

    // Solve the situation.
    this.speedAdjuster.staticSolverEngine.initialize(items);

    this.solve(items);

    // Apply initial solution's speeds to objects.
    var result = this.speedAdjuster.staticSolverEngine.getSolution();
    this.applyCollisionPointSpeeds(result);

//console.log(this.speedAdjuster.staticSolverEngine.toString());
    // Applies friction impulse.
    this.applyFriction(result);

    // Re-roll the static solver engine, using the new diffs for friction.
    var newSolverItems = this.getSolverItems();
    var newDiffs = newSolverItems.map(function(item) {return item.diff;});
    this.speedAdjuster.staticSolverEngine.diffs = newDiffs;
    this.solve(newSolverItems);

    // Apply solution's speeds to objects.
    result = this.speedAdjuster.staticSolverEngine.getSolution();
    this.applyCollisionPointSpeeds(result);

    // Get max dt.
    var dt = this.getSolutionMaxDt();

    // Remove collision points that are no longer valid from all groups.
    var newInfos = [];
    for (i = 0; i < this.info.length; i++) {
        if (!this.info[i].connection) {
            if (!(result[i] == 0 && (this.info[i].dist > .2) && (!this.speedAdjuster.lastLookAheadCps.hasOwnProperty(this.info[i].key)))) {
                newInfos.push(this.info[i]);
            }
        }
    }

    return {info: newInfos, dt: dt};
};

/**
 * Finds the max dt at which at least no collision point penetrates the edge object for more than 10cm.
 * @return {Number}
 */
SpeedAdjusterGroup.prototype.getSolutionMaxDt = function() {
    var dt = this.speedAdjuster.frameDt;
    var steps = 0;
    var i;

    while(true) {

        // Try out the newly applied speeds.
        var maxDistDiff = 0;
        for (i = 0; i < this.info.length; i++) {
            if (!this.info[i].connection && !this.speedAdjuster.staticSolverEngine.killed[i]) {
                var dist2 = this.progressCollisionPointPeek(this.info[i].cp, this.speedAdjuster.scene.t + dt);
                if (dist2 < 0) {
                    var d = dist2 - this.info[i].dist;
                    maxDistDiff = Math.min(d, maxDistDiff);
                }
            }
        }

        if (maxDistDiff > -0.5 * Scene.COLLISION_PROXIMITY) {
            // Done!
            break;
        } else {
            // Decrease time step for next try (even if it may not be necessary).
            dt = dt * .5;
            steps++;
            if (steps > 10) {
                logSituation();
                console.error("can't fix look-ahead problems in frame " + scene.frame);

                // Let's hope this won't break everything.
                break;
            }
        }
        if (steps >= 5) {
            console.log('serious look-ahead issue');
        }
    }

    return dt;
};

/**
 * Applies the speed delta vector to the collision points.
 * @param {Number[]} result
 */
SpeedAdjusterGroup.prototype.applyCollisionPointSpeeds = function(result) {
    for (var i = 0; i < this.info.length; i++) {
        var r = result[i];
        if (r != 0) {
            this.info[i].o1.speed = this.info[i].o1.speed.add(this.info[i].dv1.mul(r));
            this.info[i].o2.speed = this.info[i].o2.speed.add(this.info[i].dv2.mul(r));
            this.info[i].o1.rotationSpeed += this.info[i].dw1 * r;
            this.info[i].o2.rotationSpeed += this.info[i].dw2 * r;
        }
    }
};

/**
 * Solves the static collision points model.
 */
SpeedAdjusterGroup.prototype.solve = function(items) {
    var self = this;

    try {
        try {
            self.speedAdjuster.staticSolverEngine.solve();
        } catch(err) {
            if (err instanceof FalseOverflowError) {
                // Make a small adjustment. This may introduce a slight solution error but at least makes the matrix solvable.
                for (var i = 0; i < items[err.index].fx.length; i++) {
                    if (items[err.index].fx[i].index == err.index2) {
                        items[err.index].fx[i].effect += 1e-5;
                    }
                }
                for (i = 0; i < items[err.index2].fx.length; i++) {
                    if (items[err.index2].fx[i].index == err.index) {
                        items[err.index2].fx[i].effect -= 1e-5;
                    }
                }

                self.speedAdjuster.staticSolverEngine.initialize(items);

                try {
                    self.speedAdjuster.staticSolverEngine.solve();
                } catch(err2) {
                    if (err2 instanceof FalseOverflowError) {
                        // Remove point altogether and let the main-loop infinite collision detection handle this situation.
                        console.log('false overflow error killPoint situation in frame ' + scene.frame);
                        self.speedAdjuster.staticSolverEngine.killPoint(err2.index);
                        self.speedAdjuster.staticSolverEngine.solve();
                    } else {
                        throw err2;
                    }
                }

            } else {
                throw err;
            }
        }
    } catch(e) {
        logSituation();
        console.error(e);
        console.error("static solver info: \n" + this.speedAdjuster.staticSolverEngine.toString() + "\n\n\nItems: " + JSON.stringify(items));

        // Continue and wish for the best.
    }

    if (!this.speedAdjuster.staticSolverEngine.solvedCorrectly(1e-4)) {
        logSituation();
        console.error("static solver engine didn't solve correctly in frame " + scene.frame + ": \n" + this.speedAdjuster.staticSolverEngine.toString() + "\n\n\nItems: " + JSON.stringify(items));
        // This is not a show stopper.
    }
};

/**
 * Peeks into the future and returns the distance between the collision point and the collision edge.
 * @param {CollisionPoint} cp
 *   The collision point to 'peek' for.
 * @param t
 *   The peeking time.
 * @returns {number}
 *   This distance, in m. Negative means that the cp has penetrated the edge.
 */
SpeedAdjusterGroup.prototype.progressCollisionPointPeek = function(cp, t) {
    // Remember current situation.
    cp.pointSolidObject.saveSituation();
    cp.edgeSolidObject.saveSituation();

    // Step ahead to dt.
    cp.pointSolidObject.setT(t);
    cp.pointSolidObject.updateCornerPoint(cp.point);

    cp.edgeSolidObject.setT(t);
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
 * Applies friction.
 * @param {number[]} pushSpeeds
 *   The amount of m/s that the edge and point were pushed away (results in the speed adjuster).
 */
SpeedAdjusterGroup.prototype.applyFriction = function(pushSpeeds) {
    // Calculate friction.
    for (var i = 0; i < pushSpeeds.length; i++) {
        if (this.info[i].connection) {
            return;
        }

        if (pushSpeeds[i] > 0) {
            // How much impulse was applied on the collision point to counter the collision?
            var p = pushSpeeds[i] * this.info[i].impulsePerSpeedDiff;

            // Scale to friction impulse using a constant (this could depend on the edge and point materials, but for now it is always the same).
            var frictionImpulse = p * .2;

            // Get perpendicular collision edge normal (for friction calculations).
            var nPerp = this.info[i].n.getPerp();

            // Get perpendicular speed difference on the collision edge.
            var vd = this.getNormalSpeedDiff(
                this.info[i].o1.speed,
                this.info[i].o1.rotationSpeed,
                this.info[i].r1,
                this.info[i].o2.speed,
                this.info[i].o2.rotationSpeed,
                this.info[i].r2,
                nPerp
            );

            if (vd > 0) {
                // Change direction of frictionImpulse.
                frictionImpulse = -frictionImpulse;
            }

            // Get the speed effect per 1 unit of moment of applied friction.
            var mDv1Perp = nPerp.mul(-1 / this.info[i].o1.mass);
            var mDv2Perp = nPerp.mul(1 /this.info[i].o2.mass);
            var mDw1Perp = -this.info[i].r1.crossProduct(nPerp) / this.info[i].o1.inertia;
            var mDw2Perp = this.info[i].r2.crossProduct(nPerp) / this.info[i].o2.inertia;

            // Get the vd netto result of 1 unit of moment of applied friction.
            var vdNetto = ((mDv2Perp.add(this.info[i].r2.getPerp().mul(mDw2Perp))).d(nPerp) - (mDv1Perp.add(this.info[i].r1.getPerp().mul(mDw1Perp))).d(nPerp));

            // Check if the friction effect causes a change in speed direction.
            if (vd > 0) {
                if (vdNetto * frictionImpulse < -vd) {
                    // Yes it does! Limit the friction to get equal speeds.
                    frictionImpulse = -vd / vdNetto;
                }
            } else {
                if (vdNetto * frictionImpulse > -vd) {
                    // Yes it does! Limit the friction to get equal speeds.
                    frictionImpulse = -vd / vdNetto;
                }
            }

            // Always have some friction, even if the speed does not require this.
            frictionImpulse = Math.min(frictionImpulse, 300);

            // Apply the friction impulse on both solid objects.
            this.info[i].o1.applyImpulseAbsolute(
                this.info[i].abs,
                nPerp,
                -frictionImpulse,
                true
            );

            this.info[i].o2.applyImpulseAbsolute(
                this.info[i].abs,
                nPerp,
                frictionImpulse,
                true
            );
        }
    }
};

/**
 * Returns the collision point speed diff.
 * @param {object} info
 *   Collision point info.
 * @returns {number}
 */
SpeedAdjusterGroup.prototype.getCollisionPointSpeedDiff = function(info) {
    return this.getNormalSpeedDiff(info.o1.speed, info.o1.rotationSpeed, info.r1, info.o2.speed, info.o2.rotationSpeed, info.r2, info.n);
};

/**
 * Returns the speed difference between both solid objects relative to the normal.
 * @param {Vector} v1
 *   Linear speed of solid object 1.
 * @param {Number} w1
 *   Rotation speed of so 1.
 * @param {Vector} r1
 *   Distance of CM of so 1 to collision point.
 * @param {Vector} v2
 *   Linear speed of solid object 2.
 * @param {Number} w2
 *   Rotation speed of so 2.
 * @param {Vector} r2
 *   Distance of CM of so 2 to collision point.
 * @param {Vector} n
 *   The speed diff normal.
 * @returns {number}
 *   The speed difference. Negative is 1 moving towards 2 (and vice versa), positive is 1 moving away from 2.
 */
SpeedAdjusterGroup.prototype.getNormalSpeedDiff = function(v1, w1, r1, v2, w2, r2, n) {
    // Calculate current speeds at collision point.
    var v1AtCp = v1.add(r1.getPerp().mul(w1));
    var v2AtCp = v2.add(r2.getPerp().mul(w2));

    // Calculate speeds relative to normal.
    var v1n = v1AtCp.d(n);
    var v2n = v2AtCp.d(n);

    // Get current collision 'opposite' speed (negative is towards each other, positive is away of each other).
    return v2n - v1n;
};

