'use strict';

const course = require('../../models/course');

module.exports.getCourses = () =>

    new Promise((resolve, reject) => {

        course.find().sort({ number: 1 })

            .then(courses => resolve(courses))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });

module.exports.deleteCourse = (id) =>

    new Promise((resolve, reject) => {

        course.find({_id: id})

            .then(courses => {
                if (courses.length == 0) {
                    reject({ status: 404, message: 'Course Not Found !' });
                }
                courses[0].remove();
            })

            .then(() => resolve({ status: 200, message: 'Operation has done successfully !' }))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });

module.exports.deleteLevel = (data) =>

    new Promise((resolve, reject) => {

        course.find({ _id: data.course_id })

            .then(courses => {
                if (courses.length == 0) {
                    reject({ status: 404, message: 'Course Not Found !' });
                }
                const course = courses[0];
                
                for (var i = 0; i < course.levels.length; i++) {
                    if (course.levels[i].number == data.number) {
                        course.levels.splice(i, 1);
                        break;
                    }
                }
                return course.save();
            })

            .then(() => resolve({ status: 200, message: 'Operation has done successfully !' }))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });

module.exports.addCourse = (data) =>

    new Promise((resolve, reject) => {

        const newCourse = new course({
            number: data.number,
            name: data.name,
            is_available: data.is_available,
            levels: []
        });

        newCourse.isNew = true;

        newCourse.save()

            .then((course) => resolve({ status: 200, message: 'Operation has done successfully !', course: course }))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });

module.exports.updateCourse = (data) =>

    new Promise((resolve, reject) => {

        course.find({ _id: data.id })

            .then(courses => {
                if (courses.length == 0) {
                    reject({ status: 404, message: 'Course Not Found !' });
                }
                const course = courses[0];
                course.number = data.number;
                course.name = data.name;
                course.is_available = data.is_available;
                return course.save();                
            })

            .then((course) => resolve({ status: 200, message: 'Operation has done successfully !', course: course }))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });

module.exports.updateLevel = (data) =>

    new Promise((resolve, reject) => {

        course.find({ _id: data.course_id })

            .then(courses => {
                if (courses.length == 0) {
                    reject({ status: 404, message: 'Course Not Found !' });
                }
                const course = courses[0];

                for (var i = 0; i < course.levels.length; i++) {
                    if (course.levels[i].number == data.old_number) {
                        course.levels[i].number = data.number;
                        course.levels[i].name = data.name;
                        break;
                    }
                }

                return course.save();
            })

            .then((course) => resolve({ status: 200, message: 'Operation has done successfully !', course: course }))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });

module.exports.addLevel = (data) =>

    new Promise((resolve, reject) => {

        course.find({ _id: data.course_id })

            .then(courses => {
                if (courses.length == 0) {
                    reject({ status: 404, message: 'Course Not Found !' });
                }
                const course = courses[0];
                course.levels.push({
                    number: data.number,
                    name: data.name
                })
                return course.save();
            })

            .then((course) => resolve({ status: 200, message: 'Operation has done successfully !', course: course }))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });
