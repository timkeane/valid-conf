const fetch = require('node-fetch')

require('babel-polyfill')

class GetConfig {

  constructor(protocol, host, port, user, password) {
    port = port ? `:${port}` : ''
    this.user = user
    this.password = password
    this.url = `${protocol}://${user}:${password}@${host}${port}/geoserver/rest/workspaces.json`
  }

  fillConfig(config) {
    this.requestCount = 0
    this.config = config
    return new Promise(
      resolve => {
        this.get(
          resolve,
          this.url, 
          this.getWorkspaces, 
          this.config
        )
  
      }
    )
  }

  auth(url) {
    return url.replace(/\:\/\//, `://${this.user}:${this.password}@`)
  }

  error(url, callback, parent, error) {
    console.warn('=====================================')
    console.error(url)
    console.error(callback)
    console.error(parent)
    console.error(error)
    console.warn('=====================================')
    process.exit(1)
  }

  get(resolve, url, callback, parent) {
    this.requestCount++
    fetch(url)
      .then(response => {
        return response.json()
      })
      .then(result => {
        callback.call(this, resolve, result, parent)
        this.requestCount--
        if (this.requestCount === 0) {
          resolve(this.config)
        }
      })
      .catch(error => {
        this.error(url, callback, parent, error)
      })
    return resolve
  }

  getWorkspaces(resolve, result, config) {
    config.workspaces = {}
    result.workspaces.workspace.forEach(workspace => {
      this.get(resolve, this.auth(workspace.href), this.gotWorkspace, config.workspaces)
    })
    return resolve
  }

  gotWorkspace(resolve, result, workspaces) {
    const workspace = result.workspace
    workspaces[workspace.name] = workspace
    this.get(resolve, this.auth(workspace.dataStores), this.getDataStores, workspace)
    return resolve
  }

  getDataStores(resolve, result, workspace) {
    workspace.dataStores = {}
    if (result.dataStores.dataStore) {
      result.dataStores.dataStore.forEach(dataStore => {
        this.get(resolve, this.auth(dataStore.href), this.gotDataStore, workspace.dataStores)
      })
    }
    return resolve
  }

  gotDataStore(resolve, result, dataStores) {
    const dataStore = result.dataStore
    dataStores[dataStore.name] = dataStore
    this.get(resolve, this.auth(dataStore.featureTypes), this.getFeatureTypes, dataStore)
    return resolve
  }

  getFeatureTypes(resolve, result, dataStore) {
    dataStore.featureTypes = {}
    if (result.featureTypes.featureType) {
      result.featureTypes.featureType.forEach(featureType => {
        this.get(resolve, this.auth(featureType.href), this.gotFeatureType, dataStore.featureTypes)
      })
    }
    return resolve
  }

  gotFeatureType(resolve, result, featureTypes) {
    const featureType = result.featureType
    featureTypes[featureType.name] = featureType
    return resolve
  }

}

module.exports = GetConfig