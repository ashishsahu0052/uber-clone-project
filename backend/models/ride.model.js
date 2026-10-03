const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Captain'
    },
    pickup: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    fare: {
        type: Number,
        required: true
    },
    vehicleType: {
        type: String,
        default: 'car'
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'ongoing', 'completed', 'canceled'],
        default: 'pending'
    },
    duration: {
        type: Number,
    },
    distance: {
        type: Number
    },
    paymentId: {
        type: String
    },
    orderId: {
        type: String
    },
    signature: {
        type: String
    },
    otp: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("ride", rideSchema);