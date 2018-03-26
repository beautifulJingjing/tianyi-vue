/**
 * Created by XUER on 2016-3-6.
 * 开会员
 * 只用于普通、短信回复方式开通，验证码方式通过LoginOrder方法
 */

const co = require('co')
const openOrder = require('../common/openOrder')
const openCrbt = require('../common/openCrbt')

module.exports = (req, res, next) => {
  const current = req.current
  const spconfig = current.config

  res.locals.p = co(function * () {
    // if (spconfig.order.mode == '903'
    //   && spconfig.login.mode == 1
    //   && spconfig.order.pop.pop == 1
    //   && spconfig.crbt.pop.pop == 1
    // ) {
      yield openOrder({ req })
      return { user: current.user }
    // }
    // //此处理论上是不应该再被调用到了
    // if (yield openCrbt({ req, data: { userphone: current.user.phone, key: '' } })) {
    //   return {
    //     user: current.user,
    //     crbt: { code: 1 },
    //     order: { code: 20 }
    //   }
    // }
    // return Promise.reject('未知')
  })
  next()
}
