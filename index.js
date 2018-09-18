import GetConfig from './src/GetConfig'

require('dotenv').config()

const getConfig = new GetConfig()

getConfig.getConfig(
  process.env.GEOSERVER_PROTOCOL,
  process.env.GEOSERVER_HOST,
  process.env.GEOSERVER_PORT,
  process.env.GEOSERVER_USER,
  process.env.GEOSERVER_PASSWORD
).then(() => {
  console.warn(getConfig.config)  
})

setTimeout(() => {
  console.warn(getConfig.config) 
  //console.warn(JSON.stringify(getConfig.config, null, 2)) 
}, 10000)