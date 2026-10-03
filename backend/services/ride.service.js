const rideModel = require('../models/ride.model');
const mapService = require('../services/maps.service');

async function getFare(pickup, destination) {
    if (!pickup || !destination) {
        throw new Error('Please enter pickup and destination');
    }

    const distanceTime = await mapService.getDistanceTime(pickup, destination);

    const baseFare = {
        auto: 25,
        bike: 20,
        car: 50
    };

    const perKmFare = {
        auto: 10,
        bike: 8,
        car: 15
    };

    const perMinuteFare = {
        auto: 1.5,
        bike: 1,
        car: 2.5
    };

    const fare = {
        auto: Math.round(baseFare.auto + (distanceTime.distance * perKmFare.auto) + (distanceTime.time * perMinuteFare.auto)),
        bike: Math.round(baseFare.bike + (distanceTime.distance * perKmFare.bike) + (distanceTime.time * perMinuteFare.bike)),
        moto: Math.round(baseFare.bike + (distanceTime.distance * perKmFare.bike) + (distanceTime.time * perMinuteFare.bike)),
        car: Math.round(baseFare.car + (distanceTime.distance * perKmFare.car) + (distanceTime.time * perMinuteFare.car)),
        distance: distanceTime.distance,
        duration: distanceTime.duration
    };

    return fare;
}

function getOtp(num = 4) {
    return Math.floor(Math.pow(10, num - 1) + Math.random() * (Math.pow(10, num) - Math.pow(10, num - 1) - 1)).toString();
}

module.exports.getFare = getFare;
module.exports.getOtp = getOtp;

module.exports.createRide = async ({ userId, pickup, destination, vehicleType }) => {
    if (!userId || !pickup || !destination || !vehicleType) {
        throw new Error("Please enter all required fields");
    }

    const fareObj = await getFare(pickup, destination);
    const normalizedType = vehicleType === 'moto' ? 'bike' : vehicleType;
    const fare = fareObj[normalizedType] || fareObj.car;

    const otp = getOtp(4);

    const ride = await rideModel.create({
        userId,
        pickup,
        destination,
        otp,
        fare,
        vehicleType,
        status: 'pending',
        distance: fareObj.distance,
        duration: fareObj.duration
    });

    const populatedRide = await rideModel.findById(ride._id).populate('userId', 'fullname email socketId');
    return populatedRide;
};

module.exports.confirmRide = async ({ rideId, captainId }) => {
    if (!rideId || !captainId) {
        throw new Error("Ride ID and Captain ID are required");
    }

    const ride = await rideModel.findOneAndUpdate(
        { _id: rideId, status: 'pending' },
        { status: 'accepted', captain: captainId },
        { new: true }
    )
    .populate('userId', 'fullname email socketId')
    .populate('captain', 'fullname vehicle location socketId');

    if (!ride) {
        throw new Error("Ride not found or already accepted");
    }

    return ride;
};

module.exports.startRide = async ({ rideId, otp, captainId }) => {
    if (!rideId || !otp) {
        throw new Error("Ride ID and OTP are required");
    }

    const ride = await rideModel.findOne({ _id: rideId })
        .populate('userId', 'fullname email socketId')
        .populate('captain', 'fullname vehicle location socketId');

    if (!ride) {
        throw new Error("Ride not found");
    }

    if (ride.status !== 'accepted') {
        throw new Error("Ride is not in accepted state");
    }

    if (ride.otp !== otp) {
        throw new Error("Invalid OTP");
    }

    ride.status = 'ongoing';
    await ride.save();

    return ride;
};

module.exports.endRide = async ({ rideId, captainId }) => {
    if (!rideId) {
        throw new Error("Ride ID is required");
    }

    const ride = await rideModel.findOne({ _id: rideId, captain: captainId })
        .populate('userId', 'fullname email socketId')
        .populate('captain', 'fullname vehicle location socketId');

    if (!ride) {
        throw new Error("Ride not found");
    }

    if (ride.status !== 'ongoing') {
        throw new Error("Ride is not ongoing");
    }

    ride.status = 'completed';
    await ride.save();

    return ride;
};

module.exports.getPendingRides = async () => {
    const rides = await rideModel.find({ status: 'pending' })
        .populate('userId', 'fullname email socketId')
        .sort({ createdAt: -1 });

    return rides;
};
