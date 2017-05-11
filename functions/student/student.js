'use strict';

const student = require('../../models/student');
const purchase = require('../../models/purchase');
const mongoose = require('mongoose');
const querystring = require('querystring');
const config = require('../../config/config.json');
const http = require('https');

module.exports.getStudent = (user_id) =>

    new Promise((resolve, reject) => {

        student.find({ user_id: user_id })

            .then(students => resolve(students[0]))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });

module.exports.getCheckoutID = (price, currency) =>
    new Promise((resolve, reject) => {
        var path = '/v1/checkouts';
        var data = querystring.stringify({
            'authentication.userId': '8a8294174b7ecb28014b9699220015cc',
            'authentication.password': 'sy6KJsT8',
            'authentication.entityId': '8a8294174b7ecb28014b9699220015ca',
            'amount': price,
            'currency': currency,
            'paymentType': 'DB',
            'shopperResultUrl': 'my.app://custom/url',
            'notificationUrl': 'http://www.example.com/notify'
        });
        var options = {
            port: 443,
            host: 'test.oppwa.com',
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': data.length
            }
        };
        var postRequest = http.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                var jsonRes = JSON.parse(chunk);
                resolve(jsonRes);
            });
        });
        postRequest.write(data);
        postRequest.end();
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

