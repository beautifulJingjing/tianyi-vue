/**
 * Created by XUER on 2016-3-6.
 * 检查会员状态
 */

const co = require('co')
const utils = require('../../utils')
const isOrder = require('../common/isOrder')

module.exports = (req, res, next) => {
  const { phone } = req.query

  res.locals.p = co(function * () {
    if (!utils.isPhone(phone)) {
      return Promise.reject('参数错误！')
    }
    return yield isOrder({ req, data: { phone } })
  })
  next()
}
