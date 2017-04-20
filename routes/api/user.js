'use strict';
const auth = require('basic-auth');
const jwt = require('jsonwebtoken');
const express = require('express');
const register = require('../../functions/user/register');
const login = require('../../functions/user/login');
const config = require('../../config/config.json');
const helper = require('../../helpers/user');

var router = express.Router();

router.post('/login', (req, res) => {

    const credentials = auth(req);

    if (!credentials) {

        res.status(400).json({ message: 'Invalid Request !' });

    } else {

        login.login(credentials.name, credentials.pass)

            .then(result => {

                const token = jwt.sign(result.user.email, config.secret, {});

                const user = {
                    email: result.user.email,
                    user_type: result.user.user_info.user_type,
                    first_name: result.user.user_info.first_name,
                    last_name: result.user.user_info.last_name,
                    token: token

                }

                res.status(result.status).json({ user: user, token: token });

            })

            .catch(err => res.status(err.status).json({ message: err.message }));
    }
});

router.post('/register', (req, res) => {

    const info = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        country: req.body.country,
        phone_number: req.body.phone_number
    };
    const email = req.body.email;
    const password = req.body.password;


    if (!email || !password || !email.trim() || !password.trim()) {

        res.status(400).json({ message: 'Invalid Request !' });

    } else {

        register.register(email, password, info)

            .then(result => {

                res.setHeader('Location', '/' + email);
                res.status(result.status).json({ message: result.message })
            })

            .catch(err => {
                res.status(err.status).json({ message: err.message })
            });
            
    }
});

router.get('/:id', (req, res) => {

    if (helper.checkToken(req)) {

        profile.getProfile(req.params.id)

            .then(result => res.json(result))

            .catch(err => res.status(err.status).json({ message: err.message }));

    } else {

        res.status(401).json({ message: 'Invalid Token !' });
    }
});

router.put('/:id', (req, res) => {

    if (helper.checkToken(req)) {

        const oldPassword = req.body.password;
        const newPassword = req.body.newPassword;

        if (!oldPassword || !newPassword || !oldPassword.trim() || !newPassword.trim()) {

            res.status(400).json({ message: 'Invalid Request !' });

        } else {

            password.changePassword(req.params.id, oldPassword, newPassword)

                .then(result => res.status(result.status).json({ message: result.message }))

                .catch(err => res.status(err.status).json({ message: err.message }));

        }
    } else {

        res.status(401).json({ message: 'Invalid Token !' });
    }
});

router.post('/:id/password', (req, res) => {

    const email = req.params.id;
    const token = req.body.token;
    const newPassword = req.body.password;

    if (!token || !newPassword || !token.trim() || !newPassword.trim()) {

        password.resetPasswordInit(email)

            .then(result => res.status(result.status).json({ message: result.message }))

            .catch(err => res.status(err.status).json({ message: err.message }));

    } else {

        password.resetPasswordFinish(email, token, newPassword)

            .then(result => res.status(result.status).json({ message: result.message }))

            .catch(err => res.status(err.status).json({ message: err.message }));
    }
});


module.exports = router;