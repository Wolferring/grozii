<template>
<div class="home-event" v-if="!hasShown&&activity.id" @touchmove.stop.prevent>
	<div class="layer" ></div>
	<div class="home-event-content">
		<img :src="activity.image" v-if="activity.image" @click="openLink" alt="">
		<span class="close icon-only" v-if="activity.close==1" @click="closeAlert()">
			<i class="iconfont icon-close"></i>
		</span>
	</div>
</div>
</template>
<script>
	export default{
		data(){
			return {
				hasShown:true
			}
		},
		props:['events'],
		watch:{
			events(){
				var id = ''
				try{
					id = plus.storage.getItem('home_alert_id')
				}catch(e){}
				if(id!=this.activity.id){
					this.hasShown = false
					plus.storage.setItem('home_alert_id',String(this.activity.id))
				}
			}
		},
		computed:{
			activity(){
				return this.events.activity
			}
		},
		methods:{
			openLink(){
				this.hasShown = true
				this.tool.openWebview(this.activity.url)
			},
			closeAlert(){
				this.hasShown = true
			}
		},

	}
</script>
<style lang="less" scoped>
	.home-event{
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		z-index: 13500;
		.layer{
			background-color: rgba(0,0,0,.7);
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
			height: 100%;
			width: 100%;
			&.opacity{
				background-color: initial;
			}
		}
		.home-event-content{
			.close{
				position: absolute;
				right: 10px;
				top: -15px;
				color: #fff;
				font-size: 24px;
			}
			position: absolute;
			width: 100%;
			top: 100px;
			text-align: center;
			img{
				max-width: 100%;
				margin-top: 20px;
			}
		}
	}
</style>