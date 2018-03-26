/**
 *  获取活动列表
 *  isweb：是否取web版内容，1-是，0(默认)-否;
 *  start：起始读取记录，默认从0开始;
 *  records：读取记录数，-1(默认)时为读取所有记录;
 *  return
 *  list: 结果列表
 *  count：符合记录总数
 */

const act_getlist = require('../interfaces/act_getlist')

module.exports = (req, res, next) => {
  const data = Object.assign(
    { start: 0, records: 10 },
    req.query
  )
  res.locals.p = act_getlist({ req, data })
  next()
}
