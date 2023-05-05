const mongoose = require('mongoose')
// const User = require('../modelSchema/userDetails')

const planCareerSchema = new mongoose.Schema({
    current_job_or_field_of_work: {
        type: String,
    },
    long_been_working_your_current_field: {
        type: String,
        required: true
    },
    top_professional_strengths: {
        type: String,
        required: true
    },
    professional_development_need_to_improve:{
        type: String
    },
    long_term_career_goals: {
        type: String
    },
    short_term_career_goals: {
        type: String
    },
    work_environment_prefer:{
        type: String
    },
    pursuing_further_education_or_professional_certifications:{
        type: String
    },
    important_thing_looking_for_in_career:{
        type: String
    },
    industry_or_field_interested_in:{
        type: String
    },
    skills_you_have_as_a_good_candidate_for_desired_career_path:{
        type: String
    },
    skills_you_need_to_develop_to_successful_in_desired_career_path:{
        type: String
    },
    challenges_foresee_in_achieving_your_career_goals:{
        type: String
    },
    think_sets_you_apart_from_other_candidates_in_your_field:{
        type: String
    },
    biggest_professional_achievements_so_far: {
        type: String
    },
    measure_success_in_career:{
        type: String
    },
    handle_setbacks_or_failure_in_professionl_life:{
        type: String
    },
    stay_up_to_date_with_industry_trends_and_development: {
        type: String
    },
    impact_you_want_to_have_in_your_field_or_industry: {
        type: String
    },
    steps_taking_to_achieve_your_long_term_career_goals: {
        type: String
    },
    userId: {
        type: String
    }
},{timestamps: true})

module.exports = mongoose.model("planCareer", planCareerSchema)