/**
 * 榜单/专题内容列表
 * data { 
 *  pid：榜单id（特殊id -1：最新，-2：最热，-3：背景音，-4：DIY素材）;
 *  start：起始读取记录，从0开始，缺省=1;
 *  records：读取记录数，设为-1时为读取所有记录，缺省=-1;
 * }
 * return {}
 */
const request = require('./request')

module.exports = ({ req, data = {} }) => {
  data.service = 'get_ring_list'
  return request({ req, data, cache: true })
}
