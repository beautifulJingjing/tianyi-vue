/**
 * 获取铃音详细
 * data { 
 *  ringid: 铃音id, 
 * }
 * return {}
 */
const request = require('./request')

module.exports = ({ req, data = {} }) => {
  data.service = 'get_ring_info'
  return request({ req, data, cache: true })
}
