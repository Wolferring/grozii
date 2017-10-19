<template>
	<transition name="fade">
		<div class="share-page" @scroll.prevent.stop @touchmove.prevent.stop v-show="shareType.shareScreenShow">
			<div class="share-box">
				<img class="share-bgw" src="../assets/images/share/bgw.png" alt="">
				<div class="share-content">
					<div class="share-head">
						<span>分享到</span>
						<f7-link @click="closeShareScreen" class='icon-only'>
							<i class="iconfont icon-close" @click="closeShareScreen"></i>
						</f7-link>
					</div>
					<div class="share-type">
						<div class="share-item" v-if="shares&&shares['weixin']['nativeClient']">
							<f7-link @click="shareAction('weixin','WXSceneSession')">
								<img src="../assets/images/share/weixin.png" alt="">
							</f7-link>
							<p>微信</p>
						</div>
						<div class="share-item" v-if="shares&&shares['weixin']['nativeClient']">
							<f7-link @click="shareAction('weixin','WXSceneTimeline')">
								<img src="../assets/images/share/pyq.png" alt="">
							</f7-link>
							<p>朋友圈</p>
						</div>
						<div class="share-item" v-if="shares&&shares['sinaweibo']['nativeClient']">
							<f7-link @click="shareAction('sinaweibo')">
								<img src="../assets/images/share/weibo.png" alt="">
							</f7-link>
							<p>微博</p>
						</div>
						<div class="share-item" v-if="shares&&shares['qq']['nativeClient']">
							<f7-link @click="shareAction('qq')">
								<img src="../assets/images/share/qq.png" alt="">
							</f7-link>
							<p>QQ</p>
						</div>
						<div class="share-item">
							<f7-link @click="copyToClip">
								<img src="../assets/images/share/line.png" alt="">
							</f7-link>
							<p>生成链接</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>
<style lang="less">
.rotatePers-enter-active {
  animation: rotatePers-in .5s;
}
.rotatePers-leave-active {
  animation: rotatePers-out .5s;
}
@keyframes rotatePers-in {
  0% {
    transform: perspective(300px) rotateY(-45deg);
  }
  40% {
    transform: perspective(300px) rotateY(15deg);;
  }
  100% {
    transform: perspective(300px) rotateY(0);;
  }
}
@keyframes bounce-out {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(0);
  }
}
.share-page{
    position: absolute;
	display: flex;
	justify-content:center;
	align-items:center;
	box-sizing: border-box;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
	-webkit-transform: translate3d(0,0,0);
	transform: translate3d(0,0,0);
	background-color: rgba(0, 0, 0, 0.7)!important;
	z-index: 9999;
	.share-box{
		width: 8.90666667rem;
		height: auto;
		position: relative;
		overflow: hidden;
		.share-bgw{
			width: 100%;
			margin:0 auto;
			vertical-align: bottom;
			z-index: -1;
		}
		.share-content{
			position: absolute;
			width: 100%;
			height: 100%;
			display: flex;
			top: 0;
			bottom: 0;
			flex-direction:column;
			.share-head{
				width: 100%;
				padding: 0 .85333333rem;
				margin:13px auto;
				position: relative;
				box-sizing: border-box;
				display: flex;
				justify-content:space-between;
			    font-size: 18px;
			    line-height: 44px;
				span{
				    font-weight: bold;
				    text-align: left;
			  	    color: #000;
				}
				.link.icon-only{
					text-align: right;
					margin-right: -15px;
					font-weight: bold;
				}
			}
			.share-type{
				width: 100%;
				margin:0 auto;
				padding: 0;
				overflow: hidden;
				list-style-type: none;
				display: flex;
				justify-content:flex-start;
				align-items:center;
				flex-wrap:wrap;
				.share-item{
					min-width: 33.33%;
					margin-bottom: 15px;
					text-align: center;
					img{
						width: 1.44rem;
					}
					p{
						height: 13px;
				  	    font-size: 13px;
				 	    font-weight: 500;
					    line-height: 13px;
					    text-align: center;
					    color: #999;
						margin-top: 2px;
					}
				}
			}
		}
	}
}
</style>
<script>
import htmlPlus from "../config/plusInit.js";

	export default{
		data(){
			return{
				shares:""
			}
		},
		props: ['message'],
		mounted(){
			var $this = this;
			htmlPlus.bind(function() {
		    	$this.updateSerivces()
			});			
		},
		methods:{
			closeShareScreen() {
		      this.$store.dispatch("setShare", false);
		    },
		    updateSerivces(){
		    	var $this = this
	            plus.share.getServices(function(s) {
	                $this.shares = {};
	                for (var i in s) {
	                    var t = s[i];
	                    $this.shares[t.id] = t;
	                }
		            console.log("获取服务:"+JSON.stringify($this.shares))
	                
	            }, function(e) {
	                
	            });
		    },
		    shareMessage(service, ex){
		    	var self = this
	            var msg = Object.assign(this.message,{
	            	extra: {
                    	scene: ex
                	}
	            })
	            service.send(msg, function() {
	                self.$store.commit("SET_SHARE_STATUS",false)
	                self.$toast.center("分享成功")
	            }, function(e) {
	                //失败
	            });	    	
		    },
			shareAction(id, ex) {
	            var service = null,
	            	$this = this;
	            if (!id || !(service = $this.shares[id])) {
	                console.log("无效的分享服务！");
	                return;
	            }
	            if (service.authenticated) {
	                $this.shareMessage(service, ex);
	                console.log("已经认证，直接分享")
	            } else {
	                service.authorize(function() {
		            	console.log("获取认证后分享")
	                    $this.shareMessage(service, ex);
	                }, function(e) {
	                    console.log("认证授权失败");
	                });
	            }
	        },
	        copyToClip(){
	        	var $this = this;
	        	if ($this.$device.android) {
					var Context = plus.android.importClass("android.content.Context");
					var main = plus.android.runtimeMainActivity();
					var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
					plus.android.invoke(clip,"setText",$this.message.href||'www.grozii.com');
	        	}
	        	if($this.$device.ios){
					var UIPasteboard  = plus.ios.importClass("UIPasteboard");
					var generalPasteboard = UIPasteboard.generalPasteboard();
					// 设置/获取文本内容:
					generalPasteboard.setValueforPasteboardType($this.message.href||'www.grozii.com', "public.utf8-plain-text");
					var value = generalPasteboard.valueForPasteboardType("public.utf8-plain-text");   	        		
	        	}
		    	$this.$toast.center("链接已经成功复制到剪贴板")
	        }	    
		},
		computed:{
		    shareType() {
		      return this.$store.getters.setShare;
		    }
		}
	}

</script>
