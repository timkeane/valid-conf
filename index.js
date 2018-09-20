const fs = require('fs')
const GeoServerConfig = require('./src/GeoServerConfig')
require('dotenv').config()

const geoServerConfig = new GeoServerConfig(
  process.env.GEOSERVER_PROTOCOL,
  process.env.GEOSERVER_HOST,
  process.env.GEOSERVER_PORT,
  process.env.GEOSERVER_USER,
  process.env.GEOSERVER_PASSWORD
)

geoServerConfig.getConfig().then(config => {
  console.warn(config)
  fs.writeFileSync('config.json', JSON.stringify(config, null, 2))
  console.warn('')
  console.warn('config written to config.json')
})
  
// (async () => {
//   const fetch = require('node-fetch')
//   const request = async () => {
//     const response = await fetch('http://csgis-stg-prx.csc.nycnet/geoclient/v1/search.json?app_key=74DF5DB1D7320A9A2&app_id=nyc-lib-example&input=59%20maiden')
//     const json = await response.json()
//     console.log(json)
//   }
//   await request()
//   console.log('============')
// })()

// const fetch = require('node-fetch')
// const request = async () => {
//   const response = await fetch('http://csgis-stg-prx.csc.nycnet/geoclient/v1/search.json?app_key=74DF5DB1D7320A9A2&app_id=nyc-lib-example&input=59%20maiden')
//   const json = await response.json()
//   console.log(json)
// }
// await request()
// console.log('============')