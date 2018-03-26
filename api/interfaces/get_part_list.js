/**
 * 榜单/专题列表
 * data { 
 *  type：类型（支持多选以","分隔）:1-专题,2-榜单,3-分类,4-在线素材;
 *  pid：专题id（此参数不为空时，参数type不起作用），缺省=空;
 *  picwide：图片高度,可缺省;
 *  pichigh：图片宽度,可缺省;
 *  pictype：图片类型，0-普通(缺省)，1-默认，2-ios默认，3-androi默认，4-PC默认；
 *  start：起始读取记录，从0开始，缺省=0;
 *  records：读取记录数，设为-1时为读取所有记录，缺省=-1;
 * }
 * return {}
 */
const request = require('./request')

module.exports = ({ req, data = {} }) => {
  data.service = 'get_part_list'
  return request({ req, data, cache: true })
}
