/**
 * Makes sure that speeds are correctly adjusted at all collision points.
 * @param {Scene} scene
 * @constructor
 */
var SpeedAdjuster = function(scene) {

    var self = this;

    /**
     * Used for solving the matrix of speed effects.
     * @type {MatrixSolver}
     */
    this.matrixSolver = null;

    /**
     * The scene.
     * @param {Scene}
     */
    this.scene = scene;

    this.counter = 0;

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
     * Collision point speed component info.
     * @type {Object[]}
     */
    this.info = null;

    /**
     * Collision point item effects.
     * @type {null}
     */
    this.items = null;

    /**
     * Checks the existing scene and adjust speeds. Deletes collision points that are no longer valid.
     * @param {number} dt
     *   The max step duration. Used for intra-step distance compensation with speed.
     */
    this.adjust = function(dt) {
        var i, c, o1, o2;
        this.counter++;

        this.info = [];
        this.items = [];

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

        if (this.scene.collisionPoints.length > 0) {
            for (i = 0; i < this.scene.collisionPoints.length; i++) {
                // Set physics info object for later use.
                this.info[i] = this.getCollisionPointInfo(this.scene.collisionPoints[i]);
            }

            // Per collision point, get other collision points that are affected directly by an opposite speed application.
            for (i = 0; i < this.info.length; i++) {
                var c1 = this.info[i];
                this.info[i].sideEffects = [];
                for (var k = 0; k < this.info.length; k++) {
                    if (i == k) continue;
                    var c2 = this.info[k];

                    // Calculate effect of 1 m/s on c1 on c2's collision point.
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

                    if (effect) {
                        this.info[i].sideEffects.push({index: k, effect: effect});
                    }
                }
            }

            // Keep track of disabled collision points while resolving.
            var disabled = 0;

            // Use matrix solver to get result.
            for (i = 0; i < this.info.length; i++) {
                var cp = this.scene.collisionPoints[i];

                // Get vd.
                var vd = this.getCollisionSpeedDiff(
                    cp.edgeSolidObject.speed,
                    cp.edgeSolidObject.rotationSpeed,
                    this.info[i].r1,
                    cp.pointSolidObject.speed,
                    cp.pointSolidObject.rotationSpeed,
                    this.info[i].r2,
                    this.info[i].n
                );

                var key = "" + cp.edgeSolidObject.index + "-" + cp.edge.index + "_" + cp.pointSolidObject.index + "-" + cp.point.index;
                cp.key = key;
                var time = cp.edgeSolidObject.t;
                var bounce = false;
                if (!this.lastCollisionsTimes.hasOwnProperty(key) || (time > this.lastCollisionsTimes[key] + 0.25)) {
                    bounce = true;
                } else {
                    bounce = false;
                }

                this.lastCollisionsTimes[key] = time;

                var d;
                if (bounce) {
                    d = vd * -1.2;
                } else {
                    // In case that there is a distance between the edge and the point, let some of the speed
                    // remain so that the distance will decrease.
                    if (this.info[i].dist > .1 * Scene.COLLISION_PROXIMITY) {

                        // Get required speed in order to compensate during dt timeframe.
                        var s = (.1 * Scene.COLLISION_PROXIMITY - this.info[i].dist) / dt;

                        if (vd > 0) {
                            d = -vd;
                        } else {
                            if (vd > s) {
                                d = 0;
                            } else {
                                d = s - vd;
                            }
                        }
                    } else {
                        d = -vd;
                    }
                }

                var item = {result: d, sideEffects: this.info[i].sideEffects};
                if (d < -1e-6) {
                    item.disabled = true;
                    disabled++;
                }
                this.items.push(item);
            }

            var result = this.solve();

            var recalcNeeded = false;
            for (i = 0; i < this.info.length; i++) {
                if (result[i] < -1e-6) {
                    this.items[i].disabled = true;
                    disabled++;
                    recalcNeeded = true;
                }
            }

            if (recalcNeeded) {
                result = this.solve();
            }

            if (disabled > 0) {
                for (i = 0; i < this.scene.objects.length; i++) {
                    this.scene.objects[i].setSpeedReset();
                }

                // Apply results.
                for (i = 0; i < this.info.length; i++) {
                    var r = result[i];
                    if (!this.items[i].disabled && r != 0) {
                        this.info[i].o1.speed = this.info[i].o1.speed.add(this.info[i].dv1.mul(r));
                        this.info[i].o2.speed = this.info[i].o2.speed.add(this.info[i].dv2.mul(r));
                        this.info[i].o1.rotationSpeed += this.info[i].dw1 * r;
                        this.info[i].o2.rotationSpeed += this.info[i].dw2 * r;
                    }
                }

                recalcNeeded = false;
                for (i = 0; i < this.info.length; i++) {
                    if (this.items[i].disabled) {
                        // Check if there are collision speed diff problems.
                        var t = this.getCollisionPointSpeedDiff(this.scene.collisionPoints[i], this.info[i]);
                        if (t < 0) { // Be aware of rounding errors!
                            // Colliding points are moving towards each other.
                            recalcNeeded = true;
                            this.items[i].disabled = false;
                        }
                    }
                }

                if (recalcNeeded) {
                    // Reset speeds, and recalc with enabled collision points.
                    for (i = 0; i < this.scene.objects.length; i++) {
                        this.scene.objects[i].resetSpeed();
                    }

                    result = this.solve();

                    for (i = 0; i < this.info.length; i++) {
                        r = result[i];
                        if (!this.items[i].disabled && r != 0) {
                            this.info[i].o1.speed = this.info[i].o1.speed.add(this.info[i].dv1.mul(r));
                            this.info[i].o2.speed = this.info[i].o2.speed.add(this.info[i].dv2.mul(r));
                            this.info[i].o1.rotationSpeed += this.info[i].dw1 * r;
                            this.info[i].o2.rotationSpeed += this.info[i].dw2 * r;
                        }
                    }
                }
            } else {
                // Apply results.
                for (i = 0; i < this.info.length; i++) {
                    var r = result[i];
                    if (!this.items[i].disabled && r != 0) {
                        this.info[i].o1.speed = this.info[i].o1.speed.add(this.info[i].dv1.mul(r));
                        this.info[i].o2.speed = this.info[i].o2.speed.add(this.info[i].dv2.mul(r));
                        this.info[i].o1.rotationSpeed += this.info[i].dw1 * r;
                        this.info[i].o2.rotationSpeed += this.info[i].dw2 * r;
                    }
                }
            }
        }
    };

    /**
     * Removes the collision points that have become invalid.
     */
    this.cleanupCollisionPoints = function() {
        var newCollisionPoints = [];
        for (var i = 0; i < this.scene.collisionPoints.length; i++) {
            if (!(this.items[i].disabled && (this.info[i].dist > .2) && (!this.lastLookAheadCps.hasOwnProperty(this.scene.collisionPoints[i].key)))) {
                newCollisionPoints.push(this.scene.collisionPoints[i]);
            }
        }
        this.items = null;
        this.info = null;
        this.scene.collisionPoints = newCollisionPoints;
    };

    /**
     * Solves the current collision point items using the matrix solver.
     * @return {Number[]}
     *   An array with speed applications.
     */
    this.solve = function() {
        return this.matrixSolver.solve(this.items);
    };

    /**
     * Returns the collision point speed diff.
     * @param {CollisionPoint} cp
     * @param {object} info
     *   Collision point info.
     * @returns {number}
     */
    this.getCollisionPointSpeedDiff = function(cp, info) {
        return this.getCollisionSpeedDiff(cp.edgeSolidObject.speed, cp.edgeSolidObject.rotationSpeed, info.r1, cp.pointSolidObject.speed, cp.pointSolidObject.rotationSpeed, info.r2, info.n);
    };

    /**
     * Returns the collision speed difference.
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
     *   The collision normal.
     * @returns {number}
     *   The collision speed difference. Negative is towards each other (hit), positive is away from each other.
     */
    this.getCollisionSpeedDiff = function(v1, w1, r1, v2, w2, r2, n) {
        // Calculate current speeds at collision point.
        var v1AtCp = v1.add(r1.getPerp().mul(w1));
        var v2AtCp = v2.add(r2.getPerp().mul(w2));

        // Calculate speeds relative to normal.
        var v1n = v1AtCp.d(n);
        var v2n = v2AtCp.d(n);

        // Get current collision 'opposite' speed (negative is towards each other, positive is away of each other).
        return v2n - v1n;
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

        var dist = e.getPointDistanceRelativeToThis(p);

        // Return physics info about the collision.
        return {o1: o1, o2: o2, dv1: dv1, dv2: dv2, dw1: dw1, dw2: dw2, r1: r1, r2: r2, n: n, dist: dist};
    };

    // Creates a new matrix solver for at most 100 collision points.
    this.matrixSolver = new MatrixSolver(100);

};

/**
 * Solves the speed distribution matrix.
 * @param {Number} nEdges
 *   The max number of supported edges.
 * @constructor
 */
var MatrixSolver = function(nEdges) {

    var self = this;

    /**
     * The matrix, which is used to store data while solving.
     * @type {Number[][]}
     */
    this.matrix = null;


    /**
     * Returns the unique values in the specified array.
     * @param {Number[]} array
     * @returns {Number[]}
     */
    this.getUniqueValues = function(array) {
        var temp = array.sort();
        var n = temp.length;
        if (n > 0) {
            array = [];
            var current = 0;
            var j = 0;
            while (j < n) {
                if (j == 0 || current != temp[j]) {
                    current = temp[j];
                    array.push(current);
                }
                j++;
            }
        }
        return array;
    };

    /**
     * Returns the solution of the matrix.
     * @param {{result : float, sideEffects: {index : int, effect : float}}[], disabled: Boolean} items
     *   An array with all adjustable items.
     *   The effects on the other items are specified when an item is adjusted with 1.
     *   The desired end result is also specified.
     *   An item can be disabled.
     * @return Number[]
     *   A vector, with, per item, the adjustment value which causes all results to be correct.
     * @pre The matrix is an identity matrix (1 on diagonal, 0 elsewhere).
     * @post The matrix is still an identity matrix.
     */
    this.solve = function(inputItems) {
        var i, j, k, n, m, o, v;

        // Clone input items to maintain them originally.
        var items = [];
        var item;
        for (i = 0; i < inputItems.length; i++) {
            item = {
                result: inputItems[i].result,
                disabled: inputItems[i].disabled,
                sideEffects: []
            };
            for (j = 0; j < inputItems[i].sideEffects.length; j++) {
                item.sideEffects.push(inputItems[i].sideEffects[j]);
            }
            items.push(item);
        }

        // Initialize item objects.
        n = items.length;
        for (i = 0; i < n; i++) {

            items[i].rowNonZeroes = items[i].sideEffects.map(function(a) {
                return a.index;
            }).filter(function(b) {
                return !items[b].disabled;
            });
            items[i].colNonZeroes = items[i].rowNonZeroes.slice(0);
        }

        // Set matrix non-zero values.
        var fx;
        for (i = 0; i < n; i++) {
            if (!items[i].disabled) {
                m = items[i].sideEffects.length;
                for (j = 0; j < m; j++) {
                    fx = items[i].sideEffects[j];
                    this.matrix[fx.index][i] = fx.effect;
                }
            }
        }

        // Calculate the item solve order by comparing the number of side effects.
        var temp = [];
        for (i = 0; i < items.length; i++) {
            temp.push({index: i, n: items[i].sideEffects.length});
        }
        var solveOrder = temp.sort(function(a,b) {return a.n - b.n}).map(function(a) {return a.index});
        solveOrder = solveOrder.filter(function(index) {return !items[index].disabled});

        o = solveOrder.length;
        for (i = 0; i < o; i++) {
            var index = solveOrder[i];
            var item = items[index];

            // Get all unique non-zero row indices.
            (function(index) {
                item.rowNonZeroes = self.getUniqueValues(item.rowNonZeroes).filter(
                    function(a) {
                        return self.matrix[index][a] != 0;
                    }
                );

                // Get all unique non-zero column indices.
                item.colNonZeroes = self.getUniqueValues(item.colNonZeroes).filter(
                    function(a) {
                        return self.matrix[a][index] != 0;
                    }
                );
            })(index);

            // Normalize row so that pivot is 1.
            if (this.matrix[index][index] != 1) {
                if (this.matrix[index][index] == 0) {
                    // This is a strange situation that can occur. The effect would be for v to be very high.
                    v = 100;
                } else {
                    v = 1 / this.matrix[index][index];
                    if (v > 100) {
                        v = 100;
                    }
                    if (v < -100) {
                        v = -100;
                    }
                }
                this.matrix[index][index] = 1;
                n = item.rowNonZeroes.length;
                for (j = 0; j < n; j++) {
                    this.matrix[index][item.rowNonZeroes[j]] *= v;
                }
                item.result *= v;
            }

            // Add this row to all other rows that have this item, so that the other column cells only contains zeroes.
            n = item.colNonZeroes.length;
            for (j = 0; j < n; j++) {
                var index2 = item.colNonZeroes[j];

                // Manage rowNonZeroes and colNonZoroes.
                // Notice that this might add duplicates, but these will be filtered out when the row is solved.
                m = item.rowNonZeroes.length;
                for (k = 0; k < m; k++) {
                    var index3 = item.rowNonZeroes[k];
                    if (this.matrix[index2][index3] == 0) {
                        items[index2].rowNonZeroes.push(index3);
                        items[index3].colNonZeroes.push(index2);
                    }
                }

                // Make sure that the column cell is 0 by applying the item row.
                v = this.matrix[index2][index];
                this.matrix[index2][index] = 0;
                m = item.rowNonZeroes.length;
                for (k = 0; k < m; k++) {
                    var index3 = item.rowNonZeroes[k];
                    this.matrix[index2][index3] -= v * this.matrix[index][index3];
                }
                items[index2].result -= v * item.result;
            }
        }

        // Return result vector.
        return items.map(function(a) {return a.disabled ? 0 : a.result});
    };

    this.init = function() {
        // Create a matrix.
        this.matrix = [];
        for (var i = 0; i < nEdges; i++) {
            var a = [];
            for (var j = 0; j < nEdges; j++) {
                a.push((i == j ? 1.0 : 0));
            }
            this.matrix.push(a);
        }
    };

    this.init();

};
