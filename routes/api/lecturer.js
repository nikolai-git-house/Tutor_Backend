'use strict';

const express = require('express');
const user_helper = require('../../helpers/user');
const lecturers = require('../../functions/lecturer/lecturer');

var router = express.Router();

router.get('/:id', (req, res) => {

    const user_id = req.params.id;

    lecturers.getLecturer(user_id)

        .then(result => {
            res.status(200).json(result)
        })

        .catch(err => {
            res.status(err.status).json({ message: err.message })
        });

});

router.get('/', (req, res) => {

    const user_id = req.headers['id'];

    lecturers.getLecturer(user_id)

        .then(result => {
            res.status(200).json(result)
        })

        .catch(err => {
            res.status(err.status).json({ message: err.message })
        });

});

router.post('/assign', function (req, res) {

    const data = req.body.data;

    lecturers.assignSubject(data)

        .then(result => res.status(200).json(result))

        .catch(err => res.status(err.status).json(null));

});

router.post('/delete', function (req, res) {

    const data = req.body.data;

    lecturers.deleteSubject(data)

        .then(result => res.status(200).json(result))

        .catch(err => res.status(err.status).json(null));

});


module.exports = router;