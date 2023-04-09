const mongoose = require('mongoose')

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
},{timestamps: true})

module.exports = mongoose.model("Astro", astroSchema)