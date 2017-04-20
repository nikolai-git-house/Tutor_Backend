'use strict';

const question = require('../../models/question');
const mongoose = require('mongoose');

module.exports.getQuestions = (course_number, level_number, subject_number) =>

    new Promise((resolve, reject) => {

        question.find({ course_number: course_number, level_number: level_number, subject_number: subject_number })

            .then(questions => resolve(questions))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });


module.exports.getUserQuestions = (user_id) =>

    new Promise((resolve, reject) => {

        question.find({ user_id: user_id })

            .then(questions => resolve(questions))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });

module.exports.ask = (user_id, course_number, level_number, subject_number, title, content) =>

    new Promise((resolve, reject) => {

        var id = mongoose.Types.ObjectId();
        const newQuestion = new question({
            _id: id,
            course_number: course_number,
            level_number: level_number,
            subject_number: subject_number,
            question: {
                user_id: user_id,
                title: title,
                content: content,
                created_at: new Date()
            },
            is_answered: false,
            answer: {
            }

        });

        newQuestion.isNew = true;
        newQuestion.save()

            .then(() => resolve({ status: 200, message: 'Succesfully Reported.' }))

            .catch(err => {
                    reject({ status: 500, message: 'Internal Server Error !' });
            });

    });

module.exports.answer = (user_id, question_id, content) =>

    new Promise((resolve, reject) => {

        question.find({ _id: question_id })

            .then(questions => {

                let question = questions[0];

                question.is_answered = true;

                question.answer = {
                    user_id: user_id,
                    content: content,
                    created_at: new Date()
                };

                return question.save();
            })

            .then(question => resolve({ status: 200, message: 'Answer Updated Sucessfully !' }))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));


    });
