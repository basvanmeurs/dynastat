/**
 * Makes sure that speeds are correctly adjusted at all collision points.
 * @param {Scene} scene
 * @constructor
 */
var SpeedAdjuster = function(scene) {

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
     * Checks the existing scene and adjust speeds. Deletes collision points that are no longer valid.
     */
    this.adjust = function() {
        var i, c, o1, o2;
        this.counter++;

        if (this.scene.collisionPoints.length > 0) {
            //@todo: check collisions for validity (x-axis).

            var info = [];
            for (i = 0; i < this.scene.collisionPoints.length; i++) {
                // Set physics info object for later use.
                info[i] = this.getCollisionPointInfo(this.scene.collisionPoints[i]);
            }

            // Per collision point, get other collision points that are affected directly by an opposite speed application.
            for (i = 0; i < info.length; i++) {
                var c1 = info[i];
                info[i].sideEffects = [];
                for (var k = 0; k < info.length; k++) {
                    if (i == k) continue;
                    var c2 = info[k];

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

                    info[i].sideEffects.push({index: k, effect: effect});
                }
            }

            // Keep track of disabled collision points while resolving.
            var disabled = 0;

            // Use matrix solver to get result.
            var items = [];
            for (i = 0; i < info.length; i++) {
                var cp = this.scene.collisionPoints[i];

                // Get vd.
                var vd = this.getCollisionSpeedDiff(
                    cp.edgeSolidObject.speed,
                    cp.edgeSolidObject.rotationSpeed,
                    info[i].r1,
                    cp.pointSolidObject.speed,
                    cp.pointSolidObject.rotationSpeed,
                    info[i].r2,
                    info[i].n
                );

                // Remove very small speeds so that infinite bounce does not occur.
                var key = "" + cp.edgeSolidObject.index + "-" + cp.edge.index + "_" + cp.pointSolidObject.index + "-" + cp.point.index;
                var time = cp.edgeSolidObject.t;
                var bounce = false;
                if (!this.lastCollisionsTimes.hasOwnProperty(key) || (time > this.lastCollisionsTimes[key] + Scene.TIMESTEP * 3)) {
                    bounce = true;
                } else {
                    bounce = false;
                }
                this.lastCollisionsTimes[key] = time;
                var d = vd * (bounce ? -1.2 : -1.001);

                // Fix bug: bounce-back.
                d = d + .1;

                var item = {result: d, sideEffects: info[i].sideEffects};
                if (d < 0) {
                    item.disabled = true;
                    disabled++;
                }
                items.push(item);
            }

            var anyDisabled, anyEnabled;
            do {
                var result = this.matrixSolver.solve(items);

                // Check if there are negative results. These items should be disabled.
                anyDisabled = false;
                anyEnabled = false;
                for (i = 0; i < result.length; i++) {
                    if (result[i] < 0) {
                        items[i].disabled = true;
                        disabled++;
                        anyDisabled = true;
                    }
                }
                if (!anyDisabled) {
                    // Add speed reset points.
                    for (i = 0; i < this.scene.objects.length; i++) {
                        this.scene.objects[i].setSpeedReset();
                    }

                    // Apply results.
                    for (i = 0; i < info.length; i++) {
                        var r = result[i];
                        info[i].o1.speed = info[i].o1.speed.add(info[i].dv1.mul(r));
                        info[i].o2.speed = info[i].o2.speed.add(info[i].dv2.mul(r));
                        info[i].o1.rotationSpeed += info[i].dw1 * r;
                        info[i].o2.rotationSpeed += info[i].dw2 * r;
                    }

                    if (disabled > 0) {
                        for (i = 0; i < items.length; i++) {
                            if (items[i].disabled) {
                                // Check if there are collision speed diff problems.
                                var t = this.getCollisionPointSpeedDiff(this.scene.collisionPoints[i], info[i]);
                                if (t < 0) {
                                    // Colliding points are moving towards each other.
                                    anyEnabled = true;
                                    items[i].disabled = false;
                                    disabled--;
                                }
                            }
                        }

                        if (anyEnabled) {
                            // Reset speeds, and try again.
                            for (i = 0; i < this.scene.objects.length; i++) {
                                this.scene.objects[i].resetSpeed();
                            }
                        }
                    }
                }
            } while (anyDisabled || anyEnabled);

            if (disabled > 0) {
                // Remove invalid collision points.
                var newCollisionPoints = [];
                for (i = 0; i < this.scene.collisionPoints.length; i++) {
                    if (!items[i].disabled) {
                        newCollisionPoints.push(this.scene.collisionPoints[i]);
                    }
                }
                this.scene.collisionPoints = newCollisionPoints;
            }
            // Fix bug: bounce-back. Have to fix by look-ahead of edge progression and extra d.
        }
        var i;
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
        var dw1 = -1 * r1.getPerp().d(n) / o1.inertia;
        var dw2 = r2.getPerp().d(n) / o2.inertia;

        // Scale all speed components so that they total to 1 m/s of unit speed difference.
        var j = 1 / ((dv2.add(r2.getPerp().mul(dw2))).d(n) - (dv1.add(r1.getPerp().mul(dw1))).d(n));
        dv1 = dv1.mul(j);
        dv2 = dv2.mul(j);
        dw1 *= j;
        dw2 *= j;

        // Return physics info about the collision.
        return {o1: o1, o2: o2, dv1: dv1, dv2: dv2, dw1: dw1, dw2: dw2, r1: r1, r2: r2, n: n};
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
    this.solve = function(items) {        //window.scene.t == 8.04718627929686
        var i, j, k, n, m, o, v;

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
        solveOrder.filter(function(index) {return !items[index].disabled});

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
                    throw "matrix division by zero";
                }
                v = 1 / this.matrix[index][index];
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
