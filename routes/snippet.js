/**
 * Created by hatem on 2016-12-02.
 */
"use strict";

let router = require('express').Router();
let Snippet = require('../models/Snippet');

//Call when listing all the snippets
router.route('/snippet/')
    .get(function (req, res) {
        //TODO: session
        Snippet.find({}, function(error, data) {
            //Mapping the object
            let context = {
                snippets: data.map(function (snipp) {
                    return {
                        title: snipp.title,
                        code: snipp.code,
                        createdBy: snipp.createdBy,
                        updatedAt: snipp.updatedAt,
                        id: snipp._id
                    };
                }),
                //TODO: session
            };
            res.render('snippet/indexLoggedIn', context);
        });
    });

//Create step
router.route('/snippet/create')
    .get(function (req, res) {
        //Get the form for create
        res.render('snippet/create');
    })
    .post(function (req, res) {
        let snippTitle = req.body.snippetTitle;
        let snippCode = req.body.snippetCode;

        //Create the object to save
        let snippet = new Snippet({
            title: snippTitle,
            code: snippCode,
            createdBy: 'Hatem'
        });

        snippet.save().then(function() {
            res.redirect('/');
        }).catch(function (err) {
            console.error(err);
            res.redirect('/error/500');
        });
    });

//Delete step
router.route('/snippet/delete/:id')
    .get(function (req, res) {
        //render the form, send along the id
        res.render('snippet/delete', {id: req.params.id});
    })
    .post(function (req, res) {
        Snippet.findOneAndRemove({_id: req.params.id}, function(err) {
            if (err) {
                throw new Error('Something went wrong while deleting the snippet');
            }
            //TODO: session
            res.redirect('/home/indexLoggedIn');
        });
    });

module.exports = router;
