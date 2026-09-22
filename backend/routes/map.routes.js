const express = require('express')
const router = express.Router()
const authMiddleware =require('../middlewares/auth.middleware')
const mapController = require('../controllers/map.controller')


router.get('/get-coordinates' ,authMiddleware.authUser  , mapController.getCoordinates  )
router.get('/get-distance-time' ,authMiddleware.authUser  , mapController.getDistanceTime )
module.exports = router