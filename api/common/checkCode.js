/**
 * Created by LXP on 2016/3/3.
 * 短信验证
 */

const co = require('co')

// 手机号
function _phone(req, val) {
  if (val !== undefined) {
    req.session.mobileInput = val
  } else {
    return req.session.mobileInput
  }
}

// 验证码
function _code(req, val) {
  if (val !== undefined) {
    req.session.codeInput = val
  } else {
    return req.session.codeInput
  }
}

// 清除
function _clear(req) {
  _phone(req, null)
  _code(req, null)
}

// 有无发送验证码
function _isSend(req) {
  return _phone(req) && _code(req)
}

/**
 * 获取短信验证码,部分用途无返回
 * option={
 *   req: 客户端请求对象,
 *   data: {
 *     phone:手机号
 *     type(可缺省):用途，0(默认)-绑定手机;1-订购;2-退订;3-预付费;4-集团炫铃;5-母亲节活动
 *   },
 *   callback(boolean): 结果回调方法
 *   error(Error):有错误触发，缺省时触发callback
 */
const send_vcode = require('../interfaces/send_vcode')

exports.getCode = ({ req, data = {} }) => {
  const { phone, type } = data

  return co(function * () {
    if (!phone) {
      return Promise.reject('参数错误')
    }
    // 1分钟内不重复发送短信
    const lastSendTime = req.session[`SEND_VCODE_${phone}`]
    if (+new Date() - lastSendTime < 60000) {
      return true
    }
    const retCode = yield send_vcode({ req, data: { mobile: phone, type: type || '' } })
    req.session[`SEND_VCODE_${phone}`] = +new Date()
    _phone(req, phone)
    _code(req, retCode)
    //验证码日志输出
    console.info(phone + ' is check code ' + retCode)
    return true
  })
}

/**
 * 验证码校验
 * option={
 *   req: 客户端请求对象,
 *   data: {
 *     phone:手机号
 *     checkcode:验证码
 *   },
 *   callback(boolean): 结果回调方法
 *   error(Error):有错误触发，缺省时触发callback
 */
exports.checkCode = ({ req, data = {} }) => {
  const { phone, checkcode } = data
  if (!phone || !checkcode) {
    return Promise.reject('请输入手机号和验证码！')
  }
  if (!_isSend(req)) {
    return Promise.reject('请获取验证码！')
  }
  if (_phone(req) != phone || _code(req) != checkcode) {
    return Promise.reject('手机号与验证码不匹配！')
  }
  _clear(req)
  return Promise.resolve(true)
}
