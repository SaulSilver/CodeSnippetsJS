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
                type: 'success',
                message: 'Your account has been created successfully!'
            };
            res.redirect('/');
        }).catch(function (err) {
            //TODO: Better error handling
            console.error(err);
            req.session.flash = {
                type: 'failure',
                message: 'Your account was not created!'
            };
            res.redirect('/authentication/registration');
        });
    });

module.exports = router;
