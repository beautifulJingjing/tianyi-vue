/**
 * 获取铃音文件地址列表
 * data { 
 *  ringid：铃音id;
 *  source：铃音来源(缺省=1)：1-栏目列表，2-个人彩铃列表（此类型下只有wav文件），3-作品列表，4-无意义，5-个人DIY列表;
 *  type：文件类型(缺省=1)：1-mp3，2-aif，3-m4r，5-wav;
 *  downtype：下载文件类型，缺省与type相同;
 *  stype：获取地址类型(缺省=0)：0-请求参数ringid的播放地址和计费地址，1-请求附加9天歌曲的计费地址;
 *  rphone：下发计费链接使用的号码，缺省为空时，使用预制号码表;
 *  only：1-只下发播放地址，缺省为空
 * }
 * return {}
 */
const request = require('./request')

module.exports = ({ req, data = {} }) => {
  data.service = 'get_fileurllist'
  data.source = data.source || 1
  data.type = data.type || 1
  return request({ req, data })
    .then(ret => ret.list)
}
