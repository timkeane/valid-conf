'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('babel-polyfill');

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GetConfig = function () {
  function GetConfig() {
    _classCallCheck(this, GetConfig);
  }

  _createClass(GetConfig, [{
    key: 'getConfig',
    value: function getConfig(protocol, host, port, user, password) {
      port = port ? ':' + port : '';
      this.config = {};
      this.user = user;
      this.password = password;
      this.get(this.auth(protocol + '://' + host + port + '/geoserver/rest/workspaces.json'), this.getWorkspaces, this.config);
      return this.config;
    }
  }, {
    key: 'auth',
    value: function auth(url) {
      return url.replace(/\:\/\//, '://' + this.user + ':' + this.password + '@');
    }
  }, {
    key: 'error',
    value: function error(url, callback, parent, _error) {
      console.warn('=====================================');
      console.error(url);
      console.error(callback);
      console.error(parent);
      console.error(_error);
      console.warn('=====================================');
      process.exit(1);
    }
  }, {
    key: 'get',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url, callback, parent) {
        var _this = this;

        var response, result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _nodeFetch2.default)(url).catch(function (error) {
                  _this.error(url, callback, parent, error);
                });

              case 2:
                response = _context.sent;
                _context.next = 5;
                return response.json();

              case 5:
                result = _context.sent;

                callback.call(this, result, parent);

              case 7:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function get(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      }

      return get;
    }()
  }, {
    key: 'getWorkspaces',
    value: function getWorkspaces(result, config) {
      var _this2 = this;

      config.workspaces = {};
      result.workspaces.workspace.forEach(function (workspace) {
        _this2.get(_this2.auth(workspace.href), _this2.gotWorkspace, config.workspaces);
      });
    }
  }, {
    key: 'gotWorkspace',
    value: function gotWorkspace(result, workspaces) {
      var workspace = result.workspace;
      workspaces[workspace.name] = workspace;
      this.get(this.auth(workspace.dataStores), this.getDataStores, workspace);
    }
  }, {
    key: 'getDataStores',
    value: function getDataStores(result, workspace) {
      var _this3 = this;

      workspace.dataStores = {};
      if (result.dataStores.dataStore) {
        result.dataStores.dataStore.forEach(function (dataStore) {
          _this3.get(_this3.auth(dataStore.href), _this3.gotDataStore, workspace.dataStores);
        });
      }
    }
  }, {
    key: 'gotDataStore',
    value: function gotDataStore(result, dataStores) {
      var dataStore = result.dataStore;
      dataStores[dataStore.name] = dataStore;
      this.get(this.auth(dataStore.featureTypes), this.getFeatureTypes, dataStore);
    }
  }, {
    key: 'getFeatureTypes',
    value: function getFeatureTypes(result, dataStore) {
      var _this4 = this;

      dataStore.featureTypes = {};
      if (result.featureTypes.featureType) {
        result.featureTypes.featureType.forEach(function (featureType) {
          _this4.get(_this4.auth(featureType.href), _this4.gotFeatureType, dataStore.featureTypes);
        });
      }
    }
  }, {
    key: 'gotFeatureType',
    value: function gotFeatureType(result, featureTypes) {
      var featureType = result.featureType;
      featureTypes[featureType.name] = featureType;
    }
  }]);

  return GetConfig;
}();

exports.default = GetConfig;