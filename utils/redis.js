const config = require('../config')
const redis = require('redis')
const bluebird = require('bluebird')

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

const client = redis.createClient(config.redis)

client.on('ready', () => {
  console.log(`redis ready`)
})
client.on('connect', () => {
  console.log(`redis connect`)
})
client.on('reconnecting', () => {
  console.log(`redis reconnecting`)
})
client.on('end', () => {
  console.log(`redis end`)
})
client.on('warning', () => {
  console.log(`redis warning`)
})
client.on('error', err => {
  console.error(`redis err: ${err}`)
})

module.exports = client
