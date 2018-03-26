<template>
  <transition name="slide">
    <div class="sliderGroup">
      <!--第一次确认滑窗-->
      <slider v-if="sliderShow" :title="sliderTit" @close="sliderDestroy">
        <!--根据配置返回20，直接开通-->
        <div v-if="resCode === 20" class="openSucc">
          <img src="../../static/img/icon-success.png">
          <p>{{sliderCon}}</p>
          <button @click="close">我知道了</button>
        </div>
        <!--根据配置返回-20（不支持的会员开通方式）/-30(上尚未开通彩铃功能),此种情况需要二次滑窗确认-->
        <!--一次弹窗，开通彩铃-->
        <div v-if="crbt.show" class="confirm confirm1">
          <p class="phone fz18">
            {{userInfo.msg.phone}}
            <span class="changePhone fz15" @click="setSliderShow3">更换手机号</span>
          </p>

          <p class="confirmMsg fz19">{{crbt.msg}}</p>
          <button v-if="provinceCode == '33'" @click="_closeOpen" :class="{cancel: provinceCode == '33'}">取消</button>
          <button @click="crbtBtn" :class="{confirm: provinceCode == '33'}">确认</button>
          <p v-html="crbt.content" class="explain"></p>
        </div>
        <!--二次弹窗，开通会员-->
        <div v-if="order.show" class="confirm confirm2">
          <p class="phone fz18">
            {{userInfo.msg.phone}}
            <span class="changePhone fz15" @click="setSliderShow3">更换手机号</span>
          </p>
          <p class="confirmMsg fz19">{{order.msg}}</p>
          <button v-if="provinceCode == '33'" @click="_closeOpen" :class="{cancel: provinceCode == '33'}">取消</button>
          <button @click="orderBtn" :class="{confirm: provinceCode == '33'}">确认</button>
          <p class="notice" v-html="order.content"></p>
        </div>
      </slider>
      <!--开通成功信息提示-->
      <slider v-if="sliderShow2" :title="sliderTit2" @close="sliderDestroy">
        <div class="openOrder">
          <img src="../../static/img/icon-success.png">
          <p>{{sliderCon2}}</p>
          <p v-if="resCode == 20" class="link" @click="getLottery">[点击抽奖]</p>
          <button @click="sliderDestroy">我知道了</button>
        </div>
      </slider>
      <!--更换手机号弹窗-->
      <slider v-if="sliderShow3" title="验证手机号" @close="close">
        <Login :state="{isLogin:  2}" @loginCallBack="close"></Login>
        <p class="notice" v-html="loginMsg"></p>
      </slider>
      <Modal class="globalError" v-if="alert.show" :title="alert.title" :hasCancel="true" @close="_closeModal" @confirm="_confirmModal" @cancel="_closeModal">{{alert.text}}</Modal>
    </div>
  </transition>
</template>

<script>
  import Back from '../components/Back.vue'
  import Login from '../components/Login.vue'
  import { mapState , mapMutations } from 'vuex'
  export default {
    components: { Back ,Login},
    data() {
      return {
        sliderShow: true,
        sliderTit: '温馨提示',
        sliderCon: '',
        sliderShow2: false,
        sliderTit2: '温馨提示',
        sliderCon2: '',
        sliderShow3: false,
        resCode: null,
        provinceCode: window.spconfig.id.slice(2,4), //省份
        loginMsg: window.spconfig.login.pop.content.replace(/[\r\n]/g,'<br>'),
        crbt: {
          show: false,
          msg: '',
          content: window.spconfig.crbt.pop.content.replace(/[\r\n]/g,'<br>'),
        },
        order: {
          show: false,
          msg: '',
          content: window.spconfig.order.pop.content.replace(/[\r\n]/g,'<br>'),
        },
        alert: {
          show: false,
          text: '',
          title: ''
        }
      }
    },
    props: ['code'],
    computed: {
      ...mapState(['userInfo']),
    },
    mounted() {
      if(this.code == -20) {
        //没有开通会员，只弹order，调order接口
        this.resCode = -20
        this.crbt.show = false
        this.order.show = true
        this.sliderShow2 = false
        this.order.msg = window.spconfig.ringset.serve == 2 && window.spconfig.order.pop.pop == 1 ? '　　领取专属特权，需要升级VIP会员（6元/月），是否确认升级？' : '　　是否确认领取VIP专属特权？'
        this.sliderTit = window.spconfig.order.pop.title
        this.$log({
          name: 'alertOpenOrder'
        })
      } else if(this.code == -30 && window.spconfig.ringset.serve==1 && window.spconfig.crbt.pop.pop == 1) {
        //没有开通彩铃
        this.sliderShow2 = false
        this.resCode = -30
        this.crbt.show = true
        this.order.show = false
        this.crbt.msg = window.spconfig.ringset.serve == 2 && window.spconfig.order.pop.pop == 2 || window.spconfig.ringset.serve==1 && window.spconfig.crbt.pop.pop == 1 ? "　　领取专属特权，需要开通彩铃功能（5元/月），是否确认开通？" :"　　是否确认领取VIP专属特权？"
        this.sliderTit = window.spconfig.crbt.pop.title
        this.$log({
          name: 'alertOpenCrbt'
        })
      } else if(this.code == 31) {
        this.sliderShow2 = true
        this.resCode == 31
        if(window.spconfig.crbt.asyncsucc.contetn) {
          this.sliderTit2 = window.spconfig.crbt.asyncsucc.title 
          this.sliderCon2 = window.spconfig.crbt.asyncsucc.content
        } else {
          this.sliderTit2 = '温馨提示'
          this.sliderCon2 = '彩铃功能开通中，请耐心等待'
        }
      } else {
        this.setServe()
      }
    },
    methods: {
      ...mapMutations(['updateUserInfo','updateLoading']),
      setServe() {
        this.updateLoading({show: true,content: '正在升级VIP会员中...'})

        this.$axios({
          url: '/setServe',
          method: 'post',
          data: {}
        })
          .then(res => {
            this.sliderShow = true
            this.sliderShow2 = false
            this.updateLoading({show: false,content: ''})
            this.resCode = res.code
            if(res.code == 20){
              //不需要弹窗，直接开通
              this.sliderTit = window.spconfig.order.succ.title
              this.sliderCon = window.spconfig.order.succ.content
              this.updateUserInfo(this.userInfo.msg)
            }
             //没有再次确认弹窗
              if(res.code === -20) {
                //没有开通会员，只弹order，调order接口
                this.crbt.show = false
                this.order.show = true
                this.order.msg = window.spconfig.ringset.serve == 2 && window.spconfig.order.pop.pop == 1 ? '　　领取专属特权，需要升级VIP会员（6元/月），是否确认升级？' : '　　是否确认领取VIP专属特权？'
                this.sliderTit = window.spconfig.order.pop.title
                this.$log({
                  name: 'alertOpenOrder'
                })
              } else if(res.code === -30) {
                //没有开通彩铃,弹开通彩铃
                this.crbt.show = true
                this.order.show = false
                this.crbt.msg = window.spconfig.ringset.serve == 2 && window.spconfig.order.pop.pop == 1 ? "　　领取专属特权，需要开通彩铃功能（5元/月），是否确认开通？" :"　　是否确认领取VIP专属特权？"
                this.sliderTit = window.spconfig.crbt.pop.title
                this.$log({
                  name: 'alertOpenCrbt'
                })
              } else if(res.code == 31) {
                //开通中，
                this.sliderShow2 = true
                if(window.spconfig.crbt.asyncsucc.contetn) {
                  this.sliderTit2 = window.spconfig.crbt.asyncsucc.title 
                  this.sliderCon2 = window.spconfig.crbt.asyncsucc.content
                } else {
                  this.sliderTit2 = '温馨提示'
                  this.sliderCon2 = res.msg
                }
              } else if(res.code === 1) {
                this.$emit('orderCallback')
              } 
          })
      },
      openBtn() {
        this.alert.show = false
        this.updateLoading({show: true,content: '正在升级VIP会员中...'})
        if(this.resCode === -20) {
          //开通会员
          this.$log({
            name: 'alertOpenOrder.doOK'
          })
          this.$axios({
            url: '/openOrder',
            method: 'post',
            data: {}
          })
            .then(res => {
              this.updateLoading({show: false,content: ''})
              this.sliderShow2 = true
              this.updateUserInfo(res.user)
              this.resCode = 20
              this.$emit('openOrderOk')
              this.sliderTit2 = window.spconfig.order.succ.title || '温馨提示'
              this.sliderCon2 = window.spconfig.order.succ.content || '升级VIP会员成功！'
            })
        } else if(this.resCode === -30) {
          //开通彩铃
          this.$log({
            name: 'alertOpenCrbt.doOK'
          })
          this.$axios({
            url: '/openCrbt',
            method: 'post',
            data: {}
          })
            .then(res => {
              this.updateLoading({show: false,content: ''})
              // this.order.show = true
              this.resCode = res.code
              this.sliderShow2 = true
              if(res.code == 1) {
                if(res.order) {
                  //开通彩铃并且开通了会员
                  switch(res.order.code) {
                    case -21:
                      //开通失败  
                      this.resCode = -21
                      this.sliderTit2 = window.spconfig.order.fail.title || '温馨提示'
                      this.sliderCon2 = window.spconfig.order.fail.content || '彩铃开通失败!'
                      this.setServe()
                      break
                    case 1://本身就是会员
                    case 20://开会员成功
                      this.sliderTit2 = window.spconfig.crbt.succ.title || '温馨提示'
                      this.sliderCon2 = window.spconfig.crbt.succ.content || '彩铃开通成功！'
                      this.updateUserInfo(res.user)
                      this.$emit('openOrderOk')
                      break
                    case -24://不支持的会员开通方式
                    default:
                      this.sliderTit2 = window.spconfig.crbt.succ.title || '温馨提示'
                      this.sliderCon2 = window.spconfig.crbt.succ.content || '彩铃开通成功！'
                      this.setServe()
                      break
                  }
                } else {
                  if(this.userInfo.orderstate == 4) {
                    this.setServe()
                  } else {
                    this.sliderShow2 = false
                    this.$emit('openCrbtOk')
                  }
                }
                
              } else if(res.code == 31) {
                //开通中，
                if(window.spconfig.crbt.asyncsucc.contetn) {
                  this.sliderTit2 = window.spconfig.crbt.asyncsucc.title 
                  this.sliderCon2 = window.spconfig.crbt.asyncsucc.content
                } else {
                  this.sliderTit2 = '温馨提示'
                  this.sliderCon2 = res.msg
                }
              } else if(res.code == 14) {
                this.sliderTit2 = window.spconfig.crbt.succ.title 
                this.sliderCon2 = window.spconfig.crbt.succ.content
              } else {
                this.sliderTit2 = window.spconfig.crbt.fail.title
                this.sliderCon2 = window.spconfig.crbt.fail.content
              }
            })
        }
      },
      sliderDestroy() {
        this.sliderShow = false
        this.sliderShow2 = false
        this.$emit('_closeSlider')
      },
      close() {
        this.sliderShow3 = false
      },
      setSliderShow3() {
        this.sliderShow3 = true
      },
      getLottery() {
        location.href = window.spconfig.declare.message.link
      },
      crbtBtn() {
        if(window.spconfig.crbt.again_pop.norm.pop == 0 && window.spconfig.order.again_pop.norm.pop == 0) {
          //调openOrder接口
          this.openBtn()
        } else if(window.spconfig.crbt.again_pop.norm.pop == 1 && window.spconfig.order.again_pop.norm.pop == 1){
          //显示确认弹窗
          this.alert.show = true
          this.alert.title = window.spconfig.crbt.again_pop.norm.title
          this.alert.text = window.spconfig.crbt.again_pop.norm.content
        }
      },
      orderBtn () {
        if(window.spconfig.crbt.again_pop.norm.pop == 0 && window.spconfig.order.again_pop.norm.pop == 0) {
          //调openOrder接口
          this.openBtn()
        } else if(window.spconfig.crbt.again_pop.norm.pop == 1 && window.spconfig.order.again_pop.norm.pop == 1){
          //显示确认弹窗
          this.alert.show = true
          this.alert.title = window.spconfig.order.again_pop.norm.title
          this.alert.text = window.spconfig.order.again_pop.norm.content
        }
      },
      _closeModal() {
        this.alert.show = false
      },
      _confirmModal() {
        this.openBtn()
      },
      _closeOpen() { //滑窗取消按钮
        this.$emit('closeOpen')
      }
    }
  }
</script>

<style lang="scss">
  @import '../assets/css/variables';
  .sliderGroup {
    position: fixed;
    left: 0;right: 0;top: 0;bottom: 0;
    background-color: #fff;
    z-index: 100;
    overflow: auto;
  }
  .isLogin_true{
    height: px2rem(150);
    border-bottom: 1px solid #e5e5e5;
    padding: px2rem(20);
    position: relative;
    .left{
      height: px2rem(110);
      img{
        width: px2rem(120);
        height: px2rem(120);
        @extend %centerV;
        margin-left: px2rem(10);
      }
      div{
        @extend %centerV;
        margin-left: px2rem(150);
        p{
          line-height: px2rem(50);
        }
      }
    }
    .right{
      position: relative;
      line-height: px2rem(110);
      .changePhone{
        width: px2rem(170);
        height: px2rem(60);
        line-height: px2rem(60);
        text-align: center;
        color: $c-red;
        border-radius: px2rem(10);
        border: 1px solid $c-red;
        background: transparent;
      }
    }
  }
  .upgrade{
    width: 90%;
    margin: px2rem(40) auto 0;
    button{
      width: 100%;
      background: $c-red;
      color: white;
      padding: px2rem(20) 0;
      border: none;
      border-radius: px2rem(10);
    }
  }
  .slider{
    .openSucc {
      img{
        width: px2rem(110);
        height: px2rem(110);
        position: absolute;
        top: px2rem(150);
        left: 50%;
        margin-left: px2rem(-55);
      }
      p{
        margin-top: px2rem(200);
        color: #666666;
        line-height: 1.4;
        padding: 0 px2rem(60);
        text-align: center;
      }
      button{
        @extend %redBtn;
        width: 80%;
        margin-left: 10%;
        margin-top: px2rem(40);
      }
    }
    .confirm {
      color: #666666;
      .phone {
        line-height: px2rem(160);
        font-weight: bold;
        padding: 0 px2rem(50);
        .changePhone {
          float: right;
          font-weight: normal;
          width: px2rem(170);
          height: px2rem(60);
          line-height: px2rem(60);
          text-align: center;
          color: $c-red;
          border-radius: px2rem(10);
          border: 1px solid $c-red;
          background: transparent;
          margin-top: px2rem(50);
        }
      }
      .confirmMsg {
        line-height: px2rem(50);
        padding: 0 px2rem(50);
        text-align: left;
      }
      .explain {
        padding: px2rem(50);
        line-height: px2rem(40);
        u {
          text-decoration: none;
          color: #ef3a2d;
        }
      }
      button {
        @extend %redBtn;
        width: 80%;
        margin: px2rem(50) 10% 0;
      }
      .cancel {
        margin: px2rem(40) px2rem(30);
        width: 30%;
        background: $c-bb;
      }
      .confirm {
        margin: px2rem(40) px2rem(30);
        width: 54%;
        margin-left: 0;
      }
    }
    .openOrder {
      text-align: center;
      img{
        width: px2rem(110);
        height: px2rem(110);
        margin-top: px2rem(40);
      }
      p{
        margin-top: px2rem(30);
        padding: 0 px2rem(40);
        line-height: 1.5;
        text-align: left;
      }
      .link {
        margin-top: px2rem(20);
        color: $c-red;
      }
      button {
        @extend %redBtn;
        width: 80%;
        margin: px2rem(40) 10%;
      }
    }
  }

  .notice {
    padding: px2rem(20) px2rem(40);
    line-height: px2rem(40);
    u{
      text-decoration: none;
      color: $c-red;
    }
  }

  // 过渡效果
  .slide-enter-active, .slide-leave-active {
    transition: transform .5s;
  }
  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>