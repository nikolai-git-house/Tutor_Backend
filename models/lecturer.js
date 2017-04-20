'use strict'
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const lecturerSchema = mongoose.Schema({
    user_id: String,
    subjects: [{
        course_number: Number,
        level_number: Number,
        number: Number,
        name: String
    }]
});

module.exports = mongoose.model('lecturer', lecturerSchema);