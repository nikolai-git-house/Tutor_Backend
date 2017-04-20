'use strict'
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const subjectSchema = mongoose.Schema({
    course_number: Number,
    level_number: Number,
    number: Number,
    name: String,
    price: Number,
    chapters: [{
        number: Number,
        name: String,
        video_url: String,
        note_url: String
        }]
});

module.exports = mongoose.model('subject', subjectSchema);