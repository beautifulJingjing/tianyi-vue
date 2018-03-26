props
ringid: 铃音id,
img.imgPlay: 播放按钮暂停状态图片
img.imgPause: 播放按钮播放状态图片
<template>
  <div class="audio">
    <img v-show="!isPlay" :src="img.imgPlay ? img.imgPlay : '../../static/img/btn-play-red.png'" @click="play">
    <img v-show="isPlay" :src="img.imgPause ? img.imgPause : '../../static/img/btn-pause-red.png'" @click="pause">
  </div>
</template>  

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  data() {
    return {
      audio: null
    }
  },
  props: [ 'ringid' , 'img'],
  computed: {
    ...mapState(['currPlay','lastCurrPlay']),
    isPlay() {
      return this.ringid === this.currPlay
    },
  },
  methods: {
    ...mapMutations(['updateCurrPlay','updateLoading','updateLastCurrPlay']),
    pause() {
      this.$audio.pause()
      this.updateCurrPlay(null)
      this.updateLastCurrPlay(this.ringid)
    },
    play() {
      if(this.lastCurrPlay === this.ringid) {
        this.$audio.play()
      } else {
        this.updateLoading({show: true,content: '音频加载中...'})
        this.$audio.src = this.$audioSrc(this.ringid)
        this.$audio.play()
        this.updateLastCurrPlay(null)
      }
      this.updateCurrPlay(this.ringid)
    }
  }
};
</script>

<style lang="scss" scoped>
  @import '../assets/css/variables';
  .audio{
    position: absolute;
    top: 50%;
    margin-top: px2rem(-30);
    width: px2rem(60);
    height: px2rem(60);
    img{
      width: 100%;
    }
  }
</style>
