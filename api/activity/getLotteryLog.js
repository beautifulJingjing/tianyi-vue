/**
 * 活动-获奖列表
 * data { 
 *  lid: string 活动id;
 *  phone: string 手机号码，无手机号码时返回整个活动的中奖列表，有手机号码时返回该号码的抽奖记录;
 *  start: int 起始读取记录，从0开始; 默认0
 *  records: int 读取记录数，设为-1时为读取所有记录; 默认20
 * }
 * return {}
 */

const act_get_lotterylog = require('../interfaces/act_get_lotterylog')

module.exports = (req, res, next) => {
  const data = Object.assign(
    { start: 0, records: 20 },
    req.query
  )
  res.locals.p = act_get_lotterylog({ req, data })
  next()
}
