<template>
<f7-page
id="post-detail"
class="postdetails"
no-navbar
no-toolbar
@page:afteranimation="pageAnimated"
@page:beforeanimation="reinitPage"
>
	<f7-navbar class="navbar-hidden">
    </f7-navbar>
	<f7-progressbar v-show="!contentReady" infinite color="green"></f7-progressbar>
	<div class="container">
		<div class="head-image-box"  id="headImage">
			<f7-swiper pagination v-if="detail.attaches" :params="{speed:500,autoHeight:true}" id="postDetailAttach">
				<f7-swiper-slide v-for="(banner,index) in detail.attaches" :key="banner.id">
						<img src="../assets/images/post-detail-layer.png" class="head-image-box-cover" alt="" >
						<template v-if="index==0">
							<transition name="fade">
						 		<img :src="banner" v-show="imageReady" @load="imageLoaded" alt="">
							</transition>
						</template>
						<template v-else>
					 		<img :src="banner" alt="">
						</template>
				</f7-swiper-slide>
			</f7-swiper>
		</div>
		<div class="content">
			<f7-link class="like-icon" :disabled="liking" @click="doLike" v-if="detail.extra">
				<transition name="upVote">
					<img src="../assets/images/beforeVoted.png" v-show="!detail.extra.is_digg" alt="">
				</transition>
				<transition name="cancleVote">
				<img src="../assets/images/voted.png" v-show="detail.extra.is_digg" alt="">
				</transition>
			</f7-link>
			<div class="content-head" v-if="detail.author">
				<div class="auth">
					<f7-link :href="'/otherInfo/'+ detail.author.user_id">
						<div class="avatar" v-if="detail.author">
							<img :src="detail.author.avatar" v-if="detail.author" alt="">
						</div>
						<span class="userID" >{{detail.author.username}}</span>
					</f7-link>
					<span class="date" v-if="detail.dateline">
						<timeago :since="detail.dateline*1000" :max-time="86400*2" :format='tool.convertDate'></timeago>
					</span>

				</div>
				<span class="date">{{detail.diggs|convertNumber}}人喜欢</span>
			</div>
			<div class="tags" v-if="detail.tag">
				<span class="tag" v-for="tag in detail.tag">{{tag}}</span>
			</div>
			<div class="content-text">
				<transition name="fade">
					<div inner class="content-inner-block" v-show="contentReady">
						<p v-html="detail.content">
						</p>
					</div>
				</transition>
				<div inner
					v-if="!contentReady&&!requestError"
				>
					<span class="placer "></span>
					<span class="placer placer-20"></span>
					<span class="placer placer-30"></span>
					<span class="placer placer-60"></span>
					<span class="placer "></span>

				</div>
			</div>
			<div inner v-if="requestError" class="text-center">
				<h3>加载失败</h3>
				<br>
				<button class="btn" @click="reinitDetail">{{contentReady?"点击加载":"加载中"}}</button>
			</div>
		</div>
	</div>
	<div slot="fixed" id="headerBar" class="back-share" ref="backShare">
		<f7-link  class="back float-l" back>
			<i id="leftIcon" class="iconfont icon-back icon-only"></i>
		</f7-link>
		<span id="headerText" class="back-share-span" >晒物详情</span>
		<f7-link  v-if="detail.author&&detail.author.user_id!=user.id" class="share float-r" @click="openShareScreen">
			<i id="rightIcon" class="iconfont icon-share icon-only"></i>
		</f7-link>
		<f7-link @click="actionShow=true" class="share float-r" v-if="detail.author&&detail.author.user_id==user.id">
			<f7-link icon-only>
				<i class="iconfont icon-more"></i>
			</f7-link>
		</f7-link>
		<div id="postAction" v-if="actionShow">
			<div class="action-layer" @touchmove.prevent="" @click="actionShow=false">

			</div>
			<div class="action-list">
				<f7-link class="action-item" @click="deletePost(detail.id)">
					<i class="iconfont icon-web_delete"></i>
					删除
				</f7-link>
				<f7-link class="action-item" @click="openShareScreen">
					<i  class="iconfont icon-share"></i>
					分享
				</f7-link>
			</div>
		</div>
	</div>
	<div slot="fixed" class="footer">
			<div class="footer-all" v-if="detail.extra">
			<f7-grid>
				<f7-link :href="'/comments/'+detail.id" class="col-auto footer-item">
		      		<i class="iconfont icon-comment icon-only"></i>
		      		<span>{{detail.replies}}</span>
				    <span class="rightLine"></span>
				</f7-link>
				<f7-link class="col-auto footer-item" :disabled="collecting" :class="{'active':detail.extra.is_fav}" @click="doCollect">
				  	<i class="iconfont icon-collect icon-only"></i>
				  	<span>
				  		{{detail.collects}}
				  	</span>
				</f7-link>
			</f7-grid>
			</div>
	</div>
	<share slot="fixed" :message="shareMessage"></share>
</f7-page>
</template>
<style lang="less">
@import url('../assets/less/var.less');
	.progressbar{
		position: absolute;
		z-index: 10;
	}
	.upVote-enter-active {
	  animation: upVote-out .3s;
	}
	.upVote-leave-active {
	  animation: upVote-in .4s;
	  transform-origin: center;
	}
	#postAction{
		z-index: 10001;
		.action-layer{
			position: fixed;
			bottom: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0,0,0,.7);
			left: 0;
			z-index: 0;
		}
		.action-list{
			&:before{
				content: "";
				display: block;
				height: 10px;
				width: 10px;
				background-color: #fff;
				position: absolute;
				z-index: -1;
				top: -5px;
				right: 10px;
				transform:rotate(45deg);
			}
			position: absolute;
			z-index: 10;
			width:2rem;
			border-radius: 0;
			padding: 0 .13333333rem;
			background-color: #fff;
			color:#333;
			position: absolute;
			right: 15px;
			font-size: 13px;
			border-radius: 2px;
			box-sizing: border-box;
			.iconfont{
				font-size: 16px;
				color: #333;
				&.icon-share{
					font-size: 14px;
				}
			}
		}
		.action-item{
			display: inline-block;
			border-bottom: .5px solid #ddd;
			&:last-child{
				border-bottom: none;
			}
		}
	}
	@keyframes upVote-in {
	  0% {
	    transform:scale(1);
		opacity: 1;
	  }

	  100% {
	    transform:scale(3);
		opacity: 0;
	  }
	}
	@keyframes upVote-out {

	}
	.cancleVote-leave-active {
	  animation: cancleVote-out .2s;
	  transform-origin: center;
	}
	.cancleVote-enter-active {
	  animation: cancleVote-in .2s;
	  transform-origin: center;
	}
	@keyframes cancleVote-out {
	  0% {
		opacity: 1;
	  }
	  100% {
		opacity: 0;
	  }
	}
	@keyframes cancleVote-in {
	  0% {
	    transform: scale(1);
	    opacity: 1;
	  }
	  50% {
	    transform: scale(1.4);
	  }
	  85% {
		transform: scale(0.9);
	  }
	  100% {
	    transform: scale(1);
	    opacity: 0;
	  }
	}
	.cancleVote-leave-active {
	  animation: cancleVote-in .5s;
	  transform-origin: center;
	}
	@keyframes cancleVote-in {
	  0% {
		opacity: 1;
	  }
	  50%{
	  	opacity: ;
	  }
	  100% {
		opacity: 0;
	  }
	}
	.postdetails{
		position: relative;
		.active-icon{
	 		color: #45e69c;
		}
		.head-image-box{
			position: relative;
			width: 100%;
			border-bottom:.5px solid #dedede;
			min-height: 200px;
			.head-image-box-cover{
				position: absolute;
				z-index: 999;
				height: 150px;
			}
			.swiper-container{
				min-height: 200px;
			}
	         .swiper-slide{
	         	img{
	         		width: 100%;
	         		vertical-align:bottom;
	         	}
	         }
			 .swiper-pagination{
			 	bottom: 10px;
			 }

		}
		.content{
			padding-bottom: 1.45946rem;
			position: relative;
			 .like-icon{
			 	position: absolute;
				top: -57px;
				right: 15px;
				display: block;
				z-index: 300;
				width: 57px;
			    height: 57px;
			    background-image: linear-gradient(to top, #26d9c2, #1cea8b);
			    box-shadow: 0px 4px 9px 0 rgba(12, 167, 112, 0.4);
				border-radius: 50%;
				img{
					width: 25px;
					position: absolute;
					margin: auto;
					top:0px;bottom:0;right: 0;left: 0;
				}
			 }
			.content-head{
				display: flex;
				justify-content:space-between;
				height: 0.64865rem;
				line-height: 0.64865rem;
				margin:20px auto;
				margin-bottom: 10px;
				padding: 0 .53333333rem;
				font-size: 13px;
				color: #999;
				.avatar{
					width: 0.64865rem;
					height: 0.64865rem;
				}
				.userID{
					padding-right:.21333333rem ;
					border-right: .5px solid #e6e6e6;
				}
				.date{
					margin-left: .16rem;
				}
				.iconfont{
					font-size: 13px;
				}
			}
			.tags{
				color:#999;
				padding:0px .53333333rem;
				font-size: 12px;
				.tag{
					display: inline-block;
					height: 20px;
					line-height: 20px;
					margin-right: 10px;
					border: .5px solid #999;
					padding: 0 .4rem;
					border-radius: .53333333rem;
					.iconfont{
						margin-right: 5px;
						font-size: 12px;
					}
				}
			}
			.content-text{
				padding:5px .53333333rem;
				overflow: hidden;
				font-size:15px;
				line-height: 1.8;
				color: #333;
				.content-block{
					margin:10px 0 0 0;
					.content-inner-block{
						padding:0!important;
					}
					.content-inner-block::after{
						background: #fff;
					}
				}
			}
		}
		.footer{
			position: absolute;
			z-index: 999;
			width:100%;
			height: 54px;
			line-height: 54px;
			border: solid 1px #ebebeb;
			bottom: 0;
			background-color: #fff;
			display: flex;
			justify-content:space-between;
			align-items:center;
			color:#999;
			.link{
				color:#999;
			}
			.footer-all{
				flex:1;
				text-align: center;
				.footer-item{
					position: relative;
					display: flex;
					justify-content:center;
					transition:all .3s ease;
					font-size: 12px;
					i{
						display: inline-block;
						min-width: 0.67568rem;
					}
					&.active{
						color:@sub-color;
					}
					.rightLine{
						position: absolute;
						right: 0;
						display: inline-block;
						width:1px;
						height: 19px;
						border-right: 1px solid #e2e2e2;
						top: 50%;
						-webkit-transform: translateY(-50%);
						-moz-transform: translateY(-50%);
						-o-transform: translateY(-50%);
						-ms-transform: translateY(-50%);
						transform: translateY(-50%);
					}
				}
			}
		}
		.back-share-span{
			display: inline-block!important;
			font-size: 0.48649rem;
			font-weight: bold;
			color: rgba(0, 0, 0, 0);
		}
		.no-shadow{
			border: 0 !important;
			box-shadow: none!important;
		}
		.back-share{
			position: absolute;
			top: 0;
			width: 100%;
			height: 64px;
			line-height: 44px;
			z-index: 1000;
			text-align: center;
			box-sizing: border-box;
			padding: 0 .266667rem;
			padding-top: 20px;
			span{
				display:none;
			}
			.back{
				height: 44px;
			}
			.share{
				height: 44px;
			}
			i{
				display: inline-block;
				color: #fff;
				font-size: 0.54054rem;
			}
		}
	}
</style>
<script>
import share from "../components/share";

export default {
  data() {
    return {
      loadingProgress: 10,
      animateReady:false,
      requestReady:false,
      showbar: false,
      line: false,
      actionShow:false,
      replyPost:'post',
      statusStyle:"",
      imageReady:false,
      requestError:false,
      liking:false,
      collecting:false
    };
  },
  mounted(){
  	this.$$("#post-detail .page-content").on("scroll",function(e){
  		e.preventDefault()
  		e.stopPropagation()
  	})  	
  },
  components: {
    share
  },
  methods: {
	doLike() {
		var self = this
		this.liking = true
		this.$store.dispatch('feedLike',self.pid).then(()=>{
			this.liking = false
		},function(data){
			self.$toast.bottom(data.msg)
		})
    },
    doCollect() {
    	var self = this;
    	this.collecting = true
	    this.$store.dispatch('feedCollect',self.pid).then(()=>{
	    	this.collecting = false
	    },function(data){
	    	self.$toast.bottom(data.msg)
	    })
    },
    deletePost(id){
    	this.actionShow = false
		var self = this;
		if(typeof plus == "undefined"){
	    	this.$store.dispatch("deletePost",{id:id})
	    	.then(data=>{
	    		this.$router.back();
	    		$this.$toast.center("删除成功")
		    	this.actionShow = false
	    	})
	    	.catch(e=>{
	    		this.$toast.center(e.msg||"删除失败，请重试")
	    	})
			return false;
		}
		plus.nativeUI.confirm("确认删除这条晒物?", function(e){
			if(e.index==0){
		    	this.$store.dispatch("deleteEval",{id:id})
		    	.then(data=>{
		    		this.$router.back();
		    		$this.$toast.center("删除成功")
			    	this.actionShow = false
		    	})
		    	.catch(e=>{
		    		this.$toast.center(e.msg||"删除失败，请重试")
		    	})
			}
		}, "确认删除", ["删除","取消"] );      	
    },
    pageAnimated(){
    	this.animateReady = true;
    },
    openShareScreen() {
      this.$store.dispatch("setShare", true);
    },
    reinitDetail(){
		const deviceWidth = window.screen.width;
		const rem = parseFloat(document.documentElement.style.fontSize)
	    var self = this;
		self.requestError = false
		self.requestReady = false
	    this.loadingProgress = 40;
	    this.$store.dispatch("getFeedDetail", this.pid).then(function() {
			self.$f7.hideProgressbar();
			self.requestReady = true;
	    })
	    .catch(()=>{
			self.requestReady = true;
	    	self.requestError = true
	    })
	    this.$store.commit("changeReplyType", this.replyPost)
    },
	reinitPage(){
		const deviceWidth = window.screen.width;
		const rem = parseFloat(document.documentElement.style.fontSize)
	    var self = this;
	    this.loadingProgress = 40;
	    this.$store.dispatch("getFeedDetail", this.pid).then(function() {
			self.$f7.hideProgressbar();
			self.requestReady = true;
	    })
	    .catch(()=>{
			self.requestReady = true;
	    	self.requestError = true
	    })
	    this.$store.commit("changeReplyType", this.replyPost)
	    self.statusStyle = plus.navigator.getStatusBarStyle()||"dark"
		plus.navigator.setStatusBarStyle('light');
	},
	imageLoaded(){
		this.imageReady = true;
	}
  },
  destroyed() {
    this.$store.commit("FEED_DETAIL",{})
	this.$store.dispatch("setShare", false);
  },
  computed: {
    pid() {
      return this.$route.params.pid;
    },
    detail() {
      return this.$store.getters.getFeedDetail;
    },
    contentReady(){
    	return this.requestReady&&this.animateReady;
    },
    user(){
    	return this.$store.getters.getUserInfo
    },
    shareMessage(){
		if(this.detail.author){
			return {
				title:this.detail.content.slice(0,30)+'-'+this.detail.author.username,
				content:"来自格物志-发现世间好物",
				href:"http://m.grozii.com/feed/"+this.detail.id+".html",
				thumbs: [this.detail.author.avatar]
			}
		}else{
			return {}
		}
    },
    replyType() {
      return this.$store.getters.replyType;
    }
  }
};
</script>
