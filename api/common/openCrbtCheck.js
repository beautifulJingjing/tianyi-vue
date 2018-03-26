const co = require('co')
const isCrbt = require('./isCrbt')
const isCrbtOpening = require('./isCrbtOpening')
const openCrbt = require('./openCrbt')

module.exports = ({ req, data = {} }) => co(function * () {
  const current = req.current
  const spconfig = current.config
  const { phone } = data

  // 已开通
  if (yield isCrbt({ req, data: { phone } })) {
    return {}
  }
  // 开通中
  if (yield isCrbtOpening({ req })) {
    return Promise.reject({ code: 31, msg: '彩铃功能开通中，请耐心等待！' })
  }
  // 直接开通，不弹窗
  if (spconfig.crbt.pop.pop == 0) {
    try {
      yield openCrbt({ req })
    } catch (err) {
      return Promise.reject({ code: -31, msg: err })
    }
    // 短信回复开通
    if (spconfig.crbt.open == 2) {
      return Promise.reject({ code: 14 })
    }
    if (yield isCrbtOpening({ req })) {
      return Promise.reject({ code: 31, msg: '彩铃功能开通中，请耐心等待！' })
    }
    return { crbt: { code: 30 } }
  }
  // 需要弹窗提示
  return Promise.reject({ code: -30, msg: '尚末开通彩铃功能！' })
})
