<template>
<div class="search">
  <Back></Back>
  <div class="search_area">
    <input type="text" class="search_input" placeholder="输入关键字" v-model='search_mes'>
    <input type="button" class="search_btn" value="搜索" @click='search'>
  </div>
  <div v-show="lists.length !== 0" class="ringList">
    <Rings :lists="lists" data="{vip: '1'}" :styles="{}"></Rings>
    <p class="fz14 btnMore" @click="getMore">
      <span>点击加载更多</span>
    </p>
  </div>
</div>
</template>

<script>
import Back from '@/components/Back.vue'
import Rings from '../components/Rings.vue'
import {mapState , mapMutations} from 'vuex'
export default {
  name: 'search',
  data() {
    return {
      search_mes: "",
      lists: [],
      start: 0
    }
  },
  components:{ Back, Rings },
  methods:{
    ...mapMutations(['updateLoading']),
    search(){
      this.lists = []
      if(this.search_mes === ""){
        alert("请输入搜索内容！")
        return
      }else{
        this.getList();
      }
    },
    getList() {
      this.updateLoading({show: true,content: '正在加载中...'})
      this.$axios({
        method:'get',
        url:'/getSearch',
        params: {
          key:this.search_mes,
          type: '-1',
          start: this.start,
          records: 20
        }
      })
        .then((res) => {
          this.updateLoading({show: false,content: ''})
          this.lists = this.lists.concat(res.list)
        })
    },
    getMore() {
      this.start += 20
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/variables';
.search_area{
  background: #cac9ce;
  padding: .5em;
}
.search_area:before{
  content: "";
  display: table;
  clear:both
}
.search_area:after{
  content:"";
  display: table;
  clear:both;
}
.search_input{
    float: left;
    width: 74%;
    background: #fff url(/static/img/icons_search.png) px2rem(16) center no-repeat;
    background-size: px2rem(32);
    -webkit-background-size: px2rem(32);
    -moz-background-size: px2rem(32);
    -o-background-size: px2rem(32);
    padding-left: px2rem(64);
    border: none;
    display: block;
    height: px2rem(65);
    line-height: px2rem(65);
    border-radius: .3em;
    color: #999;
    overflow: hidden;
    text-indent: 1em;
    box-sizing: border-box;
    padding-top: px2rem(15);
    padding-bottom: px2rem(15);
}
.search_btn{
    float: right;
    width: 23%;
    background: #ff4a00;
    font-size: 1.4em;
    color: #fff;
    border: 0;
    display: block;
    height: px2rem(65);
    line-height: px2rem(65);
    font-size: px2rem(33);
    border-radius: .3em;
    color: #fff;
    overflow: hidden;
}
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
