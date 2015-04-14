/**
 * Creates the matrix with the specified width and height.
 * @param {int} maxCellCount
 * @param {int} w
 * @param {int} h
 * @constructor
 */
var Matrix = function(maxCellCount, w, h) {

    this.maxCellCount = maxCellCount;

    // Claim memory so that it's not fragmented.
    this.cells = new Array(maxCellCount);

    this.resize(w, h);

};

/**
 * Matrix max cell count. This is the amount of memory claimed.
 * @param {int}
 */
Matrix.prototype.maxCellCount = null;

/**
 * Matrix width.
 * @param {int}
 */
Matrix.prototype.w = null;

/**
 * Matrix height.
 * @param {int}
 */
Matrix.prototype.h = null;

/**
 * Cells in the matrix, index = y * n + x.
 * @type {Number[]}
 */
Matrix.prototype.cells = null;

/**
 * Resizes the matrix. This invalidates the cells.
 * @param {int} w
 * @param {int} h
 */
Matrix.prototype.resize = function(w, h) {
    if (w * h > this.maxCellCount) {
        // Too much cells.
        throw new Error('this matrix has too little space for the resize dimensions');
    }

    this.w = w;
    this.h = h;
};

/**
 * Copies the specified matrix into this matrix.
 * @param {Matrix} matrix
 */
Matrix.prototype.copy = function(matrix) {
    this.w = matrix.w;
    this.h = matrix.h;

    var index = 0;
    var maxIndex = this.w * this.h;
    while(index < maxIndex) {
        this.cells[index] = matrix.cells[index];
        index++;
    }
};

/**
 * Sets the identity matrix.
 */
Matrix.prototype.identity = function() {
    var y, index = 0;
    var end = (this.h + 1) * this.w;
    while(index < end) {
        this.cells[index++] = 0;
    }
    for (y = 0; y < this.h; y++) {
        this.cells[y * (this.w + 1)] = 1;
    }
};

/**
 * Resets the specified row to the identity.
 */
Matrix.prototype.identityRow = function(y) {
    var index = y * this.w;
    var end = index + y;
    var end2 = index + this.w;
    while(index < end) {
        this.cells[index] = 0;
        index++;
    }
    this.cells[index++] = 1;
    while(index < end2) {
        this.cells[index] = 0;
        index++;
    }
};

/**
 * Resets the specified col to the identity.
 */
Matrix.prototype.identityCol = function(x) {
    var index = x;
    var end = index + x * this.w;
    var end2 = index + this.h * this.w;
    while(index < end) {
        this.cells[index] = 0;
        index += this.w;
    }
    this.cells[index] = 1;
    index += this.w;
    while(index < end2) {
        this.cells[index] = 0;
        index += this.w;
    }
};

/**
 * Adds row sourceIndex factorized by factor to row destIndex.
 * @param {int} sourceIndex
 * @param {int} destIndex
 * @param {number} factor
 */
Matrix.prototype.addRow = function(sourceIndex, destIndex, factor) {
    var index = sourceIndex * this.w;
    var end = index + this.w;
    var diff = (destIndex - sourceIndex) * this.w;
    while (index < end) {
        if (this.cells[index]) {
            this.cells[index + diff] += this.cells[index] * factor;
        }
        index++;
    }
};

/**
 * Adds row sourceIndex factorized by factor to row destIndex, except the specified column.
 * @param {int} sourceIndex
 * @param {int} destIndex
 * @param {number} factor
 * @param {int} exceptColumn
 *   The x value for the specified column.
 */
Matrix.prototype.addRowExceptCol = function(sourceIndex, destIndex, factor, exceptColumn) {
    var index = sourceIndex * this.w;
    var end = index + exceptColumn;
    var end2 = index + this.w;
    var diff = (destIndex - sourceIndex) * this.w;
    while (index < end) {
        if (this.cells[index]) {
            this.cells[index + diff] += this.cells[index] * factor;
        }
        index++;
    }
    index++;
    while (index < end2) {
        if (this.cells[index]) {
            this.cells[index + diff] += this.cells[index] * factor;
        }
        index++;
    }
};

/**
 * Scale row targetIndex.
 * @param {int} targetIndex
 * @param {number} factor
 */
Matrix.prototype.scaleRow = function(targetIndex, factor) {
    var index = targetIndex * this.w;
    var end = index + this.w;
    while (index < end) {
        if (this.cells[index]) {
            this.cells[index] *= factor;
        }
        index++;
    }
};

/**
 * Scale row sourceIndex, except the specified column.
 * @param {int} targetIndex
 * @param {number} factor
 * @param {int} exceptColumn
 *   The x value for the specified column.
 */
Matrix.prototype.scaleRowExceptCol = function(targetIndex, factor, exceptColumn) {
    var index = targetIndex * this.w;
    var end = index + exceptColumn;
    var end2 = index + this.w;
    while (index < end) {
        if (this.cells[index]) {
            this.cells[index] *= factor;
        }
        index++;
    }
    index++;
    while (index < end2) {
        if (this.cells[index]) {
            this.cells[index] *= factor;
        }
        index++;
    }
};

/**
 * Returns a string representation of this matrix.
 * @returns {string}
 */
Matrix.prototype.toString = function() {
    var lines = [];
    var index = 0;
    for (var y = 0; y < this.h; y++) {
        var items = [];
        for (var x = 0; x < this.w; x++) {
            items.push(this.cells[index]);
            index++;
        }
        var line = "| " + items.map(function(item) {
                var str = item.toPrecision(6);
                while(str.length < 11) {
                    str = " " + str;
                }
                return str;
            }).join(" ") + " |";
        lines.push(line);
    }
    var dashes = "";
    for (var i = 0; i < lines[0].length; i++) {
        dashes += "-"
    }
    return dashes + "\n" + lines.join("\n") + "\n" + dashes;
};

/**
 * Multiplies this matrix with the specified vector.
 * @param {Number[]} vector
 * @return {Number[]}
 */
Matrix.prototype.m = function(vector) {
    var x, y;
    var results = [];
    var index = 0;
    for (y = 0; y < this.h; y++) {
        var r = 0;
        for (x = 0; x < this.w; x++) {
            r += this.cells[index] * vector[x];
            index++;
        }
        results.push(r);
    }
    return results;
};

/**
 * Multiplies a single row of this matrix with the specified vector.
 * @param {int} index
 * @param {Number[]} vector
 * @return {Number}
 */
Matrix.prototype.mIndex = function(index, vector) {
    var start = index * this.w;
    var end = start + this.w;

    var vectorIndex = 0;
    var r = 0;
    for (var i = start; i < end; i++) {
        r += this.cells[i] * vector[vectorIndex++];
    }
    return r;
};
