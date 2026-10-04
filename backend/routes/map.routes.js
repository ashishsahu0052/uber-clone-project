const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/auth.middleware')
const mapController = require('../controllers/map.controller')
const { query } = require('express-validator')


router.get('/get-coordinates', authMiddleware.authUser, mapController.getCoordinates)
router.get('/get-distance-time', authMiddleware.authUser, mapController.getDistanceTime)
router.get('/get-suggestion',
    query('input').isString().isLength({ min: 3 }),
    authMiddleware.authUser,
    mapController.getSuggestion
)
router.get('/get-route', mapController.getRoute)

module.exports = router