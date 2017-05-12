'use strict';

const express = require('express');
const user_helper = require('../../helpers/user');
const students = require('../../functions/student/student');
const config = require('../../config/config.json');


var router = express.Router();

router.get('/', (req, res) => {

    const user_id = req.headers['id'];

    students.getStudent(user_id)

        .then(result => res.status(200).json(result))

        .catch(err => res.status(err.status).json(null));

});


router.get('/checkout/id/:price', (req, res) => {

    var price = req.params['price'];
    price = Number(price).toFixed(2);

    students.getCheckoutID(price, 'ZAR')

        .then(result => {
            res.status(200).json({ id: result.id })
        })

        .catch(err => res.status(err.status).json(null));

});

router.post('/checkout/success', (req, res) => {

    const id = req.headers['id'];
    const course_number = req.body["course_number"];
    const level_number = req.body["level_number"];
    const subject_number = req.body["number"];

    students.purchaseSuccess(id, course_number, level_number, subject_number)

        .then(result => res.json(result))

        .catch(err => res.status(err.status).json(null));

});

router.get('/checkout/status/:id', (req, res) => {

    const user_id = req.headers['id'];
    const checkout_id = req.params['id'];

    students.getCheckoutStatus(checkout_id)

        .then(result => res.json(result))

        .catch(err => res.status(err.status).json(null));

});

module.exports = router;