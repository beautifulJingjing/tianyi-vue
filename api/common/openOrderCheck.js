const co = require('co')
const isOrder = require('./isOrder')
const openOrder = require('./openOrder')

module.exports = ({ req, data = {} }) => co(function * () {
  const current = req.current
  const spconfig = req.current.config
  // const data = {}
  // if (current.user) data.phone = current.user.phone

  // 已开通
  if (yield isOrder({ req })) {
    return {}
  }
  // 不开通，需要弹窗提示
  if (spconfig.order.open == 0) {
    return Promise.reject({ code: -20, msg: '尚未开通会员服务！' })
  }
  // 直接开通，不弹窗
  if (spconfig.order.pop.pop == 0) {
    try {
      yield openOrder({ req })
    } catch (err) {
      // 开会员失败
      return Promise.reject({ code: -21, msg: err })
    }
    // 短信回复开通
    if (spconfig.order.open == 2) {
      return Promise.reject({ code: 15 })
    }
    return {
      order: { code: 20 },
      user: current.user
    }
  }
  // 需要弹窗提示
  return Promise.reject({ code: -20, msg: '尚未开通会员服务！' })
})
