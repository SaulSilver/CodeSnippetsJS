/**
 * Handles the database
 *
 * Created by hatem on 2016-11-30.
 */
"use strict";

let mongoose = require('mongoose');

module.exports = {
    initialize : function() {
        //read db configuration
        let dbConfig = require('../config/database.js');

        let db = mongoose.connection;

        //in case of a connection error
        db.on('error', console.error.bind(console, 'Database connection error!'));

        db.once('open', function(){
            console.log('Successfully connected to mongoDB');
        });

        //Close mongoose connection when Node ends
        process.on('SIGINT', function () {
            db.close(function() {
                console.log('Mongoose connection disconnected by app termination');
                process.exit(0);
            });
        });

        //Setting the default global promise for mongoose instead mongoose deprecated promise
        mongoose.Promise = global.Promise;

        //Connect to database
        mongoose.connect(dbConfig.connectionString);
    }
};
