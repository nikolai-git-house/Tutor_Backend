'use strict';

const user = require('../../models/user');
const bcrypt = require('bcrypt-nodejs');
const randomstring = require("randomstring");
const config = require('../../config/config.json');
const nodemailer = require('nodemailer');

exports.changePassword = (email, password, newPassword) =>

    new Promise((resolve, reject) => {

        user.find({ email: email })

            .then(users => {

                let user = users[0];
                const hashed_password = user.hashed_password;

                if (bcrypt.compareSync(password, hashed_password)) {

                    const salt = bcrypt.genSaltSync(10);
                    const hash = bcrypt.hashSync(newPassword, salt);

                    user.hashed_password = hash;

                    return user.save();

                } else {

                    reject({ status: 401, message: 'Invalid Old Password !' });
                }
            })

            .then(user => resolve({ status: 200, message: 'Password Updated Sucessfully !' }))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });

exports.resetPasswordInit = email =>

    new Promise((resolve, reject) => {

        const random = randomstring.generate(8);

        user.find({ email: email })

            .then(users => {

                if (users.length == 0) {

                    throw reject({ status: 404, message: 'User Not Found !' });

                } else {

                    let user = users[0];

                    const salt = bcrypt.genSaltSync(10);
                    const hash = bcrypt.hashSync(random, salt);

                    user.temp_password = hash;
                    user.temp_password_time = new Date();

                    return user.save();
                }
            })

            .then(user => {

                const transporter = nodemailer.createTransport({
                    host: 'vegeta.aserv.co.za',
                    port: 465,
                    secure: true,
                    auth: {
                        user: config.email_username,
                        pass: config.email_password
                    }
                });
                
                const mailOptions = {
    
                    from: config.email_username,
                    to: email,  
                    subject: 'Reset Password Request ', 
                    html: `Hello ${user.user_info.first_name},
                            Your reset password code is <b>${random}</b>. 
                    <br/ >
                    <br/ >
                    Thanks.`
                };
    
                return transporter.sendMail(mailOptions);
            })

            .then(info => {
                resolve({ status: 200, message: 'Check mail for instructions' })
            })

            .catch(err => {
                reject({ status: 500, message: 'Internal Server Error !' });
            });
    });

exports.resetPasswordFinish = (email, code, password) =>

    new Promise((resolve, reject) => {
        console.log(email, code, password, 'SNOWSNOW')
        user.find({ email: email })

            .then(users => {

                let user = users[0];

                const diff = new Date() - new Date(user.temp_password_time);
                const seconds = Math.floor(diff / 1000);
                console.log(`Seconds : ${seconds}`);

                if (seconds < 300) { return user; } else { reject({ status: 401, message: 'Time Out ! Try again' }); }
            }).then(user => {
                
                if (bcrypt.compareSync(code, user.temp_password)) {
                    console.log(email, password)

                    const salt = bcrypt.genSaltSync(10);
                    const hash = bcrypt.hashSync(password, salt);
                    user.hashed_password = hash;
                    user.temp_password = undefined;
                    user.temp_password_time = undefined;

                    return user.save();

                } else {

                    reject({ status: 401, message: 'Invalid Code !' });
                }
            })

            .then(user => resolve({ status: 200, message: 'Password Changed Successfully !' }))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });