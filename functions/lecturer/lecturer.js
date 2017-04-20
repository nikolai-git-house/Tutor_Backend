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
