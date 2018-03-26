/**
 * Created by shengaozhou on 2016/2/24.
 *  热门搜索铃音
 *  records：读取记录数，-1(默认)时为读取所有记录;
 *  count：返回值，符合记录总数
 */

const get_recommend = require('../interfaces/get_recommend')

module.exports = (req, res, next) => {
  const data = Object.assign(
    { start: 0, records: 10 },
    req.query
  )
  res.locals.p = get_recommend({ req, data })
  next()
}
