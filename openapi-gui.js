#!/usr/bin/env node

'use strict';

const fs = require('fs');
const util = require('util');

const express = require('express');
const compression = require('compression');
const argv = require('tiny-opts-parser')(process.argv);
const opn = require('opn');
const yaml = require('js-yaml');
const widdershins = require('widdershins');
const shins = require('shins');

const ourVersion = require('./package.json').version;
var definition = {openapi:"3.0.0",info:{title:"API",version:"1.0.0"},paths:{}};

// nice stack traces
process.on('unhandledRejection', r => console.log(r));

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

const getWiddershinsOptions = function() {
	var options = {}; // defaults shown
	options.codeSamples = true;
	//options.language_tabs = [];
	////options.loadedFrom = sourceUrl;
	////options.user_templates = './user_templates';
	options.templateCallback = function(templateName,stage,data) { return data };
	options.theme = 'ocean';
	options.search = true;
	options.sample = true; // set false by --raw
	options.schema = true; // set false by --noschema
	options.discovery = false;
	options.includes = [];
	options.aggressive = false;
	options.language_tabs = [{ 'http': 'HTTP' }, { 'javascript': 'JavaScript' }, { 'javascript--nodejs': 'Node.JS' }, { 'python': 'Python' }];
	return options;
}

const getShinsOptions = function() {
	var options = {};
	options.minify = false;
	options.customCss = false;
	options.inline = false;
	return options;
}

app.get('/markdown', function(req, res) {
	widdershins.convert(definition, getWiddershinsOptions(), function(err,str){
		res.set('Content-Type', 'text/plain');
		res.send(str);
	});
});

app.get('/shins', function(req, res) {
	widdershins.convert(definition, getWiddershinsOptions(), function(err,str){
		shins.render(str, getShinsOptions(), function(err, html) {
			res.set('Content-Type', 'text/html');
			res.send(html);
		});
	});
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.use("/", express.static(__dirname, {
    setHeaders: function(res, path) {
        res.set('X-OpenAPI-GUI',ourVersion);
    }
}));

let myport = process.env.PORT || argv.p || argv.port || 3000;

let server = app.listen(myport, function () {
    let host = server.address().address;
    let port = server.address().port;

    console.log('OpenAPI GUI server listening at http://%s:%s', host, port);
    if (argv.l || argv.launch) {
        let path = '';
        if (argv.d || argv.definition) {
            path = '/?url=%2fserve';
            let defName = (argv.d || argv.definition);
            console.log('Serving',defName);
            definition = yaml.safeLoad(fs.readFileSync(defName,'utf8'),{json:true});
        }
        console.log('Launching...');
        opn('http://'+(host === '::' ? 'localhost' : host)+':'+port+path);
    }
});

