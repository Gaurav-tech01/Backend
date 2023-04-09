const mongoose = require('mongoose')

const loginSchema = new mongoose.Schema({
    email: {
        type: String
    },
    password: {
        type: String
    },
    verified: {
        type: Boolean
    },
    profile_status: {
        type: Boolean
    }
},{timestamps: true})

module.exports = mongoose.model('Login', loginSchema)