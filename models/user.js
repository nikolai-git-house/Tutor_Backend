'use strict'
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
    email: String,
    hashed_password: String,
    user_info: {
        first_name: String,
        last_name: String,
        country: String,
        phone_number: String,
        user_type: Number
    },
    created_at: String,
    temp_password: String,
    temp_password_time: String,
});

module.exports = mongoose.model('user', userSchema);