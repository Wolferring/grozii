<template>
	<f7-page toolbar-fixed navbar-fixed class="advice">
	    <f7-navbar sliding>
          <f7-nav-left>
			<f7-link icon-only back>
				<i class="iconfont icon-back">

				</i>
			</f7-link>
          </f7-nav-left>
          <f7-nav-center>
          		发送反馈
          </f7-nav-center>
          <f7-nav-right>
	          <f7-link @click="send" class="text-sub" :disabled="advice.length<4">
	          	发送
	          </f7-link>
          </f7-nav-right>          
	    </f7-navbar>
			<textarea v-model="advice" id="advice" placeholder="描述你遇到的问题或者建议" rows="5"></textarea>
	</f7-page>
</template>
<style lang="less" scoped>
.advice{

}
#advice{
	width: 100%;
	border:none;
	outline: none;
	padding: 5px .4rem;
	border-bottom: .5px solid #ccc;
	font-size: 14px;
	line-height: 1.3;
	user-select:auto;
	resize:none;
	box-sizing: border-box;
	padding-top: 15px;
}
</style>
<script>
import api from '../store/api.js'
export default {
	data(){
		return {
			advice:""
		}
	},
	mounted(){

	},
	methods:{
		send(){
			api.postUserAdvice({
				content:this.advice
			},(data)=>{
				if(data.code==2000){
					this.$toast.center("反馈成功,感谢您的建议")
					this.$router.back()
				}else{
					this.$toast.center(data.msg||"未知错误")
				}
			})
		}
	}
}
</script>
