const express = require("express");
const app = express();
const mongoose = require('mongoose');
const userRoute = require('./api/login')
const DB_URI = 'mongodb+srv://gauravsaraiwala:sJZ7f0PPZkefNsdP@cluster0.5cqk2hp.mongodb.net/counseling?retryWrites=true&w=majority';
const user = require('./api/user')
const astro = require('./api/astro')

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

app.listen(8000, ()=> {
    console.log("Backend Server is running!")
})