const router = require("express").Router();
const Login = require('../modelSchema/userLogin');
const User = require('../modelSchema/userDetails');
const Otp = require('../modelSchema/otpVerification')
const dotenv = require('dotenv');
const twilio = require('twilio');
dotenv.config();

router.post("/details", async (req, res) => {
    const query = {email: req.body.email}
    const check = await Login.findOne(query);
    if(!check || check.verified)
    {
        try{
            const newUser = new User({
                name: req.body.name,
                dob: req.body.dob,
                address: req.body.address,
                email: req.body.email,
                education: req.body.education,
                phone: req.body.phone
            });
            newUser.save().then((result) => {
                sendSMS(result, res)
            });
            await Login.updateOne(query, {profile_status: true});
            res.json(newUser)
        } catch(err) {
            console.log(err);
        }
    }
    else{
        await Login.deleteMany(query);
        res.json({
            message: 'Not Verified or User not registered'})
        }
});

async function sendSMS({phone}, res){
    const genotp = `${Math.floor(1000 + Math.random() * 9999)}`;
    const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)
    const number = "+91"+phone
    return client.messages.create(
        {
            body: `Your ${genotp} for verification`,
            from: process.env.PHONE_NUMBER,
            to: number
        }
    ).then(message => {const newOtp = new Otp({
        phone: phone,
        otp: genotp,
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000
     });
     newOtp.save()
    })
    .catch(err => {console.log(err, "Message not sent")})
}

router.post("/verifyPhoneOTP", async (req, res) => {
    let {phone, otp} = req.body;
    try {
        if(!phone || !otp) {
            throw Error("Empty otp details");
        } else {
            const otpRecord = await Otp.find({phone}); 
            if(otpRecord.length <= 0) {
                throw new Error(
                    "Record doesn't exist"
                )
            } else {
                const {expiresAt} = otpRecord[0];
                if (expiresAt < Date.now()) {
                    await Otp.deleteMany({phone});
                    throw new Error('Code has expired. Please request again.');
                } else {
                    if(otp == otpRecord[0].otp) {
                        await Otp.deleteMany({phone});
                        res.json({
                            status: "Verified",
                            message: "Phone number Verified"
                        })
                    } else {
                        throw new Error("Invalid Code")
                    }
                }
            }
        }
    } catch (error) {
        await Otp.deleteMany({phone});
        res.json({
            status: "Failed",
            message: error.message
        })
    }
})

router.post("/resendOTP", async (req, res) => {
    try {
        let {phone} = req.body;
        if(!phone) {
            throw Error("Empty user details are not allowed")
        } else {
            await Otp.deleteMany({phone});
            sendOTP({phone}, res);
        }
    } catch(error) {
        res.json({
            status: "FAILED",
            message: error.message
        })
    }
})

router.get("/fetchUserDetails", async (req, res) => {
    const query = {email: req.body.email}
    const check = await User.findOne(query).populate('astro');
    res.send(check)
})

module.exports = router;
