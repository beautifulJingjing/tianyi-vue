/**
 * 获取spinfocode配置
 */

const co = require('co')
const request = require('./request')
const redis = require('./redis')
const config = require('../config')
const dense = require('./dense')

const configUrl = 'http://config.ringbox.cn/options/'

// 标准化配置
const normalize = c => co(function * () {
  const loginPop = c.login.pop
  const orderPop = c.order.pop
  const crbtPop = c.crbt.pop
  const remind = c.declare.remind

  let set = parseInt(c.set)
  // 自动状态下判断是使用标准还是配置
  if (set === 0) {
    set = (yield dense.isDense(c.id)) ? 2 : 1
  }
  // 根据使用配置，变更结构以适应标准对象
  switch (set) {
    case 1:
      Object.assign(loginPop, loginPop.norm)
      Object.assign(orderPop, orderPop.norm)
      Object.assign(crbtPop, crbtPop.norm)
      Object.assign(remind, remind.norm)
      break
    case 2:
      Object.assign(loginPop, loginPop.custom)
      Object.assign(orderPop, orderPop.custom)
      Object.assign(crbtPop, crbtPop.custom)
      Object.assign(remind, remind.custom)
      break
    default:
      console.log(`标准化配置时set: ${set}`)
  }
  delete loginPop.norm
  delete loginPop.custom
  delete orderPop.norm
  delete orderPop.custom
  delete crbtPop.norm
  delete crbtPop.custom
  delete remind.norm
  delete remind.custom

  // 新增节点的初始化
  if (!c.downring) {
    c.downring = { serve: c.ringset.serve }
  }
  if (!c.crbt.asyncsucc) {
    c.crbt.asyncsucc = { title: '', content: '' }
  }

  return c
})

// 获取配置
const getSpconfig = (code) => co(function * () {
  const rKey = `CONFIG-${code}`
  const redisData = yield redis.getAsync(rKey)

  if (redisData) {
    return JSON.parse(redisData)
  }

  const _start = +new Date()
  const { success, body } = yield request({ url: configUrl + code })
  console.log(`get config cost: ${+new Date() - _start}ms`)
  if (success && body) {
    // 缓存12小时
    redis.set(rKey, JSON.stringify(body))
    redis.expire(rKey, 12 * 3600)
    return body
  }

  return false
})

module.exports = code => co(function * () {
  let result = null
  const spconfig = yield getSpconfig(code)
  if (spconfig) {
    // console.log(`spinfocode: `, code)
    result = spconfig
  } else {
    // 获取默认配置
    console.log(`spinfocode: `, code, config.spinfocode)
    result = yield getSpconfig(config.spinfocode)
  }

  return yield normalize(result)
})
