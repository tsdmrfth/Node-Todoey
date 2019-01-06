const env = process.env.NODE_ENV || 'development'
const config = require('./config.json')

if (env === 'development' || env === 'test') {
    const environmentConfig = config[env]
    Object.keys(environmentConfig).forEach(key => {
        process.env[key] = environmentConfig[key]
    })
}