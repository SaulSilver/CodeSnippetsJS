/**
 * Created by hatem on 2016-11-29.
 */
"use strict";

let router = require('express').Router();
let User = require('../models/User');

router.route('/')
    .get(function (req, res) {
        res.render('authentication/registration');
    })
    .post(function (req, res) {
        let newUsername = req.body.username;
        let newPassword = req.body.password;

        let user = new User({
            username: newUsername,
            password: newPassword
        });

        user.save().then(function () {
            //Notify the user
            req.session.flash = {
                type: 'success card-panel blue lighten-3',      //Add some materialize classes for the css
                message: 'Your account has been created successfully!'
            };
            res.redirect('/');
        }).catch(function (err) {
            console.log(err);
            req.session.flash = {
                type: 'failure card-panel blue lighten-3',      //Add some materialize classes for the css
                message: 'Your account was not created! Please write a unique ID and a password with at least 6 characters'
            };
            res.redirect('#');
        });
    });

module.exports = router;
