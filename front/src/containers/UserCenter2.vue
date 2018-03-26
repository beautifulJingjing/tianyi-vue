<template>
  <div class="login_com">
    <Back :title="userInfo.isLogin ? '更换手机号码' : '会员中心'" :hasRight="true">
      <router-link :to="$setLink('help')">帮助</router-link>
    </Back>
    <Login :state="{isLogin: 1}"></Login>
    <WarmPrompt :data="{isLogin: false}"></WarmPrompt>
  </div>
</template>  

<script>
import Back from '../components/Back.vue'
import Login from '../components/Login.vue'
import WarmPrompt from '../components/WarmPrompt.vue'
import { mapState , mapMutations } from 'vuex'
export default {
  name: 'UserCenter2',
  components: { Login , Back , WarmPrompt},
  computed: {
    ...mapState(['userInfo'])
  },
  created() {

  },
  methods: {
    ...mapMutations(['updateLogin']),
  }
};
</script>

<style lang="scss" scoped>

</style>