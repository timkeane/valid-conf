const fetch = require('node-fetch')

class GetConfig {

  constructor(protocol, host, port, user, password) {
    port = port ? `:${port}` : ''
    this.user = user
    this.password = password
    this.url = `${protocol}://${user}:${password}@${host}${port}/geoserver/rest/workspaces.json`
  }

  async fillConfig(config) {
    this.config = config
    await this.get(
      this.url, 
      this.getWorkspaces, 
      this.config
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

  async get(url, callback, parent) {    
    const response = await fetch(url).catch(error => {
      this.error(url, callback, parent, error)
    })
    const result = await response.json()
    callback.call(this, result, parent)
  }

  getWorkspaces(result, config) {
    config.workspaces = {}
    result.workspaces.workspace.forEach(workspace => {
      this.get(this.auth(workspace.href), this.gotWorkspace, config.workspaces)
    })
  }

  gotWorkspace(result, workspaces) {
    const workspace = result.workspace
    workspaces[workspace.name] = workspace
    this.get(this.auth(workspace.dataStores), this.getDataStores, workspace)
  }

  getDataStores(result, workspace) {
    workspace.dataStores = {}
    if (result.dataStores.dataStore) {
      result.dataStores.dataStore.forEach(dataStore => {
        this.get(this.auth(dataStore.href), this.gotDataStore, workspace.dataStores)
      })
    }
  }

  gotDataStore(result, dataStores) {
    const dataStore = result.dataStore
    dataStores[dataStore.name] = dataStore
    this.get(this.auth(dataStore.featureTypes), this.getFeatureTypes, dataStore)
  }

  getFeatureTypes(result, dataStore) {
    dataStore.featureTypes = {}
    if (result.featureTypes.featureType) {
      result.featureTypes.featureType.forEach(featureType => {
        this.get(this.auth(featureType.href), this.gotFeatureType, dataStore.featureTypes)
      })
    }
  }

  gotFeatureType(result, featureTypes) {
    const featureType = result.featureType
    featureTypes[featureType.name] = featureType
  }

}

module.exports = GetConfig