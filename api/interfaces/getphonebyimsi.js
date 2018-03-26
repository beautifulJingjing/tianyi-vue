/**
 * 获取手机号
 * data { 
 *  unikey：识别码，为空时返回结果为unikey
 *  sptype：运营商，0-未知，1-移动，2-电信，3-联通（默认）;
 * }
 * return { phone }
 */
const request = require('./request')

module.exports = ({ req, data = {} }) => {
  data.service = 'getphonebyimsi'
  data.ipstr = req.current.ip.replace(/\./g, '_')
  data.sptype = data.sptype || 3

  return request({ req, data, special: true })
    .then(ret => {
      if (ret.code === 1 || ret.code === 2) {
        return ret.data
      }
      return Promise.reject(ret.msg)
    })
}
