<template>
<f7-page
  toolbar-fixed
  no-navbar
  id="userView"
  @page:beforeanimation="reinitPage()"

>
<f7-navbar class="navbar-hidden">
	<f7-nav-left>
	<f7-link icon-only back>
		<i class="iconfont icon-back">

		</i>
	</f7-link>
	</f7-nav-left>
	<f7-nav-center>
		
	</f7-nav-center>
	<f7-nav-right>

	</f7-nav-right>
</f7-navbar>
<div class="user-view">
	<div class="user-basic">
		<div class="user-avatar-back">
			<img  src="../assets/images/loginBg.jpg" alt="">
		</div>
		<div class="user-avatar">
			<div class="avatar">
				<f7-link v-if="hasLogin" @click="openImageBrowser(user.avatar)">
					<img  :src="user.avatar" />
				</f7-link>
				<f7-link @click="openLogin" v-else>
					<img src="../assets/images/loginavatar.jpg" alt="">
				</f7-link>
			</div>
		</div>
		<div class="text-center user-info">
			<p class='username' v-if="hasLogin">{{user.username}}</p>
			<div class='login-text' v-if="!hasLogin">
				<f7-link @click="openLogin">登录</f7-link>
				/
				<f7-link open-popup="#register-popup">注册</f7-link>
			</div>
			<p class="personBrief" v-if="hasLogin">{{user.intro}}</p>
		</div>
		<div class="user-sub-info">
			<div class="psn-about">
				<f7-link @click="go('follows')">
					<p class="about">关注</p>
					<p class="num">{{user.following || 0}}</p>
				</f7-link>
				<span></span>
				<f7-link @click="go('fans')">
					<p class="about">粉丝</p>
					<p class="num">{{user.follower || 0}}</p>
				</f7-link>
			</div>
		</div>
	</div>

    <f7-list class="login-list">
		<f7-list-item @click="go('news')"  link=" ">
			<span :class="{'notify':comConf.hasNewMessage}"><img src="../assets/images/icons/message.png"  alt="">消息
			</span>
		</f7-list-item>
		<f7-list-item @click="go('myPost')" link=" ">
			<span><img  src="../assets/images/icons/send.png" alt="">发布</span>
		</f7-list-item>
		<f7-list-item @click="go('myCollect')" link=" ">
			<span slot="inner-start"><img  src="../assets/images/icons/like.png" alt="">收藏</span>
			
			
		</f7-list-item>
	</f7-list>
	<f7-list class="login-list">
		<f7-list-item  link="/setting/">
			<span><img  src="../assets/images/icons/setting.png" alt="">设置</span>
		</f7-list-item>
	</f7-list>
</div>
<f7-toolbar
    tabbar
    labels
    class="main-tab-toolbar no-border">
    <f7-link tab-link="#tab-home">
      <img src="../assets/images/icons/home.png"alt="">
    </f7-link>
    <f7-link  tab-link="#tab-eval" >
      <img src="../assets/images/icons/eval.png" alt="">
    </f7-link>
    <f7-link  tab-link="#tab-post">
      <img src="../assets/images/icons/post.png" alt="">
    </f7-link>
    <f7-link  tab-link="#tab-user" active>
      <img src="../assets/images/icons/me-active.png" alt="">
    </f7-link>
</f7-toolbar>
</f7-page>
</template>

<style lang="less">
#userView .page-content{
	-webkit-overflow-scrolling:none;
	background-color: #f5f5f5;
}
	.user-view{
		.user-basic{
			box-sizing: border-box;
			position: relative;
			width: 100%;
			display: flex;
			justify-content:flex-end;
			flex-direction:column;
			min-height: 200px;
			margin-bottom: 45px;
			padding-bottom: 30px;
			.user-avatar-back{
				position: absolute;
				display: block;
				left: 0;
				top:0;
				height: 100%;
				width: 100%;
				z-index: -1;
				overflow: hidden;
				text-align: center;
				img{
					width: 100%;
					vertical-align: bottom;
				}
			}
			.user-avatar{
				.avatar{
					height :1.86666667rem;
					width: 1.86666667rem;
					display: block;
					margin: 0 auto;
					border:2px solid #fff;
				}
			}
			.user-info{
				margin:5px 0;
				color:#fff;
				font-size: 14px;
				line-height: 1.8;
				min-height: 45px;
				.login-text{
					text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
					line-height: 3;
					.link{
						padding: 5px;
						color:#fff;
					}
				}
			}
			.personBrief{
				font-size: 10px;
			}
			.user-sub-info{
				position: absolute;
				width: 100%;
				bottom: -25px;
			}
			.psn-about{
				width: 300px;
				height: 38px;
				background: #fff;
				padding:5px 0;
				margin: 0 auto;
				box-shadow: 0px 6px 21px 0 rgba(135, 141, 140, 0.1);
				border-radius: 4px;
 				border: solid .5px #ededed;
				.link{
					width: 50%;
					float: left;
					text-align: center;
					.about{
						font-size: 14px;
						color: #333;
					}
					.num{
						font-size: 12px;
						color: #999;
					}
				}
				span{
					position: absolute;
					width: 1px;
					height: 26px;
					background: #d4d4d4;
					top: 50%;
					transform: translateY(-50%) scaleX(.5);

				}
			}
		}
		.login-list{
			margin: 0 0 14px;
			.item-content{
				padding:0 20px;
				min-height: 54px;
				padding-right: 0;
				.item-inner{
					span{
						line-height: 40px;
						font-size: 15px;
						color: #333;
					}
					img{
						vertical-align: middle;
						width: 16px;
						margin-right: 7px;
						margin-bottom: 2px;
					}
				}
			}
		}
	}
</style>
<script>
	export default{
		data() {
			return {
			}
		},
		methods: {
			openLogin(){
				this.$store.commit("COM_CONF",{
					isLoginScreenShow:true,
				})
			},
			openImageBrowser(img){
				let browser = this.$f7.photoBrowser({
				    zoom: 400,
				    theme:"dark",
				    navbar:false,
				    backLinkText:"返回",
				    ofText:"用户头像",
				    toolbar:false,
				    photos: [img],
				    exposition:false,
				})
				browser.open()
				browser.swiper.on("click",()=>{
					browser.close()
				})

			},
		    reinitPage(){
		        plus.navigator.setStatusBarStyle('light');
		    },
			userLogout(){
				this.$store.dispatch("getLogout")
			},
			testUserInfo(){
				// this.$store.dispatch("getUserTest")
				this.$f7.mainView.router.refreshPage()
			},

			go(add){
				var self = this,
					currentView = self.$f7.getCurrentView();
				if(this.$store.getters.userHasLogin){
					currentView.router.load({url:"/"+add+"/"});
				}else{
					self.openLogin()
				}
			}
		},
		created(){

		},
		mounted(){
		},
		activated(){


		},
		computed:{
			comConf(){
				return this.$store.getters.getComConf
			},
		    user(){
		      return this.$store.getters.getUserInfo
		    },
		    testUser(){
		    	return this.$store.getters.getTestUser
		    },
		    hasLogin(){
		    	return this.$store.getters.userHasLogin
		    }, 
		}
	}
</script>
