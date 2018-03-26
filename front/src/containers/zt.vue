<template>
  <div class="zt">
    <ul>
      <li v-for="(item,index) in ztList" :key="item.ringid">
        <router-link :to="{path:'/m/partlist/'+item.pid+'1',query:{spinfocode: $utils.query('spinfocode')}}" @click.native="saveTit(item.name)">
          <img :src="item.picpath">
          <p class="fz18">{{item.name}}</p>
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script>
  import { mapGetters, mapState, mapMutations  } from 'vuex'
  export default {
    name: 'zt',
    data() {
      return {
      }
    },
    computed: {
      ...mapState(['ztList']),
      ...mapGetters(['isLogin'])
    },
    created() {
      this.getList()
    },
    methods: {
      ...mapMutations(['updateZtList','updateLoading','updatePartTitle']),
      getList() {
        if (!this.ztList) {
          this.updateLoading({show: true,content: '正在加载中...'})
          this.$axios({
            url: '/getParts',
            method: 'get',
            params: {
              type: '1',
              start: 0,
              records: 21
            }
          })
            .then(res => {
              this.updateZtList(res.list)
              this.updateLoading({show: false,content: ''})
            })
        }
      },
      saveTit(name) {
        this.updatePartTitle(name)
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '../assets/css/variables';
.zt{
  box-sizing: border-box;
  padding:  px2rem(15);
  ul{
    padding-top: px2rem(10);

    li{
      margin-bottom: px2rem(20);

      a{
        width: 100%;
        color: #4a4f52;
        border: 1px solid #ccc;
        padding: px2rem(10);
        border-radius: px2rem(10);
        img{
          width: 100%;
          // height: px2rem(236);
        }
        p{
          line-height: px2rem(60);
        }
      }
    }
  }
}
</style>
