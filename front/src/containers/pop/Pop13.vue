<template>
<div class="pop">
  <div class="ban">
    <img src="../../../static/img/13/ban.png" alt="">
  </div>
  <div class="getBtn ban">
    <img src="../../../static/img/13/ban2.png" alt="">
    <div class="context fz12" id="con">
      <!-- <ul class="icon-box">
        <li>
          <div class="one"><img src="../../../static/img/13/one.png" alt=""></div>
          <div class="two"><p>每月免费抽奖1次</p><a href="https://tianyiring.com/m/zt/zt7/">立即抽奖</a></div>
        </li>
        <li>
          <div class="one"><img src="../../../static/img/13/two.png" alt=""></div>
          <div class="two"><p>彩铃/振铃（0元/首）</p><span>全站铃声免费用</span></div>
        </li>
      </ul>
      <span class="discripttion">领取VIP特权福利，需成为翼铃高级VIP，仅需6元/月。后续还有更多VIP福利，敬请期待。</span> -->
    </div>
    <div class="btn">
      <img class="img_btn" @click="receiveBtn" src="../../../static/img/13/get-btn.png" alt="">
      <img class="finger" src="../../../static/img/13/get-finger.png" alt="">
      <p class="fz14">已有<span>{{getReceiveNum}}</span>人领取</p>
    </div>
  </div>
  <div class="ringList">
    <div class="ringTit">
      <img class="hongbao03" src="../../../static/img/13/hongbao_03.png" alt="">
      <span class="fz15">2017年6月新鲜出炉全球爆红铃声</span>
      <img class="hongbao06" src="../../../static/img/13/hongbao_06.png" alt="">
    </div>
    <div class="allRing">
      <Rings :lists="ringList" :data="{vip: '3'}" :styles="{
        imgPlay: '../../static/img/13/btn-play.png',
        imgPause: '../../static/img/13/btn-pause.png',
        imgSetRing : '../../static/img/13/btn-setring.png',
        imgDownRimg : '../../static/img/13/btn-download.png',
        bgc: ''}">
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
    <img src="../../../static/img/13/get-btn.png" alt="">
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
    link() {
      location.href = this.succLinkUrl
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
  background: #580195;
  padding-bottom: px2rem(40);
  .ban {
    font-size: 0;
    img {
      width: 100%;
    }
  }
  .getBtn {
    position: relative;
    .context {
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
      padding: px2rem(20) px2rem(15);
      border-bottom-left-radius: px2rem(15);
      border-bottom-right-radius: px2rem(15);
      ul{
        float: left;
        width: 100%;
      }
      li {
        width: 50%;
        float: left;
        position: relative;
        padding-left: px2rem(80); 
        line-height: px2rem(40);
        .one{
          width: px2rem(85);
          height: px2rem(85);
          position: absolute;
          left: px2rem(10);
        }
        .two {
          padding: px2rem(10) 0 0 px2rem(20) ;
          p {
            color: #ffffff;
          }
          span {
            color: #ffffff;
          }
        }
        a {
          color: #fffe00;
          text-decoration: underline;
        }
      }
      .discripttion {
        width: 94%;
        margin: px2rem(25) 3% 0;
        padding: px2rem(10) px2rem(10) px2rem(10) px2rem(20);
        border-radius: px2rem(10);
        background: #d22647;
        line-height: px2rem(25);
        color: #f1f1f1
      }
    }
    .btn {
      .img_btn {
        width: 80%;
        position: absolute;
        left: 10%;
        top: px2rem(205);
      }
      .finger {
        width: px2rem(69);
        height: px2rem(66);
        position: absolute;
        right: px2rem(100);
        top: px2rem(250);
        animation-name: floating;
        -webkit-animation-name: floating;
        animation-duration: 1.2s;
        -webkit-animation-duration: 1.2s;
        animation-iteration-count: infinite;
        -webkit-animation-iteration-count: infinite;
      }
      p {
        position: absolute;
        left: 0;
        top: px2rem(310);
        color: #ffffff;
        text-align: center;
        width: 100%;
        span {
          color: #ffec17;
        }
      }
    }
  }
  .ringList {
    margin-top: px2rem(-140);
    position: relative;
    .ringTit{
      text-align: center;
      height: px2rem(100);
      line-height: px2rem(100);
      background: #580195;
      position: relative;
      span {
        color: #fffe00;
        font-weight: bold;
      }
      .hongbao03 {
        width: px2rem(40);
        height: px2rem(40);
        position: absolute;
        left: px2rem(70);
        top: px2rem(27);
      }
      .hongbao06 {
        position: absolute;
        right: px2rem(70);
        top: px2rem(20);
      }

    }
    .allRing {
      background: #ffffff;
      padding: px2rem(20) 0 0;
      width: 90%;
      margin: 0 auto;
      border-radius: px2rem(20);
      border: px2rem(2) solid #2f201d;
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
  }
  .floatLayer {
    width: 100%;
    background: #f83e62;
    padding: px2rem(20) px2rem(30);
    position: fixed;
    left: 0;
    transition: opacity 1s;
    img {
      width: 100%;
    }
  }
}
@keyframes floating {
  0% {transform: translate(0)}
  50% {transform: translate(12%,12%);}
  100% {transform: translate(0);}
}
@-webkit-keyframes floating {
  0% {-webkit-transform: translate(0);}
  50% {-webkit-transform: translate(12%,12%);}
  100% {-webkit-transform: translate(0);}
}
</style>
