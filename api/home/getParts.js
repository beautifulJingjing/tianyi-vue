/**
 * 榜单/专题列表
 * type：类型（支持多选以","分隔）:1-专题,2-榜单,3-分类,4-在线素材;
 * pid：专题id（此参数不为空时，参数type不起作用），缺省=空;
 * picwide：图片高度,可缺省; picwide
 * pichigh：图片宽度,可缺省; pichigh
 * start：起始读取记录，从0开始，缺省=0;
 * records：读取记录数，设为-1时为读取所有记录，缺省=-1;
 */

const get_part_list = require('../interfaces/get_part_list')

module.exports = (req, res, next) => {
  const data = Object.assign(
    { start: 0, records: 20 },
    req.query
  )
  res.locals.p = get_part_list({ req, data })
  next()
}
