const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const rideController = require('../controllers/ride.controller')
const authMiddleware = require('../middlewares/auth.middleware')


router.post('/create',
    authMiddleware.authUser,

    body('pickup').isString().withMessage('Please enter a valid lcoation'),
    body('destination').isString().withMessage('Please enter a valid destination'),
    body('vehicleType').isString().isIn(['auto', 'bike', 'car']).withMessage(' Please enter a valid vehicle type'),

    rideController.createRide

)

module.exports = router