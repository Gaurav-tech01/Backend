const mongoose = require('mongoose')
// const User = require('../modelSchema/userDetails')

const chooseCareerSchema = new mongoose.Schema({
    favorite_subjects_school: {
        type: String,
    },
    strengths_in_school: {
        type: String,
        required: true
    },
    subjects_find_most_challenging: {
        type: String,
        required: true
    },
    hobbies_and_interests: {
        type: String,
        required: true
    },
    career_path_considering:{
        type: String
    },
    skills_want_to_develop: {
        type: String
    },
    work_environment_prefer:{
        type: String
    },
    pursuing_career_in_arts:{
        type: String
    },
    pursuing_career_in_healthcare:{
        type: String
    },
    pursuing_career_in_technology:{
        type: String
    },
    pursuing_career_in_education:{
        type: String
    },
    pursuing_career_in_law:{
        type: String
    },
    biggest_problems_facing_the_world_today: {
        type: String
    },
    achieve_in_career:{
        type: String
    },
    impact_want_to_have_in_community:{
        type: String
    },
    motivates_you_to_pursue_a_particular_career_path: {
        type: String
    },
    thoughts_on_higher_education: {
        type: String
    },
    working_independently_or_team: {
        type: String
    },
    see_yourself_doing_in_5_10_years: {
        type: String
    },
    skills_you_have_as_a_good_candidate_for_desired_career_path:{
        type: String
    },
    userId: {
        type: String
    }
},{timestamps: true})

module.exports = mongoose.model("chooseCareer", chooseCareerSchema)