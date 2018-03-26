/**
 * Created by shengaozhou on 2016/2/26.
 *  查询抽奖机会
 *  lid：活动id;
 *  phone：手机号码;
 */

const co = require('co')
const isOrder = require('../common/isOrder')
const act_lottery_num = require('../interfaces/act_lottery_num')

module.exports = (req, res, next) => {
  const { lid, phone } = req.query

  res.locals.p = co(function * () {
    if (!phone) {
      return Promise.reject('请输入手机号码！')
    }
    if (yield isOrder({ req, data: { phone } })) {
      return yield act_lottery_num({ req, data: { lid, phone } })
    }
    return { code: -3, msg: '您还没有抽奖机会，只有彩铃DIY会员才可参与抽奖哦。' }
  })
  next()
}
