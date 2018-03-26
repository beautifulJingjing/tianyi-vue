/**
 * 活动-获取列表
 * data { 
 *  isweb: 是否取web版内容，1-是，0(默认)-否, 
 *  start: 起始读取记录，默认从0开始, 
 *  records: 读取记录数，-1(默认)时为读取所有记录 
 * }
 * return { 
 * }
 */
const request = require('./request')

module.exports = ({ req, data = {} }) => {
  data.service = 'act_getlist'
  return request({ req, data, cache: true })
}
