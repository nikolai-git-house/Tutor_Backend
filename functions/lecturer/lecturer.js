'use strict';

const lecturer = require('../../models/lecturer');

module.exports.getLecturer = (user_id) =>

    new Promise((resolve, reject) => {

        lecturer.find({ user_id: user_id })

            .then(lecturers => {

                if (lecturers.length == 0) {

                    reject({ status: 404, message: 'User Not Found !' });
                }
                else {

                    resolve(lecturers[0]);
                }
            })

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });

module.exports.assignSubject = (data) =>

    new Promise((resolve, reject) => {

        lecturer.find({ user_id: data.user_id })

            .then(lecturers => {
                if (lecturers.length == 0) {
                    reject({ status: 404, message: 'User Not Found !' });
                }
                const lecturer = lecturers[0];
                lecturer.subjects.push({
                    course_number: data.course_number,
                    level_number: data.level_number,
                    number: data.subject_number,
                    name: data.name
                })
                return lecturer.save();
            })

            .then((lecturer) => resolve({ status: 200, message: 'Operation has done successfully !', lecturer: lecturer }))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });

module.exports.deleteSubject = (data) =>

    new Promise((resolve, reject) => {

        lecturer.find({ user_id: data.user_id })

            .then(lecturers => {
                if (lecturers.length == 0) {
                    reject({ status: 404, message: 'User Not Found !' });
                }
                const lecturer = lecturers[0];

                for (var i = 0; i < lecturer.subjects.length; i++) {
                    if (lecturer.subjects[i].course_number == data.course_number && lecturer.subjects[i].level_number == data.level_number && lecturer.subjects[i].number == data.subject_number) {
                        lecturer.subjects.splice(i, 1);
                        break;
                    }
                }
                return lecturer.save();
            })

            .then((lecturer) => resolve({ status: 200, message: 'Operation has done successfully !', lecturer: lecturer }))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });