/**
 * 意见反馈
 * data { 
 *  key：关键字
 *  type：搜索范围，多选用“,”分隔，2-电信，3-移动，4-联通，6-个推；
 *  start：起始读取记录，默认从0开始;
 *  records：读取记录数，-1(默认)时为读取所有记录;
 * }
 * return {
 *  list: 结果列表
 *  count：符合记录总数
 * }
 */
const request = require('./request')

module.exports = ({ req, data = {} }) => {
  data.service = 'search_ring'
  return request({ req, data, cache: false })
}
