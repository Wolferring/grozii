<template>
	<f7-page navbar-fixed class="setting no-toolbar">
	    <f7-navbar sliding class="shadow">
          <f7-nav-left>
			<f7-link icon-only back>
				<i class="iconfont icon-back">

				</i>
			</f7-link>
          </f7-nav-left>
          <f7-nav-center>
          	设置
          </f7-nav-center>
          <f7-nav-right>

          </f7-nav-right>
	    </f7-navbar>
		<f7-list class="setting-list" v-if="hasLogin">
			<f7-list-item class="head-list" link="/personSetting/">
				<div class="avatar">
					<img :src="user.avatar" alt="">
				</div>
				<span>{{user.username}}</span>
			</f7-list-item>
		</f7-list>
		<f7-list class="setting-list" v-if="hasLogin">
			<f7-list-item link="/user/resetPassword/">
				修改密码
			</f7-list-item>
		</f7-list>
		<f7-list class="setting-list">
			<f7-list-item link="/about/">
				关于格物志
			</f7-list-item>
			<f7-list-item  link="/userAdvice/">
				发送反馈
			</f7-list-item>
			<!-- <f7-list-item @click="checkVersion()" link=" " v-if="this.$device.android"> -->
			<f7-list-item @click="checkVersion()" link=" " v-if="this.$device.android">
				检查更新
			</f7-list-item>
			<f7-list-item @click="clearCache()">
				清除缓存
			</f7-list-item>
		</f7-list>
		<f7-list class="setting-list login-out" v-if="hasLogin">
			<f7-list-item @click="userLogout">
				<span>退出登录</span>
			</f7-list-item>
		</f7-list>
	</f7-page>
</template>
<style lang="less">
	.setting{
		.page-content{
			background: #f5f5f5!important;
		}
		.list-block{
			margin:10px 0 0 0;
		}
		.setting-list{
			.progress{
				.progressbar{
					width: 50%;
					position: relative;
				}
			}
			.head-list{
				.avatar{
					width: 44px;
					height: 44px;
				}
				span{
					flex:1;
					margin-left: 10px;
					font-size: 12px;
					color:#999;
				}
			}
			.item-content{
				min-height: 54px;
				padding-left: 0;
				.item-inner{
					padding-left: 20px;
					font-size: 15px;
				}
			}
		}
		.login-out{
			.item-inner{
				padding-right:20px;
				span{
					font-size: 15px;
					margin:0 auto;
					color: #e03c3c;
				}
			}
		}
	}
</style>
<script>
import api from '../store/api.js'
export default {
	data(){
		return {
			cacheSize:"",
		}
	},
	beforeCreate(){
		plus.navigator.setStatusBarStyle('dark');
	},
	mounted(){
		this.$store.dispatch('getNewestVer',{type:1});
	},
	destroyed(){

	},
	computed:{
		hotSearch(){
			return this.$store.getters.getSearchHotList
		},
		user(){
		  return this.$store.getters.getUserInfo
		},
		hasLogin(){
			return this.$store.getters.userHasLogin
		},
		newestVer(){
			return this.$store.getters.getNewestVer
		}
	},
	methods:{
		clearCache(){

		},
		calcCache(){

		},
		checkVersion(){
			var types = {};
			var self = this;
			var currentVersion = plus.runtime.version;
			types[plus.networkinfo.CONNECTION_WIFI] = "WiFi";
			if(this.$device.android){
				var update = function(){
					plus.runtime.getProperty(plus.runtime.appid,function(inf){
						var wgtVersion = inf.version;
						var updateUrl = '';
						api.checkAppUpdate({
							type:'1',
							version:wgtVersion
						},function(data){
							if(data.code == 2000){
								if(!data.data.is_need){
									self.$toast.center("无新版本可更新!");
								}else{
									updateUrl = data.data.url;
									if(data.data.is_force){
										var w=plus.nativeUI.showWaiting("　　 开始下载...　　 ");
										var dtask = plus.downloader.createDownload( updateUrl,{}, function ( d, status ) {
											console.log(updateUrl);
											if ( status == 200 ) {   // 下载成功
												var path = d.filename;
												plus.runtime.install(path,{},function(){
													waiting.setTitle('数据资源包下载完成，正在重启应用...');
													plus.io.resolveLocalFileSystemURL(path,function(entity){
														entity.remove();
													},function(error){
														debugCom.log(error.message);
													})
												});
											} else {   // 下载成功
												alert( "下载失败:" + status );
											}
										});
										dtask.start();
										dtask.addEventListener( "statechanged", function(task,status){
												switch(task.state) {
													case 1: // 开始
														w.setTitle("　　 开始下载...　　 ");
													break;
													case 2: // 已连接到服务器
														w.setTitle("　　 开始下载...　　 ");
													break;
													case 3:
														var a = task.downloadedSize/task.totalSize*100;
														w.setTitle("　　 已下载"+parseInt(a)+"%　　 ");
													break;
													case 4: // 下载完成
														w.close();
													break;
										}
									  });
									}else{
										plus.nativeUI.confirm( "检测到可用更新，是否更新?", function(e){
											if(e.index==1){
												var w=plus.nativeUI.showWaiting("　　 开始下载...　　 ");
												var dtask = plus.downloader.createDownload( updateUrl,{}, function ( d, status ) {
													console.log(updateUrl);
													if ( status == 200 ) {	// 下载成功
														var path = d.filename;
														plus.runtime.install(path,{},function(){
															waiting.setTitle('数据资源包下载完成，正在重启应用...');
															plus.io.resolveLocalFileSystemURL(path,function(entity){
																entity.remove();
															},function(error){
																debugCom.log(error.message);
															})
														});
													} else {	// 下载成功
														alert( "下载失败:" + status );
													}
												});
												dtask.start();
												dtask.addEventListener( "statechanged", function(task,status){
														switch(task.state) {
															case 1: // 开始
																w.setTitle("　　 开始下载...　　 ");
															break;
															case 2: // 已连接到服务器
																w.setTitle("　　 开始下载...　　 ");
															break;
															case 3:
																var a = task.downloadedSize/task.totalSize*100;
																w.setTitle("　　 已下载"+parseInt(a)+"%　　 ");
															break;
															case 4: // 下载完成
																w.close();
															break;
												}
											  });
											}
										}, "版本更新", ["取消","更新"] );
									}
								}
							}else{
								self.$toast.center("检测更新失败!");
							}
						})
					});
				}
			}else{
				var update = function(){
					plus.runtime.getProperty(plus.runtime.appid,function(inf){
						var wgtVersion = inf.version;
						var updateUrl = '';
						api.checkAppUpdate({
							type:'0',
							version:wgtVersion
						},function(data){
							if(data.code == 2000){
								if(!data.data.is_need){
									self.$toast.center("无新版本可更新!");
								}else{
									var url='';
									plus.runtime.openURL(url);
								}
							}else{
								self.$toast.center("检测更新失败!");
							}
						})
					});
				}
			}

			if(types[plus.networkinfo.getCurrentType()] != "WiFi"){
				plus.nativeUI.confirm( "当前网络处于非WiFi环境，是否继续?", function(e){
					if(e.index==1){
						update();
					}
				}, "版本更新", ["取消","继续"] );
			}else{
				update();
			}
		},
		userLogout(){
			var self = this;
			if(typeof plus == "undefined"){
				self.$store.dispatch("getLogout").then(function(data){
					self.$toast.center("退出登录成功")
					self.$router.back()
				},function(){})
				return false;
			}
			plus.nativeUI.confirm( "确认退出当前账号?", function(e){
				if(e.index==0){
					self.$store.dispatch("getLogout").then(function(data){
						self.$toast.center("退出登录成功")
						self.$router.back()
					},function(){})
				}
			}, "退出登录", ["退出","取消"] );
		}
	}
}
</script>
