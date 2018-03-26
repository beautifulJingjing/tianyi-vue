/**
 * 抽奖
 * data { 
 *  lid: 活动id, 
 *  phone: 手机号码, 
 *  checkout:效验码 (缺省为空) 
 * }
 * return { 
 *  code: 结果, 
 *  res_str: 中奖内容, 
 *  valid_count: 可用抽奖次数 
 * }
 */
const request = require('./request')

module.exports = ({ req, data = {} }) => {
  data.service = 'act_lottery'
  return request({ req, data, special: true })
}
