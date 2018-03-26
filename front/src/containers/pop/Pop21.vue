<template>
    <div class="pop">
        <div class="ban">
            <img src="../../../static/img/21/ban.png" alt="">
        </div>
        <div class="getBtn">
            <div class="tits">100,000爆款铃声+话费流量</div>
            <img src="../../../static/img/21/btns.gif" @click="receiveBtn" alt="">
            <div class="getNum"><p class="fz12">已有<span>{{getReceiveNum}}</span>人翻牌</p></div>
        </div>
        <div class="ruleLayer">
            <div class="ruleTit">活动规则</div>
            <ul class="ruleBox clear" id="con">
                <li><span></span>参与翻牌游戏,需成为翼铃会员(首月免费,次月收取<u>6元/月</u>)。每个用户可享受1次首月免费特权。</li>
                <li><span></span>活动奖品将在次月初的15个工作日内进行发放，我们将发送短信通知或由客服联系确认，请获奖者保持手机畅通。以下三种情况，将不予发放奖品：① 已取消口袋铃声服务的用户 ② 欠费停机用户 ③ 电话无人接听，3次联系不上获奖者将视为主动放弃奖品</li>
                <li><span></span>总共三万份奖品，最高100元话费，<a href="javascript:;" id="lookDetail">点击查看详情</a></li>
            </ul>
        </div>
        <div class="ringList">
            <div class="ringTit">爆款网红铃声TOP100</div>
            <div class="allRing">
              <Rings :lists="ringList" :data="{vip: '3'}" :styles="{
                imgPlay: '../../static/img/21/icon-play.png',
                imgPause: '../../static/img/21/icon-pause.png',
                imgSetRing : '../../static/img/21/icon-setring.png',
                imgDownRimg : '../../static/img/21/icon-download.png',
                bgc: 'background: '}">
              </Rings>
            </div>
            <div class="btnGetMore" @click="getMore">
                <span class="fz16">加载更多</span>
                <p class="fz15">小贴士：如手机不支持振铃下载，请通过pc浏览器（chrome）下载后同步到手机</p>
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
            <img src="../../../static/img/21/float-btn.png" alt="">
        </div>
    </div>
    <!--<Modal class="globalError" v-if="modal.modalShow" :title="modal.title" @close="_closeModal" @confirm="_confirmModal">{{modal.content}}</Modal>-->
</template>

<script>
  import { mapGetters, mapState , mapMutations } from 'vuex'
  import store from '../../store'
  import Login from '../../components/Login.vue'
  import WarmPrompt from '../../components/WarmPrompt.vue'
  import Rings from '../../components/Rings.vue'
  import Open from '../../components/Open.vue'

export default {
  name: 'pop21',
  components: {Login , WarmPrompt ,Rings, Open},
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
      },
      modal: {
          modalShow: false,
          content: ''
      },
      lid: 155
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
    document.getElementById('con').innerHTML = this.noticeCon //读配置
    document.getElementById('con').getElementsByTagName('a')[0].onclick = function () {
        store.commit('updateModal', { title: '温馨提示', content: '• 活动时间：即日起至2018年6月30日；\r\n<p>• 活动期间，成为翼铃VIP会员，即可获得翻牌机会，每月可翻1次；</p>• 多次重复注册升级不可重复获得翻牌机会；<br>• 活动奖品：<br>小米空气净化器2，3份<br>100元电信话费，9份<br> 1G电信流量，30份<br> 500M电信流量，60份<br> 10元电信话费，280份<br> 50M电信流量，360份<br> 5元电信话费，3000份<br> 1元电信话费，24000份'})
    }
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
            //store.commit('updateModal',{title:'温馨提示',content: '您已经是VIP会员咯，不能重复参加活动哦！'})
            this.getLot()
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
      if(this.orderCode&&this.orderCode == 20) {
        this.popSliderShow = true
        this.loginCallBackMsg.setLoginMsgShow = true
      } else if (this.orderCode&&this.orderCode == 1 || this.orderCode === null && this.userInfo.msg.orderstate !== 4){
          this.popSliderShow = false
          this.loginCallBackMsg.setLoginMsgShow = false
          this.getLot()
      }else if(this.userInfo.msg.orderstate === 4) {
        this.openShow = true
        this.popSliderShow = false
      }
    },
    closeSlider() {
      this.openShow = false
    },
    _closeModal() {
        this.modal.modalShow = false
    },
    _confirmModal() {
        this.closeSlider()
        this.close()
    },
    getLotter() {
      location.href = window.spconfig.declare.message.link
    },
    getLot() {
        this.$axios({
            url: '/getLottery',
            method: 'post',
            data: {
                lid: this.lid,
                phone: userInfo.msg.phone
            }
        })
            .then(res => {
                if(res.code == 1) {
                    if(res.data.res_str == '') {
                        if(res.data.valid_count >= 0) {
                            store.commit('updateModal', { title: '温馨提示', content: '哎呦，啥也没中，偷偷告诉你，每月都有1次抽奖机会，下个月再来吧。'})
                        }
                    } else {
                        //中奖了
                        store.commit('updateModal', { title: '温馨提示', content: '<p>恭喜你，中奖啦！<br><u>抽中：' + res.data.res_str + '</u></p>'})
                    }
                } else if(res.code == -1) {
                    store.commit('updateModal', { title: '温馨提示', content: '哎呦，不好意思，您的抽奖机会已经用完咯。下次抽奖活动再来玩吧...'})
                } else if(res.code == -3) {

                } else {
                    store.commit('updateModal', { title: '温馨提示', content: res.msg})
                }
            })
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/css/variables';
.pop {
  background: #f9a01f;
  padding-bottom: px2rem(40);
  .ban {
    img {
      width: 100%;
    }
  }
  .getBtn {
      width: 96%;
      background: #de2800;
      border: px2rem(6) solid #ffbd52;
      margin: 0 auto;
      padding: px2rem(10) 0 px2rem(40);
      box-sizing: border-box;
      text-align: center;
      position: relative;
      img{width: 100%;z-index: 0}
      .tits{
          display:inline-block;
          font-size: px2rem(24);
          color: #fff;
          padding: px2rem(10) px2rem(20) 0;
          height: px2rem(30);
          line-height: px2rem(35);
      }
      .tits:before{
          display: inline-block;
          background: url("../../../static/img/21/icon-zs.png") no-repeat;
          background-size: px2rem(30);
          content: "";
          width: px2rem(30);
          height: px2rem(30);
          float: left;
          margin-right: px2rem(10);
      }
      .tits:after{
          display: inline-block;
          background: url("../../../static/img/21/icon-zs.png") no-repeat;
          background-size: px2rem(30);
          content: "";
          width: px2rem(30);
          height: px2rem(30);
          float: right;
          margin-left: px2rem(10);
      }
      .getNum{
          position: absolute;
          height: px2rem(36);
          width: 100%;
          bottom: px2rem(14);
          left: 0;
          text-align: center;
          p{
              display: inline-block;
              background: #b22000;
              color: #fbff8e;
              font-size: px2rem(18);
              line-height: px2rem(36);
              padding: 0 px2rem(15);
              border-radius: px2rem(20);
          }
      }
  }
  .ruleLayer{
      width: 96%;
      margin: px2rem(10) auto;
      .ruleTit{
          line-height: px2rem(24);
          color: #bd7000;
          text-align: center;
          font-weight: 600;
          font-size: px2rem(22)
      }
      .ruleBox{
          line-height: px2rem(30);
          color: #bd7000;
          margin-top: px2rem(5);
          li{
              position: relative;
              padding-left: px2rem(15);
              font-size: px2rem(20);
              span{
                  display: inline-block;
                  width: px2rem(8);
                  height: px2rem(8);
                  background: #bd7000;
                  border-radius: 50%;
                  position: absolute;
                  top: px2rem(10);
                  left: 0;
              }
              u{color: #bd4c00;}
              a{
                  color: #bd4c00;
                  text-decoration: underline;
              }
          }
      }
  }
  .ringList {
      width: 96%;
      background: #de2800;
      border: px2rem(6) solid #ffbd52;
      margin: 0 auto;
      box-sizing: border-box;
      padding-top: px2rem(10);
      .ringTit{
          width:60%;
          font-size: px2rem(24);
          color: #fff;
          padding: px2rem(10) px2rem(20) 0;
          height: px2rem(30);
          line-height: px2rem(35);
          margin: 0 auto;
      }
      .ringTit:before{
          display: inline-block;
          background: url("../../../static/img/21/icon-zs.png") no-repeat;
          background-size: px2rem(30);
          content: "";
          width: px2rem(30);
          height: px2rem(30);
          float: left;
          margin-right: px2rem(10);
      }
      .ringTit:after{
          display: inline-block;
          background: url("../../../static/img/21/icon-zs.png") no-repeat;
          background-size: px2rem(30);
          content: "";
          width: px2rem(30);
          height: px2rem(30);
          float: right;
          margin-left: px2rem(10);
      }
    .allRing {
      padding-top: px2rem(20);
      width: 100%;
      margin: 0 auto;
      border-radius: px2rem(20);
      .ring{
          border-bottom: none;
          span{color: #fff181}
          p span{color: #fff7d2;font-size: px2rem(28)}
          .operation img{width:1.25rem;height:1.25rem;}
      }
    }
    .audio{width:1.25rem;height:1.25rem;margin-top: -.7rem}
    .btnGetMore {
        text-align: center;
        background: #ffbd52;
        span {
            height: px2rem(100);
            line-height: px2rem(100);
            background: url(../../../static/img/icon-more.png) left center no-repeat;
            padding-left: px2rem(50);
            background-size: px2rem(40);
            color: #000;
        }
        p {
            line-height: 1.5;
            color: #000;
            padding:0 px2rem(20) px2rem(20);
            text-align: left;
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
    background: #f8dca4;
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
