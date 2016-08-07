/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
var fs = require('fs');
var myParser = require("body-parser");
var express = require('express'),
  app = express(),
  vcapServices = require('vcap_services'),
  extend = require('util')._extend,
  watson = require('watson-developer-cloud');
var expressBrowserify = require('express-browserify');

// load environment properties from a .env file for local development
require('dotenv').load({silent: true});

// Bootstrap application settings
require('./config/express')(app);

// automatically compile and serve the front-end js
app.get('/js/index.js', expressBrowserify('src/index.js', {
  watch: process.env.NODE_ENV !== 'production'
}));

// For local development, replace username and password
var config = extend({
  version: 'v1',
  url: 'https://stream.watsonplatform.net/speech-to-text/api',
  username: process.env.STT_USERNAME || 'baf9a2b4-eb37-45fe-ba8d-77b083788aa3',
  password: process.env.STT_PASSWORD || 'yWCGNqUz5By6'
}, vcapServices.getCredentials('speech_to_text'));

var authService = watson.authorization(config);

app.get('/', function(req, res) {
  res.render('index', {
    ct: req._csrfToken,
    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID
  });
});
// app.use(bodyParser.json());

app.post('/api/alchemy', function(request, response) {

  var watson = require('watson-developer-cloud');

  var alchemy_language = watson.alchemy_language({
    api_key: '69d17cec4018ad992ed58383782e04b3c67fb66c'
  });

  var someResponse = null;
  alchemy_language.sentiment(request.body, function (err, res) {
    if (err)
      console.log('error:', err);
    else
      console.log(JSON.stringify(res, null, 2));
      someResponse = JSON.stringify(res, null, 2);
      response.end(someResponse);
      // response.end(JSON.stringify(res, null, 2));
  });
  console.log(request.body);
  // response.end(someResponse);

});

// Get token using your credentials
app.post('/api/token', function(req, res, next) {
  authService.getToken({url: config.url}, function(err, token) {
    if (err)
      next(err);
    else
      res.send(token);
  });
});

// error-handler settings
require('./config/error-handler')(app);

module.exports = app;
