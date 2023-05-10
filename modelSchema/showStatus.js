const mongoose = require('mongoose')

const showSchema = new mongoose.Schema({
    astro: {
        type: Boolean,
        default: false
    },
    Psychometric: {
        type: Boolean,
        default: false
    },
    Career: {
        type: Boolean,
        default: false
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