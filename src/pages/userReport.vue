<template>
	<f7-page toolbar-fixed navbar-fixed class="report">
	    <f7-navbar sliding>
          <f7-nav-left>
			<f7-link icon-only back>
				<i class="iconfont icon-back">

				</i>
			</f7-link>
          </f7-nav-left>
          <f7-nav-center>
          		举报
          </f7-nav-center>
          <f7-nav-right>
	          <f7-link @click="send" class="text-sub" :disabled="!type">
	          	提交
	          </f7-link>
          </f7-nav-right>          
	    </f7-navbar>
	    <div class="input-container border-bottom">
				
	    </div>
		<f7-list form>

		  <f7-list-item radio v-model="type" name="report-type" value="1" checked>{{query.report_link_type==5?"发布":""}}广告内容</f7-list-item>
		  <f7-list-item radio v-model="type" name="report-type" value="2">{{query.report_link_type==5?"发布低俗色情暴力内容":"低俗色情暴力"}}</f7-list-item>
		  <f7-list-item radio v-model="type" name="report-type" value="3" >抄袭或非原创</f7-list-item>
		  <f7-list-item radio v-model="type" name="report-type" value="4">{{query.report_link_type==5?"发布老旧重复内容":"老旧重复内容"}}</f7-list-item>
		  <f7-list-item radio v-model="type" name="report-type" value="7">其它</f7-list-item>
		</f7-list>    
	</f7-page>
</template>
<style lang="less">
.report{
	.page-content{
		padding-top: 64px!important;
	}
	.list-block{
		margin: 0;
		font-size: 14px;
	}
}

</style>
<script>
import api from '../store/api.js'
export default {
	data(){
		return {
			type:"1",
			query:Object
		}
	},
	mounted(){
		this.query = this.$route.options.query
	},
	computed:{
		is_user(){
			return this.query.report_link_type == "5"
		}
	},
    beforeCreate(){
        plus.navigator.setStatusBarStyle("dark");
    },	
	methods:{
		send(){
			api.postUserReport({
				type:this.type,
				link_id:this.query.report_link_id,
				link_type:this.query.report_link_type
			},(data)=>{
				if(data.code==2000){
					this.$toast.center("举报成功")
					this.$router.back()
				}else{
					this.$toast.center(data.msg||"举报失败")
				}
			})
		}
	}
}
</script>
