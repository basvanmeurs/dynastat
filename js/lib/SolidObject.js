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
    this.position = null;

    /**
     * The speed of this vector.
     * @type {Vector}
     */
    this.speed = null;

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
     * If this is a child object, the parent it belongs to.
     * @type {SolidObject}
     * @private
     * @note This may not be modified after the initChild call.
     */
    this.parent = null;

    /**
     * The mount point on the parent, relative to the CM.
     * @type {Vector}
     */
    this.parentMountPoint = null;

    /**
     * The mount point on the child, relative to the CM.
     * @type {Vector}
     */
    this.childMountPoint = null;

    /**
     * If set to true, this child acts as part of the body of the parent in collision response but it may be rotated seperately (better performance).
     * The rotation is NOT affected by collisions so must be managed by external impulse applications.
     * @type {boolean}
     */
    this.fixed = false;

    /**
     * If this is a fixed child, the fixed parent, or it's fixed parent, or it's fixed grandparent, etc.
     * @type {SolidObject}
     */
    this.fixedParentRoot = null;

    /**
     * The fixed children and descendants that have this solid object as their fixed root.
     * @type {Array}
     */
    this.fixedDescendants = [];

    /**
     * Initializes the object with the specified data.
     * @param {Scene} scene
     * @param {number} mass
     * @param {number} inertia
     * @param {Vector} position
     * @param {Vector[]} cornerPointCoordinates
     */
    this.init = function(scene, mass, inertia, position, cornerPointCoordinates) {
        var i;
        this.scene = scene;
        this.mass = mass;

        this.position = position;
        this.speed = new Vector(0, 0);
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

        if (inertia) {
            this.inertia = inertia;
        } else {
            this.estimateInertia();
        }
    };

    /**
     * Initializes the object with the specified data.
     * @param {Scene} scene
     * @param {number} mass
     * @param {number} inertia
     * @param {SolidObject} parent
     * @param {Vector} parentMountPoint
     * @param {Vector} childMountPoint
     * @param {Vector[]} cornerPointCoordinates
     * @param {Boolean} [fixed]
     */
    this.initChild = function(scene, mass, inertia, parent, parentMountPoint, childMountPoint, cornerPointCoordinates, fixed) {
        var i;
        this.scene = scene;
        this.mass = mass;
        this.parent = parent;
        this.parentMountPoint = parentMountPoint;
        this.childMountPoint = childMountPoint;
        this.fixed = fixed ? true : false;

        if (this.fixed) {
            // Register fixed root.
            this.fixedParentRoot = this.parent;
            while(this.fixedParentRoot.parent && this.fixedParentRoot.fixed) {
                this.fixedParentRoot = this.parent.parent;
            }
            this.fixedParentRoot.fixedDescendants.push(this);
        }

        if (!this.fixed) {
            this.speed = new Vector(0, 0);
        }

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

        if (inertia) {
            this.inertia = inertia;
        } else {
            this.estimateInertia();
        }
    };

    /**
     * Returns the combined fixed mass.
     * @return {Number}
     */
    this.getMass = function() {
        if (this.fixedDescendants.length > 0) {
            // Fixed parent root.
            var total = this.mass;
            for (var i = 0; i < this.fixedDescendants.length; i++) {
                total += this.fixedDescendants[i].mass;
            }
            return total;
        } else {
            return this.mass;
        }
    };

    /**
     * Returns the combined fixed inertia.
     * @return {Number}
     */
    this.getInertia = function() {
        // @todo: provide algorithm to combine, or keep this manually?
        return this.inertia;
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
     * Sets the time.
     * @param {Number} t
     */
    this.setT = function(t) {
        if (this.parent) {
            // The parent must have the same time in order to be able to calculate the correct position.
            this.parent.setT(t);
        }

        var dt = t - this.t;
        this.t = t;
        if (dt != 0) {
            this.rotation += this.rotationSpeed * dt;
            this.boundingBox = null;
            this.rotationCosSin = null;

            if (!this.parent) {
                this.position.x += this.speed.x * dt;
                this.position.y += this.speed.y * dt;
            } else {
                // Reset cached position.
                this.position = null;
            }

            // Update all absolute positions of the corner points.
            this.updateCornerPoints();
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
     * Returns the position of the center of this solid object (absolute).
     */
    this.getPosition = function() {
        if (this.parent && !this.position) {
            var coords = this.parent.getAbsoluteCoordinates(this.parentMountPoint);
            var mp = this.getInverseAbsoluteRotatedCoordinates(this.childMountPoint);
            this.position = coords.sub(mp);
        }
        return this.position;
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
     * Returns the current rotation relative to the world.
     */
    this.getAbsoluteRotation = function() {
        if (this.parent && this.fixed) {
            return this.rotation + this.parent.getAbsoluteRotation();
        } else {
            return this.rotation;
        }
    };

    /**
     * Returns the cosinus and sinus of the current rotation.
     * @returns {{cos: number, sin: number}|*}
     */
    this.getAbsoluteRotationCosSin = function() {
        if (this.rotationCosSin == null) {
            var rotation = this.getAbsoluteRotation();
            this.rotationCosSin = {
                cos: Math.cos(rotation),
                sin: Math.sin(rotation)
            }
        }
        return this.rotationCosSin;
    };

    /**
     * Returns the speed of this solid object at the specified absolute coordinates.
     * @param coordinates
     */
    this.getSpeedAt = function(coordinates) {
        var relCoordinates = coordinates.sub(this.getPosition());
        var localRotationSpeed = relCoordinates.getPerp().mul(this.rotationSpeed);

        if (this.parent && this.fixed) {
            var speed = this.parent.getSpeedAt(coordinates);

            // Add local rotation to the speed.
            return speed.add(localRotationSpeed);
        } else {
            return this.speed.add(localRotationSpeed);
        }
    };

    /**
     * Returns the absolute world coordinates for the relative object coordinates.
     * @param {Vector} coordinates
     * @return {Vector}
     */
    this.getAbsoluteCoordinates = function(coordinates) {
        var pos = this.getPosition();
        var v = this.getAbsoluteRotationCosSin();
        return new Vector(coordinates.x * v.cos - coordinates.y * v.sin + pos.x, coordinates.x * v.sin + coordinates.y * v.cos + pos.y);
    };

    /**
     * Returns the relative object coordinates for the absolute world coordinates.
     * @param {Vector} coordinates
     * @return {Vector}
     */
    this.getRelativeCoordinates = function(coordinates) {
        var pos = this.getPosition();
        var v = this.getAbsoluteRotationCosSin();
        var dx = coordinates.x - pos.x;
        var dy = coordinates.y - pos.y;
        return new Vector(dx * v.cos + dy * v.sin, -dx * v.sin + dy * v.cos);
    };

    /**
     * Returns the rotated object coordinates for the relative coordinates.
     * @param {Vector} coordinates
     * @return {Vector}
     */
    this.getAbsoluteRotatedCoordinates = function(coordinates) {
        var v = this.getAbsoluteRotationCosSin();
        return new Vector(coordinates.x * v.cos + coordinates.y * v.sin, coordinates.x * v.sin - coordinates.y * v.cos);
    };

    /**
     * Returns the inversely rotated object coordinates for the relative coordinates.
     * @param {Vector} coordinates
     * @return {Vector}
     */
    this.getInverseAbsoluteRotatedCoordinates = function(coordinates) {
        var v = this.getAbsoluteRotationCosSin();
        return new Vector(coordinates.x * v.cos - coordinates.y * v.sin, coordinates.x * v.sin + coordinates.y * v.cos);
    };

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
     * @param {Boolean} direct
     *   If not direct, the speed addition will be postponed until the next call to applyAddedSpeed.
     */
    this.addSpeed = function(x, y, rot, direct) {
        if (this.fixedParentRoot) {
            // Add vector speed to the fixed parent root.
            this.fixedParentRoot.addSpeed(x, y, rot, direct);
        } else {
            if (direct) {
                this.speed.x += x;
                this.speed.y += y;
                this.rotationSpeed += rot;
            } else {
                this.addedSpeed.x += x;
                this.addedSpeed.y += y;
                this.addedRotationSpeed += rot;
            }
        }
    };

    /**
     * Adds rotational speed to the local child object.
     * @param rot
     * @param direct
     */
    this.addFixedChildRotationSpeed = function(rot, direct) {
        if (direct) {
            this.rotationSpeed += rot;
        } else {
            this.addedRotationSpeed += rot;
        }
    };

    /**
     * Applies the added speed to the model's speed.
     * This is only done just before an speed adjustment.
     */
    this.applyAddedSpeed = function() {
        this.addSpeed(this.addedSpeed.x, this.addedSpeed.y, this.addedRotationSpeed, true);

        this.addedSpeed.x = 0;
        this.addedSpeed.y = 0;
        this.addedRotationSpeed = 0;
    };

    /**
     * Returns the subject without the filtered intersections.
     * @param {Array[]} subject
     * @param {Array[]} filtered
     */
    this.getFilteredIntersections = function(subject, filtered) {
        var i, j;

        var newSubject = [];
        var n1 = subject.length;
        var n2 = filtered.length;
        for (i = 0; i < n1; i++) {
            for (j = 0; j < n2; j++) {
                if (subject[i][0] == filtered[j][0] && subject[i][1] == filtered[j][1]) {
                    // Exists. Go to next item.
                    i++;
                    j = 0;
                    if (i == n1) {
                        return newSubject;
                    }
                }
            }
            newSubject.push(subject[i]);
        }

        return newSubject;
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
     * @post
     *   Both of the solid objects will be progressed to either maxTime or the collision time.
     */
    this.getCollision = function(that, time, maxTime) {
        if (this.parent == that || that.parent == this) {
            return null;
        }

        var intersections;

        // Go to the end of the time frame.
        this.setT(maxTime);
        that.setT(maxTime);

        if (!this.checkCollisionBounds(that)) {
            return null;
        }

        intersections = this.getIntersections(that);

        if (intersections.length == 0) {
            // No collision at the end: we assume that there was non collision at all during the time frame.
            return null;
        } else {
            var negativeT = time;
            var positiveT = maxTime;

            // We are sure that a collision occurs.

            // Gather the intersections that already occur at start time; these may lead to infinite loops so we will remove them.
            this.setT(time);
            that.setT(time);
            var startIntersections = this.getIntersections(that);

            var hasStartIntersections = (startIntersections.length > 0);
            if (hasStartIntersections) {
                intersections = this.getFilteredIntersections(intersections, startIntersections);
                if (intersections.length == 0) {
                    return null;
                }
            }

            // Logaritmically search for it.
            var t, is, collisionPoints;
            var recursionCounter = 0;
            var inc = 0;

            // Because intersections might have already been found, we'll use a recursion counter to prevent infinite looping.
            while(true) {
                recursionCounter++;
                if (recursionCounter > 20) {
                    // Infinite loop. In this emergency situation it's best to ignore the collision altogether.
                    console.log('infinite loop detected');
                    return null;
                }

                t = 0.5 * (negativeT + positiveT);
                this.setT(t);
                that.setT(t);

                is = null;
                if (this.checkCollisionBounds(that)) {
                    is = this.getIntersections(that);
                    if (hasStartIntersections) {
                        is = this.getFilteredIntersections(is, startIntersections);
                    }
                }
                if (is == null || is.length == 0) {
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

            return [];
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
     * @return {Array[]}
     *   Each array contains another array with thisCp (corner point), thatCp (corner point) and pcps (array if numbers).
     *   The intersections; an empty array if there are no intersections at all.
     * @pre this.t == that.t, otherwise we're comparing bogus.
     */
    this.getIntersections = function(that) {
        var intersections = [];

        // Investigate all edge combinations.
        for (var i = 0; i < this.cornerPoints.length; i++) {
            for (var j = 0; j < that.cornerPoints.length; j++) {
                if (this.cornerPoints[i].checkCollisionBounds(that.cornerPoints[j])) {
                    var info = this.cornerPoints[i].getIntersection(that.cornerPoints[j]);
                    if (info != null) {
                        // Intersection!
                        intersections.push([this.cornerPoints[i], that.cornerPoints[j], info]);
                    }
                }
            }
        }

        return intersections;
    };

    /**
     * Returns the collision info if the current non-intersection situation is a valid collision situation for the
     * previously found intersections.
     * @param {SolidObject} that
     * @param {Array[]} intersections
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
            var pcps = intersection[0].getValidPossibleCollisionPoints(intersection[1], intersection[2]);

            // If none, this collision is invalid.
            if (pcps.length > 0) {
                // If there are multiple valid pcps, we choose the first one as if it occurs earlier.
                var pcp = pcps[0];
                var cp;
                switch (pcp) {
                    case 0:
                        cp = new CollisionPoint(this, intersection[0], that, intersection[1]);
                        break;
                    case 1:
                        cp = new CollisionPoint(this, intersection[0].next, that, intersection[1]);
                        break;
                    case 2:
                        cp = new CollisionPoint(that, intersection[1], this, intersection[0]);
                        break;
                    case 3:
                        cp = new CollisionPoint(that, intersection[1].next, this, intersection[0]);
                        break;
                }
                collisionPoints.push(cp);
            }
        }

        if (collisionPoints.length == 0) {
            return collisionPoints;
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
     *   The direction (normal) of the applied impulse (relative).
     * @param {Number} impulse
     *   The impulse in kg * m/s.
     * @param {Boolean} direct
     *   If not direct, the speed addition will be postponed until the next call to applyAddedSpeed.
     */
    this.applyImpulse = function(coords, n, impulse, direct) {
        // Calculate rotational effect.
        var dw = coords.getPerp().d(n) * (impulse / this.inertia);

        // Calculate absolute effect.
        var dv = n.rotate(this.rotation).mul(impulse / this.mass);

        // Add speed upon next round.
        this.addSpeed(dv.x, dv.y, dw, direct);
    };

    /**
     * Applies the specified impulse at the specified point in the absolute object space.
     * @param {Vector} coords
     *   Absolute coords.
     * @param {Vector} n
     *   The direction (normal) of the applied impulse (absolute).
     * @param {Number} impulse
     *   The impulse in kg * m/s.
     * @param {Boolean} direct
     *   If not direct, the speed addition will be postponed until the next call to applyAddedSpeed.
     */
    this.applyImpulseAbsolute = function(coords, n, impulse, direct) {
        var relCoords = this.getRelativeCoordinates(coords);
        var relN = n.rotate(-this.rotation);
        this.applyImpulse(relCoords, relN, impulse, direct);
    };
};