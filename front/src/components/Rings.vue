lists: 父组件传递过来的铃音详细数据
data.vip: 1/显示VIP图标，其他都为不显示
styles.imgPlay: 播放按钮暂停状态图标
styles.imgPause: 播放按钮播放状态图标
styles.imgSetRing: 设铃按钮图标
styles.imgDownRing: 下载按钮设铃图标
styles.bgc: 铃音列表背景色

<template>
<div class="rings">
  <Ring :key="index"
        :data="{index:index,
          name:list.name,
          songer:list.songer,
          new:list.isnew,
          hot:list.ishot,
          vip: data.vip,
          ringid:list.ringid,
          imgPaly: styles.imgPlay,
          imgPause: styles.imgPause,
          imgSetRing: styles.imgSetRing,
          imgDownRing: styles.imgDownRimg,
        }"
        v-for="(list,index) in lists"
        @downloadRing="downloadRing(list.ringid,list.name,list.songer)"
        @setRing="setRing(list.ringid,list.name,list.songer)"
        :style="index%2 == 1 ? styles.bgc : ''">
  </Ring>
  <Slider v-if="sliderState" :title="tit" @close="close">
    <!--铃音信息-->
    <div class="setRing">
      <RingPlay :ringid="ringid" :img="{imgPlay: styles.imgPlay, imgPause: styles.imgPause}"></RingPlay>
      <div class="summary" @click="play">
        <span class="fz15 name">
        {{name}}
        </span>
        <span class="fz12 songer">{{songer}}</span>
       </div>
    </div>

    <!--登录-->
    <div class="one" v-show="!userInfo.isLogin">
      <Login :state="{isLogin: 2}" @loginCallBack="loginCallBack"></Login>
      <div class="context fz14">
        <span v-html="loginCon"></span>
      </div>
    </div>

    <!--第一次滑窗-->
    <div class="two" v-show="userInfo.isLogin && alert1.show">
      <h4 class="fz22">{{userInfo.msg.phone}}</h4>
      <p v-html="alert1.msg" class="fz16"></p>
      <button class="fz16" @click="confirm(ringid)">确定</button>
    </div>
    <!--二次滑窗-->
    <div class="three" v-show="alert2.show">
      <img src="../../static/img/icon-success.png" alt="">
      <p v-show="order == 1">{{alert2.msg1}}</p>
      <p v-show="alert2.msg2">{{alert2.msg2}}</p>
      <p class="link" v-show="alert2.msg3" @click="loadOther">{{alert2.msg4}}</p>
      <button class="fz16" @click="close">知道了~</button>
    </div>
  </Slider>
  <Open v-if="sliderOpen" @_closeSlider="closeSlider" :code="resCode" @closeOpen="closeSlider" @openOrderOk="openOrderOk" @openCrbtOk="openCrbtOk"></Open>
</div>
</template>  

<script>
import Ring from './Ring.vue'
import Login from './Login.vue'
import RingPlay from './RingPlay.vue'
import Open from './Open.vue'
import { mapGetters , mapState , mapMutations } from 'vuex'
export default {
  components: { Ring , Login , RingPlay ,Open},
  data() {
    return {
      ringid: '',
      name: '',
      songer: '',
      tit: '', // 滑窗的标题
      loginCon: window.spconfig.login.pop.content.replace(/[\r\n]/g,'<br>'), //未登录弹出登录之后下边的提示信息，需读取配置
      alert1: {
        show: false,
        msg: ''
      }, // 第一次设铃之后返回的确认信息
      alert2:{
        show: false,
        msg1: '', //等二次设铃成功，并且是通过登录开通会员来设铃，开通成功提示
        msg2: '',//第二次弹窗返回内容
        msg3: '',// 抽奖按钮,抽奖链接
        msg4: '' //抽奖按钮内容
      },
      order: 0,//非会员开通会员
      audio: null,
      sliderOpen: false,
      resCode: null,
      mode: null //判断是设铃还是下载
    }
  },
  props: [ 'lists' , 'data' , 'styles'],
  computed: {
    ...mapState(['userInfo','sliderState','loginMode','loading','currPlay','lastCurrPlay','orderCode']),
    ...mapGetters(['isLogin']),
  },
  methods: {
    ...mapMutations(['updateLogin','updateUserInfo','updateSliderState',,'updateCurrPlay','updateLoading','updateLastCurrPlay','updateOrderCode']),
    play() {
      if(this.ringid === this.currPlay){
        this.updateCurrPlay(null)
        this.$audio.pause()
        this.updateLastCurrPlay(this.ringid)
      } else {
        if(this.lastCurrPlay === this.ringid) {
          this.$audio.currentTime = 0
          this.$audio.play()
        } else {
          this.updateLoading({show: true,content: '音频加载中...'})
          this.$audio.src = this.$audioSrc(this.ringid)
          this.$audio.play()
        }
        this.updateCurrPlay(this.ringid)
      }
    },
    postData(data) {
      this.updateLoading({show: true,content: '设置中,请稍后...'})
      this.$axios({
        url: '/setRing',
        method: 'post',
        data: data
      })
        .then(res => {
          this.alert1 = {
            show: false,
            msg: ''
          }
          this.alert2 = {
            show: false,
            msg1: '',
            msg2: '',
            msg3: '',
            msg4: ''
          }

          this.updateLoading({show: false, content: ''})
          this.updateSliderState(true)
          if(res.code == -10001) {//尚未登录，更新用户信息
            this.updateLogin(false)
            this.updateUserInfo({})
            this.tit = window.spconfig.login.pop.title
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
          } else if(res.code == -32) {//第一次请求setring返回正常信息
            this.alert1.msg= res.msg.replace(/[\n]/g,'<br>')
            this.alert1.show = true
            this.tit = '设为彩铃'
            this.updateUserInfo(res.user)
          } else if(res.code == 1006) { //第二次弹窗返回信息，重复设置，没有抽奖，也没有开通成功提示
            this.alert1.show = false
            this.alert2.show = true
            this.tit = '设置成功'
            this.alert2.msg2 = '彩铃正在设置中，预计24小时内生效。'
          } else if(res.code == 1) { //第二次弹窗返回信息，设置成功，有抽奖
            this.alert1.show = false
            this.alert2.show = true
            this.tit = window.spconfig.ringset.singleset.succ.title
            this.alert2.msg2 = window.spconfig.ringset.singleset.succ.content
            this.alert2.msg3 = window.spconfig.declare.message.link
            this.alert2.msg4 = window.spconfig.declare.message.content
          } else if(res.code == -20 || res.code == -30) {
            //调用开通会员组件
            this.resCode = res.code
            this.updateSliderState(false)
            this.sliderState = false
            this.sliderOpen = true
          } else if(res.code === '0') {
            //设置失败
            this.alert1.show = false
            this.alert2.show = true
            this.tit = window.spconfig.ringset.singleset.fail.title
            this.alert2.msg2 = window.spconfig.ringset.singleset.fail.content
          } else if(res.code == 31) {
            //彩铃正在开通中
            this.alert1.show = false
            this.alert2.show = true
            if(window.spconfig.crbt.asyncsucc.contetn) {
              this.tit = window.spconfig.crbt.asyncsucc.title 
              this.alert2.msg2 = window.spconfig.crbt.asyncsucc.content
            } else {
              this.tit = '温馨提示'
              this.alert2.msg2 = res.msg
            }
          }
          if(this.alert2.show) {
            if(this.orderCode == 1) {
              this.order = 2
            } else if(this.orderCode == 20) {
              this.alert2.msg1 = window.spconfig.order.succ.content
              this.order = 1
              this.updateOrderCode(null)
            } else {
              this.order = 2
            }
          }
        })
    },
    loginCallBack() {
      if(this.mode == 1) {
        this.postData({rid: this.ringid,confirm: 0})
      } else {
        this.downPostData()
      }
      if(this.userInfo.isLogin) {
        this.tit = window.spconfig.crbt.pop.title
      } else {
        this.tit = window.spconfig.login.pop.title
      }
      // this.setRing(this.ringid,this.name,this.songer)
    },
    setRing(ringid,name,songer) {
      this.mode = 1
      this.updateCurrPlay(null)
      this.$audio.pause()
      this.postData({rid: ringid,confirm: 0})
      this.ringid = ringid
      this.name = name
      this.songer = songer
      if(this.userInfo.isLogin) {
        this.tit = window.spconfig.crbt.pop.title
      } else {
        this.tit = window.spconfig.login.pop.title
      }
      this.$log({
        name: 'doSetRing',
        params: {rid: ringid,confirm: 0}
      })
    },
    downloadRing(ringid,name,songer) {
      this.mode = 2
      this.updateCurrPlay(null)
      this.$audio.pause()
      this.ringid = ringid
      this.name = name
      this.songer = songer
      this.downPostData()
      if(this.userInfo.isLogin) {
        this.tit = window.spconfig.crbt.pop.title
      } else {
        this.tit = window.spconfig.login.pop.title
      }
      this.$log({
        name: 'doDown',
        params: {
          rid: ringid,
          source: 1,
          type: 1
        }
      })
    },
    downPostData() {
      if(this.userInfo.isLogin) {
        this.updateLoading({show: true,content: '下载中，请稍后...'})
        this.$axios({
          url: '/getRingDownUrl',
          method: 'get',
          params: {
            rid: this.ringid,
            source: 1,
            type: 1
          }
        })
          .then(res => {
            this.updateLoading({show: false,content: ''})
            this.resCode = res.code
            if(res.code == -20 || res.code == -30) {
              //调用开通会员组件
              this.resCode = res.code
              this.updateSliderState(false)
              this.sliderState = false
              this.sliderOpen = true
            } else if(res.code == 31) {
              //彩铃正在开通中
              this.updateSliderState(true)
              this.alert1.show = false
              this.alert2.show = true
              if(window.spconfig.crbt.asyncsucc.contetn) {
                this.tit = window.spconfig.crbt.asyncsucc.title 
                this.alert2.msg2 = window.spconfig.crbt.asyncsucc.content
              } else {
                this.tit = '温馨提示'
                this.alert2.msg2 = res.msg
              }
            } else if(res.code == 1) {
              location.href = res.data
            }
          })
      } else {
        this.updateSliderState(true)
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
      }
    },
    close() {
      this.updateSliderState(false)
      this.updateCurrPlay(null)
      this.$audio.pause()
    },
    confirm(ringid) {
      this.postData({rid: ringid,confirm: true})
    },
    loadOther() {
      this.updateSliderState(false)
      location.href = this.alert2.msg3
    },
    closeSlider() {
      this.sliderOpen = false
    },
    openOrderOk() {
      this.sliderOpen = false
      if(this.mode == 1) {
        this.postData({rid: this.ringid,confirm: 0})
      } else {
        this.downPostData()
      }
      if(this.userInfo.isLogin) {
        this.tit = window.spconfig.crbt.pop.title
      } else {
        this.tit = window.spconfig.login.pop.title
      }
    },
    openCrbtOk() {
      this.sliderOpen = false
      if(this.mode == 1) {
        this.postData({rid: this.ringid,confirm: 0})
      } else {
        this.downPostData()
      }
      if(this.userInfo.isLogin) {
        this.tit = window.spconfig.crbt.pop.title
      } else {
        this.tit = window.spconfig.login.pop.title
      }
    }
  }
};
</script>

<style lang="scss">
  @import '../assets/css/variables';
  .setRing{
    position: relative;
    padding: px2rem(50) 0 px2rem(40) ;
    border-bottom: px2rem(1) solid #ededed;
    .audio{
      left: px2rem(60);
    }
    .summary{
      line-height: px2rem(30);
      margin-left: px2rem(140);
      padding-right: px2rem(40);
      img{
        position: absolute;
        left: px2rem(40);
        top:50%;
        margin-top: px2rem(-45);
      }
      .name{
        color: #4d4c4d;
      }
      .songer{
        display: block;
        padding-left: px2rem(10);
        color: $c-red;
      }
    }
  }

  .one{
    .context{
      color: #666666;
      padding: px2rem(60) px2rem(40);
      span{
        line-height: 1.5;
      }
    }
    u{
      color: red;
      text-decoration: none;
    }
  }
  .two{
    padding: px2rem(60) px2rem(40);
    h4{
      line-height: 1.5;
    }
    p{
      color: #666666;
      line-height: 1.4;
      span{
        display: inline;
        position: relative;
        em{
          width: px2rem(70);
          height: px2rem(2);
          background: $c-red;
          position: absolute;
          left: 0;
          top: 50%;
        }
      }
      i{
        color: $c-red;
      }
    }
    button{
      @extend %redBtn;
    }
  }
  .three{
    padding: px2rem(50) px2rem(70);
    img{
      width: px2rem(120);
      height: px2rem(120);
      display: block;
      margin: 0 auto px2rem(40);
    }
    p{
      line-height: 1.5;
    }
    .link{
      color: $c-red;
    }
    button{
      @extend %redBtn
    }
  }
</style>
