/**
  props {
    title: '标题'
  }
  events {
    close: 关闭事件
  }
 */

<template>
<transition name="slide">
  <div class="slider">
    <div class="head"><span class="close" @click="_close"><i class="iconfont icon-arrowleft fz24"></i></span>{{title}}</div>
    <div class="main"><slot></slot></div>
  </div>
</transition>
</template>

<script>
export default {
  name: 'slider',
  data() {
    return {}
  },
  props: {
    title: {
      default: '提示'
    }
  },
  methods: {
    _close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/variables';

.slider {
  position: fixed;
  left: 0;right: 0;top: 0;bottom: 0;
  background-color: #fff;
  z-index: 100;
  overflow: auto;
}
$h-head: px2rem(74);
.head {
  position: relative;
  line-height: $h-head;
  background-color: $c-red;
  text-align: center;
  color: #fff;
}
.close {
  position: absolute;
  left: 0;top: 0;bottom: 0;
  width: px2rem(74);
  border-right: 2px solid #cb4638;
  text-align: center;
  i {
    color: #fff;
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

