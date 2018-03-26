/**
 * Created by shengaozhou on 2016/2/26.
 * 抽奖
 *   lid：活动id;
 *   phone：手机号 *   checkcode（缺省为空）：效验码
 * return { 
 *  code: 结果, 
 *  res_str: 中奖内容, 
 *  valid_count: 可用抽奖次数 ,
 *  msg
 * }
 */

const co = require('co')
const act_lottery = require('../interfaces/act_lottery')
const isOrder = require('../common/isOrder')

module.exports = (req, res, next) => {
  const { lid, phone } = req.body
  
  res.locals.p = co(function * () {
    if (!phone) {
      return Promise.reject('请输入手机号码！')
    }
    if (yield isOrder({ req, data: { phone } })) {
      // 是会员，去抽奖
      return yield act_lottery({ req, data: { lid, phone } })
    }
    return { code: -3, msg: '您还没有抽奖机会，只有彩铃DIY会员才可参与抽奖哦。' }
  })
  next()
}
