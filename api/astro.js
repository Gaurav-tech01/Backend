const router = require("express").Router();
const Astro = require('../modelSchema/astroDetails');
const Login = require('../modelSchema/userLogin');
const jwt = require('jsonwebtoken')

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
            const newUser = new Astro({
                name: req.body.name,
                dob: req.body.dob,
                pob: req.body.pob,
                tob: req.body.tob,
                userId: req.userId
            });
                newUser.save();
                res.json(newUser)
        } catch(err) {
            console.log(err);
        }
});

router.get("/fetchAstroDetails", async (req, res) => {
    try{
        let token = req.body.authorization;
        if(token){
            let user = jwt.verify(token, process.env.SECRET_KEY)
            req.userId = user.id
        }
        else {
            res.status(401).json({message: "Unauthorized User"})
        }

        const check = await Astro.findOne({userId: req.userId})
        res.send(check)
        
    }catch(err){
        res.status(401).json({message: "Unauthorized User"})
    }
})

module.exports = router;