'use strict';

const student = require('../../models/student');
const purchase = require('../../models/purchase');
const mongoose = require('mongoose');

module.exports.getStudent = (user_id) =>

    new Promise((resolve, reject) => {

        student.find({ user_id: user_id })

            .then(students => resolve(students[0]))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });

module.exports.getCheckoutID = (user_id, course_number, level_number, subject_number) =>

    new Promise((resolve, reject) => {

        var id = mongoose.Types.ObjectId();
        const newPay = new purchase({
            _id: id,
            user_id: user_id,
            course_number: course_number,
            level_number: level_number,
            subject_number: subject_number
        });

        newPay.isNew = true;
        newPay.save()

            .then(() => resolve(id))

            .catch(err => {
                reject({ status: 500, message: 'Internal Server Error !' });
            });

    });

module.exports.purchaseSuccess = (id) =>

    new Promise((resolve, reject) => {

        var pay = null;

        purchase.find({ _id: id })

            .then(purchases => {

                pay = purchases[0];

                return student.find({ user_id: pay.user_id });

            })

            .then(students => {

                let student = students[0];
                student.paid_subjects.push({
                    course_number: pay.course_number,
                    level_number: pay.level_number,
                    subject_number: pay.subject_number
                });

                student.save();

                return pay.remove();
            })
        
            .then(() => resolve({ status: 200, message: 'Paid successfully' }))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });

module.exports.purchaseFailure = (id) =>

    new Promise((resolve, reject) => {

        purchase.find({ _id: id })

            .then(purchases => {

                if (purchases.length != 0) {

                    let purchase = purchases[0];
                    return purchase.remove();
                }
                else {
                    reject({ status: 500, message: 'Internal Server Error !' });
                }
            })

            .then(() => resolve({ status: 200, message: 'Paid Failure!'}))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });

