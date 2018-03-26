<template>
	<div class="fix_bac" @touchstart.prevent>
		<div class="content_area">
			<div class="anim">
				<div class="cube1"></div>
				<div class="cube2"></div>
			</div>
			<div class="title">{{title}}</div>
		</div>
	</div>
</template>
<script>
	export default{
		name:"loading",
		data() {
			return {}
		},
		props:{
			title:{default:'页面加载中...'}
		}
	}
</script>
<style lang="scss" scoped>
@import '../assets/css/variables';

@-webkit-keyframes cubemove-data-v-38de4702 {
	25% { transform: translateX(px2rem(84)) rotate(-90deg) scale(0.5);-webkit-transform: translateX(px2rem(84)) rotate(-90deg) scale(0.5);}
	50% { transform: translateX(px2rem(84)) translateY(px2rem(84)) rotate(-179deg);-webkit-transform: translateX(px2rem(84)) translateY(px2rem(84)) rotate(-179deg);}
	50.1% { transform: translateX(px2rem(84)) translateY(px2rem(84)) rotate(-180deg);-webkit-transform: translateX(px2rem(84)) translateY(px2rem(84)) rotate(-180deg);}
	75% { transform: translateX(px2rem(0)) translateY(px2rem(84)) rotate(-270deg) scale(0.5);-webkit-transform: translateX(px2rem(0)) translateY(px2rem(84)) rotate(-270deg) scale(0.5);}
	100% { transform: rotate(-360deg);-webkit-transform: rotate(-360deg);}
}
@keyframes cubemove {
	25% { transform: translateX(px2rem(84)) rotate(-90deg) scale(0.5);-webkit-transform: translateX(px2rem(84)) rotate(-90deg) scale(0.5);}
	50% { transform: translateX(px2rem(84)) translateY(px2rem(84)) rotate(-179deg);-webkit-transform: translateX(px2rem(84)) translateY(px2rem(84)) rotate(-179deg);}
	50.1% { transform: translateX(px2rem(84)) translateY(px2rem(84)) rotate(-180deg);-webkit-transform: translateX(px2rem(84)) translateY(px2rem(84)) rotate(-180deg);}
	75% { transform: translateX(px2rem(0)) translateY(px2rem(84)) rotate(-270deg) scale(0.5);-webkit-transform: translateX(px2rem(0)) translateY(px2rem(84)) rotate(-270deg) scale(0.5);}
	100% { transform: rotate(-360deg);-webkit-transform: rotate(-360deg);}
}

.fix_bac{
	position: fixed;
	width: 100%;
	height: 100%;
	background: rgba(35, 24, 21,0.5);
	top:0;
	left: 0;
	z-index: 200
}
.content_area{
	position: absolute;
	top: 40%;
	width: 100%;
}
.anim{
	margin: 0 auto;
	width: px2rem(160);
	height: px2rem(160);
	position: relative;
	display: inline-block;
	text-align: center;
	left: 50%;
	margin-left:px2rem(-80);
}
.cube1,.cube2{
	background-color: #1179c9;
  width: px2rem(60);
  height: px2rem(60);
  position: absolute;
  top: 0;
  left: 0;
  animation: cubemove 1.8s infinite ease-in-out;
}
.cube2{
	background-color: #eb5b5b;
  animation-delay: -0.9s;
}
.title{text-align: center;color: #ffffff;font-size: px2rem(25)}
</style>
