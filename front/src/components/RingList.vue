<template>
<div class="ringList">
  <Rings :lists="lists" :data="msg" :styles="{}"></Rings>
  <p class="fz14 btnMore" @click="getMore">
    <span>点击加载更多</span>
  </p>
</div>
</template>  

<script>
import Rings from '../components/Rings.vue'
import { mapState, mapMutations } from 'vuex'
import store from '../store'
export default {
  name: 'hottest',
  components: {Rings},
  data() {
    return {
      lists: [],
      start: 0,
      mum: 20
    }
  },
  props: [ 'msg' ],
  computed: {
    ...mapState(['recentList','hotList']),
  },
  created() {
    this.getRingList()
  },
  methods: {
    ...mapMutations(['updateRecentList','updateHotList','updateLoading']),
    getRingList() {
      if(this.msg.pid == '-1'){
        if(this.recentList.length == 0){
          this.getRecentList()
        }else{
          this.lists = this.recentList
        }
      } else {
        if(this.hotList.length == 0){
          this.getHotList()
        } else {
          this.lists = this.hotList
        }
      }
    },
    getRecentList() {
      this.updateLoading({show:true,content: '正在加载中...'})
      this.$axios({
        url: '/getRingList',
        method: 'get',
        params: {
          pid: this.msg.pid,
          start: this.start,
          records: 20
        }
      })
        .then(res => {
          this.updateLoading({show: false,content: ''})
          if(res.list.length !== 0) {
            this.updateRecentList(res.list)
            this.lists = this.recentList
          } else {
            store.commit('updateModal', { title: '温馨提示', content: '已加载全部铃声'})
          }
        })
    },
    getHotList() {
      this.updateLoading({show:true,content: '正在加载中...'})
      this.$axios({
        url: '/getRingList',
        method: 'get',
        params: {
          pid: this.msg.pid,
          start: this.start,
          records: 20
        }
      })
        .then(res => {
          this.updateLoading({show: false,content: ''})
          if(res.list.length !== 0) {
            this.updateHotList(res.list)
            this.lists = this.hotList
          } else {
            store.commit('updateModal', { title: '温馨提示', content: '已加载全部铃声'})
          }
        })
    },
    getMore() {
      if(this.msg.pid === '-1'){
        this.start = this.recentList.length
        if(this.start > this.recentList.length-1){
          this.getRecentList()
        }else{
          this.lists = this.recentList
        }
      } else if( this.msg.pid === '-2'){
        this.start = this.hotList.length
        if(this.start > this.hotList.length-1){
          this.getHotList()
        }else{
          this.lists = this.hotList
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../src/assets/css/variables";
.ringList{
  .btnMore{
    line-height: px2rem(80);
    text-align: center;
    background: #ffffff;
    border-bottom: 1px solid #ededed;
    span{
      background: url(../../static/img/icon-more.png) left center no-repeat;
      color: #070707;
      background-size: px2rem(32);
      padding-left: px2rem(60);
    }
  }
}
</style>
