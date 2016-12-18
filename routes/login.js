/**
 * Created by hatem on 2016-11-29.
 */
"use strict";

let router = require('express').Router();
let authenticate = require('../app');
let User = require('../models/User');

router.route('/')
    .get(function (req, res) {
        res.render('authentication/login');
    })
    .post(function (req, res) {
        let userId = req.body.username;
        let userPassword = req.body.password;

        let user = new User({
            username: userId,
            password: userPassword
        });

        User.findOne({'username': user.username}, function(err, user) {
            if (err) {
                console.log('wrong');
                console.log(err);
            }
            if(user) {
                user.comparePassword(userPassword, function (err, found) {

                    if (err)
                        console.log(err);
                    else if (found){
                        req.session.regenerate(function() {
                            req.session.flash = {
                                type: 'success card-panel blue lighten-3',      //Add some materialize classes for the css
                                message: 'Welcome ' + user.username + '! Now you are logged in ;)'
                            };

                            req.session.user = user.username;
                            res.redirect('snippet');
                        });
                    } else {
                        req.session.flash = {
                            type: 'failure card-panel blue lighten-3',      //Add some materialize classes for the css
                            message: 'Password is incorrect'
                        };
                        res.redirect('#');
                    }
                });
            } else {
                req.session.flash = {
                    type: 'failure card-panel blue lighten-3',      //Add some materialize classes for the css
                    message: 'Username is not found'
                };
                res.redirect('#');
            }
        });
    });

module.exports = router;
