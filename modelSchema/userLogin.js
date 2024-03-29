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
    profile_status:{
        type: Boolean
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    pack_status: {
        type: Boolean
    },
    astro_status: {
        type: Boolean
    },
    psy_status: {
        type: Boolean
    },
},{timestamps: true})

module.exports = mongoose.model('Login', loginSchema)