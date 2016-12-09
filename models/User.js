/**
 * Responsible for the database modeling of the user authentication
 * Created by hatem on 2016-12-08.
 */
"use strict";

let mongoose = require('mongoose');

//Defining the schema
let userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

//Password validation
userSchema.path('password').validate(function (password) {
    return password.length >= 6;
}, 'password must be at least 6 characters');

//creating the model
let User = mongoose.model('User', userSchema);

module.exports = User;
