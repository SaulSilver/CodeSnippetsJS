/**
 * Responsible for the database modeling of the user authentication
 * Created by hatem on 2016-12-08.
 */
"use strict";

let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');

//Defining the schema
let userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

//Password validation
userSchema.path('password').validate(function (password) {
    return password.length >= 6;
}, 'password must be at least 6 characters');

//hash the password before saving the user in the database
userSchema.pre('save', function(next) {
    let user = this;
    bcrypt.genSalt(10, function(err, salt) {
        if (err)
            return next(err);

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err)
                return next(err);

            //Set the password to the hash
            user.password = hash;
            next();
        });
    });
});

//Checking the password
userSchema.methods.comparePassword = function(inputPassword, callback) {
    bcrypt.compare(inputPassword, this.password, function (err, res) {
        if (err)
            return callback(err);
        callback(null, res);
    });
};

//creating the model
let User = mongoose.model('User', userSchema);

module.exports = User;
