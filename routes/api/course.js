'use strict';

const express = require('express');
const user_helper = require('../../helpers/user');
const courses = require('../../functions/course/course');
const subjects = require('../../functions/course/subject');

var router = express.Router();

router.get('/', function (req, res) {

    courses.getCourses()

        .then(result => res.status(200).json(result))

        .catch(err => res.status(err.status).json(null));

});

router.get('/:course_number/:level_number/subjects', (req, res) => {

    const course_number = req.params['course_number'];
    const level_number = req.params['level_number'];

    subjects.getSubjects(course_number, level_number)

        .then(result => res.status(200).json(result))

        .catch(err => res.status(err.status).json(null));

});


module.exports = router;