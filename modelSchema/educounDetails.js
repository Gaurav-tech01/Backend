const mongoose = require('mongoose')
// const User = require('../modelSchema/userDetails')

const educonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    dob: {//date of birth
        type: String,
        required: true
    },
    "12th marks": {
        type: String
    },
    "12th marksheet":{
        type: String
    },
    "10th marks": {
        type: String
    },
    "10th marksheet":{
        type: String
    },
    userId: {
        type: String
    }
},{timestamps: true})

module.exports = mongoose.model("Councilling", educonSchema)