/**
  props {
    title 标题
    link 返回按钮的链接，默认返回上一页
    hasRight 是否有右侧内容 默认false
  }
 */
<template>
<div class="back fz16">
  <div class="title" v-html="title"></div>
  <div class="btn-back clear" @click="handleBack">
    <i class="iconfont icon-fanhui fz20 fl"></i><span class="fl">返回</span>
  </div>
  <div class="right fz14" v-if="hasRight"><slot></slot></div>
</div>
</template>

<script>
export default {
  name: 'back',
  data() {
    return {}
  },
  props: ['title', 'link', 'hasRight'],
  methods: {
    handleBack() {
      if (this.link) {
        location.href = link
      } else {
        history.go(-1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/variables';

$h: px2rem(80);
$p: px2rem(20);
.back {
  position: relative;
  height: $h;
  line-height: $h;
  background-color: #fff;
  border-bottom: 1px solid $c-bb;
  color: #777;
}
.title {
  @extend %centerH;
  top: 0;
  width: 55%;
  @extend %oneLine;
  text-align: center;
}
.btn-back {
  position: absolute;
  top: 0;
  left: $p;
  i, span {
    color: $c-red;
    vertical-align: middle;
  }
}
.right {
  @extend %centerV;
  right: $p;
  line-height: 1;
  a{
    color: #777;
  }
}
</style>
