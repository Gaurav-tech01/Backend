const mongoose = require('mongoose')

const psySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {//date of birth
        type: String,
        required: true
    },
    hobbies:[{
        type: String,
        required: true
    }],
    userId: {
        type: String
    }
},{timestamps: true})

module.exports = mongoose.model("Psy", psySchema)