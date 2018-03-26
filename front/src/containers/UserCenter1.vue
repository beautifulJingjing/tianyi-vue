<template>
<div class="userCenter">
  <Back title="会员中心" :hasRight="true">
    <router-link :to="$setLink('help')">帮助</router-link>
  </Back>
  <div class="isLogin_true">
    <div class="fl left">
      <img src="/static/img/user-default.png" alt="">
      <div>
        <p>{{userInfo.msg.phone}}</p>
        <span v-if="userInfo.msg.orderstate == 2 ||userInfo.msg.orderstate == 0">会员</span>
        <span v-if="userInfo.msg.orderstate == 3">月底到期</span>
        <span v-if="userInfo.msg.orderstate ==4">非会员</span>
      </div>
    </div>
    <div class="fr right">
      <router-link class="changePhone" @click.native="changePhone" :to="$setLink('userCenter2')">更换手机号</router-link>
    </div>
  </div>
  <div class="upgrade" v-if="userInfo.msg.orderstate === 4">
    <button class="fz16" @click="setServe">升级VIP会员</button>
  </div>
  <WarmPrompt :data="{isLogin: userInfo.msg.orderstate}"></WarmPrompt>
  <Open v-if="sliderOne" @_closeSlider="closeSlider" @closeOpen="closeSlider"></Open>
</div>
</template>

<script>
import Back from '../components/Back.vue'
import WarmPrompt from '../components/WarmPrompt.vue'
import Open from '../components/Open.vue'
import { mapState , mapMutations } from 'vuex'
export default {
  components: { Back , WarmPrompt , Open},
  data() {
    return {
      sliderOne: false
    }
  },
  computed: {
    ...mapState(['userInfo']),
  },
  methods: {
    ...mapMutations(['updateUserInfo','updateLoading']),
    setServe() {
      this.sliderOne = true
      this.$log({
        name: 'doOpenServe'
      })
    },
    closeSlider() {
      this.sliderOne = false
    },
    changePhone() {
      this.$log({
        name: 'changePhoneNumber'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/variables';
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

</style>
