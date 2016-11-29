/**
 * Created by hatem on 2016-11-29.
 */
"use strict"

let router = require('express').Router();
console.log('Accessing the secret section ...')
router.route('/hh222ix-examination-2/views/authentication/login.hbs')
    .get(function (req, res) {

        res.render('authentication/login');
    });

module.exports = router;
