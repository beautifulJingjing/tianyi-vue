/**
 * Created by shengaozhou on 2016/2/24.
 *  意见反馈
 *  content：反馈内容
 *  user：用户标识
 *  ver：应用版本号
 */

const feedback = require('../interfaces/feedback')

module.exports = (req, res, next) => {
  const data = req.body
  
  res.locals.p = feedback({ req, data })
  next()
}
