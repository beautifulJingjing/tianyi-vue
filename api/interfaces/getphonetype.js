/**
 * 获取4G状态
 * data {}
 * return {}
 */
const request = require('./request')

module.exports = ({ req, data = {} }) => {
  data.service = 'getphonetype'
  return request({ req, data })
}
