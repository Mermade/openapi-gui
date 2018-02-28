#!/usr/bin/env node

'use strict';

const oag = require('./index.js');
const argv = require('tiny-opts-parser')(process.argv);

let myport = process.env.PORT || argv.p || argv.port || 3000;

oag.server(myport, argv);

