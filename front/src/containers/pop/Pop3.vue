<template>
<div class="pop">
  <div class="ban">
    <img src="../../../static/img/3/ban.png" alt="">
    <img class="sm-text" src="../../../static/img/3/sm-text.png" alt="">
    <img class="get-btn" @click="receiveBtn" src="../../../static/img/3/get-btn.png" alt="">
  </div>
  <div class="containerBox">
    <div class="title">
      <img src="../../../static/img/3/icon-heart.png" alt="">
      <span class="fz15">活动说明</span>
    </div>
    <div class="context fz13" id="con">
    </div>
  </div>
  <div class="zs-line"></div>
  <div class="ringList">
    <div class="ringTit">
      <span class="fz16">本月超新超热铃声都在这里 ↓</span>
    </div>
    <div class="allRing">
      <Rings :lists="ringList" :data="{vip: '3'}" :styles="{
        imgPlay: '../../static/img/btn-play-red.png',
        imgPause: '../../static/img/btn-pause-red.png',
        imgSetRing : '../../static/img/btn-setring-red.png',
        imgDownRimg : '../../static/img/btn-download-red.png',
        bgc: 'background: #fafafa'}">
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
    document.getElementById('con').innerHTML = this.noticeCon
    document.getElementById('con').children[0].firstChild.lastChild.href = window.spconfig.declare.message.link
  },
  methods: {
    ...mapMutations(['updateLoading','updateUserInfo']),
    receiveBtn() {
      this.updateLoading({show: true, content: '正在加载中...'})
      this.$axios({
        url: '/setServe',
        method: 'post',
        data: {}
      })
        .then(res => {
          this.updateLoading({show: false, content: ''})
          this.resCode = res.code
          if (res.code === -10001) {
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
          } else if (res.code === 1 && res.order === undefined) {
            //已经是会员,返回信息中没有order,弹窗提示
            store.commit('updateModal', {title: '温馨提示', content: '您已经是VIP会员咯，不能重复参加活动哦！'})
          } else {
            this.openShow = true
          }
        })
      this.$log({
        name: 'doOpenServe'
      })
    },
    getRingList(start) {
      this.updateLoading({show: true, content: '正在加载中...'})
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
          this.updateLoading({show: false, content: ''})
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
  background: #ffb000 url(../../../static/img/3/bgs.jpg);
  padding: px2rem(10) 0 px2rem(40);
  .ban {
    font-size: 0;
    position: relative;
    img {
      width: 100%;
    }
    .sm-text {
      width: 64%;
      position: absolute;
      left: 18%;
      bottom: px2rem(210);
    }
    .get-btn {
      width: 80%;
      position: absolute;
      left: 10%;
      bottom: px2rem(85)
    }

  }
  .containerBox {
    width: 90%;
    margin: 0 auto;
    background: #ffe5ac;
    border-radius: px2rem(30);
    padding: px2rem(10);
    font-size: 0;
    border: px2rem(3) solid #5e5727;
    box-shadow: 0 px2rem(10) 0 rgba(94,87,39,.5);
    .title {
      padding: px2rem(10);
      background-size: px2rem(28) auto;
      color: #4f1f04;
      span {
        margin-left: px2rem(10);
        font-weight: 700;
        vertical-align: middle;
      }
      img {
        width: px2rem(25);
        height: px2rem(19);
        vertical-align: middle;
      }
    }
      .context {
        padding: px2rem(20) px2rem(15);
        border-bottom-left-radius: px2rem(15);
        border-bottom-right-radius: px2rem(15);
        li {
          line-height: px2rem(35);
          color: #77420a;
          padding-left: px2rem(40);
          position: relative;
          a {
            color: #d62e1d;
            text-decoration: none;
          }
          em {
            width: px2rem(30);
            height: px2rem(30);
            line-height: px2rem(30);
            text-align: center;
            text-shadow: 0 0 3px #f83126;
            background: url("../../../static/img/18/icon-num.png") no-repeat;
            background-size: 100%;
            font-style: normal;
            position: absolute;
            left: 0;
            top: px2rem(6);
            color: #fff;
          }
        }
        p {
          line-height: px2rem(30);
          color: #77420a;
          padding: px2rem(10) px2rem(20);
          margin-top: px2rem(10);
          u {
            color: #d62e1d;
            text-decoration: none;
          }
        }
        .sm-text {
          margin-top: px2rem(10);
          color: #c68409;
          margin: 0 auto ;
          line-height: px2rem(32);
          u{
            color: #d22300;
            text-decoration: none;
          }
        }
    }
  }
  .zs-line {
    width: 90%;
    margin: 0 auto;
    height: px2rem(60);
    background: url(../../../static/img/3/bg-line.png) left top repeat-y;
    background-size: 100% auto;
  }
  .ringList {
    position: relative;
    .ringTit{
      height: px2rem(80);
      width: 90%;
      margin: 0 auto;
      line-height: px2rem(80);
      color: #ff4e00;
      text-align: center;
      background: #fafafa;
      border-radius: px2rem(30) px2rem(30) 0 0;
      font-weight: bold;
      border: px2rem(3) solid #5e5727;
      border-bottom: none;
    }
    .allRing {
      background: #ffffff;
      width: 90%;
      margin: 0 auto;
      border-radius: 0 0 px2rem(30) px2rem(30);
      border: px2rem(3) solid #5e5727;
      border-top: none;
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
}
</style>
