'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

require('isomorphic-fetch');

var GetConfig = function () {
  function GetConfig() {
    _classCallCheck(this, GetConfig);
  }

  _createClass(GetConfig, [{
    key: 'getConfig',
    value: function getConfig(protocol, host, port, user, password) {
      var now = new Date();
      port = port ? ':' + port : '';
      this.user = user;
      this.password = password;
      this.config = {};
      return this.get(this.auth(protocol + '://' + host + port + '/geoserver/rest/workspaces.json'), this.getWorkspaces, this.config);
    }
  }, {
    key: 'auth',
    value: function auth(url) {
      return url.replace(/\:\/\//, '://' + this.user + ':' + this.password + '@');
    }
  }, {
    key: 'get',
    value: function get(url, callback, parent) {
      var _this = this;

      return fetch(url).then(function (response) {
        return response.json();
      }).then(function (result) {
        callback.call(_this, result, parent);
      }).catch(function (error) {
        console.warn('=====================================');
        console.error(url);
        console.error(callback);
        console.error(parent);
        console.error(error);
        console.warn('=====================================');
      });
    }
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