const router = require("express").Router();
const jwt = require("jsonwebtoken")
const Login = require('../modelSchema/userLogin');
const Stream = require('../modelSchema/chooseStream')
const dotenv = require('dotenv');
dotenv.config();

router.post("/question", async (req, res) => {
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
    const check = await Login.findById(req.userId)
    const fillAnswer = new Stream({
        favorite_subjects_school: req.body.favorite_subjects_school,
        strengths_in_school: req.body.strengths_in_school,
        subjects_find_most_challenging: req.body.subjects_find_most_challenging,
        hobbies_and_interests: req.body.hobbies_and_interests,
        career_path_considering: req.body.career_path_considering,
        skills_want_to_develop: req.body.skills_want_to_develop,
        working_independently_or_team: req.body.working_independently_or_team,
        enjoy_working_with_numbers_and_data:req.body.enjoy_working_with_numbers_and_data,
        interested_in_exploring_new_technologies:req.body.interested_in_exploring_new_technologies,
        interested_in_learning_new_languages: req.body.interested_in_learning_new_languages,
        favorite_books_movies_TV_shows: req.body.favorite_books_movies_TV_shows,
        favorite_websites_or_apps: req.body.favorite_websites_or_apps,
        biggest_problems_facing_the_world_today: req.body.biggest_problems_facing_the_world_today,
        enjoy_public_speaking_or_presenting_in_front_of_group: req.body.enjoy_public_speaking_or_presenting_in_front_of_group,
        interested_in_arts_or_performing_arts: req.body.interested_in_arts_or_performing_arts,
        enjoy_working_with_hands_or_building_things: req.body.enjoy_working_with_hands_or_building_things,
        enjoy_doing_in_free_time: req.body.enjoy_doing_in_free_time,
        see_yourself_doing_in_5_10_years: req.body.see_yourself_doing_in_5_10_years,
        motivates_you_to_pursue_a_particular_career_path: req.body.motivates_you_to_pursue_a_particular_career_path,
        enjoy_working_with_animals_or_nature:req.body.enjoy_working_with_animals_or_nature,
        userId: check._id
    })
    fillAnswer.save();
    res.json(fillAnswer)
})

router.get('/fetchAnswer', async (req, res) => {
    try{
        let token = req.body.authorization;
        if(token){
            let user = jwt.verify(token, process.env.SECRET_KEY)
            req.userId = user.id
        }
        else {
            res.status(401).json({message: "Unauthorized User"})
        }
        const details = await Stream.findOne({userId: req.userId})
        res.send(details)
    } catch(err){
        res.status(401).json({message: "Unauthorized User"})
    }
})

module.exports = router;