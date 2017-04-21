'use strict'
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/school-db');
const username = 'snowsea';
const password = '4a>#X[(V6~g8RvJ~u7';
mongoose.connect('mongodb://' + username + ':' + password + '@ds115091-a0.mlab.com:15091,ds115091-a1.mlab.com:15091/heroku_ldk8l55q?replicaSet=rs-ds115091');
