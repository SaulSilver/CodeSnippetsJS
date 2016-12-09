/**
 * Responsible for the database modeling of the snippet
 * Created by hatem on 2016-11-30.
 */
"use strict";

let mongoose = require('mongoose');

//Defining the schema
let snippetSchema = mongoose.Schema({
    title: {type: String, required: true },
    code: {type: String, required: true},
    createdBy: {type: String, required: true},
    updatedAt: {type: Date, required: true, default: Date.now}
});

//creating the Model
let Snippet = mongoose.model('Snippet', snippetSchema);

module.exports = Snippet;
