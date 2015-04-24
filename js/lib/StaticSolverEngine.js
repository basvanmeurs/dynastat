/**
 * Creates a new static solver engine.
 * @param {int} maxPoints
 * @constructor
 */
var StaticSolverEngine = function(maxPoints) {

    /**
     * The maximum number of points that this static solver engine can handle.
     * @type {Number}
     */
    this.maxPoints = maxPoints;

    /**
     * The FX-matrix, which contains, at any point in time, the effect matrix of all points.
     * @type {Matrix}
     */
    this.fx = new Matrix(this.maxPoints * this.maxPoints, this.maxPoints, this.maxPoints);
    this.fx.name = 'fx';

    /**
     * The state matrix, which initially is the FX-matrix and is swiped into an identity matrix as the solution is being solved.
     * @type {Matrix}
     */
    this.state = new Matrix(this.maxPoints * this.maxPoints, this.maxPoints, this.maxPoints);
    this.state.name = 'state';

    /**
     * The solution matrix. This is initially an identity matrix, on which the same operations are performed as the state matrix. This enables us to find the inverse solution matrix.
     * @type {Matrix}
     */
    this.solution = new Matrix(this.maxPoints * this.maxPoints, this.maxPoints, this.maxPoints);
    this.solution.name = 'solution';

    /**
     * Holds the desired speed difference per point. The final solution should make sure that the applied netto speed difference on every point should be this number (or higher).
     * @type {number[]}
     */
    this.diffs = new Array(this.maxPoints);

    /**
     * The set of added points.
     * @type {Boolean[]}
     */
    this.enabled = new Array(this.maxPoints);

    /**
     * If a point is killed, it will never be added again.
     * @type {Array}
     */
    this.killed = new Array(this.maxPoints);

    /**
     * The number of points currently in the model.
     * @type {number}
     */
    this.n = 0;

    /**
     * The points.
     * @type {{diff: number, fx: {index: int, effect: number}, conn: Boolean}[]}
     */
    this.points = null;

    /**
     * Initializes the engine with the specified points.
     * @param {{diff: number, fx: {index: int, effect: number}, conn: Boolean}[]} points
     */
    this.initialize = function(points) {
        this.points = points;

        // Resize FX array to the required space and init as identity.
        this.fx.resize(points.length, points.length);
        this.fx.identity();

        this.n = points.length;

        // Complete FX-array.
        var i, j;
        for (i = 0; i < this.n; i++) {
            this.diffs[i] = points[i].diff;
            for (j = 0; j < points[i].fx.length; j++) {
                this.fx.cells[points[i].fx[j].index * this.fx.w + i] = points[i].fx[j].effect;
            }

            this.enabled[i] = false;
            this.killed[i] = false;
        }

        // Init solution array as identity.
        this.solution.resize(points.length, points.length);
        this.solution.identity();

        // Init state.
        this.state.copy(this.fx);
    };

    /**
     * If the specified point is currently enabled, it is disabled. A flag is set so that the point will never be
     *   enabled later, and is not regarded as part of the solution any more.
     * @param index
     */
    this.killPoint = function(index) {
        if (this.enabled[index]) {
            this.removePoint(index);
        }
        this.killed[index] = true;
    };

    /**
     * Adds a point to the enabled set.
     * @param {int} index
     */
    this.addPoint = function(index) {
        var i;
        var k, v, w;

        // Scale pivot of row.
        w = this.state.cells[index * (this.state.w + 1)];
        if (w != 1) {
            v = 1 / w;
            this.state.scaleRow(index, v);
            this.solution.scaleRow(index, v);
        }

        // Swipe row.
        k = 1.0;
        for (i = 0; i < this.n; i++) {
            if (this.enabled[i]) {
                // Swipe to zero.

                v = this.state.cells[index * this.state.w + i] * this.state.cells[i * this.state.w + index];
                k -= v;
                if (k < 1e-4 && k > -1e-4) {
                    if (this.state.cells[index * this.state.w + i] < 0) {
                        // False overshadow. This is a nasty situation which can occur for perfectly legal situations and needs to be resolved by adding a slight noise or killing the point.
                        throw new FalseOverflowError(index, i);
                    } else {
                        // Overshadowing situation! First remove point i from set, and then try again to add point.
                        this.removePoint(i);
                        return this.addPoint(index);
                    }
                }

                // Swipe solution row.
                w = -this.state.cells[index * this.state.w + i];

                this.state.addRow(i, index, w);
                this.solution.addRow(i, index, w);
            }
        }

        // Scale row.
        var scale = 1 / k;

        this.state.scaleRow(index, scale);
        this.solution.scaleRow(index, scale);

        // Swipe column.
        for (i = 0; i < this.n; i++) {
            if (this.enabled[i]) {
                v = -this.state.cells[i * this.state.w + index];

                this.state.addRow(index, i, v);
                this.solution.addRow(index, i, v);
            }
        }

        // Set as enabled.
        this.enabled[index] = true;

    };

    /**
     * Removes a point from the enabled set.
     * @param index
     */
    this.removePoint = function(index) {
        var i, w, f;

        this.enabled[index] = false;


        // Swipe solution column.
        f = 1 / this.solution.cells[index * (this.solution.w + 1)];

        for (i = 0; i < this.n; i++) {
            if (i != index) {
                w = -this.solution.cells[i * this.solution.w + index] * f;

                // Set (i,index) to w.
                this.state.addRow(index, i, w);

                // Also apply to solution matrix.
                this.solution.addRow(index, i, w);
            }
        }
    };

    /**
     * Returns the solution for the specified point.
     * @param index
     * @return Number
     */
    this.getPointSolution = function(index) {
        if (this.enabled[index]) {
            var result = 0;
            for (var i = 0; i < this.n; i++) {
                if (this.enabled[i]) {
                    result += this.solution.cells[index * this.solution.w + i] * this.diffs[i];
                }
            }
            return result;
        } else {
            // Point not in solution.
            return 0;
        }
    };

    /**
     * Returns the solution for all points, in the state of the currently enabled points.
     */
    this.getSolution = function() {
        var solution = new Array(this.n);
        var i;
        for (i = 0; i < this.n; i++) {
            solution[i] = this.getPointSolution(i);
        }
        return solution;
    };

    /**
     * Returns the FX matrix multiplied by the solution vector.
     */
    this.getCheckedSolution = function() {
        var solution = this.getSolution();
        var result = this.fx.m(solution);
        return result;
    };

    /**
     * This counts the number of solution loops and is used to postpone random point picking (for performance reasons).
     * @type {number}
     */
    this.recursionCounter = 0;

    /**
     * Solves the matrix.
     */
    this.solve = function() {
        this.recursionCounter = 0;
        while (this.checkPoints()) {
            this.recursionCounter++;
            if (this.recursionCounter > 2 * this.n) {
                throw new Error("Solve recursion!\n\n" + this.toString());
            }
        }
    };

    // Re-usable variables for checkpoints.
    this.addOptions = new Array(10);
    this.remOptions = new Array(10);

    /**
     * Checks if some points need to be enabled or disabled in the solution.
     */
    this.checkPoints = function() {
        var i, w;

        var solution = this.getSolution();
        if (this.recursionCounter >= this.n) {
            // Apply random option picking to prevent infinite recursion.
            var a = 0, r = 0;
            for (i = 0; i < this.n; i++) {
                if (!this.enabled[i] && !this.killed[i]) {
                    // Checked solution should be equal to higher than the actual diff.
                    w = this.fx.mIndex(i, solution);
                    if (this.points[i].conn) {
                        if (w < this.diffs[i] - 1e-9 || w > this.diffs[i] + 1e-9) {
                            this.addPoint(i);
                            return true;
                        }
                    } else {
                        if (w < this.diffs[i] - 1e-9) {
                            this.addPoint(i);
                            return true;
                        }
                    }
                } else {
                    if (!this.points[i].conn && (solution[i] < -1e-9)) {
                        // Points are pulling: disable.
                        if (this.recursionCounter < 1.5 * this.n) {
                            // Some matrices are solvable only with some pulling points. We'll rather solve it with those than not at all.
                            this.remOptions[r++] = i;
                        }
                    }
                }
            }

            if (a + r == 0) {
                // No options.
                return false;
            } else {
                var c = Math.floor(Math.random() * (a + r));
                if (c < a) {
                    this.addPoint(this.addOptions[c]);
                } else {
                    this.removePoint(this.remOptions[c - a]);
                }
                return true;
            }
        } else {
            // Just choose the first option.
            for (i = 0; i < this.n; i++) {
                if (!this.enabled[i] && !this.killed[i]) {
                    // Checked solution should be equal to higher than the actual diff.
                    w = this.fx.mIndex(i, solution);
                    if (this.points[i].conn) {
                        if (w < this.diffs[i] - 1e-9 || w > this.diffs[i] + 1e-9) {
                            this.addPoint(i);
                            return true;
                        }
                    } else {
                        if (w < this.diffs[i] - 1e-9) {
                            this.addPoint(i);
                            return true;
                        }
                    }
                }
            }

            for (i = 0; i < this.n; i++) {
                if (this.enabled[i]) {
                    if (!this.points[i].conn && (solution[i] < -1e-9)) {
                        // Points are pulling: disable.
                        this.removePoint(i);
                        return true;
                    }
                }
            }
        }

        return false;
    };

    /**
     * Checks if the matrix has been solved correctly.
     * @param maxDiff
     * @return {int}
     *   The incorrectly solved index.
     */
    this.solvedCorrectly = function(maxDiff) {
        if (!maxDiff) {
            maxDiff = 1e-6;
        }
        var solution = this.getCheckedSolution();
        for (var i = 0; i < solution.length; i++) {
            if (this.enabled[i]) {
                if (!(solution[i] > this.diffs[i] - maxDiff && solution[i] < this.diffs[i] + maxDiff)) {
                    return i;
                }
            } else if (!this.killed[i]) {
                if (!(solution[i] > this.diffs[i] - maxDiff)) {
                    return i;
                }
            }
        }
        return -1;
    };

    /**
     * Returns a string representation.
     */
    this.toString = function() {
        var i, values;

        var str = "";
        str += "State:\n" + this.state.toString() + "\n\n";
        str += "Solution:\n" + this.solution.toString() + "\n\n";
        str += "FX-matrix:\n" + this.fx.toString() + "\n\n";

        values = [];
        for (i = 0; i < this.n; i++) {
            values.push(this.enabled[i] ? 1 : (this.killed[i] ? 'K' : 0));
        }
        str += "Enabled: [" + values.join("") + "]\n\n";

        values = [];
        var solution = this.getSolution();
        for (i = 0; i < solution.length; i++) {
            values.push(solution[i].toPrecision(6));
        }
        str += "Solution:        [" + this.getSolution().map(function(v) {return v.toPrecision(6)}).join(", ") + "]\n\n";

        values = [];
        var solution = this.getCheckedSolution();
        for (i = 0; i < solution.length; i++) {
            values.push(solution[i].toPrecision(6));
        }
        str += "Verified result: [" + this.getCheckedSolution().map(function(v) {return v.toPrecision(6)}).join(", ") + "]\n\n";

        values = [];
        for (i = 0; i < this.n; i++) {
            values.push(this.diffs[i].toPrecision(6));
        }
        str += "Wanted diffs:    [" + values.join(", ") + "]\n\n";

        var problem = this.solvedCorrectly(1e-6);
        if (problem == -1) {
            str += "correctly solved!\n";
        } else {
            str += "NOT SOLVED correctly! Problem index: " + problem + " (expect " + this.diffs[problem] + ", got " + solution[problem] + ")\n";
        }

        str += " (recursion counter: " + this.recursionCounter + ")\n";

        return str;
    };

};

/**
 * Exception that occurs when a false overflow exists in the model; hence the model is unsolvable as it is.
 * @param index
 * @param index2
 * @constructor
 */
var FalseOverflowError = function(index, index2) {
    this.index = index;
    this.index2 = index2;
};
