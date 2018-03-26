/**
 * Created by XUER on 2016-3-6.
 * 退订会员
 */

const co = require('co')
const { checkCode } = require('../common/checkCode')
const unsubOrder = require('../common/unsubOrder')

module.exports = (req, res, next) => {
  const { phone, checkcode } = req.body

  res.locals.p = co(function * () {
    yield checkCode({ req, data: { phone, checkcode } })
    const msg = yield unsubOrder({ req, data: { phone } })

    return {
      user: req.current.user,
      msg
    }
  })
  next()
}
