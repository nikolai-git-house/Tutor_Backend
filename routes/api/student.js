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


router.get('/checkout_id/:price', (req, res) => {

    const price = req.params['price'];

    students.getCheckoutID(price, 'EUR')

        .then(result => res.status(200).json({ id: result.id }))

        .catch(err => res.status(err.status).json(null));

});

module.exports = router;