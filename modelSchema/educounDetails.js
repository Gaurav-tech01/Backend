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
    marks_12: {
        type: String
    },
    marksheet_12:{
        type: String
    },
    marks_10: {
        type: String
    },
    marksheet_10:{
        type: String
    },
    userId: {
        type: String
    }
},{timestamps: true})

module.exports = mongoose.model("Councilling", educonSchema)