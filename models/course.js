'use strict'
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courseSchema = mongoose.Schema({
    number: Number,
    name: String,
    is_available: Boolean,
    levels: [{
        number: Number,
        name: String
        }]
});

module.exports = mongoose.model('course', courseSchema);