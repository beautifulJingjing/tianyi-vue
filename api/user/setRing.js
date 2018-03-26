/**
 * Created by XUER on 2016-3-6.
 * 彩铃设置
 */

const co = require('co')
const openOrderCheck = require('../common/openOrderCheck')
const openCrbtCheck = require('../common/openCrbtCheck')
const set_user_crbt = require('../interfaces/set_user_crbt')
const get_ring_info = require('../interfaces/get_ring_info')

module.exports = (req, res, next) => {
  const { rid, confirm } = req.body
  const current = req.current
  const spconfig = current.config

  res.locals.p = co(function * () {
    // resolve进入下一步 reject直接返回
    //彩铃业务优先
    if (spconfig.ringset.serve == 2) {
      try {
        yield openCrbtCheck({ req })
      } catch (err) {
        return Promise.reject(err)
      }
      try {
        yield openOrderCheck({ req })
      } catch (err) {
        return Promise.reject(err)
      }
      return true
    }
    //DIY业务优先
    try {
      yield openOrderCheck({ req })
    } catch (err) {
      return Promise.reject(err)
    }
    try {
      yield openCrbtCheck({ req })
    } catch (err) {
      return Promise.reject(err)
    }
    return true
  }).then(ret => co(function * () {
    if (confirm == 1) {
      //客户端信息提示已确认
      return yield set_user_crbt({ req, data: { ringid: rid } })
    }
    //查询铃声资费和过期时间
    let ringInfo = null
    try {
      ringInfo = yield get_ring_info({ req, data: { ringid: rid } })
    } catch (err) {
      return { code: 0, msg: '设置彩铃未找到！' }
    }
    const price = parseInt(ringInfo.price / 100)
    return {
      code: -32,
      user: current.user,
      msg: price === 0 
        ? `是否确认设置该首彩铃？\r\n资费是：<span class="bz-span">2.0元<em></em></span>（<i>VIP专享${price}元/首</i>）`
        : `是否确认设置该首彩铃？\r\n资费：${price}元/首`
    }
  })).catch(err => {
    return Object.assign({}, err, { user: current.user })
  })

  next()
}
