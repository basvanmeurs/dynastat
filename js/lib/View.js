/**
 * Draws the scene on a canvas.
 * @param scene
 * @constructor
 */
var View = function(scene) {

    /**
     * The scene to draw.
     * @type {Scene}
     */
    this.scene = scene;

    /**
     * The container
     * @type {HTMLElement}
     */
    this.container = null;

    /**
     * The canvas layer.
     * @type {HTMLCanvasElement}
     */
    this.canvas = null;

    /**
     * The canvas rendering context to be used when drawing.
     * @type {CanvasRenderingContext2D}
     */
    this.context = null;

    /**
     * Updates the canvas.
     */
    this.update = function() {
        this.context.clearRect(0, 0, 1000, 1000);
        this.context.strokeStyle = '#000000';

        var collisions = [];

        this.context.font = "8px Courier";
        for (var i = 0; i < this.scene.objects.length; i++) {
            var obj = this.scene.objects[i];

            for (var j = 0; j < obj.cornerPoints.length; j++) {
                var inCollision = false;

                var s = obj.cornerPoints[j].getAbsoluteCoordinates();
                s = this.translateCoords(s);

                var e = obj.cornerPoints[j].next.getAbsoluteCoordinates();
                e = this.translateCoords(e);

                if (inCollision) {
                    this.context.strokeStyle = '#0000ff';
                } else {
                    this.context.strokeStyle = '#000000';
                }
                this.context.beginPath();
                this.context.moveTo(s.x, s.y);
                this.context.lineTo(e.x, e.y);
                this.context.stroke();

//                this.context.strokeText(obj.cornerPoints[j].getAbsoluteCoordinates().toString(), s.x - 20, s.y - 10);
//                this.context.strokeText(obj.cornerPoints[j].next.getAbsoluteCoordinates().toString(), e.x - 20, e.y - 10);
            }

            // Center of mass.
            this.context.fillStyle = "#00ffff";
            var t = this.translateCoords(obj.position);
            this.context.fillRect(t.x - 2, t.y - 2, 4, 4);
        }

        // Show collision points.
        for (i = 0; i < this.scene.collisionPoints.length; i++) {
            var cp = this.scene.collisionPoints[i];
            var c = cp.point.getAbsoluteCoordinates();
            c = this.translateCoords(c);

            var edgeVector = cp.edge.getCollisionHelperVariables().edge;
            var sl = this.translateCoords(cp.point.getAbsoluteCoordinates().sub(edgeVector.mul(.1)));
            var el = this.translateCoords(cp.point.getAbsoluteCoordinates().add(edgeVector.mul(.1)));
            this.context.lineWidth = 1;
            this.context.strokeStyle = "#ff0000";
            this.context.beginPath();
            this.context.moveTo(sl.x, sl.y);
            this.context.lineTo(el.x, el.y);
            this.context.stroke();
            this.context.lineWidth = 1;

            this.context.fillStyle = "#00ff00";
            this.context.fillRect(c.x - 3, c.y - 3, 6, 6);
        }

    };

    /**
     * Translates absolute coords to viewport coords.
     * @param {Vector} coords
     * @return {Vector}
     */
    this.translateCoords = function(coords) {
        return new Vector(400 + coords.x * 3, 300 - coords.y * 3);
    };

    this.container = $('<div></div>');
    this.canvas = $('<canvas width="800" height="600"></canvas>');
    $(this.container).append(this.canvas);
    this.context = this.canvas.get(0).getContext('2d');

};
