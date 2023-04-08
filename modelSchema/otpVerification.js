const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    otp: String,
    createdAt: Date,
    expiresAt: Date,
},{timestamps: true})

module.exports = mongoose.model('Otp', otpSchema)