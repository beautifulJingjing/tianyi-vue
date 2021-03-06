/**
 * Created by LXP on 2016/3/4.
 * 登录
 * switch (config.order.mode) {
 *  5: 无免 loginOrder
 *  903 && login.mode != 1: 电信铃音盒 loginCrbt
 * }
 * return {
 *  type: 1普通登录 2登录开会员 3登录开彩铃,
 *  user: 用户信息,
 *  order: { code: 1已开通 20开通成功 -21开通失败 -24不支持的开通方式 },
 *  crbt: { code: 1已开通 31开通中 30开通成功 -31开通失败 -33该手机号暂不能参加 -34不支持的开通方式 }
 * }
 */

const co = require('co')
const utils = require('../../utils')
const { checkCode } = require('../common/checkCode')
const login = require('../common/login')
const openOrder = require('../common/openOrder')
const isCrbt = require('../common/isCrbt')
const isCrbtOpening = require('../common/isCrbtOpening')
const openCrbt = require('../common/openCrbt')
const isOrder = require('../common/isOrder')
const isCrbtFreeSupport = require('../common/isCrbtFreeSupport')

module.exports = (req, res, next) => {
  const { phone, checkcode, single = false } = req.body // single暂时无用
  const current = req.current
  const spconfig = current.config

  res.locals.p = co(function * () {
    if (!utils.isPhone(phone)) {
      return Promise.reject('请输入一个有效的手机号！')
    }
    if (!checkcode) {
      return Promise.reject('请输入验证码！')
    }
    
    // 登录并开会员
    if (spconfig.order.mode == 5) {
      const result = { type: 2 }
      // 验证码开通
      if (spconfig.order.open == 3) {
        const _isOrder = yield openOrder({ req, data: { userphone: phone, key: checkcode } })
        result.user = current.user
        result.order = { code: _isOrder ? 1 : 20 }
        return result
      }
      // 正常开通
      yield checkCode({ req, data: { phone, checkcode } })
      yield login({ req, data: { userinfo: phone, type: 2 } })
      result.user = current.user
      if (yield isOrder({ req })) {
        result.order = { code: 1 }
      } else {
        try {
          yield openOrder({ req })
        } catch (err) {
          result.order = { code: -21, msg: err }
          return result
        }
        result.order = { code: 20 }
      }
      //验证登录后的开彩铃
      //只开会员、彩铃设置不是先开DIY再开彩铃、彩铃开通方式为非正常开通、彩铃开通弹窗设置不是DIY+彩铃同步开通弹窗时，不开通彩铃功能，输出结果
      if (single
        || spconfig.ringset.serve != 1
        || spconfig.crbt.open != 1
        || spconfig.crbt.pop.pop != 2
      ) {
        // 不对result做处理
      } else {
        if (yield isCrbt({ req })) {
          result.crbt = { code: 1 }
        } else {
          if (yield isCrbtOpening({ req })) {
            result.crbt = { code: 31, msg: '彩铃功能开通中，请耐心等待！' }
          } else if (utils.isUnicomPhone(req.current.user.phone)) {
            //DIY+彩铃同步正常开通只支持联通号
            try {
              yield openCrbt({ req })
            } catch (err) {
              result.crbt = {
                code: -31,
                msg: err.message
              }
            }
            if (yield isCrbtOpening({ req })) {
              result.crbt = { code: 31, msg: '彩铃功能开通中，请耐心等待！' }
            } else {
              result.crbt = { code: 30 }
            }
          } else {
            result.crbt = {
              code: -34,
              msg: '不支持的彩铃开通方式！'
            }
          }
        }
      }
      return result
    }
    // 登录并开彩铃
    if (spconfig.order.mode == 903 && spconfig.login.mode != 1) {
      const result = { type: 3 }
      yield checkCode({ req, data: { phone, checkcode } })
      if (!current.user || current.user.orderstate == 4) {
        // 验证码开通
        // 用户信息写session
        current.user = {
          id: 1,
          phone,
          weixinid: '',
          orderstate: 4,
          orderendtime: '',
          setcrbtnum: 0
        }
        const _isCrbt = yield openCrbt({ req, data: { userphone: phone, key: '' } })
        result.user = current.user
        if (_isCrbt) {
          result.crbt = { code: 1 }
          /////// yield _openOrder()
        } else {
          if (yield isCrbtOpening({ req })) {
            result.crbt = {
              code: 31,
              msg: '彩铃功能开通中，请耐心等待！'
            }
            return result
          }
          result.crbt = { code: 30 }
          /////// yield _openOrder()
        }
      } else {
        // 正常开通
        // 登录
        yield login({ req, data: { userinfo: phone, type: 2 } })
        result.user = current.user
        //0元彩铃且不支持开通
        if (spconfig.crbt.mode == 2 && !(yield isCrbtFreeSupport({ req }))) {
          //不能开通0元彩铃
          result.crbt = {
            code: -33,
            msg: '非常抱歉，您的手机号暂时不能参加本次活动！'
          }
          return result
        }
        // _openCrbt
        if (yield isCrbt({ req })) {
          result.crbt = { code: 1 }
          /////// yield _openOrder()
        } else if (yield isCrbtOpening()) {
          result.crbt = { code: 31, msg: '彩铃功能开通中，请耐心等待！' }
          return result
        } else {
          try {
            yield openCrbt({ req })
          } catch (err) {
            result.crbt = { code: -31, msg: err }
            return result
          }
          if (yield isCrbtOpening({ req })) {
            result.crbt = { code: 31, msg: '彩铃功能开通中，请耐心等待！' }
            return result
          }
          result.crbt = { code: 30 }
          /////// yield _openOrder()
        }
      }
      /////// _openOrder
      //验证登录后的开DIY
      //只开彩铃、彩铃设置不是先开彩铃再开DIY、DIY开通方式不是正常开通、DIY开通弹窗设置不是DIY+彩铃同步开通弹窗时，电信铃音盒订购，不开通DIY功能，输出结果
      if (single
        || spconfig.ringset.serve != 2
        || spconfig.order.open != 1
        || spconfig.order.pop.pop != 2
        // || spconfig.order.mode == 903
      ) {
        // 不做处理
      } else {
        if (yield isOrder({ req })) {
          result.order = { code: 1 }
        } else if (utils.isUnicomPhone(current.user.phone)) {
          //DIY+彩铃同步正常开通只支持联通号
          try {
            yield openOrder({ req })
          } catch (err) {
            result.order = { code: -21, msg: err.message }
            return result
          }
          result.order = { code: 20 }
          result.user = current.user
        } else {
          result.order = { code: -24, msg: '不支持的会员开通方式！' }
        }
      }
      return result
    }
    // 普通登录
    yield checkCode({ req, data: { phone, checkcode } })
    yield login({ req, data: { userinfo: phone.replace(/^(\\+)?(86)?/, ''), type: 2 } })
    return {
      type: 1,
      user: current.user
    }
  })

  next()
}
