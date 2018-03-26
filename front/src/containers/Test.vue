<template>
<div class="test">
  <loading v-if="loading_show" title="音频加载中..."></loading>
  <button @click="_openModal">弹窗</button>
  <button @click="_openSlider">滑窗</button>
  <Modal v-if="modalShow" title="哈哈" confirm="知道了" :hasCancel="true" @close="_closeModal">haha</Modal> 
  <Slider v-if="sliderShow" @close="_closeSlider">sliderssss</Slider> 
</div>
</template>

<script>
export default {
  name: 'test',
  data() {
    return {
      modalShow: false,
      sliderShow: false,
      loading_show:true
    }
  },
  methods: {
    _openModal() {
      this.modalShow = true
    },
    _closeModal() {
      this.modalShow = false
    },
    _openSlider() {
      this.sliderShow = true
    },
    _closeSlider() {
      this.sliderShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/variables';
</style>
