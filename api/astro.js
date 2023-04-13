const router = require("express").Router();
const Astro = require('../modelSchema/astroDetails');
const Login = require('../modelSchema/userLogin')

//To Insert values inside mongodb database for Astrology Section
router.post("/details", async (req, res) => {
    const query = {email: req.body.email}
    const check = await Login.findOne(query);
    if(!(check.astro))
    {
        try{
            const newUser = new Astro({
                name: req.body.name,
                dob: req.body.dob,
                pob: req.body.pob,
                tob: req.body.tob,
            });
                newUser.save();
                await Login.updateOne(query, {$set: {astro: newUser._id}});
                res.json(newUser)
        } catch(err) {
            console.log(err);
        }
    } else {
        res.json("Astro Details already filled")
    }
});

router.get("/fetchAstroDetails", async (req, res) => {
    const query = {email: req.body.email}
    const id = await Login.findOne(query)
    const check = await Astro.findOne(id.astro)
    res.send(check)
})

module.exports = router;