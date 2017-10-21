#!/usr/bin/env node

'use strict';

const util = require('util');

const express = require('express');
const compression = require('compression');

const ourVersion = require('./package.json').version;
var definition = {openapi:"3.0.0",info:{title:"API",version:"1.0.0"}};

var api = require('openapi-webconverter/api.js').api;
var app = api.app;
var upload = api.upload;
app.use(compression());
app.set('view engine', 'ejs');

// extract into URSA: Undo/Redo Server API, use API-chaining
app.post('/store', upload.single('filename'), function(req, res) {
    try {
        definition = JSON.parse(req.body.source);
    }
    catch (ex) {
        console.warn(ex.message);
    }
    res.send('OK');
});

app.get('/serve', function(req, res) {
    res.set('Content-Type','application/json');
    res.send(JSON.stringify(definition,null,2));
});

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
