const router = require("express").Router();
const Login = require('../modelSchema/userLogin'); 
const User = require('../modelSchema/userDetails')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const Otp = require('../modelSchema/otpVerification')
const dotenv = require('dotenv')
dotenv.config()
const gmail = process.env.GMAIL

const mail = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
        user: gmail,
        pass: process.env.PASS
    }
});

router.post("/register", async (req, res) => {
    let {email} = req.body;
    const query = {email: req.body.email}
    const check = await Login.findOne(query);
    if(!check || !(check.verified))
    {
        await Login.deleteMany({email})
        try{
            const salt = await bcrypt.genSalt(10)
            const secPass = await bcrypt.hash(req.body.password, salt)
            const newLogin = new Login({
                email: req.body.email,
                password: secPass,
                verified: false
            });
                newLogin.save().then((result) => {
                    sendOTP(result, res)
                });
        } catch(err) {
            console.log(err);
        }
    }
    else{
        res.json({
            message: 'email or password already available'})
        }
});

router.post("/verifyOTP", async (req, res) => {
    try {
        let {email, otp} = req.body;
        const verify = await Login.findOne({email})
        if(!email || !otp) {
            throw Error("Empty otp details");
        } else {
            const otpRecord = await Otp.find({
                email
            }); 
            if(otpRecord.length <= 0) {
                throw new Error(
                    "Record doesn't exist"
                )
            } else {
                const {expiresAt} = otpRecord[0];
                if (expiresAt < Date.now()) {
                    await Otp.deleteMany({email});
                    throw new Error('Code has expired. Please request again.');
                } else {
                    if(otp == otpRecord[0].otp) {
                        if(verify.verified)
                        {
                            res.json({
                                status: "Verified",
                                message: "redirect to update password page"})
                        }
                        else {
                        await Login.updateOne({email: email}, {verified: true});
                        await Otp.deleteMany({email});
                        res.json({
                            status: "Verified",
                            message: "Login email Verified"
                        })}
                    } else {
                        throw new Error("Invalid Code")
                    }
                }
            }
        }
    } catch (error) {
        res.json({
            status: "Failed",
            message: error.message
        })
    }
})

router.post("/updatepassword", async (req, res) => {
    let {password} = req.body;
    await Login.updateOne({password})
})

router.post("/resendOTP", async (req, res) => {
    try {
        let {email} = req.body;
        if(!email) {
            throw Error("Empty user details are not allowed")
        } else {
            await Otp.deleteMany({email});
            sendOTP({email}, res);
        }
    } catch(error) {
        res.json({
            status: "FAILED",
            message: error.message
        })
    }
})

router.post("/login", async (req,res) => {
    const query = {email: req.body.email}
    const pass = req.body.password
    const check = await Login.findOne(query);
    let {email} = req.body;
    if(!check || !(check.verified)){
        await Login.deleteMany({email})
        res.json({
            message: 'Login Missing or Not Verified'})
    }
    else if(!(check.profile)){
        try {
            const passCompare = await bcrypt.compare(pass, check.password);
            if(!passCompare){
                res.status(400).json({error: "Wrong Credentials"})
            } else {
                res.json({message: "Login Successful", profile_status: false})
            }
        } catch(err) {
            console.log(err);
        }
    }
    else {
        try {
            const passCompare = await bcrypt.compare(pass, check.password);
            if(!passCompare){
                res.status(400).json({error: "Wrong Credentials"})
            } else {
                res.json({message: "Login Successful", profile_status: true})
            }
        } catch(err) {
            console.log(err);
        }
    }
})

router.post("/forgetpassword", async (req,res) => {
    const query = {email: req.body.email}
    const check = await Login.findOne(query);
    if(!check) {
        res.json({
            message: 'User not registered'})
    }
    else {
        try {
            sendOTP(check, res);
        } catch(err) {
            console.log(err);
        }
    }
})

const sendOTP = async ({_id, email}, res) => {
    try {
        const genotp = `${1000+(Math.floor(Math.random()*10)*999)}`;
        console.log(genotp)
            mail.sendMail({
                from: gmail,
                to: email,
                subject: "Verify Your Email",
                html: `<p>Enter <b>${genotp}</b></p>`
            })
         const newOtp = new Otp({
            email: email,
            otp: genotp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000
         });
         newOtp.save();
            res.json({
                status: "Pending",
                message: "Verification Otp Sent"
            })
     }
     catch (error) {
        res.json({
            status: "Failed",
            message: error.message
        })
     }
    }

module.exports = router;
