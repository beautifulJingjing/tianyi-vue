/**
 * 活动-查询抽奖机会
 * data: {
 *  lid：活动id;
 *  phone：手机号码;
 * },
 * return {
 *  valid_count：可用次数
 *  valid_count2：猜铃后抽奖次数;
 * }
 */
const request = require('./request')

module.exports = ({ req, data = {} }) => {
  data.service = 'act_lottery_num'
  return request({ req, data, special: true })
}
