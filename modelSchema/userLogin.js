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
    tokens:{
        type: String
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{timestamps: true})

module.exports = mongoose.model('Login', loginSchema)