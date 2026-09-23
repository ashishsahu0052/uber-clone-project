const rideModel = require('../models/ride.model')
const mapService = require('../services/maps.service')
//const rideService = require('../services/ride.service')
const userController = require('../controllers/user.controller')
const crypto = require('crypto')

async function getFare(pickup, destination) {
    if (!pickup || !destination) {
        throw new Error('Please enter pickup and destination')

    }
    const distancecTime = await mapService.getDistanceTime(pickup, destination)

    const baseFare = {
        auto: 20,
        bike: 30,
        car: 50
    }

    const perKmFare = {
        auto: 10,
        car: 15,
        bike: 20

    }
    const perMinuteFare = {
        auto: 1,
        car: 3,
        bike: 1.5
    }

    const fare = {
        auto: baseFare.auto + distancecTime.distance * perKmFare.auto + distancecTime.time * perMinuteFare.auto,
        bike: baseFare.bike + distancecTime.distance * perKmFare.bike + distancecTime.time * perMinuteFare.bike,
        car: baseFare.car + distancecTime.distance * perKmFare.car + distancecTime.time * perMinuteFare.car

    }
    return fare



}
function getOtp(num) {
    function generateOtp(num) {
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString()
        return otp;
    }
    return generateOtp(num)

}

module.exports.createRide = async (data) => {
    const { userId, pickup, destination, vehicleType } = data
    if (!userId || !pickup || !destination || !vehicleType) {
        throw new Error("Please enter all the fields")

    }
    console.log("confirm 1")

    const fare = await getFare(pickup, destination)

    const ride = await rideModel.create({
        userId,
        pickup,
        destination,
        otp: getOtp(6),
        fare: fare[vehicleType]
    })

    return ride
}




