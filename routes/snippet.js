/**
 * Created by hatem on 2016-12-02.
 */
"use strict";

let router = require('express').Router();
let Snippet = require('../models/Snippet');

//Call when listing all the snippets
router.route('/snippet')
    .get(function (req, res) {
        Snippet.find({}, function(error, data) {
            if (error) {
                req.session.flash = {
                    type: 'failure',
                    message: 'Could not retrieve data from the database'
                };
                throw new Error('Something went wrong with the database!');
            }
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
            };
            if (!req.session.user)
                res.render('snippet/indexNotLoggedIn', context);
            else
                res.render('snippet/indexLoggedIn', context);
        });
    });

//Create step
router.route('/snippet/create')
    .get(function (req, res) {
        console.log('yo');
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
            createdBy: req.session.user
        });

        snippet.save().then(function() {
            //Notify the user
            req.session.flash = {
                type: 'success',
                message: 'Your snippet was created successfully!'
            };
            res.redirect('/snippet');
        }).catch(function (err) {
            //TODO: Better error handling
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
                req.session.flash = {
                    type: 'failure',
                    message: 'Could not delete snippet from the database'
                };
                throw new Error('Something went wrong while deleting the snippet');
            }
            req.session.flash = {
                type: 'success',
                message: 'The snippet was deleted from the database'
            };
            res.redirect('/');
        });
    });

//Edit step
router.route('/snippet/edit/:id')
    .get(function (req, res) {
        //render the form with the id along
        res.render('snippet/edit', {id: req.params.id});
    })
    .post(function (req, res) {
        //Get the new title and code from the user input
        let snippTitle = req.body.snippetTitle;
        let snippCode = req.body.snippetCode;
        let userUpdate = req.session.user;

        //find the snippet by id and update
        Snippet.findOneAndUpdate({_id: req.params.id}, {
            title: snippTitle,
            code: snippCode,
            createdBy: userUpdate,
            updatedAt:  Date.now()
        }, function (err) {
            if (err) {
                req.session.flash = {
                    type: 'failure',
                    message: 'Could not update snippet'
                };
                throw new Error('Something went wrong while editing the snippet' + '\n' + err);
            }
            req.session.flash = {
                type: 'success',
                message: 'The snippet was updated successfully'
            };
            res.redirect('/');
        });
    });


module.exports = router;
