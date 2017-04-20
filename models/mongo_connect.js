'use strict'
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/school-db');
const username = 'snowsea';
const password = 'snowsea';
mongoose.connect('mongodb://' + username + ':' + password + '@ds111461.mlab.com:11461/heroku_m4821xkr');
