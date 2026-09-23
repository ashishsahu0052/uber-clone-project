const mapService = require("../services/maps.service");
const { validationResult } = require("express-validator");

module.exports.getCoordinates = async (req, res) => {
    try {
        const { address } = req.query;

        if (!address) {
            return res.status(400).json({
                message: "Address is required",
            });
        }

        const coordinates = await mapService.getAddress(address);

        return res.status(200).json(coordinates);

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};



module.exports.getDistanceTime = async (req, res) => {
    try {
        const { pickup, destination } = req.query
        console.log(pickup)


        if (!pickup || !destination) {
            return res.status(400).json({
                message: "origin and destination both required"
            })
        }
        const pickupAddress = await mapService.getAddress(pickup)
        //await new Promise(resolve => setTimeout(resolve, 1500));
        const destinationAddress = await mapService.getAddress(destination)


        const result = await mapService.getDistanceTime(
            pickupAddress, destinationAddress

            // JSON.parse(origin),
            // JSON.parse(destination)
        )
        // console.log(originAddress , destinationAddress)
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}// seding distance and time in a object in km and minute 
module.exports.getSuggestion = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const { input } = req.query
        const suggestions = await mapService.getSuggestion(input)
        res.status(200).json(suggestions)

    } catch (error) {
        console.error("Map controller getSuggestion error:", error)
        res.status(500).json({ message: "unable to get suggestions" })
    }
}
