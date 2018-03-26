data父组件传递的数据
data.index: 当前铃音在数组中的索引值
data.name: 当前歌曲名称
data.songer: 歌手名字
data.ringid: 铃音id
data.imgPlay: 播放按钮暂停状态图片
data.imgPause: 播放按钮播放状态图片
data.new: 1/显示最新图片，其他值都为不显示
data.hot: 1/显示最热图标，其他值都为不显示
data.vip: 1/显示VIP图标，其他值都为不显示
data.imgSetRing: 设铃按钮图标
data.imgDownRing: 下载按钮图标
<template>
<div class="ring">
  <RingPlay :ringid="data.ringid" :img="{imgPlay: data.imgPaly, imgPause: data.imgPause}"></RingPlay>
  <div class="summary" @click="play">
    <p class="fz14" >
      <span>{{data.index+1}}.{{data.name}}</span>
      <i v-if="data.new == '1'" class="new fz12">新</i>
      <i v-if="data.hot == '1'" class="hot fz12">热</i>
      <i v-if="data.vip == '1'" class="vip"></i>
    </p>
    <span class="fz12">{{data.songer}}</span>
  </div>
  <div class="operation">
    <img class="setring" :src="data.imgSetRing ? data.imgSetRing : '../../static/img/btn-setring-red.png'" @click="_setRing(data.ringid)">
    <img class="download" :src="data.imgDownRing ? data.imgDownRing : '../../static/img/btn-download-red.png'" @click="_downloadRing(data.ringid)">
  </div>
</div>
</template>  

<script>
import RingPlay from '../components/RingPlay.vue'
import Login from '../components/Login.vue'
import { mapState , mapMutations } from 'vuex'
export default {
  name: 'Ring',
  components: { RingPlay },
  props: [ 'data' ],
  data() {
    return {
      imgShow: false
    }
  },
  computed: {
    ...mapState(['currPlay','lastCurrPlay']),
    isPlay() {
      return this.data.ringid === this.currPlay
    }
  },
  methods: {
    ...mapMutations(['updateLoading','updateCurrPlay','updateLastCurrPlay']),
    _setRing() {
      this.$emit('setRing')
    },
    _downloadRing() {
      this.$emit('downloadRing')
    },
    play() {
      if(this.data.ringid === this.currPlay){
        this.updateCurrPlay(null)
        this.$audio.pause()
        this.updateLastCurrPlay(this.data.ringid)
      } else {
        this.updateCurrPlay(this.data.ringid)
        if(this.lastCurrPlay === this.currPlay) {
          this.$audio.play()
        } else {
          this.updateLoading({show: true,content: '音频加载中...'})
          this.$audio.src = this.$audioSrc(this.data.ringid)
          this.$audio.play()
          this.updateLastCurrPlay(null)
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../assets/css/variables';
.ring{
  position: relative;
  padding: px2rem(15) px2rem(20);
  border-bottom: 1px solid #ededed;
  // background: #fff;
  .summary{
    width: px2rem(380);
    margin-left: px2rem(80);
    p{
      span{
        display: inline;
        color: #4d4c4d;
        line-height: px2rem(35);
      }
      i{
        width: px2rem(40);
        height: px2rem(40);
        line-height: px2rem(40);
        text-align: center;
        border-radius: 50%;
        vertical-align: middle;
      }
      .new{
        color: #ffffff;
        background: #50e3c2;
      }
      .hot{
        color: #ffffff;
        background: #fe7e83;
      }
      .vip{
        background: #f5d523 url(../../static/img/icon-vip.png) center no-repeat;
        background-size: px2rem(30);
      }
    }
    span{
      color: #999;
      margin-top: px2rem(10);
    }
  }
  .operation{
    @extend %centerV;
    right: px2rem(15);
    img{
      width: px2rem(60);
      height: px2rem(60);
    }
    .setring{
      margin-right: px2rem(10);
    }
  }
  .setRing{
    line-height: px2rem(80);
    position: relative;
    padding: px2rem(50) 0 px2rem(40);
    border-bottom: px2rem(1) solid #ededed;
    .audio{
      /*width: px2rem(90);*/
      /*height: px2rem(90);*/
      left: px2rem(80);
    }
    .summary{
      line-height: px2rem(30);
      margin-left: px2rem(140);
      span{
        line-height: px2rem(20);
      }
    }
  }
  .msg{
    margin-top: px2rem(20);
    padding: 0 px2rem(40);
    color: #666666;
    h4{
      font-weight: 500;
      line-height: 2rem;
    }
    p{
      line-height: px2rem(40);
    }
    button{
      @extend %redBtn;

    }
    a{
      color: $c-red;
    }
  }
}
</style>
