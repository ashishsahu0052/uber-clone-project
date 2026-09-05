const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const captainController = require('../controllers/captain.controller');


router.post('/register',[
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name should be more than 3 letters'),
    body('password').isLength({ min: 6 }).withMessage('Password should be more than 6 letters'),    
    body('vechicle.color').notEmpty().withMessage('Vechicle color is required'),
    body('vechicle.plate').notEmpty().withMessage('Vechicle plate is required'),
    body('vechicle.vechicleType').isIn(['car', 'bike', 'truck']).withMessage('Vechicle type must be either car, bike or truck'),    
] , captainController.registerCaptain);

module.exports = router;
