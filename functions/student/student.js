'use strict';

const student = require('../../models/student');
const purchase = require('../../models/purchase');
const mongoose = require('mongoose');
const querystring = require('querystring');
const config = require('../../config/config.json');
const http = require('https');
const user = require('../../models/user');
const randomstring = require("randomstring");

module.exports.getStudent = (user_id) =>

    new Promise((resolve, reject) => {

        student.find({ user_id: user_id })

            .then(students => resolve(students[0]))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });

module.exports.getCheckoutID = (user_id, price) =>
    new Promise((resolve, reject) => {
        user.find({ 'email': user_id })

            .then(users => {
                if (users.length == 0) {
                    reject({ status: 404, message: 'User Not Found !' });
                }
                const user = users[0];
                var path = '/v1/checkouts';
                var data = querystring.stringify({
                    'authentication.userId': config.payment_user_id,
                    'authentication.password': config.payment_password,
                    'authentication.entityId': config.payment_entity_id,
                    'amount': price,
                    'currency': 'ZAR',
                    'paymentType': 'DB',
                    'merchantTransactionId': randomstring.generate(55),
                    'customer.givenName': user.user_info.first_name,
                    'customer.surname': user.user_info.last_name,
                    'customer.email': user.email,
                    'shipping.street1': 'Main Street',
                    'shipping.street2': '',
                    'shipping.city': 'Johannesburg',
                    'shipping.state': '',
                    'shipping.postcode': '2000',
                    'shipping.country': 'ZA',
                    'shopperResultUrl': 'com.snowsea.school.payments://shopper_result',
                    'notificationUrl': 'https://tshiamo.herokuapp.com/api/students/checkout/notification'
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
            })
            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });
        

module.exports.getCheckoutStatus = (id) =>
    new Promise((resolve, reject) => {
        var path = '/v1/checkouts/' + id + '/payment';
        path += '?authentication.userId=' + config.payment_user_id
        path += '&authentication.password=' + config.payment_password
        path += '&authentication.entityId=' + config.payment_entity_id
        var options = {
            port: 443,
            host: 'test.oppwa.com',
            path: path,
            method: 'GET',
        };
        var postRequest = http.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                const jsonRes = JSON.parse(chunk);
                resolve(jsonRes.result);
            });
        });
        postRequest.end();
    })
    .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

module.exports.purchaseSuccess = (user_id, course_number, level_number, subject_number) =>

    new Promise((resolve, reject) => {

        student.find({ user_id: user_id })

            .then(students => {

                let student = students[0];
                student.paid_subjects.push({
                    course_number: course_number,
                    level_number: level_number,
                    subject_number: subject_number
                });

                student.save();
            })
        
            .then((student) => resolve({ status: 200, message: 'Paid successfully' }))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });