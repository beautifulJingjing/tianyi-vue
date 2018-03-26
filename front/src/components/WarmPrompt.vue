<template>
<div class="prompt">
  <div class="vip fz15" v-show="data.isLogin === 2">
    <!--<span>VIP会员特权</span>-->
    <span>{{title}}</span>
  </div>
  <div class="msg">
    <p v-html="content">
      <!--&lt;!&ndash;温馨提示：<br>&ndash;&gt;-->
      <!--&lt;!&ndash;• 下载铃声或更换彩铃，需升级翼铃高级VIP会员，只需<u>6元/月</u>即可免费不限次数的下载更换彩铃和来电铃，所有铃声：0元/首。<br>&ndash;&gt;-->
      <!--&lt;!&ndash;• 已经是高级VIP会员的用户，该操作仅为登录，不会重复升级。<br>&ndash;&gt;-->
      <!--&lt;!&ndash;• 海量高清彩铃需彩铃功能支持（<u>参考资费5元/月</u>），以本地运营商资费为准。（<u>彩铃用户请忽略此项</u>）&ndash;&gt;-->
    </p>
  </div>
</div>
</template>  

<script>
export default {
  data() {
    return {
      title: window.spconfig.login.pop.title,
      content: window.spconfig.user_center.explain.content.replace(/[\r\n]/g,'<br>')
    }
  },
  props: [ 'data'],
  methods: {

  }
};
</script>

<style lang="scss">
  @import '../assets/css/variables';
  .prompt{
    padding: px2rem(30);
    .vip{
      color: #333333;
      line-height: px2rem(30);
      font-weight: 600;
      margin-bottom: px2rem(30);
      span{
        padding-left: px2rem(20);
        border-left: px2rem(10) solid $c-red;
      }
    }
    .msg{
      p{
        line-height: px2rem(44);
        color: #666;
      }
      u{
        text-decoration: none;
        color: $c-red;
      }
    }
  }
</style>
