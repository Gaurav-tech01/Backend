const express = require("express");
const app = express();
const mongoose = require('mongoose');
const userRoute = require('./api/login')
const psy = require('./api/psy')
const user = require('./api/user')
const astro = require('./api/astro')
const admin = require('./api/admin')
const chooseStream = require('./api/Stream')
const chooseCareer = require('./api/Career')
const planCareer = require('./api/planCareer')
const dotenv = require('dotenv')
const DB_URI = process.env.DB_URI

dotenv.config();
//const DB_URI = process.env.OWN_URI;

app.use(express.json())

app.use(express.static('uploads'))
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

//api use for filling psychology
app.use("/psy",psy)

//api use for admin side
app.use("/admin", admin)

//api use for filling chooseStream Answer
app.use("/chooseStream", chooseStream)

//api use for filling chooseStream Answer
app.use("/chooseCareer", chooseCareer)

//api use for filling chooseStream Answer
app.use("/planCareer", planCareer)

app.listen(process.env.PORT, ()=> {
    console.log("Backend Server is running!")
})