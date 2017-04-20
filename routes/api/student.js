'use strict';

const express = require('express');
const user_helper = require('../../helpers/user');
const students = require('../../functions/student/student');
const config = require('../../config/config.json');


var router = express.Router();

router.get('/', (req, res) => {

    const user_id = req.headers['id'];

    students.getStudent(user_id)

        .then(result => res.status(200).json(result))

        .catch(err => res.status(err.status).json(null));

});


router.get('/prepare_purchase/:course_number/:level_number/:subject_number', (req, res) => {

    const user_id = req.headers['id'];
    const course_number = req.params['course_number']
    const level_number = req.params['level_number'];
    const subject_number = req.params['subject_number'];

    students.getPaymentInfo(user_id, course_number, level_number, subject_number)

        .then(result => res.status(200).json({ id: result, receiver: config.account_id }))

        .catch(err => res.status(err.status).json(null));

});

module.exports = router;