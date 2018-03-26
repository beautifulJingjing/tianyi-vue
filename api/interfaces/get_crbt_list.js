/**
 * 获取个人铃音库列表
 * data { 
 *  type：类型（1 查询铃音设置库数据 2 查询运营商数据，并更新铃音设置库数据）;
 *  start：起始读取记录，从0开始，缺省=1;
 *  records：读取记录数，设为-1时为读取所有记录，缺省=-1;
 *  uid:记录用户ID；
 *  phone:用户号码 可缺省；
 * }
 * return {}
 */
const request = require('./request')

module.exports = ({ req, data = {} }) => {
  data.service = 'get_crbt_list'
  return request({ req, data })
}
