<template>
<div>
  <Back :title="partTitle" ></Back>
  <Rings :lists="lists" :data="{vip: '3'}" styles="{}"></Rings>
  <p class="fz14 btnMore" @click="getMore">
    <span>点击加载更多</span>
  </p>
</div>
</template>  

<script>
  import Back from '../components/Back'
  import Rings from '../components/Rings'
  import { mapState, mapMutations } from 'vuex'
  import store from '../store'
  export default {
    data() {
      return {
        lists: [],
        start: 0,
        paramsId: this.$route.params.id
      }
    },
    name: 'PartList',
    components: { Back , Rings},
    computed: {
      ...mapState(['partTitle'])
    },
    mounted() {
      this.getRingList()
    },
    methods: {
      ...mapMutations(['updateLoading']),
      getRingList() {
        this.updateLoading({show: true,content: '正在加载中...'})
        this.$axios({
          url: '/getRingList',
          method: 'get',
          params: {
            pid: this.paramsId.substring(0,this.paramsId.length-1),
            start: this.start,
            records: 20
          }
        })
        .then(res => {
          this.updateLoading({show: false,content: ''})
          if(res.list.length !== 0){
            this.lists = this.lists.concat(res.list)
          }else{
            store.commit('updateModal',{title: '温馨提示',content: '已加载全部铃声'})
          }
        })
      },
      getMore() {
        this.start += 20
        this.getRingList()
      }
    }
  };
</script>

<style lang="scss" scoped>
@import "../../src/assets/css/variables";
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
</style>