/**
 * A solid 2d polygonal object
 * @constructor
 */
var SolidObject = function() {

    /**
     * The scene that this object belongs to.
     * @type {Scene}
     */
    this.scene = null;

    /**
     * Time since the start.
     * @type {number}
     */
    this.t = 0;

    /**
     * The confirmed time.
     * @type {number}
     */
    this.confirmedT = 0;

    /**
     * The mass of the object, in kg.
     * @type {number}
     */
    this.mass = 100;

    /**
     * The inertia of this object. For a disc this is .25 * r * r * m.
     * @type {number}
     */
    this.inertia = 100;

    /**
     * The position of this object.
     * @type {Vector}
     */
    this.position = new Vector(0, 0);

    /**
     * The speed of this vector.
     * @type {Vector}
     */
    this.speed = new Vector(0, 0);

    /**
     * The current rotational position.
     * @type {number}
     */
    this.rotation = 0;

    /**
     * The rotational speed in rads/sec.
     * @type {number}
     */
    this.rotationSpeed = 0;

    /**
     * The corner points.
     * @type {CornerPoint[]}
     */
    this.cornerPoints = [];

    /**
     * The cached bounding box.
     * @type {{min: Vector, max: Vector}}
     */
    this.boundingBox = null;

    /**
     * The cached rotation cosinus and sinus.
     * @type {{cos: Number, sin: Number}}
     */
    this.rotationCosSin = null;

    /**
     * The index of the solid object, which can be used as identifier.
     * @type {number}
     */
    this.index = null;

    /**
     * The speed to be added (from external sources) during the next round.
     * @type {Vector}
     */
    this.addedSpeed = new Vector(0, 0);

    /**
     * The rotation speed to be added (from external sources) during the next round.
     * @type {number}
     */
    this.addedRotationSpeed = 0;

    /**
     * Adds speed.
     * This method should be used instead of directly modifying this.speed and this.rotationSpeed so that the physics
     * keep working correctly.
     * @param {number} x
     *   x-acceleration of the cm.
     * @param {number} y
     *   y-acceleration of the cm.
     * @param {number} rot
     *   rotational acceleration.
     */
    this.addSpeed = function(x, y, rot) {
        this.addedSpeed.x += x;
        this.addedSpeed.y += y;
        this.addedRotationSpeed += rot;
    };

    /**
     * Applies the added speed to the model's speed.
     * This is only done just before an speed adjustment.
     */
    this.applyAddedSpeed = function() {
        this.speed.x += this.addedSpeed.x;
        this.speed.y += this.addedSpeed.y;
        this.rotationSpeed += this.addedRotationSpeed;

        this.addedSpeed.x = 0;
        this.addedSpeed.y = 0;
        this.addedRotationSpeed = 0;
    };

    /**
     * Sets a restore point of current speed and added speed.
     */
    this.setSpeedReset = function() {
        this.speedResetData = [this.speed.clone(), this.rotationSpeed];
    };

    /**
     * Reset speeds as they were at the last speed reset.
     * @see setSpeedReset.
     */
    this.resetSpeed = function() {
        this.speed = this.speedResetData[0];
        this.rotationSpeed = this.speedResetData[1];
    };

    this.savedSituation = null;
    this.saveSituation = function() {
        this.savedSituation = [this.t, this.position.clone(), this.rotation, this.boundingBox, this.rotationCosSin];
        var cps = [];
        for (var i = 0; i < this.cornerPoints.length; i++) {
            cps[i] = [this.cornerPoints[i].absoluteCoordinates.clone(), this.cornerPoints[i].collisionHelperVariables]
        }
        this.savedSituation.push(cps);
    };

    this.resetSituation = function() {
        this.t = this.savedSituation[0];
        this.position = this.savedSituation[1];
        this.rotation = this.savedSituation[2];
        this.boundingBox = this.savedSituation[3];
        this.rotationCosSin = this.savedSituation[4];

        var cps = this.savedSituation[5];
        for (var i = 0; i < cps.length; i++) {
            this.cornerPoints[i].absoluteCoordinates = cps[i][0];
            this.cornerPoints[i].collisionHelperVariables = cps[i][1];
        }
    };

    /**
     * Takes a time step.
     * @param dt
     * @param {Boolean} [doNotUpdateCornerPoints]
     */
    this.step = function(dt, doNotUpdateCornerPoints) {
        this.t += dt;
        this.position.x += this.speed.x * dt;
        this.position.y += this.speed.y * dt;
        this.rotation += this.rotationSpeed * dt;
        this.boundingBox = null;
        this.rotationCosSin = null;

        // Update all absolute positions of the corner points.
        if (!doNotUpdateCornerPoints) {
            this.updateCornerPoints();
        }
    };

    /**
     * Sets the time.
     * @param {Number} t
     */
    this.setT = function(t) {
        var dt = t - this.t;
        if (dt != 0) {
            this.step(dt);
        }
    };

    /**
     * Confirms the time. After calling this, the time can't be reversed.
     * @param t
     */
    this.confirmT = function(t) {
        var ft = t - this.confirmedT;
        this.confirmedT = t;
        this.scene.stepCallback(this, ft);
    };

    /**
     * Updates the absolute coordinates of the corner points.
     */
    this.updateCornerPoints = function() {
        for (var i = 0; i < this.cornerPoints.length; i++) {
            this.updateCornerPoint(this.cornerPoints[i]);
        }
    };

    /**
     * Updates the specified corner point.
     * @param {CornerPoint} cp
     */
    this.updateCornerPoint = function(cp) {
        cp.setAbsoluteCoordinates(this.getAbsoluteCoordinates(cp.coordinates));
    };

    /**
     * Seeks and returns a collision between so1 and so2 in the specified time frame.
     * @param {SolidObject} that
     * @param {Number} time
     *   The starting time.
     * @param {Number} maxTime
     *   The max time.
     * @return {CollisionPoint[]}
     *   The collision points at the moment of collision (probably just 1, but in exotic situations there may be more).
     *   An empty array if there was no collision at all.
     */
    this.getCollision = function(that, time, maxTime) {
        var i, intersections;

        // Check if non-collision at start time.
        this.setT(time);
        that.setT(time);
        intersections = this.getIntersections(that);
        if (intersections.length > 0) {
            // Intersection at the start: do not seek for a collision.
            return [];
        }

        // Go to the end of the time frame.
        this.setT(maxTime);
        that.setT(maxTime);
        intersections = this.getIntersections(that);
        if (intersections.length == 0) {
            // No collision at the end: we assume that there was non collision at all during the time frame.
            return [];
        } else {
            var negativeT = time;
            var positiveT = maxTime;

            // We are sure that a collision occurs.

            // Logaritmically search for it.
            var t, is, collisionPoints;
            var recursionCounter = 0;
            var inc = 0;
            while(true) {
                recursionCounter++;

                t = 0.5 * (negativeT + positiveT);
                this.setT(t);
                that.setT(t);
                is = this.getIntersections(that);
                if (is.length == 0) {
                    negativeT = t;

                    // Check if collision is valid.
                    collisionPoints = this.getValidCollision(that, intersections);
                    if (collisionPoints.length > 0) {
                        return collisionPoints;
                    }

                    inc = 0;
                } else {
                    positiveT = t;
                    intersections = is;

                    if (inc++ == 5) {
                        // Go back to last negative in order to check.
                        this.setT(negativeT);
                        that.setT(negativeT);

                        // Check if collision is valid.
                        collisionPoints = this.getValidCollision(that, intersections);
                        if (collisionPoints.length > 0) {
                            return collisionPoints;
                        }

                        inc = 0;
                    }
                }
            }
        }
    };

    /**
     * Returns true if the x/y-bounds of both solid objects intersect.
     * @param {SolidObject} that
     * @return {Boolean}
     */
    this.checkCollisionBounds = function(that) {
        var bbox1 = this.getBoundingBox();
        var bbox2 = that.getBoundingBox();
        var v = (bbox1.max.x >= bbox2.min.x) &&
            (bbox2.max.x >= bbox1.min.x) &&
            (bbox1.max.y >= bbox2.min.y) &&
            (bbox2.max.y >= bbox1.min.y);
        return v;
    };

    /**
     * Returns all edge intersections that are currently taking place between both solid objects.
     * @param {SolidObject} that
     * @return {{thisCp: CornerPoint, thatCp: CornerPoint, pcps: Number[]}[]}
     *   The intersections; an empty array if there are no intersections at all.
     * @pre this.t == that.t, otherwise we're comparing bogus.
     */
    this.getIntersections = function(that) {
        var intersections = [];

        if (!this.checkCollisionBounds(that)) {
            // No intersections are possible.
            return intersections;
        }

        // Investigate all edge combinations.
        for (var i = 0; i < this.cornerPoints.length; i++) {
            for (var j = 0; j < that.cornerPoints.length; j++) {
                var info = this.cornerPoints[i].getIntersection(that.cornerPoints[j]);
                if (info != null) {
                    // Intersection!
                    intersections.push({thisCp: this.cornerPoints[i], thatCp: that.cornerPoints[j], pcps: info});
                }
            }
        }

        return intersections;
    };

    /**
     * Returns the collision info if the current non-intersection situation is a valid collision situation for the
     * previously found intersections.
     * @param {SolidObject} that
     * @param {{thisCp: CornerPoint, thatCp: CornerPoint, pcps: Number[]}[]} intersections
     * @return {CollisionPoint[]}
     *   The collision points; empty if there is no valid collision.
     * @pre This solid object is currently not intersecting.
     * @pre this.t == that.t, otherwise we're comparing bogus.
     */
    this.getValidCollision = function(that, intersections) {
        var i;
        var collisionPoints = [];
        for (i = 0; i < intersections.length; i++) {
            var intersection = intersections[i];
            // Get the valid collision points.
            var pcps = intersection.thisCp.getValidPossibleCollisionPoints(intersection.thatCp, intersection.pcps);

            // If none, this collision is invalid.
            if (pcps.length == 0) {
                // Return an empty array to indicate that the collision is invalid.
                return [];
            }

            // If there are multiple valid pcps, we choose the first one as if it occurs earlier.
            var pcp = pcps[0];
            var cp;
            switch (pcp) {
                case 0:
                    cp = new CollisionPoint(this, intersection.thisCp, that, intersection.thatCp);
                    break;
                case 1:
                    cp = new CollisionPoint(this, intersection.thisCp.next, that, intersection.thatCp);
                    break;
                case 2:
                    cp = new CollisionPoint(that, intersection.thatCp, this, intersection.thisCp);
                    break;
                case 3:
                    cp = new CollisionPoint(that, intersection.thatCp.next, this, intersection.thisCp);
                    break;
            }
            collisionPoints.push(cp);
        }

        // Finally, filter double collision points.
        var done = {};
        var uniqueCollisionPoints = [];
        for (i = 0; i < collisionPoints.length; i++) {
            var c = collisionPoints[i];
            var key = "" + (c.pointSolidObject == this ? "a" : "b") + c.point.index;
            if (!done.hasOwnProperty(key)) {
                done[key] = true;
                uniqueCollisionPoints.push(c);
            }
        }

        return uniqueCollisionPoints;
    };

    /**
     * Returns the bounding box of all polygonal points.
     * @returns {{min: Vector, max: Vector}}
     */
    this.getBoundingBox = function() {
        if (this.boundingBox == null) {
            var min = new Vector(null,null);
            var max = new Vector(null,null);

            var x, y;
            for (var i = 0; i < this.cornerPoints.length; i++) {
                x = this.cornerPoints[i].getAbsoluteCoordinates().x;
                y = this.cornerPoints[i].getAbsoluteCoordinates().y;
                if (min.x === null) {
                    min.x = x;
                    max.x = x;
                    min.y = y;
                    max.y = y;
                } else {
                    if (x < min.x) min.x = x;
                    if (x > max.x) max.x = x;
                    if (y < min.y) min.y = y;
                    if (y > max.y) max.y = y;
                }
            }

            this.boundingBox = {min: min, max: max};
        }
        return this.boundingBox;
    };

    /**
     * Returns the cosinus and sinus of the current rotation.
     * @returns {{cos: number, sin: number}|*}
     */
    this.getRotationCosSin = function() {
        if (this.rotationCosSin == null) {
            this.rotationCosSin = {
                cos: Math.cos(this.rotation),
                sin: Math.sin(this.rotation)
            }
        }
        return this.rotationCosSin;
    };

    /**
     * Estimates the inertia for the object from the bounding box and the mass.
     */
    this.estimateInertia = function() {
        var bbox = this.getBoundingBox();
        var ul = bbox.min;
        var ur = new Vector(bbox.max.x, bbox.min.y);
        var ll = new Vector(bbox.min.x, bbox.max.y);
        var lr = bbox.max;

        var inertia = ul.d(ul) + ul.d(ur) + ur.d(ur);
        inertia += ul.d(ul) + ul.d(ll) + ll.d(ll);
        inertia += ll.d(ll) + ll.d(lr) + lr.d(lr);
        inertia += ur.d(ur) + ur.d(lr) + lr.d(lr);

        this.inertia = inertia * this.mass / 6;
    };

    /**
     * Returns the absolute world coordinates for the relative object coordinates.
     * @param {Vector} coordinates
     * @return {Vector}
     */
    this.getAbsoluteCoordinates = function(coordinates) {
        var v = this.getRotationCosSin();
        return new Vector(coordinates.x * v.cos - coordinates.y * v.sin + this.position.x, coordinates.x * v.sin + coordinates.y * v.cos + this.position.y);
    };

    /**
     * Initializes the object with the specified data.
     * @param {Scene} scene
     * @param {number} mass
     * @param {Vector} position
     * @param {Vector[]} cornerPointCoordinates
     */
    this.init = function(scene, mass, position, cornerPointCoordinates) {
        var i;
        this.scene = scene;
        this.mass = mass;
        this.position = position;
        this.cornerPoints = [];
        for (i = 0; i < cornerPointCoordinates.length; i++) {
            var point = new CornerPoint(i, cornerPointCoordinates[i]);
            this.cornerPoints.push(point);
        }

        // Set 'next' corner points.
        for (i = 0; i < this.cornerPoints.length - 1; i++) {
            this.cornerPoints[i].setNext(this.cornerPoints[i + 1]);
        }
        this.cornerPoints[this.cornerPoints.length - 1].setNext(this.cornerPoints[0]);

        // Set 'previous' corner points.
        for (i = 1; i < this.cornerPoints.length; i++) {
            this.cornerPoints[i].setPrevious(this.cornerPoints[i - 1]);
        }
        this.cornerPoints[0].setPrevious(this.cornerPoints[this.cornerPoints.length - 1]);

        this.updateCornerPoints();

        this.estimateInertia();
    };

    /**
     * Returns a string representation of the corner point absolute coordinates.
     */
    this.getPolygonString = function() {
        var str = 'so[';
        for (var i = 0; i < this.cornerPoints.length; i++) {
            var coords = this.cornerPoints[i].getAbsoluteCoordinates();
            if (i != 0) {
                str += ' : ';
            }
            var xStr = coords.x.toFixed(2);
            var yStr = coords.y.toFixed(2);
            str += xStr + ',' + yStr;
        }
        str += ']';
        return str;
    };

    /**
     * Applies the specified impulse at the specified point on this solid object.
     * @param {Vector} coords
     *   Coords relative to the unrotated solid object layout.
     * @param {Vector} n
     *   The direction (normal) of the applied impulse.
     * @param {Number} impulse
     *   The impulse in kg * m/s.
     */
    this.applyImpulse = function(coords, n, impulse) {
        // Calculate rotational effect.
        var dw = coords.getPerp().d(n) * (impulse / this.inertia);

        // Calculate absolute effect.
        var dv = n.rotate(this.rotation).mul(impulse / this.mass);

        // Add speed upon next round.
        this.addSpeed(dv.x, dv.y, dw);
    };

};