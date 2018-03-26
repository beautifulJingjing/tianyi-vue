/**
 * Created by XUER on 2016-3-6.
 * 检查彩铃状态
 * query {
 *  phone
 * }
 * return { code: 1是彩铃 31正在开通 0未开通 }
 */

const co = require('co')
const utils = require('../../utils')
const isCrbt = require('../common/isCrbt')
const isCrbtOpening = require('../common/isCrbtOpening')

module.exports = (req, res, next) => {
  const { phone } = req.query

  res.locals.p = co(function * () {
    if (!utils.isPhone(phone)) {
      return Promise.reject('参数错误！')
    }
    if (yield isCrbt({ req, data: { phone } })) {
      return { code: 1 }
    }
    if (yield isCrbtOpening({ req, data: { phone } })) {
      return { code: 31 }
    }
    return { code: 0 }
  })
  next()
}
