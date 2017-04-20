'use strict'
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studentSchema = mongoose.Schema({
    user_id: String,
    paid_subjects: [{
        course_number: Number,
        level_number: Number,
        subject_number: Number
    }]
});

module.exports = mongoose.model('student', studentSchema);