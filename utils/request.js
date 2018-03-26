/**
 * 基本请求
 */
const request = require('request')
const config = require('../config')

module.exports = ({ url, method = 'get', data }) => {
  method = method.toLowerCase()
  const options = { url }
  if (data) {
    if (method === 'get') {
      options.qs = data
    } else {
      options.form = data
    }
  }

  if (config.isDev) {
    options.strictSSL = false
  }

  return new Promise((resolve, reject) => {
    request[method](options, (err, httpRes, body) => {
      if (err) return reject(err)
      
      const success = httpRes.statusCode === 200
      resolve({
        success,
        httpRes,
        body: success ? (body && JSON.parse(body)) : body
      })
    })
  })
}
