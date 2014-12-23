/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2014, Tidepool Project
 * 
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 * 
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 * == BSD2 LICENSE ==
 */
'use strict';

var common = require('common');
var moment = require('moment');
var pre = require('amoeba').pre;
var request = require('request');

var CARELINK_URLS = {
  security: 'https://carelink.minimed.com/patient/j_security_check',
  login: 'https://carelink.minimed.com/patient/main/login.do',
  csv: 'https://carelink.minimed.com/patient/main/selectCSV.do'
};

function defaultOptions(jar) {
  return  {
    jar: jar,
    headers: {
      Host: 'carelink.minimed.com',
      Connection: 'keep-alive',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.76 Safari/537.36',
      'Accept-Encoding': 'gzip,deflate,sdch',
      'Accept-Language': 'en-US,en;q=0.8'
    }
  };
}

module.exports = function (opts, cb) {
  var user = pre.hasProperty(opts, 'username');
  var password = pre.hasProperty(opts, 'password');
  var daysAgo = pre.hasProperty(opts, 'daysAgo');

  var jar = request.jar();

  common.step(
    [
      function (next) {
        var reqOptions = defaultOptions(jar);
        reqOptions.qs = {j_username: user, j_password: password};
        request.post(CARELINK_URLS.security, reqOptions, next);
      },
      function (response, next) {
        request.get(CARELINK_URLS.login, defaultOptions(jar), next);
      },
      function (response, next) {
        var m = moment();

        var reqOptions = defaultOptions(jar);
        reqOptions.qs = { t: '11' };
        reqOptions.form = {
          report: 11,
          listSeparator: ',',
          datePicker1: m.format('MM/DD/YYYY'),
          datePicker2: m.subtract(daysAgo || 14, 'days').format('MM/DD/YYYY')
        };

        cb(null, request.post(CARELINK_URLS.csv, reqOptions));
      }
    ],
    cb
  );
};
