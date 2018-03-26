<template>
  <div class="classify fz15">
    <router-link :to="{path:'/m/partlist/'+tit.pid+'3',query:{spinfocode: $utils.query('spinfocode')}}" v-for="(tit,index) in classifyList" :key="tit.pid" @click.native="setTit(tit.name)">
      <span >{{tit.name}}</span>
    </router-link>
  </div>
</template>  

<script>
  import utils from '../plugin/utils'
  import { mapState , mapMutations } from 'vuex'
  export default {
    name: 'classify',
    data() {
      return {
      }
    },
    created() {
      this.getList()
    },
    computed: {
      ...mapState(['classifyList'])
    },
    methods: {
      ...mapMutations(['upadateClassifyList','updateLoading','updatePartTitle']),
      getList() {
        if(!this.classifyList){
          this.updateLoading({show: true,content: '正在加载中...'})
          this.$axios({
            url: '/getParts',
            method: 'get',
            params: {
              type: '3',
              start: 0,
              records: 14
            }
          })
            .then(res => {
              this.upadateClassifyList(res.list)
              this.updateLoading({show: false,content: ''})
            })
        }
      },
      setTit(name) {
        this.updatePartTitle(name)
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '../assets/css/variables';
.classify{

  a{
    line-height: px2rem(90);
    width: 33.2%;
    text-align: center;
    color: #4a4e51;
    border-bottom: px2rem(1) solid #ddd;
    &:nth-of-type(3n-1){
      border-left: px2rem(1) solid #ddd;
      border-right: px2rem(1) solid #ddd;
    }
  }
}
</style>