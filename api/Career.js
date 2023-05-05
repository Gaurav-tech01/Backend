const router = require("express").Router();
const jwt = require("jsonwebtoken")
const Login = require('../modelSchema/userLogin');
const Career = require('../modelSchema/chooseCareer')
const dotenv = require('dotenv');
const path = require('path');
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
    const fillAnswer = new Career({
        favorite_subjects_school: req.body.favorite_subjects_school,
        strengths_in_school: req.body.strengths_in_school,
        subjects_find_most_challenging: req.body.subjects_find_most_challenging,
        hobbies_and_interests: req.body.hobbies_and_interests,
        career_path_considering:req.body.career_path_considering,
        skills_want_to_develop: req.body.skills_want_to_develop,
        work_environment_prefer:req.body.work_environment_prefer,
        pursuing_career_in_arts:req.body.pursuing_career_in_arts,
        pursuing_career_in_healthcare:req.body.pursuing_career_in_healthcare,
        pursuing_career_in_technology:req.body.pursuing_career_in_technology,
        pursuing_career_in_education:req.body.pursuing_career_in_education,
        pursuing_career_in_law:req.body.pursuing_career_in_law,
        biggest_problems_facing_the_world_today:req.body.biggest_problems_facing_the_world_today,
        achieve_in_career:req.body.achieve_in_career,
        impact_want_to_have_in_community:req.body.impact_want_to_have_in_community,
        motivates_you_to_pursue_a_particular_career_path:req.body.motivates_you_to_pursue_a_particular_career_path,
        thoughts_on_higher_education:req.body.thoughts_on_higher_education,
        working_independently_or_team: req.body.working_independently_or_team,
        see_yourself_doing_in_5_10_years: req.body.see_yourself_doing_in_5_10_years,
        skills_you_have_as_a_good_candidate_for_desired_career_path: req.body.skills_you_have_as_a_good_candidate_for_desired_career_path,
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
        const details = await Career.findOne({userId: req.userId})
        res.send(details)
    } catch(err){
        res.status(401).json({message: "Unauthorized User"})
    }
})

module.exports = router;