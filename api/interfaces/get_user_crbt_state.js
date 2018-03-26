/**
 * 查询用户运营商彩铃状态
 * data { 
 *  phone: (可缺省)手机号,优先级高于uid, 
 *  uid: 用户ID，无此参数时，phone不能为空, 
 *  isgetgtype: 是否查询号码类型，0-否（默认），1-是 
 * }
 * return {
 *  iscrbt,
 *  isdiy,
 *  phonetype
 *  ...
 * }
 */
const request = require('./request')

module.exports = ({ req, data = {} }) => {
  const { phone, uid } = data
  if (!phone && !uid) {
    return Promise.reject('phone, uid均为空')
  }
  data.service = 'get_user_crbt_state'
  return request({ req, data })
}
