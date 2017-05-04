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

router.get('/delete/:id', function (req, res) {

    const id = req.params.id;

    courses.deleteCourse(id)

        .then(result => res.status(200).json(result))

        .catch(err => res.status(err.status).json(null));

});

router.post('/add', function (req, res) {

    const data = req.body.data;

    courses.addCourse(data)

        .then(result => res.status(200).json(result))

        .catch(err => res.status(err.status).json(null));

});

router.post('/subjects/update', function (req, res) {

    const data = req.body.data;

    subjects.updateSubject(data)

        .then(result => res.status(200).json(result))

        .catch(err => res.status(err.status).json(null));

});

router.post('/subjects/add', function (req, res) {

    const data = req.body.data;

    subjects.addSubject(data)

        .then(result => res.status(200).json(result))

        .catch(err => res.status(err.status).json(null));

});

router.post('/update', function (req, res) {

    const data = req.body.data;

    courses.updateCourse(data)

        .then(result => res.status(200).json(result))

        .catch(err => res.status(err.status).json(null));

});

router.post('/levels/add', function (req, res) {

    const data = req.body.data;

    courses.addLevel(data)

        .then(result => res.status(200).json(result))

        .catch(err => res.status(err.status).json(null));

});

router.post('/levels/delete', function (req, res) {

    const data = req.body.data;

    courses.deleteLevel(data)

        .then(result => res.status(200).json(result))

        .catch(err => res.status(err.status).json(null));

});

router.post('/levels/update', function (req, res) {

    const data = req.body.data;

    courses.updateLevel(data)

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

router.get('/subjects/delete/:id', (req, res) => {

    const id = req.params.id;

    subjects.deleteSubject(id)

        .then(result => res.status(200).json(result))

        .catch(err => res.status(err.status).json(null));

});

router.post('/chapters/add', function (req, res) {

    const data = req.body.data;

    subjects.addChapter(data)

        .then(result => res.status(200).json(result))

        .catch(err => res.status(err.status).json(null));

});

router.post('/chapters/delete', function (req, res) {

    const data = req.body.data;

    subjects.deleteChapter(data)

        .then(result => res.status(200).json(result))

        .catch(err => res.status(err.status).json(null));

});

router.post('/chapters/update', function (req, res) {

    const data = req.body.data;

    subjects.updateChapter(data)

        .then(result => res.status(200).json(result))

        .catch(err => res.status(err.status).json(null));

});

module.exports = router;