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
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.strokeStyle = '#000000';

        var collisions = [];

        this.context.font = "12px Courier";
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
                    this.context.strokeStyle = '#222222';
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
            this.context.fillRect(t.x - 1, t.y - 1, 2, 2);
        }

        // Show collision points.
        for (i = 0; i < this.scene.collisionPoints.length; i++) {
            var cp = this.scene.collisionPoints[i];
            var c = cp.point.getAbsoluteCoordinates();
            c = this.translateCoords(c);

            var edgeVector = cp.edge.getCollisionHelperVariables().edge;

            this.context.fillStyle = "#00ff00";
            this.context.fillRect(c.x - 3, c.y - 3, 6, 6);

            this.context.strokeStyle = "#000000";
            var d = edgeVector.getPerp().mul(-20 / Math.sqrt(edgeVector.d(edgeVector)));
            d.y = -d.y;

            var e = c.add(d);
            this.context.lineWidth = 2;
            this.context.strokeStyle = "#ff0000";
            this.context.beginPath();
            this.context.moveTo(c.x, c.y);
            this.context.lineTo(e.x, e.y);
            this.context.stroke();
            this.context.lineWidth = 1;

            this.context.strokeText("" + i, c.x + d.x, c.y + d.y);
        }

        this.context.strokeText("" + scene.frame, 20, 20);
    };

    /**
     * Translates absolute coords to viewport coords.
     * @param {Vector} coords
     * @return {Vector}
     */
    this.translateCoords = function(coords) {
        return new Vector(this.width * .5 + coords.x * 5, this.height *.75 - coords.y * 5);
    };

    this.width = $(window).width();
    this.height = $(window).height();

    this.container = $('<div></div>');
    this.canvas = $('<canvas width="' + this.width + '" height="' + this.height + '"></canvas>');
    $(this.container).append(this.canvas);
    this.context = this.canvas.get(0).getContext('2d');

};
