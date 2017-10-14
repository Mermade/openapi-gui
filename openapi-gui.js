#!/usr/bin/env node

'use strict';

var express = require('express');
var compression = require('compression');

var ourVersion = require('./package.json').version;

var api = require('openapi-webconverter/api.js').api;
var app = api.app;
app.use(compression());
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.use("/", express.static(__dirname, {
    setHeaders: function(res, path) {
        res.set('X-OpenAPI-GUI',ourVersion);
    }
}));

var myport = process.env.PORT || 3000;
//if (process.argv.length>2) myport = process.argv[2];

var server = app.listen(myport, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('OpenAPI GUI server listening at http://%s:%s', host, port);
});
