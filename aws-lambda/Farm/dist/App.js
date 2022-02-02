"use strict";
var lambda = require('./index');
var express = require('express');
var app = express();
var port = 3001;
// Add headers before the routes are defined
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', "*");
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});
app.use(express.json());
app.post('/prod/farm-game/farm', function (req, res) {
    console.log('--> ' + JSON.stringify(req.body));
    var answer = lambda.handler(req.body).then(function (x) {
        console.log(x);
        res.json(x);
    });
});
app.listen(port, function () {
    console.log("Example app listening on port ".concat(port));
});
module.exports = {};
