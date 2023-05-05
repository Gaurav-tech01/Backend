const mongoose = require('mongoose')
// const User = require('../modelSchema/userDetails')

const chooseStreamSchema = new mongoose.Schema({
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
    working_independently_or_team: {
        type: String
    },
    enjoy_working_with_numbers_and_data: {
        type: String
    },
    interested_in_exploring_new_technologies: {
        type: String
    },
    interested_in_learning_new_languages: {
        type: String
    },
    favorite_books_movies_TV_shows: {
        type: String
    },
    favorite_websites_or_apps: {
        type: String
    },
    biggest_problems_facing_the_world_today: {
        type: String
    },
    enjoy_public_speaking_or_presenting_in_front_of_group: {
        type: String
    },
    interested_in_arts_or_performing_arts: {
        type: String
    },
    enjoy_working_with_hands_or_building_things: {
        type: String
    },
    enjoy_doing_in_free_time: {
        type: String
    },
    see_yourself_doing_in_5_10_years: {
        type: String
    },
    motivates_you_to_pursue_a_particular_career_path: {
        type: String
    },
    enjoy_working_with_animals_or_nature: {
        type: String
    },
    userId: {
        type: String
    }
},{timestamps: true})

module.exports = mongoose.model("chooseStream", chooseStreamSchema)