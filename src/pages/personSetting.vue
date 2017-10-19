<template>
	<f7-page navbar-fixed class="personSetting no-toolbar" id="personSetting">
	    <f7-navbar sliding>
          <f7-nav-left>
			<f7-link icon-only back>
				<i class="iconfont icon-back">

				</i>
			</f7-link>
    	  </f7-nav-left>
          <f7-nav-center>
          	个人信息
          </f7-nav-center>
	 	  <f7-nav-right>
		  </f7-nav-right>
	    </f7-navbar>
			<div class="head-change">
				<f7-link href="/changeAvatar/">
					<div class="avatar">
						<img :src='user.info.avatar' alt="">
					</div>
				</f7-link>
				<p>{{user.info.username}}</p>
			</div>
		<f7-list class="setting-list">
			<f7-list-item title="用户名" @click="changeInfo('1')" >
                <span class="info-show">{{user.info.username}}</span>
			</f7-list-item>
			<f7-list-item title="性别" @click="changeInfo('2')" >
				<span class="info-show">{{user.info.sex==0? '男':'女'}}</span>
			</f7-list-item>
			<f7-list-item title="个人简介" @click="changeInfo('3')" >
				<p class="info-show info-show-brief">{{user.info.intro}}</p>
			</f7-list-item>
            <f7-list-item title="手机号">
                <span class="info-show">{{user.info.mobile}}</span>
            </f7-list-item>
            <f7-list-item title="邮箱" @click="changeInfo('4')">
                <span class="info-show">{{user.info.email}}</span>
            </f7-list-item>
		</f7-list>
	</f7-page>
</template>
<style lang="less">
	.personSetting{
		.page-content{
			background: #f5f5f5!important;
		}
        .head-change{
            background: #fff;
            text-align: center;
            padding: 10px 0;
            .avatar{
                width: 64px;
                height: 64px;
                margin:5px 0;
            }
            p{
                font-size: 12px;
                color: #999;
            }
        }
		.list-block{
			margin:0;
		}
		.setting-list{
			select{
				height: 39px;
				text-align: right;
				font-size: 15px;
		        font-weight: 500;
		        color: #000;
				direction: rtl;
			}
			select option {
			    direction: ltr;
			}
			.item-content{
				min-height: 54px;
				padding-left: 0;
				.item-inner{
					width: 100%;
					padding-left: 20px;
                    color: #333;
                    font-size: 15px;
                    .item-title{
                        font-size: 12px;
                        color: #999;
						min-width: 100px;
                    }
					.info-show{
						font-size: 14px;
						color: #333;
					}
					.info-show-brief{
						width: 100%;
						overflow: hidden;
						white-space: nowrap;
						text-overflow:ellipsis;
						text-align: right;
					}
				}
			}
		}
	}
</style>
<script>
import VueCropper from 'vue-cropper'
export default {
	components: {
		'vueCropper' : VueCropper ,
	  },
	data(){
		return {
			mysex:'',
			selected:'', 
		}
	},
	mounted(){
		// var self = this;
		// this.$store.dispatch("getSelfInfo")
		this.$store.dispatch("getUserInfo")
	},
	computed:{
		user(){
            return this.$store.getters.getUser
        },
		changeUserInfo(){
		  return this.$store.getters.changeUserInfo
		}
	},
	destroyed() {
	},
	methods:{
		changeInfo(state){
			var self = this,
				currentView = self.$f7.getCurrentView();
			this.$store.commit("changeUserInfo", state);
			currentView.router.load({url:"changePersonInfo"});
		},
		// changeHeadImg(){
		// 	var create = plus.webview.create("/upLoadAvatar.html","create",{
		// 		"kernel":"UIWebview",
		// 	})
		// 	create.show("slide-in-right");
		// }
	}
}
</script>
