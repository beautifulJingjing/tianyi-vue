<template>
<div class="pop">
  <div class="ban">
    <img src="../../../static/img/20/ban.png" alt="">
  </div>
  <div class="containerBox">
    <div class="context fz14" id="con">
      <ul class="fz12">
        <li><em class="icon1"></em><span>壕礼免费抽</span><a href="javascript: void(0)">【去抽奖】</a></li>
        <li class="center"><em class="icon2"></em><span>全站彩铃</span><p>0元/首</p></li>
        <li><em class="icon3"></em><span>爆款铃声</span><p>0元/首</p></li>
        <li><em class="icon3"></em><span>人人有奖</span><p>5元话费</p></li>
      </ul>
      <p class="sm-text fz13">领取VIP特权福利，需成为翼铃高级VIP会员(<u>6元/月</u>)。后续还有更多会员专享福利，敬请期待。如取消翼铃服务，将无法享受以上福利哦。</p>
    </div>
    <div class="getBtn">
      <img src="../../../static/img/20/btn.gif" @click="receiveBtn" alt="">
      <p class="fz12">已有<span>{{getReceiveNum}}</span>人领取</p>
    </div>
  </div>
  <div class="ringList">
    <div class="ringTit">
      <img src="../../../static/img/20/ring_tit.png" alt="">
    </div>
    <div class="allRing">
      <Rings :lists="ringList" :data="{vip: '3'}" :styles="{
        imgPlay: '../../static/img/20/play.png',
        imgPause: '../../static/img/20/pause.png',
        imgSetRing : '../../static/img/20/rings.png',
        imgDownRimg : '../../static/img/20/download.png',
        bgc: 'background: #fbfbfb'}">
      </Rings>
      <div class="btnGetMore" @click="getMore">
        <span class="fz16">加载更多</span>
        <p class="fz15">小贴士：如手机不支持振铃下载，请通过pc浏览器（chrome）下载后同步到手机</p>
      </div>
    </div>
  </div>
  <slider v-show="popSliderShow" :title="sliderTit" @close="close">
    <div v-if="!isLogin || resCode == -10001" class="toLogin">
      <Login :state="{isLogin: 2}" @loginCallBack="loginCallBack"></Login>
      <div class="context fz14">
        <span v-html="loginCon"></span>
      </div>
    </div>
    <div v-if="loginCallBackMsg.setLoginMsgShow" class="logigMsg">
      <img src="../../../static/img/icon-success.png" alt="">
      <p v-if="orderCode !== null &&orderCode === 20">{{loginCallBackMsg.text}}</p>
      <p v-if="orderCode !== null && orderCode === 1">您已经是VIP会员咯，不能重复参加活动哦！</p>
      <p v-if="orderCode === null && userInfo.msg.orderstate !== 4">您已经是VIP会员咯，不能重复参加活动哦！</p>
      <span @click="getLotter">{{loginCallBackMsg.link}}</span>
      <button @click="close">我知道了~</button>
    </div>
  </slider>
  <Open v-if="openShow" @_closeSlider="closeSlider" :code="resCode" @closeOpen="closeSlider"></Open>
  <div class="floatLayer" :style="{opacity: styleOpacity,top: styleOpacity > 0.1 ? '0px' : ''}" @click="receiveBtn">
    <img src="../../../static/img/20/btn.gif" alt="">
  </div>
</div>
</template>

<script>
  import { mapGetters, mapState , mapMutations } from 'vuex'
  import store from '../../store'
  import Login from '../../components/Login.vue'
  import WarmPrompt from '../../components/WarmPrompt.vue'
  import Rings from '../../components/Rings.vue'
  import Open from '../../components/Open.vue'

export default {
  name: 'pop1',
  components: { Login , WarmPrompt ,Rings, Open},
  data() {
    return {
      getReceiveNum: '',
      loginCon: window.spconfig.login.pop.content.replace(/[\r\n]/g,'<br>'), //未登录弹出登录之后下边的提示信息，需读取配置
      sliderTit: '温馨提示',
      ringList: [],
      start: 0,
      resCode: null,
      noticeCon: window.spconfig.declare.intro.content,
      fontSize: document.getElementsByTagName('html')[0].style.fontSize,
      styleOpacity: 0,
      openShow: false,
      popSliderShow: false,
      loginCallBackMsg: {
        setLoginMsgShow: false,
        text: window.spconfig.order.succ.content,
        link: window.spconfig.declare.message.content
      }
    }
  },
  computed: {
    ...mapState(['userInfo','orderCode']),
    ...mapGetters(['isLogin'])
  },
  mounted() {
    this.getRingList(0)
    this.$axios({
      url: '/getReceiveNum',
      method: 'get',
      params: {}
    })
      .then(res => {
        this.getReceiveNum = res
      })
    window.addEventListener('scroll',this.scrollAnimate)
    document.getElementById('con').innerHTML = this.noticeCon
    document.getElementById('con').children[0].firstChild.lastChild.href = window.spconfig.declare.message.link
  },
  methods: {
    ...mapMutations(['updateLoading','updateUserInfo']),
    receiveBtn() {
      this.updateLoading({show: true,content: '正在加载中...'})
      this.$axios({
        url: '/setServe',
        method: 'post',
        data: {}
      })
        .then(res => {
          this.updateLoading({show: false, content: ''})
          this.resCode = res.code
          if(res.code === -10001) {
            //没有登录去登录
            this.sliderTit = window.spconfig.login.pop.title
            this.popSliderShow = true
            this.updateUserInfo({})
            switch(window.spconfig.login.mode) {
              case '1':
                this.$log({
                  name: 'alertLogin'
                })
                break;
              case '2':
                this.$log({
                  name: 'alertLoginOrder'
                }) 
                break;
              case '3': 
                this.$log({
                  name: 'alertLoginCrbt'
                })
                break;  
            }
          } else if(res.code === 1 && res.order === undefined) {
            //已经是会员,返回信息中没有order,弹窗提示
              store.commit('updateModal',{title:'温馨提示',content: '您已经是VIP会员咯，不能重复参加活动哦！'})
          } else {
            this.openShow = true
          }
        })
      this.$log({
        name: 'doOpenServe'
      })
    },
    getRingList(start) {
      this.updateLoading({show: true,content: '正在加载中...'})
      this.$axios({
        url: '/getRingList',
        method: 'get',
        params: {
          pid: window.spconfig.hotlist.list[0].id,
          start: start,
          records: 10
        }
      })
        .then(res => {
          this.updateLoading({show: false,content: ''})
          this.ringList = this.ringList.concat(res.list)
        })
    },
    getMore() {
      this.start += 10
      this.getRingList(this.start)
    },
    close() {
      this.popSliderShow = false
    },
    scrollAnimate() {
      const scrollTop = document.body.scrollTop
      const fontSize = document.getElementsByTagName('html')[0].style.fontSize
      if(scrollTop > parseInt(fontSize)*15) {
        this.styleOpacity = 1
      } else {
        this.styleOpacity = 0
      }
    },
    loginCallBack() {
      this.resCode = null
      if(this.orderCode&&this.orderCode == 20 || this.orderCode&&this.orderCode == 1 || this.orderCode === null && this.userInfo.msg.orderstate !== 4 ) {
        this.popSliderShow = true
        this.loginCallBackMsg.setLoginMsgShow = true
      } else if(this.userInfo.msg.orderstate === 4) {
        this.openShow = true
        this.popSliderShow = false
      }
    },
    closeSlider() {
      this.openShow = false
    },
    getLotter() {
      location.href = window.spconfig.declare.message.link
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/css/variables';
.pop {
  background: #ffc6b7;
  padding-bottom: px2rem(40);
  .ban {
    img {
      width: 100%;
    }
  }
  .containerBox {
    width: 94.6%;
    margin: px2rem(-10) auto 0;
    background: #ff8c5c;
    border-radius: 0 0 px2rem(20) px2rem(20);
    padding: px2rem(10) px2rem(17) px2rem(135);
    font-size: 0;
    position: relative;
    .context {
      background: #ffffff;
      padding: px2rem(20) px2rem(7) px2rem(160);
      border-radius: px2rem(30);
      position: relative;
      ul {
        display: flex;
        li {
          flex: 1;
          line-height: px2rem(40);
          color: #1c1908;
          position: relative;
          margin: 0 px2rem(7);
          background: #ffefe8;
          border-radius: px2rem(15);
          box-shadow: 0 px2rem(5) px2rem(5) #ffdccf;
          padding-bottom: px2rem(10);
          text-align: center;
          a {
            display: block;
            color: #f56957;
            text-decoration: none;
            line-height: px2rem(30);
            margin-top: px2rem(-8);
          }
          span {
            color: #c4540a;
            font-weight: 600;
          }
          em {
            width: px2rem(115);
            height: px2rem(73);
            margin-top: px2rem(10);
          }
          .icon1 {
            background: url('../../../static/img/20/icon1.png') no-repeat;
            background-size: 100%;
          }
          .icon2 {
            background: url('../../../static/img/20/icon2.png') no-repeat;
            background-size: 100%;
          }
          .icon3 {
            background: url('../../../static/img/20/icon3.png') no-repeat;
            background-size: 100%;
          }
          .icon4 {
            background: url('../../../static/img/20/icon4.png') no-repeat;
            background-size: 100%;
          }
          p {
            line-height: px2rem(30);
            color: #f56957;
            margin-top: px2rem(-8);
          }
        }
      }
      .sm-text {
        color: #c4540a;
        line-height: px2rem(32);
        position: absolute;
        bottom: px2rem(-115);
        u{
          color: #fcc276;
          text-decoration: none;
        }
      }
    }
  .getBtn {
    width: 73%;
    left: 13.5%;
    position: absolute;
    top: px2rem(230);
    img {
      width: 100%;
    }
    p {
      margin-top: px2rem(-15);
      color: #c4540a;
      text-align: center;
      width: 100%;
    }
  }
  }
  .ringList {
    margin-top: px2rem(60);
    position: relative;
    .ringTit{
      padding-bottom: px2rem(20);
      img {
        width: 100%;
      }
    }
    .allRing {
      background: #ffffff;
      padding-top: px2rem(10);
      width: 90%;
      margin: 0 auto;
      border-radius: px2rem(20);
      .btnGetMore {
        text-align: center;
        span {
          height: px2rem(100);
          line-height: px2rem(100);
          background: url(../../../static/img/icon-more.png) left center no-repeat;
          padding-left: px2rem(50);
          background-size: px2rem(40);
          color: #070707;
        }
        p {
          line-height: 1.5;
          color: #555;
          padding: px2rem(20);
          text-align: left;
          border-top: px2rem(1) solid #f1f1f1;
        }
      }
    }
  }
  .slider {
    .toLogin {
      .context{
        color: #666666;
        padding: px2rem(60) px2rem(40);
        span{
          line-height: 1.5;
          u{
            color: $c-red;
            text-decoration: none;
          }
        }
      }

    }
    .logigMsg {
      padding: px2rem(60);
      img {
        display: block;
        width: px2rem(100);
        height: px2rem(100);
        margin: 0 auto;
      }
      p {
        line-height: 1.4;
        margin-top: px2rem(30);
        margin-bottom: px2rem(20);
      }
      span {
        color: #ef3a2d;
      }
      button {
        @extend %redBtn;
        width: 90%;
        margin-top: px2rem(40);
        margin-left: 5%;
      }
    }
  }
  .floatLayer {
    width: 100%;
    background: #ffffff;
    padding: px2rem(10) px2rem(40);
    position: fixed;
    left: 0;
    transition: opacity 1s;
    img {
      width: 100%;
    }
  }
}
</style>
