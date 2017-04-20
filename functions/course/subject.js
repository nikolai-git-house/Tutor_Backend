'use strict';

const subject = require('../../models/subject');

module.exports.getSubjects = (course_number, level_number) =>

    new Promise((resolve, reject) => {

        subject.find({ course_number: course_number, level_number: level_number }).sort({ number: 1 })

            .then(subjects => resolve(subjects))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });
