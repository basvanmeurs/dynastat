/**
 * A 2-dimensional vector.
 * @param {Number} x
 * @param {Number} y
 * @constructor
 */
var Vector = function (x, y) {

    /**
     * @type {Number}
     */
    this.x = x;

    /**
     * @type {Number}
     */
    this.y = y;

    /**
     * @param {Vector} that
     * @return {Vector}
     */
    this.add = function (that) {
        return new Vector(this.x + that.x, this.y + that.y);
    };

    /**
     * @param {Vector} that
     * @return {Vector}
     */
    this.sub = function (that) {
        return new Vector(this.x - that.x, this.y - that.y);
    };

    /**
     * @param {Number} f
     * @return {Vector}
     */
    this.mul = function (f) {
        return new Vector(this.x * f, this.y * f);
    };

    /**
     * @param {Vector} that
     * @return {Number}
     */
    this.dotProd = function (that) {
        return this.x * that.x + this.y * that.y;
    };

    /**
     * The cross product: this.x * that.y - this.y * that.x.
     * @param {Vector} that
     * @return {Number}
     */
    this.crossProduct = function(that) {
        return this.x * that.y - this.y * that.x;
    };

    /**
     * @param {Vector} that
     * @return {Number}
     */
    this.d = this.dotProd;

    /**
     * Clones this vector.
     * @return {Vector}
     */
    this.clone = function() {
        return new Vector(this.x, this.y);
    };


    /**
     * Returns the length of the vector.
     * @return {Number}
     */
    this.getLength = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };

    /**
     * Returns the normalized vector.
     * @returns {Vector}
     */
    this.normalize = function() {
        return this.mul(1.0 / this.getLength());
    };

    /**
     * Returns the rotated vector.
     * @param rads
     * @return {Vector}
     */
    this.rotate = function(rads) {
        var cos = Math.cos(rads);
        var sin = Math.sin(rads);
        return new Vector(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
    };

    /**
     * Returns the perpendicular vector.
     * @return {Vector}
     */
    this.getPerp = function() {
        return new Vector(-this.y, this.x);
    };

    /**
     * Returns a string representation.
     * @returns {string}
     */
    this.toString = function() {
        var xStr = this.x.toFixed(2);
        var yStr = this.y.toFixed(2);
        return '[' + xStr + ',' + yStr + ']';
    }
};