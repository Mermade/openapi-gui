'use strict';

const fs = require('fs');
const util = require('util');

const express = require('express');
const compression = require('compression');
const opn = require('opn');
const yaml = require('js-yaml');
const widdershins = require('widdershins');
const shins = require('shins');

const ourVersion = require('./package.json').version;
let definition = {openapi:"3.0.0",info:{title:"API",version:"1.0.0"},paths:{}};
let writeBack = false;
let defName;

// nice stack traces
process.on('unhandledRejection', r => console.log(r));

let api = require('openapi-webconverter/api.js').api;
let app = api.app;
let upload = api.upload;
app.use(compression());
app.set('view engine', 'ejs');

// extract into URSA: Undo/Redo Server API, use API-chaining
app.post('/store', upload.single('filename'), function(req, res) {
    try {
        definition = JSON.parse(req.body.source);
        if (writeBack) {
            let s = yaml.safeDump(definition,{lineWidth:-1});
            fs.writeFile(defName,s,'utf8',function(err){});
        }
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
	let options = {}; // defaults shown
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
	let options = {};
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

function server(myport, argv) {
    let oag = app.listen(myport, function () {
        let host = oag.address().address;
        let port = oag.address().port;

        console.log('OpenAPI GUI server listening at http://%s:%s', host, port);
        if (argv.w || argv.write) writeBack = true;
        if (argv.l || argv.launch) {
            let path = '';
            defName = (argv.d || argv.definition);
            if (defName) {
                path = '/?url=%2fserve';
                console.log('Serving',defName);
                definition = yaml.safeLoad(fs.readFileSync(defName,'utf8'),{json:true});
            }
            console.log('Launching...');
            opn('http://'+(host === '::' ? 'localhost' : host)+':'+port+path);
        }
    });
}

module.exports = {
    server: server
};

