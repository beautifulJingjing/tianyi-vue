/**
 * 榜单/专题内容列表
 */

const get_ring_list = require('../interfaces/get_ring_list')

module.exports = (req, res, next) => {
  const data = Object.assign(
    { start: 0, records: 20 },
    req.query
  )
  res.locals.p = get_ring_list({ req, data })
  next()
}
