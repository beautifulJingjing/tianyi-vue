<template>
<div id="app">
  <!-- 头部 -->
  <div class="header" v-show="setHeaderShow">
    <div class="name fz16">
      <i v-if="logoShow" class="iconTel"></i>
      <i v-if="logoShow" class="iconTianyi"></i>
      <span v-if="!logoShow" class="fz20">翼铃</span>
      <a v-if="!logoShow" href="http://wap.118100.cn/ca/5789" class="iconAiTing"></a>
    </div>
    <router-link :to="$setLink('recent')" class="main-link clear">
      <i class="siteicon iconfont icon-home1 fl fz30"></i>
    </router-link>
    <div class="other-links">
      <router-link :to="$setLink('search')" class="search fl"><i class="searchicon iconfont icon-search fz30"></i></router-link>
      <router-link @click.native="toUserCenter" :to="userInfo.isLogin ? $setLink('userCenter1') : $setLink('userCenter2')" class="usercenter fl" ><i class="usericon iconfont icon-user fz30"></i></router-link>
    </div>
  </div>
  <div class="vip_phone" v-show="userInfo.isLogin">
    <span v-if="userInfo.msg.orderstate == 2 || userInfo.msg.orderstate == 0">当前手机号：{{userInfo.msg.phone}}（会员）</span>
    <span v-if="userInfo.msg.orderstate == 3">当前手机号：{{userInfo.msg.phone}}（月底到期）</span>
    <span v-if="userInfo.msg.orderstate == 4">当前手机号：{{userInfo.msg.phone}}（非会员）</span>
  </div>
  <!-- 主体 -->
  <div class="main">
    <router-view></router-view>
  </div>
  <!-- 尾部 -->
  <div class="footer">
    <div class="site-info-wrap">
      <div class="info-section clear">
        <div class="contact fz12 fl">
          <p><span>客服电话：</span>400-1515-742</p>
          <p><span>客服邮箱：</span>2364656920@qq.com</p>
          <p><span>客服QQ：</span>2364656920</p>
        </div>
        <router-link :to="$setLink('feedback')" class="feedback fr">
          <i class="feedbackicon iconfont icon-message fz14"></i><span>意见反馈</span>
        </router-link>
      </div>
      <div class="info-section ws-section clear">
        <img src="/static/img/ws_logo.png" class="ws-logo fl">
        <div class="ws-info fz10 fl">
          <p><b class="fz12">微商铃</b>－您的专属商务彩铃顾问</p>
          <p style="color: #bb120b;">让客户听见你的声音</p>
        </div>
        <a href="http://www.ringbox.com.cn/" target="_blank" class="ws-link fr">了解更多</a>
      </div>
    </div>
    <div class="copyright fz12">
      <p>
        <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010602000783" target="_blank">
          <img src="/static/img/beian.png"><span>浙公网安备 33010602000783号</span>
        </a>
      </p>
      <p>浙ICP备 B2-20100005   浙网文[2016]4868-297号</p>
    </div>
  </div>
  <!-- 接口错误提示 -->
  <Modal class="globalError" v-if="modalShow" :title="modal.title" @close="_closeModal" @confirm="_closeModal"><div v-html="modal.content"></div></Modal>
  <!--全局loading-->
  <loading v-show="loading.show" :title="loading.content"></loading>
</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'app',
  data() {
    return {
      modalShow: false,
      setHeaderShow: true,
      logoShow: true
    }
  },
  computed: {
    ...mapState(['modal', 'userInfo' ,'loading'])
  },
  created() {
    this.checkLogin()
    this.$audio.onended = () => {
      this.updateCurrPlay(null)
    }
    this.$audio.onloadeddata = () => {
      this.updateLoading({show: false,content: ''})
    }
    this.$router.beforeEach((to,from,next) => {
      next(
        this.$audio.pause(),
        this.updateCurrPlay(null)
      )
    })
  },
  methods: {
    ...mapMutations(['updateLogin', 'updateUserInfo','updateCurrPlay','updateLoading','updateTempPhone']),
    toUserCenter() {
      this.$log({name:'alertLoginOrderUserCenter'})
    },
    _showModal() {
      this.modalShow = true
    },
    _closeModal() {
      this.modalShow = false
    },
    checkLogin() {
      this.$axios({
        url: '/comkey',
        method: 'get',
        params: {
          a: this.$utils.query('a')
        }
      })
        .then( res => {
          window.COMKEYFINISH = true
          this.updateUserInfo(res)
          if(this.userInfo.msg.id == undefined || this.userInfo.msg.id == null){
            this.updateLogin(false)
            this.updateUserInfo({})
          } else if(this.userInfo.msg.id == 0) {
            this.updateLogin(false)
            this.updateTempPhone(res.temp_phone)
          }  else {
            this.updateLogin(true)
          }
        })
    }
  },
  watch: {
    modal(next) {
      this._showModal()
    },
    $route() {
      const path = this.$route.path.substring(0,6)
      if(path == '/m/zt/') {
        this.setHeaderShow = false
      } else {
        this.setHeaderShow = true
      }
      //如果是活动18（全民尖叫）,去掉电信logo
      this.$route.name == "pop18" || "pop19" ? this.logoShow = false : this.logoShow = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import './assets/css/variables';

.header {
  $h: px2rem(96);
  $p: px2rem(16);
  position: relative;
  height: $h;
  border-bottom: 1px solid $c-bd;
  background-color: #fff;
  text-align: center;
  // padding: px2rem(16) px2rem(16) 0;
  .name {
    position: absolute;
    left: 0; top: 0; right: 0; bottom: 0;
    line-height: $h;
    text-align: center;
    z-index: 0;
    border-bottom: 1px solid $c-bb;
    i {
      width: px2rem(72);
      height: px2rem(72);
      margin-top: px2rem(10);
    }
    .iconTel {
      background: url(/static/img/icon_tel.png) no-repeat;
      background-size: 100%;
    }
    .iconTianyi {
      background: url(/static/img/icon_tianyiring.png) no-repeat;
      background-size: 100%;
    }
    .iconAiTing {
      width: px2rem(85);
      height: px2rem(85);
      background: url(/static/img/icon_aiting.gif) no-repeat;
      background-size: 100%;
      position: absolute;
      top: px2rem(6);
      right: px2rem(143);
      color: #970009;
    }
  }
  .main-link, .other-links {
    @extend %centerV;
  }
  .main-link {
    left: $p;
  }
  .other-links {
    right: $p;
  }
  .siteicon {
    margin-right: px2rem(8);
  }
  .main-link-name {
    margin-top: px2rem(4);
  }
  .search {
    margin-right: px2rem(20);
  }
  .usercenter {

  }
}
.vip_phone{
  line-height: px2rem(60);
  padding-left: px2rem(20);
  border-bottom: px2rem(1) solid $c-bb;
}
.footer {
  border-top: 1px solid $c-bd;
  .site-info-wrap {
    background-color: #fff;
    padding: 0 px2rem(25);
    border-bottom: 1px solid $c-bd;
    .info-section {
      padding: px2rem(24) 0;
      border-top: 1px solid $c-bd;
      &:first-child {
        border-top: none;
      }
    }
    .ws-section {
      position: relative;
    }
    .contact {
      p {
        color: #333;
        line-height: px2rem(26);
      }
      span {
        color: #979797;
      }
    }
    %btn {
      display: block;
      width: px2rem(180);
      text-align: center;
      $h: 60;
      line-height: px2rem($h);
      border-radius: px2rem($h / 2);
    }
    .feedback {
      @extend %btn;
      color: $c-red;
      border: 1px solid $c-red;
      margin-top: px2rem(4);
    }
    .feedbackicon {
      margin-right: px2rem(10);
      color: $c-red;
    }
    .ws-logo {
      width: px2rem(96);
    }
    .ws-info {
      @extend %centerV;
      left: px2rem(100);
      line-height: 1.5;
    }
    .ws-link {
      @extend %btn;
      color: #fff;
      background: $c-red;
      margin-top: px2rem(18);
    }
  }
  .copyright {
    padding: px2rem(30) 0 px2rem(20);
    text-align: center;
    line-height: 2;
    img, span {
      vertical-align: middle;
    }
    img {
      width: px2rem(40);
    }
  }
}
.globalError {
  z-index: 100;
}
</style>
