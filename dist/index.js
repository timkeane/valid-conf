'use strict';

var _GetConfig = require('./src/GetConfig');

var _GetConfig2 = _interopRequireDefault(_GetConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

var getConfig = new _GetConfig2.default();

getConfig.getConfig(process.env.GEOSERVER_PROTOCOL, process.env.GEOSERVER_HOST, process.env.GEOSERVER_PORT, process.env.GEOSERVER_USER, process.env.GEOSERVER_PASSWORD).then(function () {
  console.warn(getConfig.config);
});

setTimeout(function () {
  console.warn(JSON.stringify(getConfig.config, null, 2));
}, 10000);