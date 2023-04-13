const mongoose = require('mongoose')
// const User = require('../modelSchema/userDetails')

const astroSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    dob: {//date of birth
        type: String,
        required: true
    },
    pob: {//place of birth
        type: String,
        required: true
    },
    tob: {//time of birth
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Login'
    }
},{timestamps: true})

module.exports = mongoose.model("Astro", astroSchema)