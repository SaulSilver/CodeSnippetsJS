/**
 * Created by hatem on 2016-11-28.
 */
"use strict";

let express = require('express');
let bodyParser = require('body-parser');
let exphbs = require('express-handlebars');
let path = require('path');
let session = require('express-session');

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

//Setting up the session
app.use(session({
    name: 'snippetsession',
    secret: '652776324hasd',
    saveUninitialized: false,
    resave: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 23
    }
}));

//Adding functionality for flash messages through the middleware pattern
app.use(function (req, res, next) {
    if (req.session.flash) {
        res.locals.flash = req.session.flash;
        //Delete it the flash from the session
        delete req.session.flash;
    }
    next();
});

//Static files
app.use(express.static(path.join(__dirname, 'public')));

//Load routes as "mini-apps"
app.use('/', require('./routes/home.js'));
app.use('/', require('./routes/snippet'));
app.use('/login', require('./routes/login.js'));
app.use('/register', require('./routes/register.js'));

//Log out user by destroying session
app.use('/logout', function(req, res) {
    req.session.destroy(function() {
        res.redirect('/');
    });
});

app.use(function(req, res, next) {
    if(!req.session)
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

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
    if (err.status !== 403)
        return console.error(err);
    console.error(err.stack);
    res.status(403).render('error/403');
});

//Start listening to the port
app.listen(port, () =>
    console.log('Express app is listening on port %s!', port)
);

