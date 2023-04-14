const express = require("express");
const app = express();
const mongoose = require('mongoose');
const userRoute = require('./api/login')

const user = require('./api/user')
const astro = require('./api/astro')
const dotenv = require('dotenv')
//const DB_URI = process.env.DB_URI
const DB_URI = process.env.OWN_URI;

app.use(express.json())

//MongoDb Connection Setup With Atlas
async function connectDB() {
    try {
        await mongoose.connect(DB_URI);
        console.log("Connected to MongoDB")
    } catch (error) {
        console.log("Error while connecting" + error.message);
    }
}
connectDB();

//api use for login
app.use("/user", userRoute)

//api use for filling user Details
app.use("/userDetails", user)

//api use for filling astro Details
app.use("/astro", astro)

console.log(process.env.PORT)
app.listen(process.env.PORT, ()=> {
    console.log("Backend Server is running!")
})