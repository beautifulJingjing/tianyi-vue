/**
 * Created by shengaozhou on 2016/2/24.
 *  铃音搜索
 *  key：关键字
 *  type：搜索范围，多选用“,”分隔，-1 所有，2-电信，3-移动，4-联通，6-个推；
 *  start：起始读取记录，默认从0开始;
 *  records：读取记录数，-1(默认)时为读取所有记录;
 */

const search_ring = require('../interfaces/search_ring')

module.exports = (req, res, next) => {
  const data = Object.assign(
    { type: 4, start: 0, records: 10 },
    req.query
  )
  res.locals.p = search_ring({ req, data })
  next()
}
