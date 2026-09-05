const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");
const { validationResult } = require("express-validator");

module.exports.registerCaptain = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const { fullname, email, password , vechicle } = req.body;

        const isExistingCaptain = await captainModel.findOne({ email });

        if (isExistingCaptain) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const hashedPassword = await captainModel.hashPassword(password);

        const captain = await captainService.createCaptain({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword,
            color: vechicle.color,
            plate: vechicle.plate,
            capacity: vechicle.capacity,
            vehicleType: vechicle.vechicleType
        });

        const token = captain.generateAuthToken();

        return res.status(201).json({
            message: "Captain registered successfully",
            captain,
            token
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};