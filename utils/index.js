const crypto = require('crypto')

// 判断手机号
exports.isPhone = phone => {
  return /^1\d{10}$/.test(phone)
}
// 判断移动号码
exports.isMobilePhone = phone => {
  return /^((13[4-9])|147|(15[0|1|2|7|8|9])|178|(18[2|3|4|7|8]))\d{8}$/.test(phone)
}
// 判断联通号码
exports.isUnicomPhone = phone => {
  return /^((13[0-2])|145|(15[5|6])|176|(18[5|6]))\d{8}$/.test(phone)
}
// 判断电信号码
exports.isTelcomPhone = phone => {
  return /^(133|153|173|177|(18[0|1|9]))\d{8}$/.test(phone)
}

// md5
exports.md5 = str => {
  return crypto.createHash('md5').update(str).digest('hex')
}
// sha1
exports.sha1 = str => {
  return crypto.createHash('sha1').update('str').digest('hex')
}
