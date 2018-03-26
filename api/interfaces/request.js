/**
 * api request
 */

const config = require('../../config')
const co = require('co')
const request = require('../../utils/request')
const { md5 } = require('../../utils')
const querystring = require('querystring')
const redis = require('../../utils/redis')

// api接口参数
const api = {
  id: 1,
  key: 'sky',
  //host: 'http://60.191.59.46:22387/ringsetting/phone.htm',
  // host: 'https://api.ringbox.com.cn/ringsetclientv3/phone.htm'
  //host: 'http://api.ringbox.com.cn:8808/ringsetclientv3/phone.htm'
  //host: 'http://10.161.187.76:8808/ringsetclientv3/phone.htm'
  //host: 'http://115.29.165.32:8808/ringsetclientv3/phone.htm',
  //host: 'http://192.168.3.252/ringsetting/phone.htm',
  host: config.isProd 
    ? 'https://api.ringbox.com.cn/ringsetclientv3/phone.htm'
    : 'http://api.ringbox.com.cn:8808/ringsetclientv3/phone.htm'
}

// 参数加密
function cryptoParams(data) {
  const keys = Object.keys(data)
  keys.sort((a, b) => {
    return a.localeCompare(b)
  })

  let str = ''
  keys.forEach(key => {
    str += data[key].toString()
  })

  return md5(str + api.key).toUpperCase()
}

// 发请求
const _request = ({ req, data, special }) => co(function * () {
  data = Object.assign({}, data)
  // if (!data.spinfocode) data.spinfocode = req.current.spinfocode
  data.spinfocode = req.current.spinfocode
  if (!data.version) data.version = '30'
  data.format = 'JSON'
  data.timespan = +new Date()
  data.appid = api.id
  data.hash = cryptoParams(data)

  console.log(`url: ${api.host}?${querystring.stringify(data)}`)
  const { success, httpRes, body } = yield request({ url: api.host, method: 'post', data })
  console.log(`service ${data.service} cost: ${+new Date() - data.timespan}ms`)

  if (success) {
    if (body) {
      if (body.code === 0) {
        return Promise.reject(body.msg)
      }
      if (special) {
        return body
      }
      return body.data
    }
    console.error('响应内容为空！')
    return Promise.reject('响应内容为空！')
  }
  const { statusCode, statusMessage } = httpRes
  return Promise.reject(statusCode + statusMessage)
})

// 生成redis key
const makeKey = (data) => {
  //spinfocode是否做缓存键，有待确定
  const newObj = {}
  for (let i in data) {
    if (i !== 'spinfocode') {
      newObj[i] = data[i]
    }
  }
  return querystring.stringify(newObj)
}

// cache指定要不要缓存, special返回所有内容
module.exports = ({ req, data = {}, cache = false, special = false }) => {
  let rKey = null
  return co(function * () {
    if (cache) {
      rKey = makeKey(data)
      const ret = yield redis.getAsync(rKey)
      return ret ? JSON.parse(ret) : null
    }
    return null
  }).then(ret => co(function * () {
    if (ret) return ret
    const result = yield _request({ req, data, special })
    req.trace.interface({ name: data.service, params: data })
    console.log(JSON.stringify(result))
    if (cache) {
      redis.set(rKey, JSON.stringify(result))
      // 默认缓存2小时
      redis.expire(rKey, typeof cache === 'number' ? cache : 2 * 3600)
    }
    return result
  })).catch(err => {
    req.trace.error({ name: data.service, params: data, msg: err })
    return Promise.reject(err)
  })
}
