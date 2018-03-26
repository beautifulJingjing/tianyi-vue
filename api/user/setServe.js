/**
 * Created by XUER on 2016-3-6.
 * 会员、彩铃服务设置
 */

const co = require('co')
const openOrderCheck = require('../common/openOrderCheck')
const openCrbtCheck = require('../common/openCrbtCheck')

module.exports = (req, res, next) => {
  const spconfig = req.current.config

  res.locals.p = co(function * () {
    //彩铃业务优先
    if (spconfig.ringset.serve == 2) {
      try {
        yield openCrbtCheck({ req })
      } catch (err) {
        return err
      }
      let orderRet = null
      try {
        orderRet = yield openOrderCheck({ req })
      } catch (err) {
        return err
      }
      return Object.assign({ code: 1 }, orderRet)
    }
    //DIY业务优先
    let orderRet = null
    try {
      orderRet = yield openOrderCheck({ req })
    } catch (err) {
      return err
    }
    return Object.assign({ code: 1 }, orderRet)
  })
  next()
}
