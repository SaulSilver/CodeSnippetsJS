/**
 * Created by hatem on 2016-11-29.
 */
"use strict";

let router = require('express').Router();

router.route('/')
    .get(function (req, res) {
        res.render('home/index');
    });

module.exports = router;
