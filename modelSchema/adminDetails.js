const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    name: {
        type: String
    },
    dob: {
        type: String
    },
    address: {
        line1:{
            type: String
        },
        state:{
            type: String
        },
        country:{
            type: String
        }
    },
    occupation: {
        type: String
    },
    phone: {
        type: String
    },
    image: {
        type: String
    }
},{timestamps: true})

module.exports = mongoose.model('Admin', adminSchema)