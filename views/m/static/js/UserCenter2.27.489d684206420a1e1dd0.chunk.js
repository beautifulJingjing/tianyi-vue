webpackJsonp([27],{150:function(t,e,n){function o(t){n(396)}var i=n(8)(n(281),n(563),o,"data-v-fef8a358",null);t.exports=i.exports},184:function(t,e,n){function o(t){n(194)}var i=n(8)(n(192),n(195),o,"data-v-412d838f",null);t.exports=i.exports},185:function(t,e,n){function o(t){n(188)}var i=n(8)(n(186),n(189),o,"data-v-20aa3431",null);t.exports=i.exports},186:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"back",data:function(){return{}},props:["title","link","hasRight"],methods:{handleBack:function(){this.link?location.href=link:history.go(-1)}}}},187:function(t,e,n){e=t.exports=n(139)(!1),e.push([t.i,".right[data-v-20aa3431]{position:absolute;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.title[data-v-20aa3431]{position:absolute;left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.back[data-v-20aa3431]{position:relative;height:2rem;line-height:2rem;background-color:#fff;border-bottom:1px solid #d9d9d9;color:#777}.title[data-v-20aa3431]{top:0;width:55%;text-align:center}.btn-back[data-v-20aa3431]{position:absolute;top:0;left:.5rem}.btn-back i[data-v-20aa3431],.btn-back span[data-v-20aa3431]{color:#fe403f;vertical-align:middle}.right[data-v-20aa3431]{right:.5rem;line-height:1}.right a[data-v-20aa3431]{color:#777}",""])},188:function(t,e,n){var o=n(187);"string"==typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);n(140)("e086010e",o,!0)},189:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"back fz16"},[n("div",{staticClass:"title",domProps:{innerHTML:t._s(t.title)}}),t._v(" "),n("div",{staticClass:"btn-back clear",on:{click:t.handleBack}},[n("i",{staticClass:"iconfont icon-fanhui fz20 fl"}),n("span",{staticClass:"fl"},[t._v("返回")])]),t._v(" "),t.hasRight?n("div",{staticClass:"right fz14"},[t._t("default")],2):t._e()])},staticRenderFns:[]}},192:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(54),i=n.n(o),a=n(53),s=n.n(a),r=n(28),d=n(9),p=n(55),l=n.n(p);e.default={components:{Slider:l.a},data:function(){return{phone:"",phoneCode:"",index:-1}},created:function(){this.phone=this.userInfo.msg.phone},props:["state"],mounted:function(){null!=this.tempPhone&&(this.phone=this.tempPhone)},computed:s()({},n.i(r.a)(["userInfo","quitState","loginMode","tempPhone"]),{getText:function(){return-1==this.index?"获取短信验证码":"验证码已下发("+this.index+")"}}),methods:s()({},n.i(r.b)(["updateOrderCode","updateLogin","updateUserInfo","updateQuitState","updateLoginMode","updateLoading","updatePopSliderState"]),{btnLogin:function(){1==this.state.isLogin||2===this.state.isLogin?this.login1():this.unsubscribe()},btnGetCode:function(){-1==this.index&&(1==this.state.isLogin||2==this.state.isLogin?this.getCode(0):this.getCode(2))},getCode:function(t){var e=this;if(!this.phone)return this.alertMsg("请输入您的手机号码。"),!1;if(!new RegExp(/^(133|153|177|173|(18[0|1|9]))\d{8}$/).test(this.phone))return this.alertMsg("亲，别闹了，搞个电信的手机号码再来！"),!1;var n=null;this.index=60;var o=this;n=setInterval(function(){--o.index<0&&clearInterval(n)},1e3),this.$log({name:"doSendCheckcode.Before",params:{phone:this.phone,dir:"1",type:t}}),this.$axios({url:"/getCheckCode",method:"post",data:{phone:this.phone,dir:"1",type:t}}).then(function(n){e.$log({name:"doSendCheckcode",params:{phone:e.phone,dir:"1",type:t}})})},login1:function(){var t=this;if(!this.phone)return this.alertMsg("请输入您的手机号码。"),!1;if(!new RegExp(/^(133|153|177|173|(18[0|1|9]))\d{8}$/).test(this.phone))return this.alertMsg("亲，别闹了，搞个电信的手机号码再来！"),!1;if(!this.phoneCode)return this.alertMsg("请输入验证码。"),!1;switch(this.updateLoading({show:!0,content:"用户验证，请稍后..."}),window.spconfig.login.mode){case"1":this.$log({name:"alertLogin.doOK",params:{phone:this.phone,checkcode:this.phoneCode}});break;case"2":this.$log({name:"alertLoginOrder.doOK",params:{phone:this.phone,checkcode:this.phoneCode}});break;case"3":this.$log({name:"alertLoginCrbt.doOK",params:{phone:this.phone,checkcode:this.phoneCode}})}this.$axios({url:"/login",method:"post",data:{phone:this.phone,checkcode:this.phoneCode}}).then(function(e){t.updateLoading({show:!1,content:""}),e.order&&t.updateOrderCode(e.order.code),void 0===e.user&&""===e.user&&0===i()(e.user).length||(t.updateLogin(!0),t.updateUserInfo(e.user)),1===t.state.isLogin?(t.$router.push(t.$setLink("userCenter1")),t.updateLoginMode(1)):2===t.state.isLogin&&t.updateLoginMode(2),t.$emit("loginCallBack")})},unsubscribe:function(){var t=this;return this.phone?new RegExp(/^(133|153|177|173|(18[0|1|9]))\d{8}$/).test(this.phone)?this.phoneCode?(this.updateLoading({show:!0,content:"用户验证，请稍后..."}),this.$axios({url:"/offOrder",method:"post",data:{phone:this.phone,checkcode:this.phoneCode}}).then(function(e){t.updateLoading({show:!1,content:""}),t.phoneCode="",t.updateQuitState({state:!0,msg:e.msg||"退订成功"}),t.updateUserInfo(e.user)}),void this.$log({name:"alertOutOrder.doOK",params:{data:this.phone,checkcode:this.phoneCode}})):(this.alertMsg("请输入验证码。"),!1):(this.alertMsg("亲，别闹了，搞个电信的手机号码再来！"),!1):(this.alertMsg("请输入您的手机号码。"),!1)},alertMsg:function(t){d.a.commit("updateModal",{title:"提示",content:t})}})}},193:function(t,e,n){e=t.exports=n(139)(!1),e.push([t.i,".login p[data-v-412d838f]{padding:.25rem .8rem}.login p input[data-v-412d838f]{height:1.875rem;border:1px solid #cbcbd0;text-indent:.25rem;border-radius:.125rem;background:#f3f3f3;box-sizing:border-box;padding:.375rem 0}.login p[data-v-412d838f]:first-child{margin-top:.75rem}.login p:first-child input[data-v-412d838f]{width:100%}.login p .login_btn[data-v-412d838f]{margin-top:.25rem;background:#fe403f;color:#fff;text-align:center;border-radius:.25rem;border:none;width:100%;height:2.25rem}.login p.phone_code input[data-v-412d838f]{width:7.5rem}.login p.phone_code button[data-v-412d838f]{height:1.875rem;padding:0 .75rem;border-radius:.125rem;color:#fe403f;text-align:center;border:1px solid #fe403f;background:transparent}",""])},194:function(t,e,n){var o=n(193);"string"==typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);n(140)("3c100970",o,!0)},195:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"login"},[n("p",[n("input",{directives:[{name:"model",rawName:"v-model",value:t.phone,expression:"phone"}],staticClass:"fz15",attrs:{type:"tel",placeholder:"请输入手机号",maxlength:"11"},domProps:{value:t.phone},on:{input:function(e){e.target.composing||(t.phone=e.target.value)}}})]),t._v(" "),n("p",{staticClass:"phone_code"},[n("input",{directives:[{name:"model",rawName:"v-model",value:t.phoneCode,expression:"phoneCode"}],staticClass:"fz15",attrs:{type:"tel",placeholder:"请输入短信验证码",maxlength:"6"},domProps:{value:t.phoneCode},on:{input:function(e){e.target.composing||(t.phoneCode=e.target.value)}}}),t._v(" "),n("button",{staticClass:"fr fz13",attrs:{id:"btn_getCode"},on:{click:t.btnGetCode}},[t._v(t._s(this.getText))])]),t._v(" "),n("p",[n("button",{staticClass:"fz18 login_btn",on:{click:t.btnLogin}},[t._v("确定")])])])},staticRenderFns:[]}},216:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={data:function(){return{title:window.spconfig.login.pop.title,content:window.spconfig.user_center.explain.content.replace(/[\r\n]/g,"<br>")}},props:["data"],methods:{}}},217:function(t,e,n){e=t.exports=n(139)(!1),e.push([t.i,".prompt{padding:.75rem}.prompt .vip{color:#333;line-height:.75rem;font-weight:600;margin-bottom:.75rem}.prompt .vip span{padding-left:.5rem;border-left:.25rem solid #fe403f}.prompt .msg p{line-height:1.1rem;color:#666}.prompt .msg u{text-decoration:none;color:#fe403f}",""])},218:function(t,e,n){var o=n(217);"string"==typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);n(140)("3380036a",o,!0)},219:function(t,e,n){function o(t){n(218)}var i=n(8)(n(216),n(220),o,null,null);t.exports=i.exports},220:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"prompt"},[n("div",{directives:[{name:"show",rawName:"v-show",value:2===t.data.isLogin,expression:"data.isLogin === 2"}],staticClass:"vip fz15"},[n("span",[t._v(t._s(t.title))])]),t._v(" "),n("div",{staticClass:"msg"},[n("p",{domProps:{innerHTML:t._s(t.content)}})])])},staticRenderFns:[]}},281:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(53),i=n.n(o),a=n(185),s=n.n(a),r=n(184),d=n.n(r),p=n(219),l=n.n(p),c=n(28);e.default={name:"UserCenter2",components:{Login:d.a,Back:s.a,WarmPrompt:l.a},computed:i()({},n.i(c.a)(["userInfo"])),created:function(){},methods:i()({},n.i(c.b)(["updateLogin"]))}},354:function(t,e,n){e=t.exports=n(139)(!1),e.push([t.i,"",""])},396:function(t,e,n){var o=n(354);"string"==typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);n(140)("383ba239",o,!0)},563:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"login_com"},[n("Back",{attrs:{title:t.userInfo.isLogin?"更换手机号码":"会员中心",hasRight:!0}},[n("router-link",{attrs:{to:t.$setLink("help")}},[t._v("帮助")])],1),t._v(" "),n("Login",{attrs:{state:{isLogin:1}}}),t._v(" "),n("WarmPrompt",{attrs:{data:{isLogin:!1}}})],1)},staticRenderFns:[]}}});