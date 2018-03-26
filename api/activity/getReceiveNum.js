/**
 * 获取领取礼包的人数
 */

const co = require('co')
const redis = require('../../utils/redis')
const querystring = require('querystring')

module.exports = (req, res, next) => {
  const data = Object.assign(
    { secret: 'getReceiveNum' },
    req.query
  )
  const key = querystring.stringify(data)

  res.locals.p = co(function * () {
    const n = yield redis.getAsync(key)
    const newNum = parseInt(n ? +n + Math.random() * 100 : 38925 + Math.random() * 100)
    redis.set(key, newNum)
    return newNum
  })
  next()
}
