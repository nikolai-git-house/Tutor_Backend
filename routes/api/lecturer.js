'use strict';

const express = require('express');
const user_helper = require('../../helpers/user');
const students = require('../../functions/lecturer/lecturer');

var router = express.Router();

router.get('/', (req, res) => {

    const user_id = req.headers['id'];

    students.getLecturer(user_id)

        .then(result => {
            res.status(200).json(result)
        })

        .catch(err => {
            res.status(err.status).json({ message: err.message })
        });

});


module.exports = router;