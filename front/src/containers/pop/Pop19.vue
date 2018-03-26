<template>
<div class="pop1">
  <div class="ban">
    <img src="../../../static/img/19/ban.png" alt="">
    
    <div class="containerBox">
      <div class="context fz13" id="con">
       <!-- <ul>
          <li>
              <span>壕礼每月抽</span>
              <p><a href="javascript:;">【点击抽奖】</a></p>
          </li>
          <li>
              <span>全站炫铃</span>
              <p>0元/首月</p>
          </li>
          <li>
              <span>爆款铃声</span>
              <p>0元/首月</p>
          </li>
          <li>
              <span>炫铃功能</span>
              <p>免费送</p>
          </li>
        </ul>
        <p class="sm-text ">领取特权福利,<u>需成为翼铃高级VIP会员(首月免费,免费期后收取6元/月)</u>。每个用户可享受1次首月免费特权.</p> -->
      </div>
  <p class="getReceiveNum fz14">已有{{getReceiveNum}}人领取</p>
      <img class="get-btn" src="../../../static/img/19/get_btn.gif" @click="flag && receiveBtn()" alt="">
    </div>
  </div>
  <div class="ringList">
    <div class="ringTit">
      <img src="../../../static/img/19/tit.png" alt="">
    </div>
    <div class="allRing">
      <Rings :lists="ringList" :data="{vip: '3'}" :styles="{
        imgPlay: '../../static/img/19/btn-play-19.png',
        imgPause: '../../static/img/19/btn-pause-19.png',
        imgSetRing : '../../static/img/19/btn-setring.png',
        imgDownRimg : '../../static/img/19/btn-download.png',
        bgc: 'background: '}">  
      </Rings>
      <div class="btnGetMore" @click="getMore">
        <span class="fz16">加载更多</span>
        <p class="fz15">小贴士：如手机不支持振铃下载，请通过pc浏览器（chrome）下载后同步到手机</p>
      </div>
    </div>
  </div>
  <slider v-if="popSliderShow" :title="sliderTit" @close="close">
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
  <div class="floatLayer" :style="{opacity: styleOpacity,top: styleOpacity > 0.1 ? '0px' : ''}" @click="flag && receiveBtn()">
    <img src="../../../static/img/19/get_btn.gif" alt="">
  </div>
</div>
</template> 

<script>
import { mapGetters, mapState, mapMutations } from "vuex";
import store from "../../store";
import Login from "../../components/Login.vue";
import WarmPrompt from "../../components/WarmPrompt.vue";
import Rings from "../../components/Rings.vue";
import Open from "../../components/Open.vue";

export default {
  name: "pop19",
  components: { Login, WarmPrompt, Rings, Open },
  data() {
    return {
      getReceiveNum: "",
      loginCon: window.spconfig.login.pop.content.replace(/[\r\n]/g, "<br>"), //未登录弹出登录之后下边的提示信息，需读取配置
      sliderTit: "温馨提示",
      ringList: [],
      start: 0,
      resCode: null,
      noticeCon: window.spconfig.declare.intro.content.replace(/[\r\n]/g,"<br>"),
      fontSize: document.getElementsByTagName("html")[0].style.fontSize,
      styleOpacity: 0,
      openShow: false,
      popSliderShow: false,
      loginCallBackMsg: {
        setLoginMsgShow: false,
        text: window.spconfig.order.succ.content,
        link: window.spconfig.declare.message.content
      },
      flag: true,
    };
  },
  computed: {
    ...mapState(["userInfo", "orderCode"]),
    ...mapGetters(["isLogin"])
  },
  mounted() {
    this.getRingList(0);
    this.$axios({
      url: "/getReceiveNum",
      method: "get",
      params: {}
    }).then(res => {
      this.getReceiveNum = res;
    });
    window.addEventListener("scroll", this.scrollAnimate);
    document.getElementById('con').innerHTML = this.noticeCon
    document.getElementById('con').children[0].firstChild.lastChild.children[0].href = window.spconfig.declare.message.link
  },
  methods: {
    ...mapMutations(["updateLoading", "updateUserInfo"]),
    receiveBtn() {
      this.flag = false
      this.updateLoading({ show: true, content: "正在加载中..." });
      this.$axios({
        url: "/setServe",
        method: "post",
        data: {}
      }).then(res => {
        this.updateLoading({ show: false, content: "" });
        this.flag = true
        this.resCode = res.code;
        if (res.code === -10001) {
          //没有登录去登录
          this.sliderTit = window.spconfig.login.pop.title;
          this.popSliderShow = true;
          this.updateUserInfo({});
          switch (window.spconfig.login.mode) {
            case "1":
              this.$log({
                name: "alertLogin"
              });
              break;
            case "2":
              this.$log({
                name: "alertLoginOrder"
              });
              break;
            case "3":
              this.$log({
                name: "alertLoginCrbt"
              });
              break;
          }
        } else if (res.code === 1 && res.order === undefined) {
          //已经是会员,返回信息中没有order,弹窗提示
          store.commit("updateModal", {
            title: "温馨提示",
            content: "您已经是VIP会员咯，不能重复参加活动哦！"
          });
        } else {
          this.openShow = true;
        }
      });
      this.$log({
        name: "doOpenServe"
      });
    },
    getRingList(start) {
      this.updateLoading({ show: true, content: "正在加载中..." });
      this.$axios({
        url: "/getRingList",
        method: "get",
        params: {
          pid: window.spconfig.hotlist.list[0].id,
          start: start,
          records: 10
        }
      }).then(res => {
        this.updateLoading({ show: false, content: "" });
        this.ringList = this.ringList.concat(res.list);
      });
    },
    getMore() {
      this.start += 10;
      this.getRingList(this.start);
    },
    close() {
      this.popSliderShow = false;
    },
    scrollAnimate() {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const fontSize = document.getElementsByTagName("html")[0].style.fontSize;
      if (scrollTop > parseInt(fontSize) * 16) {
        this.styleOpacity = 1;
      } else {
        this.styleOpacity = 0;
      }
    },
    loginCallBack() {
      this.resCode = null;
      if (
        (this.orderCode && this.orderCode == 20) ||
        (this.orderCode && this.orderCode == 1) ||
        (this.orderCode === null && this.userInfo.msg.orderstate !== 4)
      ) {
        this.popSliderShow = true;
        this.loginCallBackMsg.setLoginMsgShow = true;
      } else if (this.userInfo.msg.orderstate === 4) {
        this.openShow = true;
        this.popSliderShow = false;
      }
    },
    closeSlider() {
      this.openShow = false;
    },
    getLotter() {
      location.href = window.spconfig.declare.message.link;
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/variables";
.pop1 {
  padding-bottom: px2rem(70);
  overflow-x: hidden;
  background: url(../../../static/img/19/line.png) repeat-y;
  background-size: 100% 100%;
  position: relative;
  .ban {
    font-size: 0;
    position: relative;
    img {
      width: 100%;
    }
    .containerBox {
      width: 100%;
      background: url("../../../static/img/19/ban-bg.png") no-repeat;
      background-size: 100% auto;
      margin-top: -1px;
      font-size: 0;
      position: relative;
      overflow: auto;
      .context {
        padding: px2rem(8) 0;
        border-radius: px2rem(20);
        position: relative;
        padding-bottom: px2rem(340);
        text-align: center;
        ul {
          display: inline-block;
          width: 70%;
          font-size:px2rem(18);
          font-weight:bold;
          li {
            width: 25%;
            float: left;
            color: #b04a0b;
            position: relative;
            text-align: center;
            a {
              color: #f00;
              display: block;
              font-weight: bold;
            }
            em {
              width: px2rem(110);
              height: px2rem(110);
              position: relative;
            }
            .icon1 {
              background: url(../../../static/img/18/icon_prize.png) no-repeat;
              background-size: 100%;
            }
            .icon2 {
              background: url(../../../static/img/18/icon_music.png) no-repeat;
              background-size: 100%;
            }
            .icon2::before {
              content: "";
              height: px2rem(150);
              width: px2rem(3);
              background: url(../../../static/img/18/icon_line.png) no-repeat;
              background-size: 100%;
              position: absolute;
              left: px2rem(-45);
              top: px2rem(40);
            }
            .icon2::after {
              content: "";
              height: px2rem(150);
              width: px2rem(3);
              background: url(../../../static/img/18/icon_line.png) no-repeat;
              background-size: 100%;
              position: absolute;
              right: px2rem(-45);
              top: px2rem(40);
            }
            .icon3 {
              background: url(../../../static/img/18/icon_ring.png) no-repeat;
              background-size: 100%;
            }
            span {
              line-height: px2rem(30);
            }
          }
          
          li:nth-child(1) {
            background: url(../../../static/img/19/1.png) 78% top no-repeat;
            background-size: 75%;
            padding-top: px2rem(80);
            margin-top: px2rem(15);
          }
          li:nth-child(2){
             background: url(../../../static/img/19/2.png) 78% top no-repeat;
            background-size: 75%;
            padding-top: px2rem(80);
            margin-top: px2rem(15);
          }
          li:nth-child(3){
             background: url(../../../static/img/19/3.png) 78% top no-repeat;
            background-size: 75%;
            padding-top: px2rem(80);
            margin-top: px2rem(15);
          }
          li:nth-child(4){
             background: url(../../../static/img/19/4.png) 78% top no-repeat;
            background-size: 75%;
            padding-top: px2rem(80);
            margin-top: px2rem(15);
          }
        }
        .sm-text {
          color: #ffddaf;
          line-height: px2rem(32);
          width: 92%;
          text-align: left;
          position: absolute;
          left: 5%;
          font-size:px2rem(20);
          top: px2rem(394);
          u {
            color: #e5d375;
            text-decoration: none;
          }
        }
      }
      .get-btn {
        width: 90%;
        position: absolute;
        left: 5%;
        top: px2rem(210);
      }
    }
  }
  .getReceiveNum {
    color: #fff1d8;
    text-align: center;
    width: 100%;
    position: absolute;
    margin:0 auto;
     margin-top: 0.05rem;
    bottom: px2rem(104);
    left: 0;
    right: 0;
    
    line-height: .3rem;
    width:px2rem(186);
    height:px2rem(33);
    line-height:px2rem(33);
    color: #ebde7b;
    background: #a0130d;
    font-size:px2rem(18);
    border-radius: px2rem(16);
   
  }
  .ringList {
    .ringTit {
      width:px2rem(451);
      margin: 0 auto;
      font-size: 0;
      margin-top:px2rem(20);
      margin-bottom:px2rem(20);
      margin-left: auto;
      margin-right: auto;
      img {
        width: 100%;
      }
    }
    .allRing {
      background: #faeab0;
      padding: px2rem(10) 0;
      width: 90%;
      margin: 0 auto;
      border-radius: 0 0 px2rem(20) px2rem(20);
      border-top-left-radius: px2rem(13);
      border-top-right-radius:  px2rem(13);
      border-top: none;
      .btnGetMore {
        text-align: center;
        span {
          height: px2rem(100);
          line-height: px2rem(100);
          background: url(../../../static/img/19/icon-more.png) left center
            no-repeat;
          padding-left: px2rem(50);
          background-size: px2rem(40);
          color: #570c02;
        }
        p {
          line-height: 1.5;
          color: #570c02;
          padding: px2rem(20);
          text-align: left;
        }
      }
    }
  }
  .slider {
    .toLogin {
      .context {
        color: #666666;
        padding: px2rem(60) px2rem(40);
        span {
          line-height: 1.5;
          u {
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
    background: #C81810;
    padding: px2rem(20) px2rem(30);
    position: fixed;
    left: 0;
    transition: opacity 1s;
    z-index: 3;
    img {
      width: 100%;
    }
  }
}
</style>
