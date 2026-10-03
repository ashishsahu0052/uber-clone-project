const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const captainModel = require('../models/captain.model');
const { sendMessageToCaptains, sendMessageToUser, sendMessageToSocketId, broadcastEvent } = require('../socket');

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { pickup, destination, vehicleType } = req.body;
        const ride = await rideService.createRide({
            userId: req.user._id,
            pickup,
            destination,
            vehicleType
        });

        // Notify all active captains via socket
        sendMessageToCaptains('new-ride', ride);

        return res.status(201).json({ ride });
    } catch (error) {
        console.error("Error creating ride:", error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { pickup, destination } = req.query;
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (error) {
        console.error("Error calculating fare:", error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { rideId } = req.body;

        let captain = req.captain;
        if (!captain || !captain._id) {
            captain = await captainModel.findOne({ status: 'active' }) || await captainModel.findOne();
        }

        if (!captain?._id) {
            return res.status(401).json({ message: "Captain not found or unauthorized" });
        }

        const ride = await rideService.confirmRide({
            rideId,
            captainId: captain._id
        });

        // Notify user that their ride has been accepted by captain
        const targetUserId = ride.userId?._id ? ride.userId._id.toString() : (ride.userId ? ride.userId.toString() : null);
        if (targetUserId) {
            sendMessageToUser(targetUserId, 'ride-confirmed', ride);
        }
        if (ride.userId?.socketId) {
            sendMessageToSocketId(ride.userId.socketId, { event: 'ride-confirmed', data: ride });
        }
        broadcastEvent('ride-confirmed', ride);

        // Notify other captains that this ride was accepted
        sendMessageToCaptains('ride-taken', { rideId });

        return res.status(200).json(ride);
    } catch (error) {
        console.error("Error confirming ride:", error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const rideId = req.query.rideId || req.body.rideId;
        // const otp = req.query.otp || req.body.otp;

        const ride = await rideService.startRide({
            rideId,
            //   otp,
            captainId: req.captain._id
        });

        // Notify user that ride has officially started
        const targetUserId = ride.userId?._id ? ride.userId._id.toString() : (ride.userId ? ride.userId.toString() : null);
        if (targetUserId) {
            sendMessageToUser(targetUserId, 'ride-started', ride);
        }
        if (ride.userId?.socketId) {
            sendMessageToSocketId(ride.userId.socketId, { event: 'ride-started', data: ride });
        }
        broadcastEvent('ride-started', ride);

        return res.status(200).json(ride);
    } catch (error) {
        console.error("Error starting ride:", error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { rideId } = req.body;
        const ride = await rideService.endRide({
            rideId,
            captainId: req.captain._id
        });

        // Notify user that ride is completed
        const targetUserId = ride.userId?._id ? ride.userId._id.toString() : (ride.userId ? ride.userId.toString() : null);
        if (targetUserId) {
            sendMessageToUser(targetUserId, 'ride-ended', ride);
        }
        if (ride.userId?.socketId) {
            sendMessageToSocketId(ride.userId.socketId, { event: 'ride-ended', data: ride });
        }
        broadcastEvent('ride-ended', ride);

        return res.status(200).json(ride);
    } catch (error) {
        console.error("Error ending ride:", error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports.getPendingRides = async (req, res) => {
    try {
        const rides = await rideService.getPendingRides();
        return res.status(200).json(rides);
    } catch (error) {
        console.error("Error getting pending rides:", error);
        return res.status(500).json({ message: error.message });
    }
};
