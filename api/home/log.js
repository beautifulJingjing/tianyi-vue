/**
 * 日志
 */

const co = require('co')
const { setDense } = require('../../utils/dense')

module.exports = (req, res, next) => {
  //爬虫过滤
  if (/Googlebot/i.test(req.headers['user-agent'])) {
    next()
  }
  
  const current = req.current
  const { type, name } = req.body
  res.locals.p = co(function * () {
    let send = ''
    switch (type) {
      case 'visit':
        req.trace.visit()
        break
      case 'event':
        req.trace.event()
        //统计访问密度
        if (/doDown|doSetRing|doSetRings|doFreeGet|doOpenServe/i.test(name)) {
          yield setDense(current.spinfocode)
          send = { config: current.config }
        }
        break
      case 'error':
        req.trace.error()
        break
      default:
        req.trace.other()
    }
    return send
  })
  next()
}
