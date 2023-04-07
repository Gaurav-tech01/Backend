const router = require("express").Router();
const User = require('../modelSchema/userLogin'); 
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
    const check = await User.findOne(query);
    console.log(check)
    if(!check || !(check.verified))
    {
        await User.deleteMany({email})
        try{
            const salt = await bcrypt.genSalt(10)
            const secPass = await bcrypt.hash(req.body.password, salt)
            const newUser = new User({
                email: req.body.email,
                password: secPass,
                verified: false
            });
                newUser.save().then((result) => {
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
                        await User.updateOne({email: email}, {verified: true});
                        await Otp.deleteMany({email});
                        res.json({
                            status: "Verified",
                            message: "User email Verified"
                        })
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
    const check = await User.findOne(query);
    let {email} = req.body;
    if(!check || !(check.verified)){
        
        await User.deleteMany({email})
        res.json({
            message: 'User Missing or Not Verified'})
        }
    else {
        try {
            const passCompare = await bcrypt.compare(pass, check.password);
            if(!passCompare){
                res.status(400).json({error: "Wrong Credentials"})
            } else {
                res.send("Login Successful")
            }
        } catch(err) {
            console.log(err);
        }
    }
})

const sendOTP = async ({_id, email}, res) => {
    try {
        const genotp = `${Math.floor(1000 + Math.random() * 9999)}`;
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
