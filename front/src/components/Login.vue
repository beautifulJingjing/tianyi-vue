<template>
<div class="login">
  <p>
    <input type="tel" class="fz15" placeholder="请输入手机号" v-model="phone" maxlength="11">
  </p>
  <p class="phone_code">
    <input type="tel" class="fz15" placeholder="请输入短信验证码" v-model="phoneCode" maxlength="6">
    <button class="fr fz13" @click="btnGetCode" id="btn_getCode">{{this.getText}}</button>
  </p>
  <p>
    <button class="fz18 login_btn" @click="btnLogin">确定</button>
  </p>
</div>
</template>  

<script>
import { mapState , mapMutations } from 'vuex'
import store from '../store'
import Slider from "../plugin/Slider";
export default {
  components: {Slider},
  data() {
    return {
      phone: '',
      phoneCode: '',
      index: -1
    }
  },
  created() {
    this.phone = this.userInfo.msg.phone
  },
  props: [ 'state' ],
  mounted() {
    if(this.tempPhone != null) {
      this.phone = this.tempPhone
    }
  },
  computed: {
    ...mapState(['userInfo','quitState','loginMode','tempPhone']),
    getText() {
      return this.index == -1 ? '获取短信验证码' : '验证码已下发('+this.index+')'
    }
  },
  methods: {
    ...mapMutations(['updateOrderCode','updateLogin','updateUserInfo','updateQuitState','updateLoginMode','updateLoading','updatePopSliderState']),
    btnLogin() {
      //state.isLogin (1-登录跳转,2-登录不跳转，3-退订)
     if(this.state.isLogin == 1 || this.state.isLogin === 2){
       this.login1()
     } else {
       this.unsubscribe()
     }
    },
    btnGetCode() {
      if(this.index == -1) {
        //登录
        if(this.state.isLogin == 1 || this.state.isLogin == 2){
          this.getCode(0)
        } else {
          //退出
          this.getCode(2)
        }
      } else {
        return
      }

    },
    //获取手机验证码
    getCode(type) {
      if (!this.phone){
        this.alertMsg('请输入您的手机号码。')
        return false
      }
      if (!new RegExp(/^(133|153|177|173|(18[0|1|9]))\d{8}$/).test(this.phone)){
        this.alertMsg('亲，别闹了，搞个电信的手机号码再来！')
        return false
      }
      var timer = null
      this.index = 60
      const $this = this
      timer = setInterval(() => {
        $this.index --
        if($this.index < 0){
          clearInterval(timer)
        }
      },1000)
      this.$log({
        name: 'doSendCheckcode.Before',
        params: {
          phone: this.phone,
          dir: '1',
          type: type
        }
      })
      this.$axios({
        url: '/getCheckCode',
        method: 'post',
        data: {
          phone: this.phone,
          dir: '1',
          type: type
        }
      }).
      then(res => {
        this.$log({
          name: 'doSendCheckcode',
          params: {
            phone: this.phone,
            dir: '1',
            type: type
          }
        })
      })
    },
    //登录成功之后跳转到个人中心
    login1() {
      if (!this.phone){
        this.alertMsg('请输入您的手机号码。')
        return false
      }
      if (!new RegExp(/^(133|153|177|173|(18[0|1|9]))\d{8}$/).test(this.phone)){
        this.alertMsg('亲，别闹了，搞个电信的手机号码再来！')
        return false
      }
      if (!this.phoneCode){
        this.alertMsg('请输入验证码。')
        return false
      }
      this.updateLoading({show: true,content: '用户验证，请稍后...'})
      switch(window.spconfig.login.mode) {
        case '1':
          this.$log({
            name: 'alertLogin.doOK',
            params: {
              phone: this.phone,
              checkcode: this.phoneCode
            }
          })
          break;
        case '2':
          this.$log({
            name: 'alertLoginOrder.doOK',
            params: {
              phone: this.phone,
              checkcode: this.phoneCode
            }
          }) 
          break;
        case '3': 
          this.$log({
            name: 'alertLoginCrbt.doOK',
            params: {
              phone: this.phone,
              checkcode: this.phoneCode
            }
          })
          break;  
      }
      this.$axios({
        url: '/login',
        method: 'post',
        data: {
          phone: this.phone,
          checkcode: this.phoneCode
        }
      })
        .then(res => {
          this.updateLoading({show: false,content: ''})
          if(res.order) {
            this.updateOrderCode(res.order.code)
          }
          if(res.user !== undefined || res.user !== '' || Object.keys(res.user).length !== 0) {
            this.updateLogin(true)
            this.updateUserInfo(res.user)
          }

          if(this.state.isLogin === 1) {
            this.$router.push(this.$setLink('userCenter1'))
            this.updateLoginMode(1)
          } else if(this.state.isLogin === 2){
            this.updateLoginMode(2)
          }
          this.$emit('loginCallBack')
        })
    },
    //退订请求
    unsubscribe() {
      if (!this.phone){
        this.alertMsg('请输入您的手机号码。')
        return false
      }
      if (!new RegExp(/^(133|153|177|173|(18[0|1|9]))\d{8}$/).test(this.phone)){
        this.alertMsg('亲，别闹了，搞个电信的手机号码再来！')
        return false
      }
      if (!this.phoneCode){
        this.alertMsg('请输入验证码。')
        return false
      }
      this.updateLoading({show: true,content: '用户验证，请稍后...'})
      this.$axios({
        url: '/offOrder',
        method: 'post',
        data: {
          phone: this.phone,
          checkcode: this.phoneCode
        }
      })
        .then(res => {
          this.updateLoading({show: false,content: ''})
          this.phoneCode = ''
          this.updateQuitState({state: true,msg:res.msg || '退订成功'})
          this.updateUserInfo(res.user)
        })
      this.$log({
        name: 'alertOutOrder.doOK',
        params: {
          data: this.phone,
          checkcode: this.phoneCode
        }
      })
    },
    alertMsg(content) {
      store.commit('updateModal', { title: '提示', content: content})
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../assets/css/variables';
.login{
  p{
    padding: px2rem(10) px2rem(32);
    input{
      height: px2rem(75);
      border: 1px solid #cbcbd0;
      text-indent: px2rem(10);
      border-radius: px2rem(5);
      background: #f3f3f3;
      box-sizing: border-box;
      padding: px2rem(15) 0;
    }
    &:first-child{
      margin-top: px2rem(30);
      input{
        width: 100%;
      }
    }
    .login_btn{
      margin-top: px2rem(10);
      background: $c-red;
      color: white;
      text-align: center;
      border-radius: px2rem(10);
      border: none;
      width: 100%;
      height: px2rem(90);
    }
  }
  p.phone_code{
    input{
      width: px2rem(300);
    }
    button{
      height: px2rem(75);
      padding: 0 px2rem(30);
      border-radius: px2rem(5);
      color: $c-red;
      text-align: center;
      border: 1px solid $c-red;
      background: transparent;
    }
  }
}
</style>