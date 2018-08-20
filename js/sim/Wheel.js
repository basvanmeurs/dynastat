/**
 * A wheel of a car.
 * @param {Car} car
 * @param {Vector} offset
 *   Offset of the wheel to the CM of the car.
 * @param {Number} baseFz
 *   The base Fz of this wheel onto the ground, when there is no roll or pitch of the car.
 * @param {Number} mass
 *   The mass of the wheel (spinning parts only).
 * @param {Number} radius
 *   The wheel radius.
 * @param {Number} width
 *   The tire thread width.
 * @constructor
 */
var Wheel = function(car, offset, baseFz, mass, radius, width) {

    /**
     * The car that this wheel is part of.
     * @type {Car}
     */
    this.car = car;

    /**
     * Offset of this wheel to the CM of the car.
     * @type {Vector}
     */
    this.offset = offset;

    /**
     * The base Fz of this wheel onto the ground, when there is no roll or pitch of the car.
     * @type {Number}
     */
    this.baseFz = baseFz;

    /**
     * The mass of the wheel (spinning parts only).
     * @type {Number}
     */
    this.mass = mass;

    /**
     * The wheel radius.
     * @type {Number}
     */
    this.radius = radius;

    /**
     * The tire width.
     * @type {Number}
     */
    this.width = width;

    /**
     * The solid object in the physics model.
     * @type {SolidObject}
     */
    this.solidObject = new SolidObject();

    /**
     * The maximum brake torque that a single brake system (for any wheel) can generate, in Newton * meter (brake disk force * radius).
     * @type {number}
     */
    this.brakeTorque = 8000 * .1;

    /**
     * Indicates whether the wheels are currently locking.
     * @type {boolean}
     */
    this.locked = false;

    /**
     * The force vector currently applied on the chassis at the contact point with the tire, absolute coordinates.
     * @type {Vector}
     */
    this.chassisForce = new Vector(0, 0);

    /**
     * The rotational torque applied to the wheel, in Newton * meter.
     * @type {number}
     */
    this.rotationTorque = 0;

    /**
     * Resets the forces for calculation this time frame.
     */
    this.resetForces = function() {
        this.chassisForce.x = 0;
        this.chassisForce.y = 0;
        this.rotationTorque = 0;
    };

    /**
     * Returns the current 'real' Fz caused by weight, chassis roll and chassis pitch.
     */
    this.getRealFz = function() {
        return this.baseFz;// + this.car.chassisTorque.dotProd(this.offset);
    };

    /**
     * Applies the lateral grip caused by slip of this wheel on the wheel itself and the chassis.
     */
    this.applySlipGrip = function() {
        // Get real Fz caused by chassis roll and pitch.
        var realFz = this.getRealFz();

        // Get rotation of wheel relative to the world.
        var rotation = this.solidObject.getAbsoluteRotation();

        // Get tire rotation vector.
        var wheelRotationVector = new Vector(-Math.sin(rotation), Math.cos(rotation));

        // Get absolute speed of the wheel hub.
        var wheelHubSpeed = this.solidObject.getSpeedAtRelCoords(new Vector(0, 0));

        // Calculate lateral slip angle: wheel angle relative to wheel hub speed direction.
        var slipAngle = 0;
        if (wheelHubSpeed.getLength() > .001|| wheelHubSpeed.getLength() < -.001) {
            var v = wheelHubSpeed.normalize().dotProd(wheelRotationVector);
            slipAngle = Math.acos(Math.abs(v));
        }

        // Get sideways force applied on the wheel at the ground/tire contact point.
        var latGrip = this.getLatitudinalGrip(slipAngle) * realFz;

        if (v < 0) {
            // Reversing car.
            latGrip = -latGrip;
        }

        // Add additional chassis force.
        var newChassisForce = new Vector(latGrip, 0);
        newChassisForce = newChassisForce.rotate(rotation);
console.log(newChassisForce.toString());
        this.chassisForce.x += newChassisForce.x;
        this.chassisForce.y += newChassisForce.y;
    };

    /**
     * Returns the max tire grip, per Fz in newton.
     * @returns {number}
     */
    this.getMaxTireGrip = function() {
        return 3200 / 2000;
    };

    /**
     * Returns the min tire grip (in wheel locked state), per Fz in newton.
     * @returns {number}
     */
    this.getMinTireGrip = function() {
        return .75 * this.getMaxTireGrip();
    };

    /**
     * Returns latitudinal grip per Fz (force on the contact point between tire and ground).
     * @param {Number} slip
     *   A number between -PI and PI.
     * @return {Number}
     */
    this.getLatitudinalGrip = function(slip) {
        var params = {
            linearGripSlip: 0.06,
            maxGripPerFz: this.getMaxTireGrip(),
            maxGripSlip: 0.08,
            minGripPerFz: this.getMinTireGrip(),
            minGripSlip: 0.16
        };

        return this.getGrip(slip, params);
    };

    /**
     * Returns the grip relative to the slip.
     * @param slip
     *   A number with unlimited range.
     * @param {object} params
     *  Surface/tire contact point grip parameters.
     *  - linearGripSlip
     *    The slip ratio until which the grip differential is linear.
     *  - maxGripPerFz
     *    Max grip per newton of Fz.
     *  - maxGripSlip
     *    Max grip slip.
     *  - minGripPerFz
     *    The level to which the grip falls back in full slip.
     *  - minGripSlip
     *    The slip ratio at which the fallGripPerFz has been reached. From here on, the grip stays the same.
     * @returns {Number}
     */
    this.getGrip = function(slip, params) {
        var direction = slip > 0 ? 1 : -1;
        if (slip < 0) {
            slip = -slip;
        }

        var diff;
        var grip = 0;
        if (slip < params.linearGripSlip) {
            // Linear.
            grip = params.maxGripPerFz * (slip / params.linearGripSlip);
        } else if (slip < params.maxGripSlip) {
            return params.maxGripPerFz;
        } else if (slip < params.minGripSlip) {
            // Fall.
            diff = (params.minGripPerFz - params.maxGripPerFz) / (params.minGripSlip - params.maxGripSlip);
            grip = params.maxGripPerFz + diff * (slip - params.maxGripSlip);
        } else {
            // Constant.
            grip = params.minGripPerFz;
        }

        if (direction == -1) {
            grip = -grip;
        }

        return grip;
    };

    /**
     * Applies brakes to the wheel.
     * @param amount
     *   A number from 0 to 1.
     * @param carMovesForward
     *   This determines whether the brake torque is positive or negative.
     */
    this.applyBrakes = function(amount, carMovesForward) {
        // Remember whether or not the car is currently braking.
        this.appliedBrakingTorque = amount * this.brakeTorque;

        this.rotationTorque += (carMovesForward ? -1 : 1) * this.appliedBrakingTorque;
    };

    /**
     * Applies the specified external torque directly on this wheel.
     * @param torque
     */
    this.applyRotationTorque = function(torque) {
        this.rotationTorque += torque;
    };

    /**
     * Returns the rotation torque.
     */
    this.getRotationTorque = function() {
        return this.rotationTorque;
    };

    /**
     * Sets the rotation torque.
     * @param torque
     */
    this.setRotationTorque = function(torque) {
        this.rotationTorque = torque;
    };

    /**
     * Returns the force on the chassis caused by the wheels.
     */
    this.getChassisForce = function() {
        // Apply rotation torque to the contact point of the tire.
        var force = this.rotationTorque / this.radius;

        // Get tire grip; when weel is locked the braking force is decremented.
        var grip = (force < 0 && this.locked) ? this.getMinTireGrip() : this.getMaxTireGrip();
        grip = grip * this.getRealFz();

        // Make force positive to simplify further calculations.
        var neg = (force < 0);
        if (neg) {
            force = -force;
        }

        if (force > grip) {
            // Too much force.
            var brakeForce = this.appliedBrakingTorque / this.radius;
            if (force - brakeForce <= grip) {
                // Brake force caused this: results in locked wheel.
                this.locked = true;
            } else {
                // Wheel spin.
                // We use traction control, so we'll just remove the overflowing force.
            }

            force = grip;
        } else {
            // If wheels were locked under braking, they are now unlocked.
            this.locked = false;
        }

        //@todo: if brake force causes change of side, stop it in time.

        if (neg) {
            force = -force;
        }

        // Apply to chassis force.
        var tireChassisForce = new Vector(0, force);
        var rotation = this.solidObject.getAbsoluteRotation();
        tireChassisForce = tireChassisForce.rotate(rotation);
        this.chassisForce = this.chassisForce.add(tireChassisForce);

        // Apply to chassis.
        return this.chassisForce;
    };

    // Initialize the solid object.
    this.solidObject.initChild(car.scene, 20, null, this.car.solidObject, this.offset, null, [
        new Vector(-0.5 * width, this.radius),
        new Vector(0.5 * width, this.radius),
        new Vector(0.5 * width, -this.radius),
        new Vector(-0.5 * width, -this.radius)
    ], true);

};
