/**
 * A collision point in the model.
 *
 * @param {SolidObject} pointSolidObject
 *   The solid object of the corner point.
 * @param {CornerPoint} point
 *   The collision point, which is touching the edge.
 * @param {SolidObject} edgeSolidObject
 *   The solid object of the edge.
 * @param {CornerPoint} edge
 *   The edge starting at the corner point.
 * @constructor
 */
var CollisionPoint = function(pointSolidObject, point, edgeSolidObject, edge) {

    /**
     * @type {SolidObject}
     */
    this.pointSolidObject = pointSolidObject;

    /**
     * @type {SolidObject}
     */
    this.edgeSolidObject = edgeSolidObject;

    /**
     * @type {CornerPoint}
     */
    this.point = point;

    /**
     * @type {CornerPoint}
     */
    this.edge = edge;

    /**
     * Returns a string representation of the collision point.
     * @returns {string}
     */
    this.toString = function() {
        var str = "CollisionPoint[" + this.point.getAbsoluteCoordinates().toString() + ", " + this.edge.getEdgeString() + " | " + this.point.index + ";" + this.edge.index + "]";
        return str;
    }
};
