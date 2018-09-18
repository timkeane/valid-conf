'use strict';

var _GetConfig = require('./src/GetConfig');

var _GetConfig2 = _interopRequireDefault(_GetConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var getConfig = void 0;

_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  var config;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          require('dotenv').config();
          getConfig = new _GetConfig2.default();
          _context.next = 4;
          return getConfig.getConfig(process.env.GEOSERVER_PROTOCOL, process.env.GEOSERVER_HOST, process.env.GEOSERVER_PORT, process.env.GEOSERVER_USER, process.env.GEOSERVER_PASSWORD);

        case 4:
          config = _context.sent;

          console.warn(config);

        case 6:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined);
}))();

setTimeout(function () {
  console.warn(getConfig.config);
}, 10000);