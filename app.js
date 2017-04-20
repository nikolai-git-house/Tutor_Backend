'use strict';
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const students = require('./functions/student/student');

const api_routes = require('./routes/api/index');
const users = require('./routes/api/user');
const user_helper = require('./helpers/user');

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

require('./models/mongo_connect');

app.use('/api/users', users);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/students/purchaseSuccess/:id', (req, res) => {

    const id = req.params['id'];

    students.purchaseSuccess(id)

        .then(result => res.render('purchase_success', { title: 'Express' }))

        .catch(err => res.status(err.status).json(null));

});

app.get('/api/students/purchaseFailure/:id', (req, res) => {

    const id = req.params['id'];

    students.purchaseFailure(id)

        .then(result => res.render('purchase_failure', { title: 'Express' }))

        .catch(err => res.status(err.status).json(null));

});

app.use(function (req, res, next) {

    if (user_helper.checkToken(req) == true) {

        next();
    } else {

        res.status(401).json({message: "Invalid Token"});
    }
});

app.use('/api', api_routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
