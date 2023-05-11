const express = require("express")
const app = express()
const router = express.Router();
const jwt = require("jsonwebtoken")
const Login = require('../modelSchema/userLogin');
const User = require('../modelSchema/userDetails');
const Otp = require('../modelSchema/otpVerification')
const dotenv = require('dotenv');
const twilio = require('twilio');
const path = require('path')
const SECRET_KEY = "LoginDone"

dotenv.config();

const multer = require('multer');
const { profile } = require("console");
const storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  })
const upload = multer({storage: storage})

// fileFilter: (req,file,cb)=>{
//     if(file.mimetype=='image/jpeg' || file.mimetype=='image/jpg' || file.mimetype=='image/png'){
//         cb(null,true)
//     }
//     else{
//         cb(null, false);
//         return cb(new Error('Only jpeg, jpg, png is allowed'))
//     }
// }})

router.post("/details", upload.single('image'), async (req, res) => {
    try{
        let token = req.body.authorization;
        if(token){
            let user = jwt.verify(token, process.env.SECRET_KEY)
            req.userId = user.id
        }
        else {
            res.status(401).json({message: "Unauthorized User"})
        }
    }catch(err){
        console.log(err)
        res.status(401).json({message: "Unauthorized User"})
    }
    const check = await Login.findById(req.userId);
    const id = check._id
    if(!check || !check.verified)
    {
        await Login.deleteMany(query);
        res.json({
            message: 'Not Verified or User not registered'})
    }
    else if(!check.profile_status){
        try{
            const newUser = new User({
                name: req.body.name,
                dob: req.body.dob,
                address: req.body.address,
                education: req.body.education,
                phone: req.body.phone,
                email: check.email,
                userId: check._id
            });
            if((req.file)){
                newUser.image = `${process.env.API_URL}/${req.file.filename}`
            }
            await newUser.save();
            await Login.updateOne({_id:id}, {$set: {profile: newUser._id, profile_status:true}});
            res.json(newUser)
        } catch(err) {
            console.log(err);
        }
    }
    else {
        res.json({message: "User Details Already Filled"})
    }
});

router.post("/updateDetails", upload.single('image'), async (req, res) => {
    try{
        let token = req.body.authorization;
        if(token){
            let user = jwt.verify(token, process.env.SECRET_KEY)
            req.userId = user.id
        }
        else {
            res.status(401).json({message: "Unauthorized User"})
        }
    } catch(err) {
        console.log(err)
        res.status(401).json({message: "Unauthorized User"})
    }
    const check = await Login.findById(req.userId);
    const id = check._id
    if(check.profile_status) {
        try{
            if((req.file)) {
                profile_image = `${process.env.API_URL}/${req.file.filename}`
            }
            else {
                const pic = User.findOne({userId:id})
                profile_image = pic.image
            }
            await User.updateOne({userId:id}, {$set: {name: req.body.name,
                dob: req.body.dob,
                address: req.body.address,
                education: req.body.education,
                phone: req.body.phone,
                image:profile_image,
                userId: check._id
            }});
            res.json({message: "User Details Updated"})
        } catch(err) {
            console.log(err);
        }
    } else {
        res.json({message: "User details not filled"})
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
    try{
        let token = req.body.authorization;
        if(token){
            let user = jwt.verify(token, SECRET_KEY)
            req.userId = user.id
        }
        else {
            res.status(401).json({message: "Unauthorized User"})
        }
        const details = await User.findOne({userId: req.userId})
        res.json(details)
    }catch(err){
        console.log(err)
        res.status(401).json({message: "Unauthorized User"})
    }
})

module.exports = router;
