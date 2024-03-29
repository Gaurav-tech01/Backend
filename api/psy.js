const router = require("express").Router();
const Login = require('../modelSchema/userLogin')
const psy = require('../modelSchema/psyDetails');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

//To Insert values inside mongodb database for Astrology Section
router.post("/details", async (req, res) => {
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
        try{
            const check = await Login.findById(req.userId)
            if(!check.pack_status)
            {
                const newUser = new psy({
                name: req.body.name,
                age: req.body.age,
                hobbies: req.body.hobbies,
                userId: req.userId
            });
            await Login.updateOne({_id: check._id}, {$set: {pack_status: true, psy_status: true}})
                newUser.save();
                res.json(newUser)
        }
    else if(check.psy_status){
        res.json({message: "Already filled Psycometric details"})
    }
    else {
        res.json({message: "Already has astro package"})
    }
        } catch(err) {
            console.log(err);
        }
});

router.get("/fetchpsyDetails", async (req, res) => {
    try{
        let token = req.body.authorization;
        if(token){
            let user = jwt.verify(token, process.env.SECRET_KEY)
            req.userId = user.id
        }
        else {
            res.status(401).json({message: "Unauthorized User"})
        }
        const check = await Login.findById(req.userId)
        if(check.psy_status && check.pack_status)
        {
            const details = await psy.findOne({userId: req.userId})
            res.send(details)
        }
        else if(!check.psy_status && check.pack_status){
            res.json({message: "Astro pack already taken"})
        }   
        else {
            res.json({message: "Psycometric details not filled"})
        }
    }catch(err){
        res.status(401).json({message: "Unauthorized User"})
    }
})

module.exports = router;