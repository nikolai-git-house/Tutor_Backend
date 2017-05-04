'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config/config.json')

exports.checkToken = function(req) {

    var token = req.headers['x-access-token'];
    var id = req.headers['id'];

    if (token) {

        try {

            var decoded = jwt.verify(token, config.secret);

            return (decoded === id);

        } catch (err) {

            return false;
        }

    } else {

        return false;
    }
}