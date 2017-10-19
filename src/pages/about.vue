<template>
	<f7-page toolbar-fixed navbar-fixed class="about">
	    <f7-navbar sliding>
          <f7-nav-left>
			<f7-link icon-only back>
				<i class="iconfont icon-back">

				</i>
			</f7-link>
          </f7-nav-left>
          <f7-nav-center>
          		关于格物志
          </f7-nav-center>
          <f7-nav-right>
          </f7-nav-right>
	    </f7-navbar>
		<f7-block class="text-center">
			<div class="icon">
				<img src="../assets/images/icon.png" alt="">
			</div>
			<h3>发现世间好物</h3>
			<p>当前版本:{{version}}</p>
		</f7-block>
		<f7-list>
			<f7-list-item link=" " @click="open('http://m.grozii.com/site/update-log.html?type='+deviceType)">
				更新日志
			</f7-list-item>

		</f7-list>
		<div class="content-block-title">关注我们</div>
		<f7-list>
			<f7-list-item link=" " @click="open('http://m.grozii.com/')">
				格物志官网
			</f7-list-item>
			<f7-list-item link=" " @click="open('http://m.grozii.com/site/agreement.html')">
				格物志用户注册协议
			</f7-list-item>
			<f7-list-item link=" " @click="open('http://m.grozii.com/site/convention.html')">
				格物志社区公约
			</f7-list-item >
			<f7-list-item link=" " @click="open('http://m.grozii.com/site/policy.html')">
				格物志用户协议
			</f7-list-item>
			<f7-list-item title="支持团队" link="mailto:support@grozii.com" link-external>
				 support@grozii.com
			</f7-list-item>			
		</f7-list>
	</f7-page>
</template>
<style lang="less">
.about{
	font-size: 15px;
	.content-block-title{
		color: #000;
	}
	.list-block{
		font-size: 14px;
		color: #666;
	}
	.icon{
		width: 80px;
		height: 80px;
		margin: 0 auto;
		border:.5px solid #eee;
		overflow: hidden;
		border-radius: 20px;
	}
	h3{
		line-height: 2;
		font-size: 18px;
		font-weight: normal;
	}
	p{
		font-size: 14px;
	}
}
img{
	max-width: 100%;
}
</style>
<script>
export default {
	data(){
		return {
			imageUrl:"",
			images:[]
		}
	},
	mounted(){

	},
	computed:{
		version(){
			var v = "borwser"
			try{
				v = plus.runtime.version
			}catch(e){}
			return v
		},
		deviceType(){
			return {"ios":0,"android":1}[this.$device.os]
		}
	},
	methods:{
		open(url,title){
			this.tool.openWebview(url)
		}
	}
}
</script>
