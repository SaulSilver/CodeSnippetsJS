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
    .get(authorize, function (req, res) {
        // authorize(req, res, res.render('snippet/create'));
        res.render('snippet/create');
    })
    .post(function (req, res) {
        let snippTitle = req.body.snippetTitle;
        let snippCode = req.body.snippetCode;

        //Check that all the required fields are filled
        if(!snippTitle || snippCode.length === 0) {
            //Notify the user
            req.session.flash = {
                type: 'failure card-panel blue lighten-3',      //Add some materialize classes for the css
                message: 'Your snippet was not created! Please fill in the title and the code'
            };
            res.redirect('#');
        } else {
            //Create the object to save
            let snippet = new Snippet({
                title: snippTitle,
                code: snippCode,
                createdBy: req.session.user
            });

            snippet.save().then(function() {
                //Notify the user
                req.session.flash = {
                    type: 'success card-panel blue lighten-3',      //Add some materialize classes for the css
                    message: 'Your snippet was created successfully!'
                };
                res.redirect('/snippet');
            }).catch(function (err) {
                console.error(err);
            });
        }
    });

//Delete step
router.route('/snippet/delete/:id')
    .get(authorize, function (req, res) {
        //render the form, send along the id
        res.render('snippet/delete', {id: req.params.id});
    })
    .post(function (req, res) {
        Snippet.findOneAndRemove({_id: req.params.id}, function(err) {
            if (err) {
                req.session.flash = {
                    type: 'failure card-panel blue lighten-3',      //Add some materialize classes for the css
                    message: 'Could not delete snippet from the database'
                };
                throw new Error('Something went wrong while deleting the snippet');
            }
            req.session.flash = {
                type: 'success card-panel blue lighten-3',      //Add some materialize classes for the css
                message: 'The snippet was deleted from the database'
            };
            res.redirect('/');
        });
    });

//Edit step
router.route('/snippet/edit/:id')
    .get(authorize, function (req, res) {
        //render the form with the id along
        res.render('snippet/edit', {id: req.params.id});
    })
    .post(function (req, res) {
        //Get the new title and code from the user input
        let snippTitle = req.body.snippetTitle;
        let snippCode = req.body.snippetCode;
        let userUpdate = req.session.user;

        //Check that no required field is empty
        if (!snippTitle || snippCode.length === 0 || userUpdate.length === 0 ) {
            req.session.flash = {
                type: 'failure card-panel blue lighten-3',      //Add some materialize classes for the css
                message: 'Could not update snippet, Please fill all the fields'
            };
            res.redirect('/snippet');
        } else {
            //find the snippet by id and update
            Snippet.findOneAndUpdate({_id: req.params.id}, {
                title: snippTitle,
                code: snippCode,
                createdBy: userUpdate,
                updatedAt: Date.now()
            }, function (err) {
                if (err) {
                    req.session.flash = {
                        type: 'failure card-panel blue lighten-3',      //Add some materialize classes for the css
                        message: 'Could not update snippet'
                    };
                    throw new Error('Something went wrong while editing the snippet' + '\n' + err);
                }
                req.session.flash = {
                    type: 'success card-panel blue lighten-3',      //Add some materialize classes for the css
                    message: 'The snippet was updated successfully'
                };
                res.redirect('/');
            });
        }
    });

/**
 * Function to authorize the user whether to show the required page
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function authorize(req, res, next) {
    if (req.session.user)
        next();
    else {
        req.session.flash = {
            type: 'failure card-panel blue lighten-3',      //Add some materialize classes for the css
            message: 'Error 403: Forbidden'
        };
        res.redirect('/');
    }
}

//Couldn't make it work
// router.all("/snippet/:type(create|edit\/*|delete\/*)",
//     function(request, response, next) {
//         // If not authenticated trigger a 403 error.
//         request.session.user ? next() : next(errorFactory(403));
//     });

module.exports = router;
