/**
 * Created by LXP on 2016/3/3.
 * 获取验证码
 * data {
 *  type // ??
 *  dir // ??
 *  phone
 * }
 */

const co = require('co')
const openOrder = require('../common/openOrder')
const openCrbt = require('../common/openCrbt')
const { getCode } = require('../common/checkCode')

module.exports = (req, res, next) => {
  req.session.isclick = true
  const { phone, dir = null, type } = req.body
  const spconfig = req.current.config

  res.locals.p = co(function * () {
    if (!phone) {
      return Promise.reject('请输入您的手机号码。')
    }

    if (type != 2 && spconfig.login.mode == 2 && spconfig.order.open == 3) {
      yield openOrder({ req, data: { userphone: phone, key: -1 } })
      return true
    } else if (type != 2 && spconfig.login.mode == 3 && (spconfig.crbt.open == 3 || spconfig.order.mode == 903)) {
      //彩铃验证码开通或是登录开彩铃且是铃音盒业务
      yield openCrbt({ req, data: { userphone: phone, key: -1 } })
      return true
    }
    yield getCode({ req, data: { phone, type } })
    return true
  })

  next()
}
