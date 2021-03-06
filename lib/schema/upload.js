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

var schema = require('./schema.js');

var idFields = ['type', 'deviceId', 'time'];
schema.registerIdFields('upload', idFields);

module.exports = schema.makeHandler('upload', {
  schema: {
    timezone: schema.isString,
    uploadId: schema.isString,
    byUser: schema.isString,
    // we are going to uncomment these once a new uploader has been deployed that uses them
    // deviceTags: schema.isArrayWithValueSchema(schema.isString),
    // deviceManufacturers: schema.isArrayWithValueSchema(schema.isString),
    // deviceModel: schema.isString,
    // deviceSerialNumber: schema.isString,
    version: schema.isString
  }
});