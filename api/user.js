const router = require("express").Router();
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
const storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  })
const upload = multer({storage: storage,
fileFilter: (req,file,cb)=>{
    if(file.mimetype=='image/jpeg' || file.mimetype=='image/jpg' || file.mimetype=='image/png'){
        cb(null,true)
    }
    else{
        cb(null, false);
        return cb(new Error('Only jpeg, jpg, png is allowed'))
    }
}})

router.post("/details", upload.single('image'), async (req, res) => {
    const query = {email: req.body.email}
    const check = await Login.findOne(query);
    if(!check || !check.verified)
    {
        await Login.deleteMany(query);
        res.json({
            message: 'Not Verified or User not registered'})
    }
    else {
        try{
            const newUser = new User({
                name: req.body.name,
                dob: req.body.dob,
                address: req.body.address,
                education: req.body.education,
                phone: req.body.phone,
                userId: check._id
            });
            if((req.file)){
                newUser.image = req.file.filename
            }
            await newUser.save();
            await Login.updateOne(query, {$set: {profile: newUser._id, profile_status:true}});
            res.json(newUser)
        } catch(err) {
            console.log(err);
        }
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
        console.log(req.userId)
        const check = await User.findOne({userId: req.userId})
        res.send(check)
        
    }catch(err){
        console.log(err)
        res.status(401).json({message: "Unauthorized User"})
    }
})

module.exports = router;
