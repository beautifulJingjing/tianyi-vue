/**
 * 热门搜索铃音
 * data { 
 *  records：读取记录数，-1(默认)时为读取所有记录;
 * }
 * return {
 *  list: 结果列表
 *  count：符合记录总数
 * }
 */
const request = require('./request')

module.exports = ({ req, data = {} }) => {
  data.service = 'get_recommend'
  data.position = '2'
  return request({ req, data, cache: true })
}
