require('isomorphic-fetch')

class GetConfig {

  getConfig(protocol, host, port, user, password) {
    const now = new Date()
    port = port ? `:${port}` : ''
    this.user = user
    this.password = password
    this.config = {}
    return this.get(
      this.auth(`${protocol}://${host}${port}/geoserver/rest/workspaces.json`), 
      this.getWorkspaces, 
      this.config
    )
  }

  auth(url) {
    return url.replace(/\:\/\//, `://${this.user}:${this.password}@`)
  }

  get(url, callback, parent) {
    return fetch(url).then(response => {
      return response.json()
    }).then(result => {
      callback.call(this, result, parent)
    }).catch(error => {
      console.warn('=====================================')
      console.error(url)
      console.error(callback)
      console.error(parent)
      console.error(error)
      console.warn('=====================================')
    })
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

export default GetConfig