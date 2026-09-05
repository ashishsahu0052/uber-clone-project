const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const captainSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'First name should be more than 3 letters']
        },
        lastname: {
            type: String,
            
        }
    },
    email: {
        type: String,
        required: true, 
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
    },
    password: { 
        required: true , 
        type: String,
        select:false
  

    },

    socketId:{
        type: String,
    },

    status:{
        type: String,
        enum:['active' , 'inactive'],
        default: 'inactive'
    },
    vechicle:{
        color:{
            type: String,
            required: true
        }, 
        plate:{
            type: String,
            required: true
        },
        capacity:{
            type: Number,
            required: true,
            min: [1, 'Capacity must be at least 1'],
        },
        vechicleType:{
            type: String,
            required: true,
            enum: ['car', 'bike', 'truck'],
        }
    },
    location :{
        lat:{
            type: Number,
        }, 
        long:{
            type: Number,
        }
    }
})

captainSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn:'24h'
    });
    return token;   
}
captainSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}   
captainSchema.statics.hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

const catainModel = mongoose.model('Captain', captainSchema)
module.exports = catainModel