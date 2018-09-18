(async () => {
  const GetConfig = require('./src/GetConfig')
  require('dotenv').config()

  const getConfig = new GetConfig(
    process.env.GEOSERVER_PROTOCOL,
    process.env.GEOSERVER_HOST,
    process.env.GEOSERVER_PORT,
    process.env.GEOSERVER_USER,
    process.env.GEOSERVER_PASSWORD
  )

  const config = {}
  await getConfig.fillConfig(config)
  console.warn(config)

  setTimeout(() => {
    console.warn(JSON.stringify(config, null, 2))
  }, 10000)
})()

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