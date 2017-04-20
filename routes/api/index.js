'use strict';

const express = require('express');
const router = express.Router();
//var users = require('./user');

const courses = require('./course');
const students = require('./student');
const questions = require('./question');
const lecturers = require('./lecturer');
const user_helper = require('../../helpers/user');

router.use('/courses', courses);
router.use('/students', students);
router.use('/questions', questions);
router.use('/lecturers', lecturers);

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});


module.exports = router;
