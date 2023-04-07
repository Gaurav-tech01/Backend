const router = require("express").Router();
const Login = require('../modelSchema/userLogin');
const User = require('../modelSchema/userDetails');

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
            });
                newUser.save();
                res.json({newUser})
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

module.exports = router;
