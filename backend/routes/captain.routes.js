const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const captainController = require('../controllers/captain.controller');
const authmiddleware = require('../middlewares/auth.middleware');


router.post('/register',[
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name should be more than 3 letters'),
    body('password').isLength({ min: 6 }).withMessage('Password should be more than 6 letters'),    
    body('vehicle.color').notEmpty().withMessage('Vehicle color is required'),
    body('vehicle.plate').notEmpty().withMessage('Vehicle plate is required'),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage('Vehicle capacity must be at least 1'),
    body('vehicle.vehicleType').isIn(['car', 'bike', 'truck', 'auto']).withMessage('Vehicle type must be either car, bike, auto or truck'),    
] , captainController.registerCaptain);

router.post('/login',[
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password should be more than 6 letters'),    
] , captainController.loginCaptain);

router.get('/profile', authmiddleware.authCaptain, captainController.getCaptainProfile);
router.get('/logout', authmiddleware.authCaptain, captainController.logoutCaptain);

module.exports = router;
