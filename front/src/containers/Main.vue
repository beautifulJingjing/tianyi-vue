<template>
<div class="index" :class="{paddingTop: isFixed}">
  <div class="nav fz16" :class="{fixed : isFixed}">
    <router-link :to="$setLink('zt')" >专题</router-link>
    <router-link :to="$setLink('recent')" >最新</router-link>
    <router-link :to="$setLink('hottest')" >最热</router-link>
    <router-link :to="$setLink('classify')" >分类</router-link>
    <img src="../../static/img/icon_arrow.png" class="arrow" :style="{ left: arrowLeft }" />
  </div>
  <router-view></router-view>
</div>
</template>

<script>
import {mapState, mapMutations, mapGetters} from 'vuex'
import Back from '@/components/Back.vue'

export default {
  name: 'index',
  components: { Back },
  data () {
    return {
      arrowLeft: 0,
      isFixed: false,
      fontSize: document.getElementsByTagName('html')[0].style.fontSize
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    alert() {
      this.$message.success('hahah')
    },
    request() {
    },
    setArrow(name) {
      const leftMap = {
        'zt': '8%',
        'recent': '33%',
        'hottest': '58%',
        'classify': '83%',
      }
      this.arrowLeft = leftMap[name]
    },
    scrollAuto() {
      const scrollTop = document.body.scrollTop
      if(this.userInfo.isLogin) {
        if(scrollTop > parseInt(this.fontSize)*3.9){
          this.isFixed = true
        } else {
          this.isFixed = false
        }
      } else {
        if(scrollTop > parseInt(this.fontSize)*2.4) {
          this.isFixed = true
        } else {
          this.isFixed = false
        }
      }
    }
  },
  mounted() {
    this.setArrow(this.$route.name)
    window.addEventListener('scroll',this.scrollAuto)
  },
  watch: {
    '$route.name' (next) {
      this.setArrow(next)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/variables';

.nav{
  position: relative;
  background-color: $c-red;
  display: flex;
  line-height: px2rem(80);
  a{
    flex: 1;
    color: white;
    text-align: center;
  }
}
.arrow {
  position: absolute;
  width: 9%;
  bottom: 0;
  transition: left .5s;
}
.fixed{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 20;
}
.paddingTop {
  padding-top: px2rem(80);
}
</style>
