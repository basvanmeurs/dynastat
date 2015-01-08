/**
 * Test collisions.
 * @param {Scene} scene
 */
var CollisionTester = function (scene) {
    var self = this;

    this.manual = true;

    /**
     * The callback that's called when a mouse button is clicked.
     * @type {Function}
     */
    this.clickCallback = null;

    /**
     * Creates and returns a solid object.
     * @param cps
     * @param p
     * @param s
     * @param [rs]
     * @returns {SolidObject}
     */
    this.o = function (cps, p, s, rs) {
        var obj = new SolidObject();
        var vectors = [];
        for (var i = 0; i < cps.length; i++) {
            var v = new Vector(cps[i][0], cps[i][1]);
            vectors.push(v);
        }
        obj.init(scene, 100, new Vector(p[0], p[1]), vectors);
        obj.speed.x = s[0];
        obj.speed.y = s[1];
        if (rs) {
            obj.rotationSpeed = rs;
        }
        return obj;
    };

    /**
     * The available test scenes.
     * @type {{name: string, objects: SolidObject[], dt: number, results: Number[][]}[]}
     */
    this.tests = [
        {
            name: "normal",
            objects: [
                this.o([
                    [10, 5],
                    [5, 10],
                    [15, 10]
                ], [0, 5], [0, -10]),
                this.o([
                    [0, 0],
                    [20, 10],
                    [15, 0]
                ], [0, 0], [0, 0])
            ],
            dt: 1,
            results: [
                [[0, 0],[1, 0]]
            ]
        },
        {
            name: "normal - reverse",
            objects: [
                this.o([
                    [0, 0],
                    [20, 10],
                    [15, 0]
                ], [0, 0], [0, 0]),
                this.o([
                    [10, 5],
                    [5, 10],
                    [15, 10]
                ], [0, 5], [0, -10])
            ],
            dt: 1,
            results: [
                [[1, 0],[0, 0]]
            ]
        },
        {
            name: "parallel",
            objects: [
                this.o([
                    [-10, 10],
                    [10, 10],
                    [10, -10],
                    [-10, -10]
                ], [0, 20], [0, -10]),
                this.o([
                    [-15, 5],
                    [15, 5],
                    [15, -5],
                    [-15, -5]
                ], [0, 0], [0, 0])
            ],
            dt: 1,
            results: [
                [[0, 2],[1, 0]],
                [[0, 3],[1, 0]]
            ]
        },
        {
            name: "parallel 2",
            objects: [
                this.o([
                    [-15, 10],
                    [15, 10],
                    [15, -10],
                    [-15, -10]
                ], [0, 20], [0, -10]),
                this.o([
                    [-10, 5],
                    [10, 5],
                    [10, -5],
                    [-10, -5]
                ], [0, 0], [0, 0])
            ],
            dt: 1,
            results: [
                [[1, 0],[0, 2]],
                [[1, 1],[0, 2]]
            ]
        },
        {
            name: "corner (side hit)",
            objects: [
                this.o([
                    [-10, 10],
                    [10, 10],
                    [10, -10],
                    [-10, -10]
                ], [0, 0], [0, 0]),
                this.o([
                    [-10, 10],
                    [10, 10],
                    [10, -10],
                    [-10, -10]
                ], [22, 12], [-1, 0])
            ],
            dt: 3,
            results: [
                [[0, 1],[1, 3]],
                [[1, 3],[0, 1]],
            ]
        },
        {
            name: "corner (corner hit)",
            objects: [
                this.o([
                    [-10, 10],
                    [10, 10],
                    [10, -10],
                    [-10, -10]
                ], [0, 0], [0, 0]),
                this.o([
                    [-10, 10],
                    [10, 10],
                    [10, -10],
                    [-10, -10]
                ], [22, 22], [-1, -1])
            ],
            dt: 3,
            results: [
                [[0, 1],[1, 3]],
            ]
        },
        {
            name: "boundary point",
            objects: [
                this.o([
                    [0, -5],
                    [-10, 5],
                    [10, 5],
                ], [0, 7], [0, -1]),
                this.o([
                    [-10, 10],
                    [0, 9],
                    [10, 10],
                    [10, -10],
                    [-10, -10]
                ], [0, -10], [0, 1])
            ],
            dt: 3,
            results: [
                [[0, 0],[1, 0]],
            ]
        },
        {
            name: "sawtooth (multiple)",
            objects: [
                this.o([
                    [-10, 5],
                    [10, 5],
                    [5, -5],
                    [0, 0],
                    [-5, -5],
                ], [0, 7], [0, -1]),
                this.o([
                    [-10, 10],
                    [10, 10],
                    [10, -10],
                    [-10, -10]
                ], [0, -10], [0, 1])
            ],
            dt: 3,
            results: [
                [[0, 2],[1, 0]],
                [[0, 4],[1, 0]],
            ]
        },
        {
            name: "sawtooth (slight tilt)",
            objects: [
                this.o([
                    [-10, 5],
                    [10, 5],
                    [5, -5],
                    [0, 0],
                    [-5, -5],
                ], [0, 7], [0, -1], .1),
                this.o([
                    [-10, 10],
                    [10, 10],
                    [10, -10],
                    [-10, -10]
                ], [0, -10], [0, 1])
            ],
            dt: 3,
            results: [
                [[0, 4],[1, 0]],
            ]
        },
        {
            name: "sawtooth (different length)",
            objects: [
                this.o([
                    [-10, 5],
                    [10, 5],
                    [5, -6],
                    [0, 0],
                    [-5, -5],
                ], [0, 7], [0, -1]),
                this.o([
                    [-10, 10],
                    [10, 10],
                    [10, -10],
                    [-10, -10]
                ], [0, -10], [0, 1])
            ],
            dt: 3,
            results: [
                [[0, 2],[1, 0]],
            ]
        },
        {
            name: "rotation 1",
            objects: [
                this.o([
                    [-10, 10],
                    [10, 10],
                    [10, -10],
                    [-10, -10]
                ], [0, 20], [0, -10], .2),
                this.o([
                    [-15, 5],
                    [15, 5],
                    [15, -5],
                    [-15, -5]
                ], [0, 0], [0, 0], .1)
            ],
            dt: 1,
            results: [
                [[0, 3],[1, 0]],
            ]
        },
        {
            name: "rotation 2",
            objects: [
                this.o([
                    [-10, 10],
                    [10, 10],
                    [10, -10],
                    [-10, -10]
                ], [0, 15.01], [0, 0], 1),
                this.o([
                    [-15, 5],
                    [15, 5],
                    [15, -5],
                    [-15, -5]
                ], [0, 0], [0, 0])
            ],
            dt: 1,
            results: [
                [[0, 3],[1, 0]],
            ]
        },
        {
            name: "no hit",
            objects: [
                this.o([
                    [-10, 10],
                    [10, 10],
                    [10, -10],
                    [-10, -10]
                ], [0, 25], [0, 0], 100),
                this.o([
                    [-15, 5],
                    [15, 5],
                    [15, -5],
                    [-15, -5]
                ], [0, 0], [0, 0])
            ],
            dt: 1,
            results: [
            ]
        },
        {
            name: "pizza slice 1",
            objects: [
                this.o([
                    [0, -5],
                    [-10, 5],
                    [10, 5],
                ], [0, 7], [0, -4]),
                this.o([
                    [-20, 10],
                    [0, -5],
                    [20, 10],
                    [20, -10],
                    [-20, -10]
                ], [0, -10], [0, 4])
            ],
            dt: 3,
            results: [
                [[0, 0],[1, 0]],
            ]
        },
        {
            name: "pizza slice 2",
            objects: [
                this.o([
                    [0, -5],
                    [-10, 5],
                    [10, 5],
                ], [10, 1], [0, -4]),
                this.o([
                    [-20, 10],
                    [0, -5],
                    [20, 10],
                    [20, -10],
                    [-20, -10]
                ], [0, -10], [0, 0])
            ],
            dt: 3,
            results: [
                [[0, 0],[1, 1]],
            ]
        },
        {
            name: "pizza slice 2 (continued)",
            reuseScene: function(scene) {
                scene.objects[0].speed.x = -4;
                scene.objects[0].speed.y = -3;
            },
            dt: 5.0,
            results: [
                [[0, 0],[1, 0]],
            ]
        },
    ];

    this.skipTests = 0;

    /**
     * Wait for a mouse click, then call the callback.
     * @param cb
     */
    this.wait = function (cb) {
        if (this.manual) {
            this.clickCallback = cb;
        } else {
            // Not manual: automatically continue.
            cb();
        }
    };

    /**
     * Called when a mouse button is clicked.
     */
    this.click = function () {
        if (this.clickCallback) {
            var func = this.clickCallback;
            this.clickCallback = null;
            func();
        }
    };

    /**
     * Starts testing.
     * @param cb
     */
    this.start = function (cb) {
        var i = this.skipTests;
        var doNext = function () {
            if (i < self.tests.length) {
                i++;
                self.runTest(self.tests[i], doNext);
            } else {
                self.alert('all tests done');
                cb();
            }
        };
        doNext();
    };

    /**
     * Runs the test, and after the test call the callback.
     * @param test
     * @param {Function} cb
     */
    this.runTest = function (test, cb) {
        self.alert("starting test " + test.name);

        // Init scene.
        if (test.objects) {
            scene.reset();
            for (var j = 0; j < test.objects.length; j++) {
                test.objects[j].index = j;
                scene.addObject(test.objects[j]);
            }
        } else if (test.reuseScene) {
            test.reuseScene(scene);
        }

        if (this.manual) {
            scene.view.update();
        }

        self.wait(function () {
            var collision = scene.getNextCollision(scene.t + test.dt);

            if (collision == null) {
                if (self.manual) {
                    scene.setT(scene.t + test.dt);
                    scene.view.update();
                }
                if (test.results.length > 0) {
                    self.alert('Failure, no results found but expected ' + test.results.length);
                }
            } else {
                if (self.manual) {
                    // Show the collision situation.
                    scene.setT(collision.t);
                    scene.view.update();
                }


                // Check results.
                for (var k = 0; k < test.results.length; k++) {
                    var r = test.results[k];
                    var point = scene.objects[r[0][0]].cornerPoints[r[0][1]];
                    var edge = scene.objects[r[1][0]].cornerPoints[r[1][1]];
                    var found = false;
                    for (var m = 0; m < collision.collision.length; m++) {
                        var cp = collision.collision[m];
                        if (cp.edge == edge && cp.point == point) {
                            cp.found = true;
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        self.alert('Failure, result not found: ' + r[0][0] + ':' + r[0][1] + ' ' + point.getAbsoluteCoordinates().toString() + ", " + r[1][0] + ':' + r[1][1] + ' ' + edge.getEdgeString());
                    }
                }

                for (k = 0; k < collision.collision.length; k++) {
                    if (!collision.collision[k].found) {
                        var c = collision.collision[k];
                        self.alert('Failure, unexpected result: ' + c.pointSolidObject.index + ':' + c.point.index + ' ' + c.edgeSolidObject.index + ':' + c.edge.index + ' ' + c.toString());
                    }
                }

                scene.collisionPoints = scene.collisionPoints.concat(collision.collision);
            }

            if (self.manual) {
                scene.view.update();
            }

            self.wait(cb);
        });
    };

    this.alert = function(str) {
        var c = $('#output', this.container).val();
        c += str + "\n";
        $('#output', this.container).val(c);
    };

    $(window).click(function () {
        self.click();
    });

    this.container = $('\
        <div><textarea cols="150" rows="20" id="output"></textarea></div>\
    ');

};