<template>
<f7-page
class="evaluating no-navbar" 
id="evaluating-detail"
no-toolbar
no-navbar 
no-page-content
@page:afteranimation="pageAnimated"
@page:beforeanimation="reinitPage"
ref="evalScroller"
>
    <f7-navbar class="navbar-hidden">
    </f7-navbar>
	<div class="page-content" ref="scrollContent" @scroll.prevent.stop="handleEvalScroll()">
		<f7-progressbar v-show="!contentReady" infinite color="green"></f7-progressbar>
		<div class="container">
			<div class="head-image-box" id="headImage">
				<transition name="fade">
					<div class="head-image" :style="{backgroundImage: 'url(\''+detail.cover+'\')'}" v-show="detail.cover" alt=""></div>
				</transition>
				<div class="layer">
					<img src="../assets/images/post-detail-layer.png" alt="">
				</div>
				<div class="tags" v-if="detail.tag">
					<span class="tag" v-for="tag in detail.tag">{{tag}}</span>
				</div>
			</div>
			<div class="content">
				<div class="title">
					<p v-if="detail.title">{{detail.title}}</p>
					<span class="placer" v-else></span>
				</div>
				<div class="content-head">
					<div class="auth" v-if="detail.author">
						<f7-link :href="'/otherInfo/'+ detail.author.user_id">
							<div class="avatar">
								<img :src="detail.author.avatar"  alt="">
							</div>
							<span class="userID" >{{detail.author.username}}</span>
						</f7-link>
						<span class="date" v-if="detail.dateline">
							<timeago :since="detail.dateline*1000" :max-time="86400" :format='tool.convertDate'></timeago>
						</span>
					</div>
					<button v-if="detail.author" class="btn btn-sm btn-gradient active" @click="followUser">{{hasFollowAuthor?"已关注":"关注"}}</button>
					<div class="auth" v-if="!detail.author&&!requestError">
						<span class="avatar"></span>
					</div>
				</div>
				<div class="content-text">
					<transition name="fade">
						<div inner
						class="content-inner-block"
						v-if="detail.content"
						v-show="contentReady"
						v-html="detail.content">
						</div>
					</transition>
					<div inner
						v-if="!contentReady&&!requestError"
					>
						<span class="placer "></span>
						<span class="placer placer-20"></span>
						<span class="placer placer-30"></span>
						<span class="placer placer-60"></span>
						<span class="placer placer-10"></span>
						<span class="placer placer-80"></span>
						<span class="placer placer-50"></span>
						<span class="placer "></span>

					</div>
					<div inner v-if="requestError" class="text-center">
						<p>加载失败</p>
						<br>
						<button class="btn" @click="reinitDetail">{{contentReady?"点击加载":"加载中"}}</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div slot="fixed"
	id="headerBar"
	class="back-share"
	:class="{'back-share-down':backShareType,'blur':this.$device.ios}"
	ref="backShare">
		<f7-link  class="back float-l" back>
			<i id="leftIcon" class="iconfont icon-back icon-only"></i>
		</f7-link>
		<span id="headerText" class="back-share-span" >好文详情</span>
		<f7-link
			v-if="detail.author&&detail.author.user_id!=user.id"
			class="share float-r"
			@click="openShareScreen">

			<i id="rightIcon" class="iconfont icon-share icon-only"></i>
		</f7-link>
		<f7-link
			@click="actionShow=true"
			class="share float-r"
			v-if="detail.author&&detail.author.user_id==user.id">
			<f7-link icon-only>
				<i class="iconfont icon-more"></i>
			</f7-link>
		</f7-link>
		<div id="evalAction" v-if="actionShow">
			<div class="action-layer" @touchmove.prevent="" @click="actionShow=false">

			</div>
			<div class="action-list">
				<f7-link class="action-item" @click="deleteEval(detail.tid)">
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

	<div slot="fixed" class="footer" v-if="detail.extra">
		<!-- {{detail}} -->
		<div class="footer-left">
			<f7-grid no-gutter>
			  <f7-link  @click="goComment(detail.status,detail.tid)" class="col-auto footer-item">
			  	<i class="iconfont icon-comment" @click=""></i>
			  	<span>{{detail.replies}}</span>
			  	<span v-if="line" class="rightLine"></span>
			  </f7-link>
			  <f7-link class="col-auto footer-item" :disabled="collecting" @click="doCollect" :class="{'active':detail.extra.is_fav}">
			  	<i class="iconfont icon-collect ">
			  	</i>
			  	<span>
			  		{{detail.collects}}
			  	</span>
			  	<span
			  		v-if="line"
			  		class="rightLine">
		  		</span>
			  </f7-link>
			  <f7-link class="col-auto footer-item" :disabled="liking" @click="doLike" :class="{'active':detail.extra.is_digg,'bounceInQuick':detail.extra.is_digg}">
			  	<i class="iconfont icon-like ">
			  	</i>
			  	<span>{{detail.diggs}}</span>
			  </f7-link>
			</f7-grid>
		</div>
		<f7-link class="footer-right"  v-if="!line">
			<img src="../assets/images/store_button.png" alt="">
			<f7-grid>
			  <f7-link href="/evalGoods/" class="col-auto">
			  	<i class="iconfont icon-cart icon-only" ></i>
			  	<span>文中商品</span>
			  </f7-link>
			</f7-grid>
		</f7-link>
	</div>
	<share slot="fixed" :message="shareMessage" ></share>
</f7-page>


</template>
<style lang="less">
	@import url('../assets/less/var.less');
	.progressbar{
		position: absolute;
	}
	#evalAction{
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
	.evaluating{
		position: relative;
		.page-content{
			.container{
				height: 100%;
				margin-top: -40px;
			}
		}
		.head-image-box{
			position: relative;
			width: 100%;
			height: 240px;
			max-height: 400px;

			overflow:hidden;
			img{
				vertical-align: bottom;
			}
			.head-image{
				position: absolute;
				width: 100%;
				height: 100%;
				left: 0;
				top: 0;
				z-index: 1;
				background-size: cover;
				background-repeat: no-repeat;
				background-position: center;
				margin: 0 auto;
			}
			.layer{
				position: absolute;
				top: 0;
				width: 100%;
				z-index: 8;
			}
			.tags{
				position: absolute;
				width: 100%;
				color: #fff;
				z-index: 9;
				bottom: 0;
				left: 0;
				padding: .32rem;
				.tag{
					display: inline-block;
					margin: 0 .21333333rem;
					border:.5px solid #fff;
					line-height: 20px;
					height: 20px;
					border-radius: 20px;
					padding: 0 .32rem;
					background-color: rgba(0,0,0,.2);
					font-size: 12px;
				}
			}
		}
		.title{
		  height: 100%;
		  position: relative;
		  font-weight: 700;
		  text-align: left;
		  margin-top: 17px;
		  p{
			  margin:0 auto;
			  width: 100%;
			  padding: 0 .53333333rem;
  			  color: #333;
  			  box-sizing: border-box;
  			  word-break:break-all;
			  font-size: 19px;
  			  line-height: 1.5;
		  }
		}
		.content{
			padding-bottom: 1.45946rem;
			overflow-x:hidden;
			.content-head{
				display: flex;
				justify-content:space-between;
				height: 0.64865rem;
				line-height: .64rem;
				margin:0.54054rem auto;
				padding: 0 .53333333rem;
				font-size: 0.32432rem;
				color: #999;
				span{
					height: .64rem;
					line-height: .64rem;
					display: inline-block;
				}
				.btn{
					margin: 0;
					height: 20px;
					line-height: 20px;
					border-radius: 20px;
					padding: 0 .32rem;
					font-size: 13px;
					&.active{
						.iconfont{
		                    transform:scale(.5) rotate(45deg);
						}
					}
					.iconfont{
						display: inline-block;
						transform-origin:center;
						transform:scale(.5);
						font-size: 20px;
						vertical-align: middle;
					}
				}
				.avatar{
					width: .64rem;
					height: .64rem;
				}
				.userID{
					margin-right: 0.27027rem;
					color: #999;
				}
				.tag{
					margin: 0 .16rem;
				}
				.iconfont{
					font-size: 0.32432rem;
					margin-right: 5px;
				}
			}
			.content-text{
				padding:0 .53333333rem;
				padding-bottom: 0.54054rem;
				color:#333;
				p{
					min-height: 12px;
					line-height: 27px;
					font-size: 16px;
					&.image-desc{
						text-align: center;
						font-size: 12px;
						color: #333;
					}
					user-select:auto;					
				}
				img{
					-webkit-touch-callout:default;
					max-width: initial!important;	
					margin-left:-.53333333rem;
					margin-right:-.53333333rem;
					&.face{
						margin: 0;
					}
				}
				h2,h3{
					color: #333;
					user-select:auto;
					&::selection{
						color:#fff;
						background-color: @main-color;
					}					
				}
				h2{
					font-size: 18px;
					line-height: 1.5;
				}
				h3{
					font-size: 16px;
					line-height: 1.5;
				}
			}
		}
		.footer{
			position: absolute;
			bottom: 0;
			height: 1.43243rem;
			line-height: 1.43243rem;
			z-index: 2;
			width:100%;
			border-top: .5px solid #ebebeb;
			background-color: #fff;
			display: flex;
			justify-content:space-between;
			color:#999;
			.footer-left{
				flex:1;
				text-align: center;
				.footer-item{
					position: relative;
					display: flex;
					justify-content:center;
					transition:all .3s ease;
					font-size: 0.32432rem;
					color: #999;
					.iconfont{
						margin-right: .13333333rem;
					}
					&.active{
						color:@sub-color;
					}
					.rightLine{
						position: absolute;
						right: 0;
						display: inline-block;
						width:1px;
						height: .53333333rem;
						top: 50%;
						background-color: #e2e2e2;
						transform: translateY(-50%) scaleX(.5);
					}
				}
			}
			.footer-right{
				width: 3.21rem;
				display: inline-block;
				text-align: center;
				position: relative;
				color: #fff;
				overflow: hidden;
				i{
					display: inline-block;
					min-width: 0.67568rem;
				}
				a{
					color: inherit;
				}
				img{
					width: 120%;
					position: absolute;
					right: -10px;
					top: 50%;
					height: 100%;
					z-index: -1;
					transform:translateY(-50%)
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
			line-height:44px;
			z-index: 200;
			text-align: center;
			box-sizing: border-box;
			padding: 0 .266667rem;
			padding-top: 20px;
			color: #fff;
			transition:all .3s;
			&.back-share-down{
				border-bottom: solid 0.01351rem #ebebeb;
				background-color: #fff;
				color: #000;
				.back-share-span{
					color: #000;
				}
				&.blur{
					background-color: rgba(255,255,255,.7);
					-webkit-backdrop-filter:blur(10px);
				}
			}
			a{
				color: inherit;
			}
			span{
				display:none;
			}
			.back{
				height: 1.18919rem;
			}
			.share{
				height: 1.18919rem;
			}
			i{
				font-size: .53333333rem;
			}
		}
	}
</style>
<script>
import share from "../components/share";
import commonTool from '../assets/js/tool.js'
export default {
  data() {
    return {
      loadingProgress: 10,
      animateReady:false,
      requestReady:false,
      requestError:false,
      showbar: false,
      actionShow:false,
      scrolled: false,
      scrolltop:0,
      touchtop:0,
      headImageHeight:220,
      backShareType: false,
	  replyEval:'eval',
	  statusStyle:"",
	  collecting:false,
	  liking:false,
	  hasFollowAuthor:false
    };
  },
  components: {
    share
  },
  mounted(){
  	var self = this
  },
  methods: {
	handleEvalScroll:commonTool.tool.throttle(function(){
		const scrolltop = this.$refs.scrollContent.scrollTop;
		this.scrolltop = scrolltop
		console.log(scrolltop)
		if(scrolltop >= 160){
			this.backShareType = true;
			plus.navigator.setStatusBarStyle('dark');
		}else{
			this.backShareType = false;
			plus.navigator.setStatusBarStyle('light');
		}
	},300),
	articleTouchStart(e){
		this.touchtop = e.touches[0].clientY
	},
	articleTouchEnd(e){
		this.touchtop = 0;
		this.headImageHeight = 280;
	},
	followUser(){
		var self = this;
		if(!this.hasLogin){
              this.$store.commit("COM_CONF",{
                isLoginScreenShow:true,
              })
              return false			
		}
		self.$store.dispatch('followUser', {
	        uid: this.detail.author.user_id
	    })
	    .then(()=>{
	    	this.hasFollowAuthor = !this.hasFollowAuthor
	    })	
	},
	articleTouchMove(e){
		if(this.scrolltop<=0){
			// this.headImageHeight = (e.touches[0].clientY-this.touchtop)/6+220;
			e.stopPropagation()
			e.preventDefault()
			return
		}
	},
	doLike() {
    	if(!this.hasLogin){
          this.$store.commit("COM_CONF",{
            isLoginScreenShow:true,
          })    	
          return false	
    	}
		var self = this
    	this.liking = true
    	let query = this.detail.extra.is_digg?"articleCancelLike":"articleLike";
	    this.$store.dispatch(query,self.pid)
	    .then(()=>{
	    	this.liking = false
	    })
	    .catch(e=>{
	    	self.$toast.bottom(e.msg)
	    })

    },
    doCollect() {
    	if(!this.hasLogin){
          this.$store.commit("COM_CONF",{
            isLoginScreenShow:true,
          })    	
          return false	
    	}    	
    	var self = this;
    	this.collecting = true
    	let query = this.detail.extra.is_fav?"articleCancelCollect":"articleCollect"
	    this.$store.dispatch(query,self.pid).then(()=>{
	    	this.collecting = false

	    })
	    .catch(e=>{
	    	self.$toast.bottom(data.msg)
	    })
    },
	goComment(status,pid){
		var self = this;
		const currentView = self.$f7.getCurrentView();
		if(status != 1){
			self.$toast.center('帖子未审核通过')
		}else{
			currentView.router.load({url:"/comments/"+pid});
		}
	},
    deleteEval(id){
		var self = this;
    	this.actionShow = false
		if(typeof plus == "undefined"){
	    	this.$store.dispatch("deleteEval",{id:id})
	    	.then(data=>{
	    		$this.$toast.center("删除成功")
	    		this.$router.back();
		    	this.actionShow = false
	    	})
	    	.catch(e=>{
	    		this.$toast.center(e.msg||"删除失败，请重试")
	    	})
			return false;
		}
		plus.nativeUI.confirm("确认删除这篇文章?", function(e){
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
	reinitDetail(){
	    var self = this;
		self.requestError = false
		self.requestReady = false
	    this.$store.dispatch("getArticleDetail", this.pid).then(function() {
			self.$f7.hideProgressbar();
			self.requestError = false
			self.hasFollowAuthor = self.detail.author.follow
			self.$$('.content-inner-block img').on('load', function (e) {
				if(this.naturalWidth>=deviceWidth){
					this.style.width = deviceWidth +"px"
				}
			});
			self.requestReady = true;
	    },function(data){
	    	if(data.code="5000"){
	    		self.requestReady = true
				self.requestError = true
	    		return false
	    	}
	    	self.$toast.center(data.msg)
	    });
		this.$store.commit("changeReplyType", this.replyEval)
	},
	reinitPage(){
		const deviceWidth = window.screen.width;
	    var self = this;
	    this.$store.dispatch("getArticleDetail", this.pid).then(function() {
			self.$f7.hideProgressbar();
			self.requestError = false
			self.hasFollowAuthor = self.detail.author.follow
			self.$$('.content-inner-block img').on('load', function (e) {
				if(this.naturalWidth>=deviceWidth){
					this.style.width = deviceWidth +"px"
				}
			});
			self.requestReady = true;
	    },function(data){
	    	if(data.code="5000"){
	    		self.requestReady = true
				self.requestError = true
	    		return false
	    	}
	    	self.$toast.center(data.msg)
	    });
		this.$store.commit("changeReplyType", this.replyEval)
	    self.statusStyle = plus.navigator.getStatusBarStyle()||"dark"
		plus.navigator.setStatusBarStyle('light');
	},
    openShareScreen() {
    	this.actionShow = false
		this.$store.dispatch("setShare", true);
    },
    pageAnimated(){
    	this.animateReady = true;
    }
  },
  filters:{
  	  replaceImage(e){}
  },
  destroyed(){
  	var self = this;
    this.$store.commit("ARTICLE_DETAIL",{})
	this.$store.dispatch("setShare", false);
  },
  computed: {
    pid() {
      return this.$route.params.pid;
    },
    detail() {
      return this.$store.getters.getArticleDetail;
    },
    contentReady(){
    	return this.requestReady&&this.animateReady
    },
    user(){
    	return this.$store.getters.getUserInfo
    },
    hasLogin(){
    	return this.$store.getters.userHasLogin
    },
    shareMessage(){
		if(this.detail.author){
			return {
				title:this.detail.title+'-'+this.detail.author.username,
				content:"来自格物志-发现世间好物",
				href:"http://m.grozii.com/post/"+this.detail.tid+".html",
				thumbs: [this.detail.author.avatar]
			}
		}else{
			return {}
		}
    },
	replyType() {
	  return this.$store.getters.replyType;
	},
	line(){
		return this.detail.goods.length<=0
	}
  }
};
</script>
