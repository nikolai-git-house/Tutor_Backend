const user = require('../../models/user');
const student = require('../../models/student');
const lecturer = require('../../models/lecturer');
var bcrypt = require('bcrypt-nodejs');

exports.register = (email, password, user_info) =>

    new Promise((resolve, reject) => {
                
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const newUser = new user({
            email: email,
            user_info: user_info,
            hashed_password: hash,
            created_at: new Date()
        });


        var newUserDetail;
        if (user_info.user_type == 1) {

            newUserDetail = new lecturer({
                user_id: email,
                subjects: []
            });
        } else {

            newUserDetail = new student({
                user_id: email,
                paid_subjects: []
            });
        }

        newUser.isNew = true;
        newUserDetail.isNew = true;

        newUser.save()

            .then(() => newUserDetail.save())

            .then(() => {
                return user.find({ email: email });
            })

            .then((users)=>resolve({ status: 201, message: 'User Registered Sucessfully !', user: users[0] }))

            .catch(err => {

                if (err.code == 11000) {

                    reject({ status: 409, message: 'User Already Registered !' });

                } else {

                    reject({ status: 500, message: 'Internal Server Error !' });
                }
            });
        
    });
