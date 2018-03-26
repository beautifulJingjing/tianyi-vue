/**
 * Created by XUER on 2016-3-6.
 * 开彩铃
 * 只用于普通、短信回复方式开通，验证码方式通过LoginCrbt方法
 * 
 */

const co = require('co')
const utils = require('../../utils')
const openCrbt = require('../common/openCrbt')
const isCrbtOpening = require('../common/isCrbtOpening')
const isOrder = require('../common/isOrder')
const openOrder = require('../common/openOrder')

module.exports = (req, res, next) => {
  const { single } = req.body
  const current = req.current
  const spconfig = current.config

  res.locals.p = co(function * () {
    yield openCrbt({ req })
    if (spconfig.crbt.open == 2) {
      return { code: 14 }
    }
    if (yield isCrbtOpening({ req })) {
      return { code: 31, msg: '彩铃功能开通中，请耐心等待！' }
    }
    //彩铃+DIY合并开通
    if (single == 1 
      || spconfig.ringset.serve != 2
      || spconfig.order.pop.pop != 2
    ) {
      return { code: 1 }
    }
    if (yield isOrder({ req })) {
      return { code: 1, order: { code: 1 }, user: current.user }
    }
    if (utils.isUnicomPhone(current.user.phone)
      || spconfig.order.open != 1
    ) {
      try {
        yield openOrder({ req })
      } catch (err) {
        return { code: 1, order: { code: -21, msg: err } }
      }
      return { code: 1, order: { code: 20 }, user: current.user }
    }
    return { code: 1, order: { code: -24, msg: '不支持的会员开通方式！' } }
  })
  next()
}
