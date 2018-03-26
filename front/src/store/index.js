import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const state = {
  // 全局弹窗，主要为了公共请求失败提示
  modal: {
    title: '出错啦',
    content: '服务器出错了'
  },
  // 全局loading,
  loading: {
    show : false,
    content : ''
  },

  // 专题列表
  ztList: null,
  // 分类列表
  classifyList: null,
  // 最新列表
  recentList: [],
  //最热列表
  hotList: [],
  // 用户信息
  userInfo: {
    isLogin: false,
    msg: {
      id: '',
      orderendtime: null,
      orderstate: null,
      phone: '',
      setcrbtnum: 0,
      weixinid: '',
    }
  },
  // 是否退订成功 false表示没有退订，true表示退订成功
  quitState: {
    state: false,
    msg: ''
  },
  // 判断登录位置 1-会员中心登录 ，2-设铃登录
  loginMode: 1,
  // 滑窗打开或者关闭 true打开，false关闭 (设铃滑窗)
  sliderState: false,
  // Rings组件正在加载中页面动画
  loadingShow: false,
  //  当前铃音播放id
  currPlay: null,
  //  上一个音频id
  lastCurrPlay: null,
  // 专题或者分类标题
  partTitle: '',
  //登录并开通会员成功
  orderCode: null,

  //验证码下发时的手机号码
  tempPhone: null
}

const getters = {
  isLogin: (state) => {
    return Object.keys(state.userInfo.msg).length === 0 ? false : true
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
})
