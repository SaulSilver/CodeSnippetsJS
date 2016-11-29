/**
 * Created by hatem on 2016-11-29.
 */
"use strict"

let router = require('express').Router();

router.route('/hh222ix-examination-2/views/authentication/registration.hbs')
    .get(function (req, res) {
        res.render('authentication/registration');
    });

module.exports = router;
