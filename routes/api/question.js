'use strict';

const express = require('express');
const questions = require('../../functions/question/question');

var router = express.Router();

router.get('/questions/:is_answered', (req, res) => {

    questions.getQuestions(is_answered)

        .then(result => res.status(200).json(result))

        .catch(err => res.status(err.status).json(null));

});

router.get('/user_questions', (req, res) => {

    const user_id = req.headers['id'];

    questions.getUserQuestions(user_id)

        .then(result => res.status(200).json(result))

        .catch(err => res.status(err.status).json(null));

});

router.post('/ask', (req, res) => {

    const user_id = req.headers['id'];
    const course_number = req.body['course_number'];
    const level_number = req.body['level_number'];
    const subject_number = req.body['subject_number'];
    const title = req.body['question']['title'];
    const content = req.body['question']['content'];

    questions.ask(user_id, course_number, level_number, subject_number, title, content)

        .then(result => {
            res.status(200).json(result)
        })

        .catch(err => res.status(err.status).json(null));

});

router.post('/answer', (req, res) => {

    const user_id = req.headers['id'];
    const question_id = req.body['_id'];
    const answer = req.body['answer']['content'];

    questions.answer(user_id, question_id, answer)

        .then(result => {
            res.status(200).json(result)
        })

        .catch(err => res.status(err.status).json(null));

});


router.get('/:course_number/:level_number/:subject_number', (req, res) => {

    const course_number = req.params['course_number'];
    const level_number = req.params['level_number'];
    const subject_number = req.params['subject_number'];

    questions.getQuestions(course_number, level_number, subject_number)

        .then(result => res.status(200).json(result))

        .catch(err => res.status(err.status).json(null));

});


module.exports = router;