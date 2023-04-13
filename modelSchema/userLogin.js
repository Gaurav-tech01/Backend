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
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    astro: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Astro'
    }
},{timestamps: true})

module.exports = mongoose.model('Login', loginSchema)