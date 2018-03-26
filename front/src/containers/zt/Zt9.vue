<template>
<div class="zt1">
  <Back title="翼铃VIP"></Back>
  <div class="container">
    <div class="ban">
      <img src="../../../static/img/zt/zt9/ban.png" >
      <input class="fz16" type="tel" v-model="text" placeholder="请在此输入手机号码" maxlength="11">
    </div>
    <div class="ban ban2">
      <img src="../../../static/img/zt/zt9/prize-box.png">
      <button @click="getRewardEv"></button>
    </div>
    <div class="prizeList">
      <img class="prizeTit" src="../../../static/img/zt/zt9/tit-prize.png" alt="">
      <ul>
        <li class="clear">
          <img src="../../../static/img/zt/zt8/vip.png">
          <div>
            <p>腾讯视频VIP会员1年</p>
            <span>6份</span>
          </div>
        </li>
        <li class="clear">
          <img src="../../../static/img/zt/zt8/100yuan.png">
          <div>
            <p>100元电信话费</p>
            <span>20份</span> </div>
        </li>
        <li class="clear">
          <img src="../../../static/img/zt/zt8/1G.png">
          <div>
            <p>1G电信流量</p>
            <span>40份</span> </div>
        </li>
        <li class="clear">
          <img src="../../../static/img/zt/zt8/500M.png">
          <div>
            <p>500M电信流量</p>
            <span>60份</span> </div>
        </li>
        <li class="clear">
          <img src="../../../static/img/zt/zt8/10yuan.png">
          <div>
            <p>10元电信话费</p>
            <span>200份</span> </div>
        </li>
        <li class="clear">
          <img src="../../../static/img/zt/zt8/50M.png">
          <div>
            <p>50M电信流量</p>
            <span>360份</span> </div>
        </li>
        <li class="clear">
          <img src="../../../static/img/zt/zt8/5yuan.png">
          <div>
            <p>5元电信话费</p>
            <span>3000份</span> </div>
        </li>
        <li class="clear">
          <img src="../../../static/img/zt/zt8/1yuan.png">
          <div>
            <p>1元电信话费</p>
            <span>24000份</span> </div>
        </li>
      </ul>
    </div>
    <div class="ruleList">
      <img class="ruleTit" src="../../../static/img/zt/zt9/tit-rule.png">
      <ul class="fz12">
        <li><span>1</span>活动时间：2017年07月01日-2017年12月31日;</li>
        <li><span>2</span>活动期间，翼铃会员，每月都有1次抽奖机会；</li>
        <li><span>3</span>多次重复注册升级不可重复获得抽奖机会；</li>
        <li><span>4</span>输入手机号码，点击抽奖，即可出现是否中奖的提示；</li>
        <li><span>5</span>抽奖机会将在活动结束后失效；</li>
        <li><span>6</span>活动奖品将在次月初的15个工作日内进行发放，我们将发送短信通知或由客服联系获奖者确认，请获奖者保持手机畅通。以下三种情况，将不予发放奖品：① 已取消翼铃服务的用户 ② 欠费停机用户 ③ 电话无人接听，3次联系不上获奖者将视为主动放弃奖品；</li>
        <li><span>7</span>本次活动，仅限中国电信用户参加;</li>
        <li><span>8</span>在法律许可范围内，翼铃对本活动具有解释权;</li>
      </ul>
    </div>
    <div class="lottery">
      <img class="lotteryTit" src="../../../static/img/zt/zt9/tit-md.png" alt="">
      <div v-show="lotteryListShow">
        <ul>
          <li v-for="(item,index) in lotteryList">
            <span>{{item.phone}}</span>
            获得了
            <u>{{item.res_str}}</u>
          </li>
        </ul>
        <p class="btnMore" @click="getMore">{{getMoreText}}</p>
      </div>
      <div class="lottoryNone" v-show="!lotteryListShow">
        <img src="../../../static/img/zt/icon-none.png" alt="">
        <p class="fz12">还没人中奖，也许你是第一个!</p>
      </div>
    </div>
  </div>
  <Modal class="globalError" v-if="modal.modalShow" :title="modal.title" @close="_closeModal" @confirm="_confirmModal">{{modal.content}}</Modal>
</div>
</template>

<script>
import Back from '../../components/Back.vue'
import store from '../../store'
export default {
  name: 'zt1',
  data() {
    return {
      text: '',
      lid: 138,
      lotteryList: [],
      lotteryListShow: true,
      start: 0,
      getMoreText: '显示更多...',
      modal: {
        modalShow: false,
        content: ''
      }
    }
  },
  components: { Back },
  created() {
    this.getPrizeList(0)
  },
  methods: {
    getMore() {
      this.start += 5
      this.getPrizeList(this.start)
    },
    //抽奖
    getRewardEv() {
      if (!this.text){
        store.commit('updateModal', { title: '温馨提示', content: '请输入您的手机号码。'})
        return false
      }
      if (!new RegExp(/^(133|153|177|173|(18[0|1|9]))\d{8}$/).test(this.text)){
        store.commit('updateModal', { title: '温馨提示', content: '亲，别闹了，搞个电信的手机号码再来！'})
        return false
      }
      this.$axios({
        url: '/getLottery',
        method: 'post',
        data: {
          lid: this.lid,
          phone: this.text
        }
      })
        .then(res => {
          if(res.code == 1) {
            if(res.data.res_str == '') {
              if(res.data.valid_count >= 0) {
                store.commit('updateModal', { title: '温馨提示', content: '哎呦，不好意思，啥也没抽中。继续加油哦，奖品多多，总会抽到的。'})
              }
            } else {
              //中奖了
              store.commit('updateModal', { title: '温馨提示', content: '恭喜你，<u>' + res.data.res_str + '</u>！活动奖品将在次月初的15个工作日内进行发放，我们将发送短信通知或由客服联系获奖者确认，请获奖者保持手机畅通。以下三种情况，将不予发放奖品：① 已取消翼铃服务的用户 ② 欠费停机用户 ③ 电话无人接听，3次联系不上获奖者将视为主动放弃奖品'})
            }
          } else if(res.code == -1) {
            store.commit('updateModal', { title: '温馨提示', content: '哎呦，不好意思，您的抽奖机会已经用完咯。下次抽奖活动再来玩吧...'})
          } else if(res.code == -3) {
            //非会员
            this.modal.modalShow = true
            this.modal.content = '请升级会员后，再来抽奖。'
          } else {
            store.commit('updateModal', { title: '温馨提示', content: res.msg})
          }
        })
    },
    //中奖名单
    getPrizeList(start) {
      this.getMoreText = '加载中...'
      this.$axios({
        url: '/getLotteryLog',
        method: 'get',
        params: {
          lid: this.lid,
          phone: '',
          start: start,
          records: 5
        }
      })
        .then(res => {
          this.getMoreText = '显示更多...'
          if(res.total_count == 0) {
            this.lotteryListShow = false
          } else {
            this.lotteryListShow = true
            if(this.start >= this.total_count) {
              store.commit('updateModal', { title: '温馨提示', content: '已经没有了！'})
            } else {
              this.lotteryList = this.lotteryList.concat(res.list)
            }
          }
        })
    },
    _closeModal() {
      this.modal.modalShow = false
    },
    _confirmModal() {
      this.$router.push({path:'/m/pop/15',query:{spinfocode: this.$utils.query('id')}})
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/variables';
  .container{
    background: #ff525c;
    .ban{
      position: relative;
      font-size: 0;
      img{
        width: 100%;
      }
      input{
        border: none;
        width: 80%;
        height: px2rem(40);
        position: absolute;
        left: 10%;
        bottom: px2rem(40);
        color: #770f01;
        background: transparent;
      }
      input::-webkit-input-placeholder{
        color: #770f01;
      }
    }
    .ban2 {
      button {
        width: px2rem(180);
        height: px2rem(160);
        position: absolute;
        left: 50%;
        margin-left: px2rem(-90);
        border: none;
        bottom: px2rem(180);
        border-radius: px2rem(24);
        background: transparent;
      }
    }
    .prizeList {
      position: relative;
      padding: px2rem(50) px2rem(10);
      .prizeTit{
        width: px2rem(620);
      }
      ul{
        width: 92%;
        padding: px2rem(20) px2rem(20);
        background: #ffffff;
        margin-top: px2rem(-20);
        margin-left: 4%;
        position: relative;
        li{
          position: relative;
          height: px2rem(90);
          img{
            width: px2rem(70);
            height: px2rem(70);
            position: absolute;
            left: 0;
            top: px2rem(10);
            border-radius: 50%;
          }
          p{
            height: px2rem(30);
            line-height: px2rem(30);
            position: absolute;
            left: px2rem(100);
            top: px2rem(30);
            color: #000;
          }
          span{
            height: px2rem(30);
            line-height: px2rem(30);
            position: absolute;
            right: 0;
            top: px2rem(30);
            color: #000000;
          }
        }
      }
    }
    .ruleList {
      position: relative;
      padding: px2rem(20) px2rem(10);
      .ruleTit{
        width: px2rem(620);
      }
      ul {
        width: 92%;
        padding: px2rem(20) px2rem(20);
        background: #ffffff;
        margin-top: px2rem(-20);
        margin-left: 4%;
        position: relative;
        li{
          line-height: px2rem(40);
          position: relative;
          margin-top: px2rem(16);
          padding-left: px2rem(40);
          color: #333333;
          span{
            position: absolute;
            left: 0;
            top: px2rem(4);
            display: inline-block;
            height: px2rem(30);
            line-height: px2rem(30);
            background: #F7413E;
            color: #ffffff;
            width: px2rem(30);
            border-radius: 50%;
            text-align: center;
          }
        }
      }
    }
    .lottery {
      position: relative;
      padding: px2rem(30) px2rem(10);
      .lotteryTit{
        width: px2rem(620);
      }
      .btnMore {
        color: $c-red;
        height: px2rem(50);
        line-height: px2rem(50);
        text-align: center;
        background: #fff4aa;
        width: 80%;
        position: absolute;
        left: 10%;
        bottom: px2rem(50);
      }
      ul {
        width: 92%;
        padding: px2rem(20) px2rem(20) px2rem(80);
        background: #ffffff;
        margin-top: px2rem(-20);
        margin-left: 4%;
        position: relative;
        li {
          line-height: px2rem(50);
          span {
            color: #a28234;
          }
          u{
            text-decoration: none;
            color: #1179c9;
          }
        }
      }
      .lottoryNone {
        padding: px2rem(80) px2rem(50) px2rem(40);
        background: #ffffff;
        border-radius: px2rem(20);
        box-shadow: 0 0 px2rem(8) px2rem(4) #2481ED;
        text-align: center;
        p {
          margin-top: px2rem(40);
        }
      }
    }
  }
.globalError {
  z-index: 100;
}
</style>
