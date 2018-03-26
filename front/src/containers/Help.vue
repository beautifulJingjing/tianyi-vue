<template>
<div class="quit">
  <Back></Back>
  <div class="help_content fz14">
    <dl>
      <dt class="fz17">1.  VIP会员有哪些专享特权？</dt>
      <dd>• 【VIP特权】VIP独享高清彩铃/振铃，免费不限次任意下载更换。</dd>
      <dd>• 【海量曲库】精选16大类、48小类高清铃声，每日更新。</dd>
      <dd>• 【个性铃声】专享APP版制作个性化铃声，为TA设置专属铃声。</dd>
      <dd>• 【方便快捷】所有铃声在线试听，一键下载、设定，即时生效。</dd>
      <dd>注意：高清彩铃无限次更换，需要用户先开通中国电信彩铃功能。</dd>
    </dl>
    <dl class="cost">
      <dt class="fz17">2.  VIP会员怎么收费？</dt>
      <dd>• VIP会员服务资费：6元/月。订购产品：翼铃高级VIP。</dd>
    </dl>
    <dl>
      <dt class="fz17">3.  彩铃如何设置？</dt>
      <dd>• 开通VIP会员后，点击彩铃按钮，即可设置彩铃。</dd>
      <dd>• 彩铃设置，需先开通彩铃功能，如果您没有开通，我们会帮您开通，彩铃功能费各地区有所不同，您也可拨打当地运营商客服电话咨询开通。</dd>
    </dl>
    <dl>
      <dt class="fz17">4. 如果关闭了彩铃功能，会不会导致VIP会员服务不能正常使用？</dt>
      <dd>• 是的，没有彩铃功能，是不能设置彩铃的哦。但下载手机铃声还是可以正常使用的。</dd>
    </dl>
    <dl>
      <dt class="fz17">5. 如何退订会员服务？</dt>
    </dl>
    <div><button class="btn-out" @click='unsubscribe'>退订</button></div>
  </div>
  <Slider v-if="setShow" :title="sliderTit" @close="close">
    <img class="icon-succ" v-show="!userInfo.isLogin" src="../../static/img/icon-success.png" alt="">
    <p class="fz15" v-show="!userInfo.isLogin">{{msg}}</p>
    <div v-if="userInfo.isLogin">
      <Login :state="{isLogin: 3}"></Login>
    </div>
  </Slider>
  <!--退订成功滑窗-->
  <Slider v-show="quitState.state" title="提示" @close="close" >
    <img class="icon-succ" src="../../static/img/icon-success.png" alt="">
    <p class="fz15">{{quitState.msg}}</p>
    <div class="succBtn">
      <button @click="close">我知道了~</button>
    </div>
  </Slider>
  <!--确定弹窗-->
  <modal v-show="alertShow" @close="alertClose" @confirm="alertConfirm" @cancel="alertClose" title="温馨提示" hasCancel="true">亲，是否确认退订VIP会员服务？</modal>
</div>
</template>

<script>
import Back from '@/components/Back.vue'
import Login from '../components/Login.vue'
import { mapState , mapMutations } from 'vuex'
import store from '../store'
export default {
  name: 'help',
  components:{Back, Login },
  data() {
    return {
      setShow: false,
      msg: '',
      sliderTit:'',
      alertShow: false
    }
  },
  computed: {
    ...mapState(['userInfo','quitState']),
  },
  methods:{
    ...mapMutations(['updateQuitState']),
    close() {
      this.setShow = false
      this.updateQuitState({state: false,msg: ''})
    },
    unsubscribe(){
      if(!this.userInfo.isLogin) {
        this.msg = '您还没有登录，不能退订哦~'
        this.sliderTit = '温馨提示'
        this.setShow = true
      } else {
        if(this.userInfo.msg.orderstate === 3) {
          //  月底到期
          store.commit('updateModal', { title: '温馨提示', content: '亲，您的服务截止'+ new Date(new Date(1970, 1, 1).getUTCMilliseconds() + parseFloat(this.userInfo.msg.orderendtime)).toLocaleDateString() +',不需要重复退订!'})
        } else if(this.userInfo.msg.orderstate === 0 || this.userInfo.msg.orderstate === 1 || this.userInfo.msg.orderstate === 2) {
        //会员
          this.alertShow = true
        } else {
          //非会员
          store.commit('updateModal', { title: '温馨提示', content: '亲，您还不是会员,不退订哦!'})
        }
      }
    },
    alertClose() {
      this.alertShow = false
    },
    alertConfirm() {
      this.setShow = true
      this.sliderTit = '退订VIP会员'
      this.alertShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/variables';
.help_content{
  background: #ffffff;
  padding:px2rem(20) px2rem(10) px2rem(10);
  box-sizing: border-box;
}
dt{
  /*font-size: px2rem(26);*/
  line-height: 1.4;
  color: #000;
  margin-top: px2rem(5);
}
dd{
  /*font-size: px2rem(22);*/
  display: block;
  padding-left: px2rem(15);
  box-sizing: border-box;
  color: #666;
  line-height: 1.8;
}
.btn-out{
  height: px2rem(80);
  border: px2rem(2) solid $c-red;
  color: $c-red;
  font-size: px2rem(25);
  width: 90%;
  background: none;
  margin: 0 auto;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  border-radius: 15px;
  display: block;
  margin-top: px2rem(20);
}
  .quit{
      img{
        display: block;
        width: px2rem(110);
        height: px2rem(110);
        margin: px2rem(40) auto;
      }
      p{
        color: #666;
        text-align: center;
      }
    .succBtn{
      width: 90%;
      margin: 0 auto;
      button{
        @extend %redBtn
      }
    }

  }
</style>
