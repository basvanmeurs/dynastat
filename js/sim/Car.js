var Car = function(scene, position, options) {

    /**
     * The 2d model physics scene that this car is a part of.
     */
    this.scene = scene;

    /**
     * The solid object in the 2d physics model.
     * @type {SolidObject}
     */
    this.solidObject = new SolidObject();

    /**
     * The mass of the, excluding the wheels.
     * @type {number}
     */
    this.mass = options.mass || 600;

    /**
     * The center of mass height (determines pitch & roll effects).
     * @type {number}
     */
    this.cmHeight = options.cmHeight || 0.5;

    /**
     * The front-left wheel.
     * @type {Wheel}
     */
    this.fl = null;

    /**
     * The front-right wheel.
     * @type {Wheel}
     */
    this.fr = null;

    /**
     * The rear-left wheel.
     * @type {Wheel}
     */
    this.rl = null;

    /**
     * The rear-right wheel.
     * @type {Wheel}
     */
    this.rr = null;

    /**
     * The current longitudinal torque of the chassis (roll, pitch).
     * @type {Vector}
     */
    this.chassisTorque = new Vector(0, 0);

    /**
     * The brake pedal ratio, from 0 to 1.
     * @type {number}
     */
    this.brakePedal = 0;

    /**
     * The throttle pedal ratio, from 0 to 1.
     * @type {number}
     */
    this.throttlePedal = 0;

    /**
     * The amount of brake power that goes to the front, from 0 to 1. To the rear goes the remaining value.
     * @type {number}
     */
    this.brakeBias = options.brakeBias || .7;

    /**
     * The engine rotation speed, in rotations per second.
     * @type {number}
     */
    this.engineRotation = 20;

    /**
     * The engine friction coefficientin Nm / rotationSpeed.
     * @type {number}
     */
    this.engineFrictionCoeff = options.engineFrictionCoeff || 0.01;

    /**
     * The inertia of the moving parts of the engine.
     * @type {number}
     */
    this.engineInertia = 0.09;

    /**
     * The selected gear. 0 = backwards, 1 = first, etc.
     * @type {number}
     */
    this.gear = 1;

    /**
     * Transmission ratios, per gear.
     * @type {number[]}
     */
    this.transmissionRatios = options.transmissionRatios || [-15, 20, 15, 12, 7, 4, 2];

    /**
     * Simulate a time step.
     * @param dt
     *   The time step to simulate / apply the forces to the model.
     */
    this.step = function(dt) {
        var i;

        var wheels = [this.fl, this.fr, this.rl, this.rr];
        var frontWheels = [this.fl, this.fr];
        var rearWheels = [this.rl, this.rr];

        // Re-calculate engine rotation from car speed.
        var carSpeed = this.solidObject.getRelativeSpeedAtRelCoords(new Vector(0, 0));
        this.engineRotation = (carSpeed.y / (this.rl.radius * 2 * Math.PI)) * this.transmissionRatios[this.gear];

        // Simulate clutch.
        if (this.engineRotation < 20) {
            this.engineRotation = 20;
        }

        /**
         * Possibilities for better simulation.
         *
         * Clutch simulation:
         * - Apply only a percentage of the wheel speed to the current engine rotation.
         * - When releasing the clutch: distribute kinetic energy in engine to the rear wheels.
         * - Do not apply full engine power to wheels, but also maintain engine rotation and engine torque, and apply
         * - the engine torque separately.
         *
         * Springs simulation:
         * - Make Fz of wheel dependent on spring situation.
         */

        // Reset forces of all tires.
        for (i = 0; i < wheels.length; i++) {
            wheels[i].resetForces();
        }

        // Apply grip caused by tire slip for all tires.
        for (i = 0; i < wheels.length; i++) {
            wheels[i].applySlipGrip();
        }
/*
        // Apply brakes.
        var frontBrakes = this.brakeBias * this.brakePedal;
        for (i = 0; i < frontWheels.length; i++) {
            frontWheels[i].applyBrakes(frontBrakes, (carSpeed.y > 0));
        }

        var rearBrakes = (1 - this.brakeBias) * this.brakePedal;
        for (i = 0; i < rearWheels.length; i++) {
            rearWheels[i].applyBrakes(rearBrakes, (carSpeed.y > 0));
        }

        // Apply throttle.
        var rpm = this.engineRotation * 60;

        // Get torque performance of engine at specified revs (graph function).
        var torque = 100 + 0.1 * (rpm - 1200) + 0.0000000005 * (rpm - 1200) * (rpm - 1200) * (rpm - 1200);

        // Scale torque performance with throttle percentage.
        torque = torque * this.throttlePedal;

        if (this.engineRotation > 200) {
            // Rev limiter.
            torque = 0;
        }

        // Get engine friction (engine braking).
        var friction = (this.engineRotation - 20) * this.engineFrictionCoeff;
        torque -= friction;

        // Apply transmission ratio.
        torque = torque * this.transmissionRatios[this.gear];

        // Apply torque to both rear wheels evenly.
        for (i = 0; i < rearWheels.length; i++) {
            rearWheels[i].applyRotationTorque(.5 * torque);
        }

        // Apply limited slip differential (rear wheels only).
        var total = 0;
        for (i = 0; i < rearWheels.length; i++) {
            total += rearWheels[i].rotationTorque;
        }

        var lock;
        if (total < 0) {
            // Coast locking.
            lock = 0.1;
        } else {
            // Power locking.
            lock = 0.5;
        }

        var average = total / rearWheels.length;
        for (i = 0; i < rearWheels.length; i++) {
            var newTorque = (1 - lock) * rearWheels[i].getRotationTorque() + lock * average;
            rearWheels[i].setRotationTorque(newTorque);
        }
*/
        // Apply the forces per wheel. This will perform all impulse applications to the physics model.
        var chassisForces = [];
        for (i = 0; i < wheels.length; i++) {
            chassisForces.push(wheels[i].getChassisForce());
        }

        // Reset chassis torque for recalculation.
        this.chassisTorque.x = 0;
        this.chassisTorque.y = 0;

        for (i = 0; i < wheels.length; i++) {
            this.applyForce(wheels[i].offset, chassisForces[i], dt);
        }
    };

    /**
     * Applies the specified force at the specified relative offset during the timestep.
     * @param {Vector} offset
     * @param {Vector} force
     * @param {number} dt
     */
    this.applyForce = function(offset, force, dt) {
        // Apply chassis forces: apply impulse.
        if (force.getLength() > 1e-9 || force.getLength() < -1e-9) {
            this.solidObject.applyImpulse(offset, force.normalize(), force.getLength() * dt);

            // Calculate chassisTorque from combined wheels' chassis forces.
            this.chassisTorque.x += this.cmHeight * force.d(new Vector(1, 0));
            this.chassisTorque.y += this.cmHeight * force.d(new Vector(0, 1));
        }
    };

    // Initialize the solid object which describes the edges of the car in the physics model.
    var inertia = 1 / 12 * this.mass * (2 * 2 + 5.5 * 5.5);
    this.solidObject.init(scene, this.mass, inertia, position, [new Vector(-1, 2.25), new Vector(1, 2.25), new Vector(1, -1.75), new Vector(-1, -1.75)]);

    // Determine the wheel base and the mass balance of the front and rear axles.
    var frontWheelOffset = 2;
    var rearWheelOffset = -1.5;
    var frontMassBalance = 1 / (1 - frontWheelOffset / rearWheelOffset);
    var rearMassBalance = 1 - frontMassBalance;

    // Initialize the individual wheels.
    this.fl = new Wheel(this, new Vector(-1, frontWheelOffset), 9.81 * this.mass * 0.5 * frontMassBalance, 15, 0.35, 0.3);
    this.fr = new Wheel(this, new Vector(1, frontWheelOffset), 9.81 * this.mass * 0.5 * frontMassBalance, 15, 0.35, 0.3);
    this.rl = new Wheel(this, new Vector(-1, rearWheelOffset), 9.81 * this.mass * 0.5 * rearMassBalance, 15, 0.35, 0.35);
    this.rr = new Wheel(this, new Vector(1, rearWheelOffset), 9.81 * this.mass * 0.5 * rearMassBalance, 15, 0.35, 0.35);
    this.fl.solidObject.rotation = .00125 * Math.PI;
    this.fr.solidObject.rotation = .00125 * Math.PI;

    this.solidObject.speed.y = 1;

    // Add all objects to scene.
    scene.addObject(this.solidObject);
    scene.addObject(this.fl.solidObject);
    scene.addObject(this.fr.solidObject);
    scene.addObject(this.rl.solidObject);
    scene.addObject(this.rr.solidObject);

};

