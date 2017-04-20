'use strict'
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const purchaseSchema = mongoose.Schema({

    _id: Schema.ObjectId,
    user_id: String,
    course_number: Number,
    level_number: Number,
    subject_number: Number

});

module.exports = mongoose.model('purchase', purchaseSchema);