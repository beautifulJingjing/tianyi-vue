/**
 * props {
    title: 标题文案，默认'提示'
    confirm: 确认按钮文案，默认'确认'
    cancel: 取消按钮文案，默认'取消',
    hasCancel: 是否有取消按钮，默认false,
    complex: 是否含有复杂内容, 默认false
   }
   events {
    confirm: 点确认时的事件
    cancel: 点取消时的事件
    close: 点X关闭时的事件
   }
 */
<template>
<div class="modal">
  <div class="modal-body">
    <div class="head"> {{title}} <i class="iconclose iconfont icon-close48 fz24" @click="_close"></i></div>
    <div class="main">
      <slot v-if="complex"></slot>
      <span class="inner" v-else><slot></slot></span>
    </div>
    <div class="foot">
      <span class="btn btn-no" v-if="hasCancel" @click="_cancel">{{cancel}}</span>
      <span class="btn btn-yes" @click="_confirm">{{confirm}}</span>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'modal',
  data() {
    return {}
  },
  props: {
    title: {
      default: '提示',
    },
    confirm: {
      default: '确认'
    },
    cancel: {
      default: '取消'
    },
    hasCancel: {
      default: false
    },
    complex: {
      default: false
    },
  },
  methods: {
    _close() {
      this.$emit('close')
    },
    _cancel() {
      this.$emit('cancel')
    },
    _confirm() {
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/variables';
.modal {
  position: fixed;
  left: 0; right: 0; top: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 250;
}
$r: px2rem(12);
.modal-body {
  @extend %center;
  width: 90%;
  border-radius: $r;
  background-color: #fff;
}
.head {
  position: relative;
  line-height: px2rem(75);
  text-align: center;
  color: #fff;
  background-color: $c-red;
  border-top-left-radius: $r;
  border-top-right-radius: $r;
  .iconclose {
    @extend %centerV;
    right: px2rem(12);
    color: #fff;
  }
}
.main {
  padding: px2rem(25);
  word-break: break-all;
  line-height: 1.4;
  text-align: center;
  .inner {
    text-align: left;
  }
}
.foot {
  padding: 0 0 px2rem(25);
  text-align: center;
}
.btn {
  line-height: px2rem(60);
  padding: 0 px2rem(38);
  color: #fff;
  text-align: center;
  border-radius: px2rem(8);
  margin-left: px2rem(10);
  &:first-child {
    margin-left: 0;
  }
}
.btn-no {
  background-color: #999;
}
.btn-yes {
  background-color: $c-red;
}
</style>
