const router = require("express").Router();
const Astro = require('../modelSchema/astroDetails');

//To Insert values inside mongodb database for Astrology Section
router.post("/details", (req, res) => {
        try{
            const newUser = new Astro({
                name: req.body.name,
                dob: req.body.dob,
                pob: req.body.pob,
                tob: req.body.tob,
            });
                newUser.save();
                res.json(newUser)
        } catch(err) {
            console.log(err);
        }
    }
);

router.get("/fetchAstroDetails", async (req, res) => {
    const query = {name: req.body.name}
    const check = await Astro.findOne(query);
    res.send(check)
})

module.exports = router;