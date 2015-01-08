/**
 * A corner point of an object
 * @param {number} index
 * @param {Vector} coordinates
 * @constructor
 */
var CornerPoint = function(index, coordinates) {

    /**
     * The index of this corner point in the object polygon.
     * @type {number}
     */
    this.index = index;

    /**
     * The corner point coordinates, relative to the object's cm.
     * @type {Vector}
     */
    this.coordinates = coordinates;

    /**
     * The absolute coordinates, this changes when the solid object's position or rotation changes.
     * @type {Vector}
     * @access private
     */
    this.absoluteCoordinates = null;

    /**
     * The previous sibling corner point on the solid object (index - 1).
     * @type {CornerPoint}
     * @access private
     */
    this.previous = null;

    /**
     * The next sibling corner point on the solid object (index + 1).
     * @type {CornerPoint}
     * @access private
     */
    this.next = null;

    /**
     * The (constant) edge length of this corner point to the next corner point.
     * @type {number}
     */
    this.edgeLength = null;

    /**
     * 1 / edgeLength
     * @type {number}
     */
    this.edgeLengthInverse = null;

    /**
     * Some variables that helps performing efficient collision checks.
     * This should be re-initialized after the coordinates are changed.
     *
     * @type {{edge : Vector, minX : Number, minY: Number, maxX : Number, maxY : Number, mx : Number, my : Number}}
     */
    this.collisionHelperVariables = null;

    /**
     * Returns the current absolute coordinates.
     * @returns {Vector}
     */
    this.getAbsoluteCoordinates = function() {
        return this.absoluteCoordinates;
    };

    /**
     * Sets the absolute coordinates.
     * @param {Vector} coords
     */
    this.setAbsoluteCoordinates = function(coords) {
        this.absoluteCoordinates = coords;
        this.collisionHelperVariables = null;
    };

    /**
     * Sets the next corner point.
     * @param {CornerPoint} next
     */
    this.setNext = function(next) {
        this.next = next;
        this.edgeLength = this.next.coordinates.sub(this.coordinates).getLength();
        this.edgeLengthInverse = 1 / this.edgeLength;
    };

    /**
     * Sets the previous corner point.
     * @param {CornerPoint} previous
     */
    this.setPrevious = function(previous) {
        this.previous = previous;
    };

    /**
     * Returns the collision helper variables.
     * @return {{edge : Vector, minX : Number, minY: Number, maxX : Number, maxY : Number, p : Number, mx : Number, my : Number}}
     */
    this.getCollisionHelperVariables = function() {
        if (this.collisionHelperVariables == null) {
            // Calculate.
            var v = {
                edge: this.next.absoluteCoordinates.sub(this.absoluteCoordinates)
            };
            if (this.absoluteCoordinates.x < this.next.absoluteCoordinates.x) {
                v.minX = this.absoluteCoordinates.x;
                v.maxX = this.next.absoluteCoordinates.x;
            } else {
                v.minX = this.next.absoluteCoordinates.x;
                v.maxX = this.absoluteCoordinates.x;
            }
            if (this.absoluteCoordinates.y < this.next.absoluteCoordinates.y) {
                v.minY = this.absoluteCoordinates.y;
                v.maxY = this.next.absoluteCoordinates.y;
            } else {
                v.minY = this.next.absoluteCoordinates.y;
                v.maxY = this.absoluteCoordinates.y;
            }

            // These are the vectors that can be used to convert absolute coordinates to coordinates relative to this normalized edge (on y=0, with x 0 to 1).
            v.p = 1 / v.edge.d(v.edge); // v.p is the division between the squared length of this edge, which is useful for determining the intersection proximity.
            v.mx = v.edge.mul(v.p);
            v.my = v.edge.getPerp().mul(v.p);

            this.collisionHelperVariables = v;
        }
        return this.collisionHelperVariables;
    };

    /**
     * Returns true if the x/y-bounds of both corner point edges intersect.
     * @param {CornerPoint} that
     * @return {Boolean}
     */
    this.checkCollisionBounds = function(that) {
        var bbox1 = this.getCollisionHelperVariables();
        var bbox2 = that.getCollisionHelperVariables();
        return (bbox1.maxX >= bbox2.minX) &&
            (bbox2.maxX >= bbox1.minX) &&
            (bbox1.maxY >= bbox2.minY) &&
            (bbox2.maxY >= bbox1.minY);
    };

    /**
     * As this and that are not intersecting, the specified possible corner points are checked for non-collision proximity.
     * @param {CornerPoint} that
     *   The corner point for the intersection in which the pcps were found. See getIntersection.
     * @param {Number[]} pcps
     *   The possible corner points. see getIntersection.
     * @return {Number[]}
     *   An array of correct possible corner points (usually just one, in exotic situations there may be 2).
     * @pre There is currently no collision of the solid objects of this and that corner point (so no intersection).
     */
    this.getValidPossibleCollisionPoints = function(that, pcps) {
        var validPcps = [];
        var thisCoords = null, thatCoords = null;
        for (var i = 0; i < pcps.length; i++) {
            var j = pcps[i];

            if (j == 0 || j == 1) {
                if (thisCoords == null) {
                    thisCoords = that.getEdgeCoordinatesRelativeToThis(this);
                }
            } else {
                if (thatCoords == null) {
                    thatCoords = this.getEdgeCoordinatesRelativeToThis(that);
                }
            }

            // Get the coordinates to be checked.
            var coords = null;
            var threshold = null;
            switch(j) {
                case 0:
                    coords = thisCoords.s;
                    threshold = Scene.COLLISION_PROXIMITY * that.edgeLengthInverse;
                    break;
                case 1:
                    coords = thisCoords.e;
                    threshold = Scene.COLLISION_PROXIMITY * that.edgeLengthInverse;
                    break;
                case 2:
                    coords = thatCoords.s;
                    threshold = Scene.COLLISION_PROXIMITY * this.edgeLengthInverse;
                    break;
                case 3:
                    coords = thatCoords.e;
                    threshold = Scene.COLLISION_PROXIMITY * this.edgeLengthInverse;
                    break;
            }

            // Check if within collision proximity outside of the edge.
            if (coords.y >= -1e-12 && coords.y <= threshold) {
                // Notice the small negative margin, because otherwise rounding errors while setting t may cause problems.

                // Check if within 1 mm of the boundary points.
                if (coords.x >= -threshold && coords.x <= 1 + threshold) {
                    // Point is correct.
                    validPcps.push(j);
                }
            }
        }
        return validPcps;
    };

    /**
     * Returns info on the intersection if this corner point's edge intersects that corner point's edge.
     * @param {CornerPoint} that
     * @return {Number[]}
     *   Either null (in case there is no collision), or an array.
     *   The array may contain indices that represent possible collision points (within collision proximity).
     *   Index 0 = this (corner point), 1 = this.next, 2 = that, 3 = that.next.
     */
    this.getIntersection = function(that) {
        if (this.checkCollisionBounds(that)) {
            var coords = this.getEdgeCoordinatesRelativeToThis(that);

            if ((coords.s.y > 0 && coords.e.y > 0) || (coords.s.y < 0 && coords.e.y < 0)) {
                // No y-intersection.
                return null;
            }
            if ((coords.s.x < 0 && coords.e.x < 0) || (coords.s.x > 1 && coords.e.x > 1)) {
                // No x-intersection.
                return null;
            }

            var dy = coords.e.y - coords.s.y;
            if (dy == 0) {
                // Edges are completely overlapping: we do not count this as intersection because there is no clear
                // singular intersection point.
                return null;
            }

            // Check if the intersection point lies within bounds.
            var intersection = this.getIntersectionPoint(coords);
            if ((intersection.thisEdge < 0) || (intersection.thisEdge > 1)) {
                return null;
            }

            // Detect possible collision points.
            var possibleCollisionPoints = [];

            if ((coords.e.y <= 0) && (intersection.thisEdge * this.edgeLength < Scene.COLLISION_PROXIMITY)) {
                // this
                possibleCollisionPoints.push(0);
            }

            if ((coords.s.y <= 0) && ((1 - intersection.thisEdge) * this.edgeLength < Scene.COLLISION_PROXIMITY)) {
                // this.next
                possibleCollisionPoints.push(1);
            }

            if ((coords.s.y <= 0) && (intersection.thatEdge * that.edgeLength < Scene.COLLISION_PROXIMITY)) {
                // that
                possibleCollisionPoints.push(2);
            }

            if ((coords.e.y <= 0) && ((1 - intersection.thatEdge) * that.edgeLength < Scene.COLLISION_PROXIMITY)) {
                // that.next
                possibleCollisionPoints.push(3);
            }

            return possibleCollisionPoints;
        } else {
            // Bounds do not intersect: collision not possible.
            return null;
        }
    };

    /**
     * In case that the edges do NOT intersect, checks if the collision points are valid.
     * A possible collision point is valid if they are still within collision proximity of the other edge.
     * @param {Number[]} possibleCollisionPoints
     *   As returned by edgesIntersect.
     * @return {Boolean}
     *   True if all collision points were valid.
     */
    this.getValidCollisionPoints = function(possibleCollisionPoints) {
        for (var i = 0; i < possibleCollisionPoints.length; i++) {
            var index = possibleCollisionPoints[i];
            switch (index) {
                case 0: //v1.
            }
        }
    };

    /**
     * Returns the coordinates of that edge relative to this edge.
     * @param {CornerPoint} that
     * @return {{s : Vector, e : Vector}}
     *   The start vector and end vector of that edge relative to this edge.
     *   The coordinates space works as follows: the start vector of this edge is [0,0] and the end vector is [1,0].
     */
    this.getEdgeCoordinatesRelativeToThis = function(that) {
        // Get the absolute coordinates of all points.
        var v1 = this.absoluteCoordinates;
        var v2 = this.next.absoluteCoordinates;
        var u1 = that.absoluteCoordinates;
        var u2 = that.next.absoluteCoordinates;

        // We use pre-calculated collision helper variables for performance reasons.
        var v = this.getCollisionHelperVariables();

        // Actually perform the calculations.
        var m = v2.sub(v1);
        var k = u1.sub(v1);
        var l = u2.sub(v1);
        var s = new Vector(v.mx.d(k), v.my.d(k));
        var e = new Vector(v.mx.d(l), v.my.d(l));
        return {s: s, e: e};
    };

    /**
     * Returns the intersection point on both vectors.
     * Notice that touching does not count as intersection.
     * @param {{s : Vector, e : Vector}} coords
     *   The relative coords to this vector, see getRelativeCoordinates.
     * @return {{thisEdge: Number, thatEdge: Number}}
     *   Values between 0 and 1.
     * @pre coords.e.y != coords.s.y
     *   Parallel lines do not intersect.
     */

    this.getIntersectionPoint = function(coords) {
        // Find the x-point at which the lines intersect on the y-axis.
        var dx = coords.e.x - coords.s.x;
        var dy = coords.e.y - coords.s.y;

        // Get intersection point on x-axis.
        var thisEdge = coords.s.x - coords.s.y * (dx / dy);


        var thatEdge = Math.abs(coords.s.y / dy);

        return {thisEdge : thisEdge, thatEdge : thatEdge};
    };

    /**
     * Returns a string representation of the corner point absolute coordinates.
     */
    this.getEdgeString = function() {
        var str = 'edge[' + this.getAbsoluteCoordinates().toString() + " - " + this.next.getAbsoluteCoordinates().toString() + ']';
        return str;
    };

};
