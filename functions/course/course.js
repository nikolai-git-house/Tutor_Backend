'use strict';

const course = require('../../models/course');

module.exports.getCourses = () =>

    new Promise((resolve, reject) => {

        course.find().sort({ number: 1 })

            .then(courses => resolve(courses))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });
