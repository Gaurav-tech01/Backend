const router = require("express").Router();
const jwt = require("jsonwebtoken")
const Login = require('../modelSchema/userLogin');
const planCareer = require('../modelSchema/planningCareer')
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
    const fillAnswer = new planCareer({
        current_job_or_field_of_work: req.body.current_job_or_field_of_work,
        long_been_working_your_current_field: req.body.long_been_working_your_current_field,
        top_professional_strengths: req.body.top_professional_strengths,
        professional_development_need_to_improve:req.body.professional_development_need_to_improve,
        long_term_career_goals: req.body.long_term_career_goals,
        short_term_career_goals:req.body.short_term_career_goals,
        work_environment_prefer:req.body.work_environment_prefer,
        pursuing_further_education_or_professional_certifications:req.body.pursuing_further_education_or_professional_certifications,
        important_thing_looking_for_in_career:req.body.important_thing_looking_for_in_career,
        industry_or_field_interested_in:req.body.industry_or_field_interested_in,
        skills_you_have_as_a_good_candidate_for_desired_career_path:req.body.skills_you_have_as_a_good_candidate_for_desired_career_path,
        skills_you_need_to_develop_to_successful_in_desired_career_path:req.body.skills_you_need_to_develop_to_successful_in_desired_career_path,
        challenges_foresee_in_achieving_your_career_goals:req.body.challenges_foresee_in_achieving_your_career_goals,
        think_sets_you_apart_from_other_candidates_in_your_field:req.body.think_sets_you_apart_from_other_candidates_in_your_field,
        biggest_professional_achievements_so_far: req.body.biggest_professional_achievements_so_far,
        measure_success_in_career:req.body.measure_success_in_career,
        handle_setbacks_or_failure_in_professionl_life:req.body.handle_setbacks_or_failure_in_professionl_life,
        stay_up_to_date_with_industry_trends_and_development:req.body.stay_up_to_date_with_industry_trends_and_development,
        impact_you_want_to_have_in_your_field_or_industry: req.body.impact_you_want_to_have_in_your_field_or_industry,
        steps_taking_to_achieve_your_long_term_career_goals: req.body.steps_taking_to_achieve_your_long_term_career_goals,
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