/**
 * 活动-获奖列表
 * data { 
 *  lid: string 活动id;
 *  phone: string 手机号码，无手机号码时返回整个活动的中奖列表，有手机号码时返回该号码的抽奖记录;
 *  start: int 起始读取记录，从0开始;
 *  records: int 读取记录数，设为-1时为读取所有记录;
 * }
 * return {}
 */
const request = require('./request')

module.exports = ({ req, data = {} }) => {
  data.service = 'act_get_lotterylog'
  return request({ req, data, cache: 5 * 60 })
}
