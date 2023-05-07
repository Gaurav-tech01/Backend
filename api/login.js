const router = require("express").Router();
const Login = require('../modelSchema/userLogin');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const Otp = require('../modelSchema/otpVerification')
const dotenv = require('dotenv')
dotenv.config()

const gmail = process.env.GMAIL
const SECRET_KEY = "LoginDone"

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
                verified: false,
                profile_status: false,
                pack_status: false,
                astro_status: false,
                psy_status: false
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
    let {email, otp} = req.body;
    try {
        const verify = await Login.findOne({email})
        if(!email || !otp) {
            res.json({message: "Empty otp details"});
        } else {
            const otpRecord = await Otp.find({email}); 
            if(otpRecord.length <= 0) {
                await Otp.deleteMany({email});
                res.json({message: "Record doesn't exist"})
            } else {
                const {expiresAt} = otpRecord[0];
                if (expiresAt < Date.now()) {
                    await Otp.deleteMany({email});
                    res.json({message: 'Code has expired. Please request again.'});
                } else {
                    if(otp == otpRecord[0].otp) {
                        if(verify.verified)
                        {
                            await Otp.deleteMany({email});
                            res.json({
                                status: "Verified",
                                message: "redirect to update password page"})
                        }
                        else {
                        const token = jwt.sign({email: verify.email, id: verify._id}, SECRET_KEY)
                        await Login.updateOne({email: email}, {verified: true}, {tokens: token});
                        await Otp.deleteMany({email});
                        res.json({
                            status: "Verified",
                            message: "Login email Verified",
                            profile_status: verify.profile_status,
                            tokens: token
                        })}
                    } else {
                        await Otp.deleteMany({email});
                        res.json({message:"Invalid Code"})
                    }
                }
            }
        }
    } catch (error) {
        await Otp.deleteMany({email});
        res.json({
            status: "Failed",
            message: error.message
        })
    }
})

router.post("/updatepassword", async (req, res) => {
    const query = {email: req.body.email}
    const check = await Login.findOne(query);
    const salt = await bcrypt.genSalt(10)
    const secPass = await bcrypt.hash(req.body.password, salt)
    if(!check) {
        res.json({
            message: 'User not registered'})
    }
    else {
        try{
            await Login.updateOne(query, {password: secPass})
            res.json({message: "password updated"})
        }
        catch{
            res.json({status: "Failed"})
        }
    }
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
    const token = jwt.sign({email: check.email, id: check._id}, SECRET_KEY)
    if(!check || !(check.verified)){
        await Login.deleteMany({email})
        res.json({
            message: 'Login Missing or Not Verified'})
    }
    else if(!(check.profile_status)){
        try {
            const passCompare = await bcrypt.compare(pass, check.password);
            if(!passCompare){
                res.status(400).json({error: "Wrong Credentials"})
            } else {
                await Login.updateOne(query, {tokens: token});
                res.json({message: "Login Successful", profile_status: false, tokens: token})
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
                await Login.updateOne(query, {tokens: token});
                res.json({message: "Login Successful", profile_status: true, tokens: token})
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
            var uniqueDigits = [];
            while (uniqueDigits.length < 4) {
            var digit = Math.floor(Math.random() * 10);
            if (uniqueDigits.indexOf(digit) === -1) {
            uniqueDigits.push(digit);
            }
        }
        const genotp = uniqueDigits.join("");
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
            expiresAt: Date.now() + 360000
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
