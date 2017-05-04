'use strict';

const subject = require('../../models/subject');

module.exports.getSubjects = (course_number, level_number) =>

    new Promise((resolve, reject) => {

        subject.find({ course_number: course_number, level_number: level_number }).sort({ number: 1 })

            .then(subjects => resolve(subjects))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });

module.exports.addSubject = (data) =>

    new Promise((resolve, reject) => {

        const newSubject = new subject({
            course_number: data.course_number,
            level_number: data.level_number,
            number: data.number,
            name: data.name,
            price: data.price,
            chapters: []
        });

        newSubject.isNew = true;

        newSubject.save()

            .then((subject) => resolve({ status: 200, message: 'Operation has done successfully !', subject: subject }))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });

module.exports.deleteSubject = (id) =>

    new Promise((resolve, reject) => {

        subject.find({ _id: id })

            .then(subjects => {
                if (subjects.length == 0) {
                    reject({ status: 404, message: 'Subject Not Found !' });
                }
                const subject = subjects[0];
                return subject.remove();
            })

            .then(() => resolve({ status: 200, message: 'Operation has done successfully !' }))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });

module.exports.updateSubject = (data) =>

    new Promise((resolve, reject) => {

        subject.find({ _id: data.id })

            .then(subjects => {
                if (subjects.length == 0) {
                    reject({ status: 404, message: 'Subject Not Found !' });
                }
                const subject = subjects[0];
                subject.course_number = data.course_number;
                subject.level_number = data.level_number;
                subject.number = data.number;
                subject.name = data.name;
                subject.price = data.price;
                return subject.save();
            })

            .then((subject) => resolve({ status: 200, message: 'Operation has done successfully !', subject: subject }))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });


module.exports.addChapter = (data) =>

    new Promise((resolve, reject) => {

        subject.find({ _id: data.subject_id })

            .then(subjects => {
                if (subjects.length == 0) {
                    reject({ status: 404, message: 'Subject Not Found !' });
                }
                const subject = subjects[0];
                subject.chapters.push({
                    number: data.number,
                    name: data.name,
                    video_url: data.video_url,
                    note_url: data.note_url
                })
                return subject.save();
            })

            .then((subject) => resolve({ status: 200, message: 'Operation has done successfully !', subject: subject }))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });

module.exports.deleteChapter = (data) =>

    new Promise((resolve, reject) => {

        subject.find({ _id: data.subject_id })

            .then(subjects => {
                if (subjects.length == 0) {
                    reject({ status: 404, message: 'Subject Not Found !' });
                }
                const subject = subjects[0];

                for (var i = 0; i < subject.chapters.length; i++) {
                    if (subject.chapters[i].number == data.number) {
                        subject.chapters.splice(i, 1);
                        break;
                    }
                }
                return subject.save();
            })

            .then(() => resolve({ status: 200, message: 'Operation has done successfully !' }))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });

module.exports.updateChapter = (data) =>

    new Promise((resolve, reject) => {

        subject.find({ _id: data.subject_id })

            .then(subjects => {
                if (subjects.length == 0) {
                    reject({ status: 404, message: 'Subject Not Found !' });
                }
                const subject = subjects[0];

                for (var i = 0; i < subject.chapters.length; i++) {
                    if (subject.chapters[i].number == data.old_number) {
                        subject.chapters[i].number = data.number;
                        subject.chapters[i].name = data.name;
                        subject.chapters[i].video_url = data.video_url;
                        subject.chapters[i].note_url = data.note_url;
                        break;
                    }
                }

                return subject.save();
            })

            .then((subject) => resolve({ status: 200, message: 'Operation has done successfully !', subject: subject }))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });
