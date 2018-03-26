<template>
<div class="feedback">
  <Back title="意见反馈"></Back>
  <div class="feedback_area">
    <textarea class="feedback_content" placeholder="输入您反馈的内容" v-model="feed_mes"></textarea>
    <input type="text" name="" placeholder="手机号/QQ号/电子邮箱" class="contact_input" v-model="contact_mes">
    <input type="button" value="提交" class="submit" @click='sub_feed_mes'>
  </div>
</div>
</template>

<script>
import Back from '@/components/Back.vue'
import store from '../store'
export default {
  name: 'feedback',
  components: { Back },
  data() {
    return {
      feed_mes : "",
      contact_mes : ""
    }
  },
  methods:{
    sub_feed_mes(){
      const regcontact = new RegExp("^[1-9][0-9]{4,10}$","g")
      const regmail = new RegExp("^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$","g")
      if(this.feed_mes===""){
        store.commit('updateModal', { title: '提示', content: '请输入您的反馈内容' })
        return
      }
      if(regcontact.test(this.contact_mes)||regmail.test(this.contact_mes)){
        this.$axios({
          method:'post',
          url:'/feedback',
          data:{
            content:this.feed_mes,
            user:this.contact_mes
          }
        }).then((res) => {
          store.commit('updateModal', { title: '提示', content: '您的反馈内容我们已收到' })
          this.feed_mes = ''
          this.contact_mes = ''
        })
      }else{
        store.commit('updateModal', { title: '提示', content: '请正确填写手机号码、QQ号或邮箱地址' })
        return
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/variables';
.feedback_area{
  padding: px2rem(18) px2rem(28);
  background: #ffffff;
}
.feedback_content{
  display: block;
  width: 100%;
  height: px2rem(200);
  border: 1px solid #bbb;
  border-radius: .5em;
  padding: px2rem(16);
  font-family: "Microsoft yahei";
  resize: none;
  vertical-align: middle;
  outline: none;
}
.feedback_content::-webkit-input-placeholder{font-size: px2rem(33);}
.contact_input{
    display: block;
    height: px2rem(80);
    margin-top: .8em;
    border-radius: .5em;
    border: 1px solid #bbb;
    font-family: "Microsoft yahei";
    width: 100%;
    box-sizing: border-box;
    padding: px2rem(16);
}
.submit{
    width: 100%;
    height: 2.5em;
    background: $c-red;
    color: #fff;
    text-align: center;
    border: none;
    display: block;
    margin-top: .8em;
    border-radius: .5em;
    font-family: "Microsoft yahei";
    font-size: px2rem(33);
}
</style>
