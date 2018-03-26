/**
 * 意见反馈
 * data { 
 *  content: 反馈内容, 
 *  usercoe: 用户标识 , 
 *  ver: 应用版本号 
 * }
 * return {}
 */
const request = require('./request')

module.exports = ({ req, data = {} }) => {
  data.service = 'feedback'
  return request({ req, data })
}
