var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env,
      __ENV__: '"dev"'
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      locals: {
        spcode: '"02330710401"',
        hmid: '"123"',
        config: JSON.stringify({
          "id": "02440710401",
          "name": "翼铃8月惊喜一夏-6元计费-标准-资费部分标红-广东版二次确认",
          "hotlist": {
            "form": "2",
            "list": [
              {
                "id": "345",
                "title": "",
                "explain": ""
              }
            ]
          },
          "getphone": "2",
          "set": "1",
          "login": {
            "mode": "1",
            "pop": {
              "title": "验证手机号",
              "content": "温馨提示：\n• 下载铃声或更换彩铃，需升级翼铃高级VIP会员，只需<u>6元/月</u>即可免费不限次数的下载更换彩铃和来电铃，所有铃声:0元/首。\n• 已经是高级VIP会员的用户，该操作仅为登录，不会重复升级。\n• 海量高清彩铃需彩铃功能支持（<u>参考资费5元/月</u>），以本地运营商资费为准。（<u>彩铃用户请忽略此项</u>）"
            }
          },
          "ringset": {
            "serve": "2",
            "singleset": {
              "sync": "1",
              "succ": {
                "title": "设置成功",
                "content": "OK，彩铃设置好了，将在24小时内生效，请耐心等待"
              },
              "fail": {
                "title": "设置失败",
                "content": "sorry，彩铃设置失败咯。网络不给力，请稍后再试~"
              }
            },
            "muchset": {
              "sync": "0",
              "succ": {
                "title": "",
                "content": ""
              },
              "fail": {
                "title": "",
                "content": ""
              }
            }
          },
          "downring": {
            "serve": "2"
          },
          "order": {
            "open": "1",
            "mode": "903",
            "sendsms": {
              "isrsms": 0,
              "isqsms": 0,
              "isosms": 0
            },
            "mobile_crack_shunt": "0",
            "shunt": "0",
            "pop": {
              "type": "1",
              "pop": "1",
              "title": "VIP会员",
              "content": "温馨提示：\n•升级翼铃高级VIP会员，即可免费不限次数的下载更换彩铃和来电铃，所有铃声: 0元/首。"
            },
            "again_pop": {
              "pop": "1",
              "title": "温馨提示",
              "content": "翼铃高级VIP会员资费6元/月，是否确认升级？"
            },
            "succ": {
              "title": "温馨提示",
              "content": "恭喜您，已成功升级翼铃高级VIP会员。现在即可享受百万高清彩铃/来电铃，免费不限次任意下载更换等多项超值尊贵特权。"
            },
            "fail": {
              "title": "温馨提示",
              "content": "非常抱歉，我们正在系统升级，您暂时还不能开通高级VIP会员服务，请耐心等待……"
            }
          },
          "crbt": {
            "open": "1",
            "asyncopen": "0",
            "mode": "1",
            "mobile_crack_shunt": "0",
            "pop": {
              "type": "1",
              "pop": "1",
              "title": "彩铃功能",
              "content": "温馨提示：\n•设置彩铃，需要彩铃功能支持。我们检测到您的手机号还未开通彩铃功能。我们将为您开通彩铃功能，并同步完成彩铃设置。\n•您也可以拨打中国电信客服电话10000进行咨询开通，开通后即可设置彩铃。"
            },
            "again_pop": {
              "pop": "1",
              "title": "温馨提示",
              "content": "彩铃功能资费5元/月。是否确认开通？"
            },
            "succ": {
              "title": "",
              "content": ""
            },
            "asyncsucc": {
              "title": "温馨提示",
              "content": "服务正在处理中。。。将24小时内生效，请耐心等待哦。"
            },
            "fail": {
              "title": "温馨提示",
              "content": "sorry~亲爱的用户，彩铃设置失败咯\n设置彩铃，需要彩铃功能支持。由于系统原因，彩铃功能开通失败了。\n请到当地电信营业厅或拨打客服电话10000进行开通。\n开通成功后，即可免费不限次数的下载更换所有彩铃和来电铃咯。"
            }
          },
          "declare": {
            "intro": {
              "content": '<ul class="fz12"><li><em class="icon1"></em><span>壕礼免费抽</span><a href="javascript: void(0)">【去抽奖】</a></li><li class="center"><em class="icon2"></em><span>全站彩铃</span><p>0元/首</p></li><li><em class="icon3"></em><span>爆款铃声</span><p>0元/首</p></li><li><em class="icon3"></em><span>人人有奖</span><p>5元话费</p></li></ul><p class="sm-text fz13">领取VIP特权福利，需成为翼铃高级VIP会员(<u>6元/月</u>)。次月未取消翼铃服务即可获得5元话费，如取消将无法享受以上福利，每个会员仅有一次享受话费福利机会。</p>'
            },
            "remind": {
              "place": "3",
              "content": ""
            },
            "message": {
              "content": "【点击去抽奖】",
              "link": "https://tianyiring.com/m/zt/zt9/?id=02440710401"
            }
          },
          "user_center": {
            "open": "1",
            "explain": {
              "content": "温馨提示：\n•下载铃声或更换彩铃，需升级翼铃高级VIP会员，只需<u>6元/月</u>即可免费不限次数的下载更换彩铃和来电铃，所有铃声: 0元/首。\n•已经是高级VIP会员的用户，该操作仅为登录，不会重复升级。\n•海量高清彩铃需彩铃功能支持（<u>参考资费5元/月</u>），以本地运营商资费为准。（<u>彩铃用户请忽略此项</u>）"
            }
          },
          "lotter": {
            "id": "138",
            "explain": "",
            "top": {
              "week": 0,
              "month": 0
            }
          },
          "ad": {
            "file": "",
            "link": ""
          },
          "attention": {
            "qrcodes": "",
            "explain": ""
          },
          "download_app": {
            "icon": "tianyiring",
            "link": ""
          },
          "contact": "1",
          "ringbox": "1",
          "remark": "翼铃8月惊喜一夏"
        }),
      }
    }),
    new FriendlyErrorsPlugin()
  ]
})
