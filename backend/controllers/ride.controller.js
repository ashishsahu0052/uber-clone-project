const rideService = require('../services/ride.service')
const { validationResult } = require('express-validator')



module.exports.createRide = async (req, res) => {
    const errors = validationResult(req)
    console.log("confirm 2")

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }


    try {
        const { pickup, destination, vehicleType } = req.body
        console.log(req.user._id)
        const ride = await rideService.createRide({ userId: req.user._id, pickup, destination, vehicleType })
        return res.status(201).json({ ride })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message })
    }

}
