const user = require('../../models/user');
const bcrypt = require('bcrypt-nodejs');
const lecturer = require('../../models/lecturer');

exports.getUsers = (userType) =>

    new Promise((resolve, reject) => {

        user.find({ 'user_info.user_type': userType })

            .then(users => {
                    resolve(users);
            })

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });

exports.deleteUser = (id) =>
    new Promise((resolve, reject) => {

        user.find({ _id: id })

            .then(users => {
                if (users.length == 0) {
                    reject({ status: 404, message: 'User Not Found !' });
                }

                const user = users[0];
                if (user.user_info.user_type == 1) {
                    lecturer.find({ user_id: user.email })

                        .then(lecturers => {

                            if (lecturers.length == 0) {

                                reject({ status: 404, message: 'User Not Found !' });
                            }

                            lecturers[0].remove();
                            return;
                        })
                }
            })

            .then(() => {
                user.remove();
            })

            .then(() => resolve({ status: 200, message: 'Operation has done successfully !' }))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });

exports.updateUser = (info) =>
    new Promise((resolve, reject) => {

        user.find({ _id: info.id })

            .then(users => {
                if (users.length == 0) {
                    reject({ status: 404, message: 'User Not Found !' });
                }

                const user = users[0];
                user.email = info.email;
                user.user_info.first_name = info.first_name;
                user.user_info.last_name = info.last_name;
                user.user_info.country = info.country;
                user.user_info.phone_number = info.phone_number;
                if (info.password !== undefined) {
                    const salt = bcrypt.genSaltSync(10);
                    const hash = bcrypt.hashSync(info.password, salt);

                    user.hashed_password = hash;
                }
                user.save();
            })

            .then(() => resolve({ status: 200, message: 'Operation has done successfully !' }))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });