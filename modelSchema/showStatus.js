const mongoose = require('mongoose')

const showSchema = new mongoose.Schema({
    astro: {
        type: Boolean,
        default: true
    },
    Psychometric: {
        type: Boolean,
        default: true
    },
    Career: {
        type: Boolean,
        default: true
    },
    Course: {
        type: Boolean,
        default: false
    },
    College: {
        type: Boolean,
        default: false
    },
    Counseling: {
        type: Boolean,
        default: false
    }
},{timestamps: true})

module.exports = mongoose.model("Show", showSchema)