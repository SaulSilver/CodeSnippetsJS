/**
 * Created by hatem on 2016-11-28.
 */
"use strict";

let express = require('express');
let bodyParser = require('body-parser');
let exphbs = require('express-handlebars');
let path = require('path');

let app = express();
let port = process.env.PORT || 8000;

//Start the Database
require('./libs/dbHandler').initialize();

//View engine
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//Add support for handling HTML form data
app.use(bodyParser.urlencoded({ extended: true }));

//Static files
app.use(express.static(path.join(__dirname, 'public')));

//Load routes as "mini-apps"
app.use('/', require('./routes/home.js'));

app.use('/login', require('./routes/login.js'));
app.use('/register', require('./routes/register.js'));
app.use('/', require('./routes/snippet'));

//Error handling ------------------------
app.use(function (err, request, response, next) {
    if(err.status !== 404)
        return next(err);
    console.log(err.stack);
    response.render('error/404');
});

app.use(function (err, req, res, next) {
    if (err.status !== 500)
        return next(err);

    console.error(err.stack);
    res.status(500).render('error/500');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(403).render('error/403');
});

//Start listening to the port
app.listen(port, () =>
    console.log('Express app is listening on port %s!', port)
);

