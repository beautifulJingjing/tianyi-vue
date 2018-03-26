/**
 * Created by XUER on 2016-3-6.
 * 检查会员、彩铃业务状态
 * 
 * data {
 *  phone
 * }
 * return {
 *  code: 1会员彩铃 -20非会员 -30非彩铃
 * }
 */

const co = require('co')
const utils = require('../../utils')
const isCrbt = require('../common/isCrbt')
const isOrder = require('../common/isOrder')

module.exports = (req, res, next) => {
  const { phone } = req.query

  res.locals.p = co(function * () {
    if (!utils.isPhone(phone)) {
      return Promise.reject('参数错误！')
    }
    const spconfig = req.current.config
    if (spconfig.ringset.serve == 2) {
      if (yield isCrbt({ req, data: { phone } })) {
        if (yield isOrder({ req, data: { phone } })) {
          return { code: 1 }
        }
        return { code: -20 }
      }
      return { code: -30 }
    }
    if (yield isOrder({ req, data: { phone } })) {
      if (yield isCrbt({ req, data: { phone } })) {
        return { code: 1 }
      }
      return { code: -30 }
    }
    return { code: -20 }
  })
  next()
}
