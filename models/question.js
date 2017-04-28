'use strict'
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const questionSchema = mongoose.Schema({
    _id: Schema.ObjectId,
    course_number: Number,
    level_number: Number,
    subject_number: Number,
    question: {
        user_id: String,
        title: String,
        content: String,
        created_at: String
    },
    is_answered: Boolean,
    answer: {
        user_id: String,
        content: String,
        created_at: String
    }

});

module.exports = mongoose.model('question', questionSchema);