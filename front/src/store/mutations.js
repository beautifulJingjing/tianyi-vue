export default {
  // 更改错误弹窗信息
  updateModal(state, data) {
    state.modal = data
  },
  // 更新全局loading状态和内容
  updateLoading(state, data) {
    state.loading = data
  },

  // 更改专题列表
  updateZtList(state, list) {
    state.ztList = list
  },
  // 更新分类列表
  upadateClassifyList(state, list){
    state.classifyList = list
  },
  // 更新最新列表
  updateRecentList(state, list){
    state.recentList = state.recentList.concat(list)
  },
  // 更新最热列表
  updateHotList(state, list){
    state.hotList = state.hotList.concat(list)
  },
  // 更新用户登录状态
  updateLogin(state, data) {
    state.userInfo.isLogin = data
  },
  //更新用户信息
  updateUserInfo(state, data) {
    state.userInfo.msg = data
  },
  // 更新用户退订状态
  updateQuitState(state, data) {
    state.quitState = data
  },
  // 更新登录方式
  updateLoginMode(state, data) {
    state.loginMode = data
  },
  //  更新设铃滑窗状态
  updateSliderState(state, data) {
    state.sliderState = data
  },
  //  更新正在加载中页面显示状态
  setLoadingShow(state, data) {
    state.loadingShow = data
  },
  // 更新当前播放id
  updateCurrPlay(state, data) {
    state.currPlay = data
  },
  // 更新上一个音频播放id
  updateLastCurrPlay(state, data) {
    state.lastCurrPlay = data
  },
  //更新专题或者分类标题
  updatePartTitle(state, data) {
    state.partTitle = data
  },
  //登录并开通会员时返回orderCode
  updateOrderCode(state, data) {
    state.orderCode = data
  },
  //读取验证码下发的号码
  updateTempPhone(state, data) {
    state.tempPhone = data
  }
}
