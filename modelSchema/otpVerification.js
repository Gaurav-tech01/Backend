const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        default: ""
    },
    otp: {
        type: String,
    },
    createdAt: Date,
    expiresAt: Date,
},{timestamps: true})

module.exports = mongoose.model('Otp', otpSchema)