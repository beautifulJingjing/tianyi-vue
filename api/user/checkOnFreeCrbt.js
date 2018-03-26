/**
 * Created by XUER on 2016-3-6.
 * 检查能否参加0元彩铃
 */

const co = require('co')
const utils = require('../../utils')
const isCrbtFreeSupport = require('../common/isCrbtFreeSupport')

module.exports = (req, res, next) => {
  const { phone } = req.query
  res.locals.p = co(function * () {
    if (!utils.isPhone(phone)) {
      return Promise.reject('参数错误！')
    }
    return yield isCrbtFreeSupport({ req, data: { phone } })
  })
  next()
}
