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
:class='{"disable-overflow":!detailOverflow}'
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
				<div class="tags" >
					<span class="tag tag-digest" v-if="detail.is_digest">精华</span>
					<span class="tag" v-if="detail.tags" v-for="tag in detail.tags">{{tag}}</span>
				</div>
			</div>
			<div class="content">
				<div class="title">
					<p v-if="detail.title">{{detail.title}}</p>
					<p v-if="!contentReady&&!requestError"><span class="placer" ></span></p>
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
					<button v-if="detail.author&&detail.author.user_id!=user.id" class="btn btn-sm btn-gradient active" @click="followUser"><i v-if="!hasFollowAuthor" class="iconfont icon-xinjian"></i> {{hasFollowAuthor?"已关注":"关注"}}</button>
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
						ref="contentDetail"
						v-html="detail.content">
						</div>
					</transition>
					<div class="content-report" v-show="contentReady">
						<f7-link  @click="$router.load({url: '/userReport/',query:{'report_link_type':'1','report_link_id':detail.tid}})" class="color-danger"><i class="iconfont icon-jubao"></i> 文章举报</f7-link>
					</div>
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
						<button class="btn" @click="reinitPage">{{contentReady?"点击加载":"加载中"}}</button>
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
		<f7-link id="headerText" open-popover v-if="cata.length>1" class="back-share-span detail-cata">
			{{currentTitle | sliceTitle}}<i class="iconfont icon-down"></i>
		</f7-link>
		<f7-link id="headerText" v-else class="back-share-span">
			原创详情
		</f7-link>
		<f7-popover @popover:open="detailOverflow=false" @popover:close="detailOverflow=true" v-if="cata.length>1" class="cata-list">
			<f7-link close-popover v-for="(item,index) in cata" @click="scrollTo(index)" class="cata-item border-bottom">
				{{item}}
			</f7-link>
		</f7-popover>
	    <f7-link @click="actionShow=true" class="share float-r" v-if="detail.author&&detail.author.user_id==user.id">
	      <f7-link icon-only>
	        <i class="iconfont icon-more"></i>
	      </f7-link>
	    </f7-link>
		<f7-link
			icon-only
			v-if="detail.author&&detail.author.user_id!=user.id"
			class="share float-r"
			@click="openShareScreen">
	        <i class="iconfont icon-share"></i>

		</f7-link>
	    <div id="evalAction" v-if="actionShow">
	      <div class="action-layer" @touchmove.prevent="" @click="actionShow=false">

	      </div>
	      <div class="action-list">
	        <f7-link class="action-item" @click="deleteEval(detail.tid)">
	          <i class="iconfont icon-web_delete"></i> 删除
	        </f7-link>
	        <f7-link class="action-item" @click="openShareScreen">
	          <i class="iconfont icon-share"></i> 分享
	        </f7-link>
	      </div>
	    </div>
  </div>

  <div slot="fixed" class="footer" v-if="detail.extra">
    <!-- {{detail}} -->
    <div class="footer-left">
      <f7-grid no-gutter>
        <f7-link @click="goComment(detail.status,detail.tid)" class="col-auto footer-item">
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
          <span v-if="line" class="rightLine">
		  		</span>
        </f7-link>
        <f7-link class="col-auto footer-item" :disabled="liking" @click="doLike" :class="{'active':detail.extra.is_digg,'bounceInQuick':detail.extra.is_digg}">
          <i class="iconfont icon-like">
			  	</i>
			  	<span>{{detail.diggs}}</span>
			  </f7-link>
			</f7-grid>
		</div>
		<f7-link class="footer-right" href="/evalGoods/"  v-if="!line">
			  <img src="../assets/images/store_button.png" alt="">
			  	<i class="iconfont icon-cart " ></i>
			  	<span>文中商品</span>
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
	.cata-list{
		border-radius: 4px;
		width: 80%;
		left: 10%!important;
		.cata-item{
			display: block;
			padding: 15px 10px;

		}
		.popover-content{
			max-height: 300px;
			overflow: auto;
		}
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
			top: 64px;
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
		&.disable-overflow .page-content{
			overflow: hidden;
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
					&.tag-digest{
						background-color: #fb853d;
						border-color: #fb853d;
					}
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
				font-size: 13px;
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
					.iconfont{
						display: inline-block;
						font-size: 10px;
						margin: 0;
						vertical-align: top;
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
				color:#555;
				line-height: 27px;
				font-size: 16px;
				p{
					min-height: 12px;
					line-height: 27px;
					font-size: 16px;
					&.image-desc{
						text-align: center;
						font-size: 14px;
						line-height: 2;
						color: #555;
					}
					user-select:auto;
				}
				img{
					display: block;
					background-color: #ececec;
					max-width: calc(~"100% + 1.1rem")!important;
					width: 100vw;
					margin: 10px -.53333333rem;
					vertical-align: bottom;
					&.face{
						margin: 0;
						background-color: none;
						display: inline-block;
						max-width: initial!important;
						width: initial;
						vertical-align: middle;
					}
				}
				h2,h3{
					color: #555;
					user-select:auto;
					&::selection{
						color:#fff;
						background-color: @main-color;
					}
				}
				h2{
					font-size: 18px;
					line-height: 2;
				}
				h3{
					font-size: 16px;
					line-height: 2;
				}
			}
			.content-report{
				color: #f34848;
				text-align: right;
				a{
					color: inherit;
				}
				font-size: 12px;
				.iconfont{
					font-size: 12px;
				}
			}
		}
		.footer{
			position: absolute;
			bottom: 0;
			height: 50px;
			line-height: 50px;
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
				.iconfont{
					display: inline-block;
					margin-right: 5px;
				}
				a{
					color: inherit;
				}
				img{
					width: 100%;
					height: 100%;
					position: absolute;
					right: 0px;
					top: 0%;
					height: 100%;
					z-index: -1;
				}
			}
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
					display: inline-block;
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
			.back-share-span{
				font-size: 18px;
				font-weight: bold;
				color: rgba(0, 0, 0, 0);
			}
			.detail-cata{
				color: auto;
				display:none;
				font-size: 14px;
				.iconfont{
					font-size: 12px;
					color:inherit;
					line-height:44px;
					margin-left: 5px;
				}
			}
			.back,.share{
				height: 1.18919rem;
			}
			.iconfont{
				font-size: 18px;
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
      animateReady:false,
      requestReady:false,
      requestError:false,
      actionShow:false,
      scrolltop:0,
      backShareType: false,
	  replyEval:'eval',
	  collecting:false,//正在收藏
	  liking:false,//正在点赞
	  hasFollowAuthor:false,//是否关注
	  cata:[],//目录
	  cataHeight:[],//目录对应标题的scrollTop
	  currentTitle:"",//当前目录
	  detailOverflow:true,//详情overflow
	  imagesBroswer:[]
    };
  },
  components: {
    share
  },
  watch:{
  	contentReady(){
  		this.$nextTick(()=>{
  			this.cataHeight = []
  			let h = window.screen.height
			this.$$(this.$refs.contentDetail).find("h2").each((index,value)=>{
				this.cataHeight.push(value.offsetTop-h*.7)
			})
			this.cataHeight.push(this.$refs.contentDetail.offsetHeight)
			this.$$(this.$refs.contentDetail).find("img:not(.face)").each((index, el)=>{
				this.imagesBroswer.push(el.src)
			});


			//准备目录元素高度
  		})
  	}
  },
  methods: {
	handleEvalScroll:commonTool.tool.throttle(function(){
		const scrolltop = this.$refs.scrollContent.scrollTop;
		this.scrolltop = scrolltop
		var len = this.cataHeight.length
		for(let i = 0;i<len-1;i++){
			if(scrolltop>this.cataHeight[i]&&scrolltop<=this.cataHeight[i+1]){
				this.currentTitle = this.cata[i]
				break
			}else{
				this.currentTitle = "原创详情"
			}
		}//滚动目录
		var status = "";
		try{
			status = plus.navigator.getStatusBarStyle();
		}catch(e){}
		if(scrolltop >= 160){
			this.backShareType = true;
			if(status!="dark"){
				plus.navigator.setStatusBarStyle('dark');
			}
		}else{
			this.backShareType = false;
			if(status!="light"){
				plus.navigator.setStatusBarStyle('light');
			}
		}//滚动设置状态栏，操作栏的样式

	},300),
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
		this.collecting = true;
		if (this.detail.status != 1) {
			self.$toast.center('帖子未审核通过')
		} else {
			let query = this.detail.extra.is_fav ? "articleCancelCollect" : "articleCollect"
			this.$store.dispatch(query, self.pid).then(() => {
			    this.collecting = false
			})
			.catch(e => {
				self.$toast.bottom(data.msg)
			})
		}
    },
    goComment(status, pid) {
      var self = this;
      const currentView = self.$f7.getCurrentView();
      if (status != 1) {
        self.$toast.center('帖子未审核通过')
      } else {
        currentView.router.load({
          url: "/comments/eval/" + pid
        });
      }
    },
    deleteEval(id) {
      var self = this;
      this.actionShow = false

      if (typeof plus == "undefined") {
        this.$store.dispatch("deleteEval", {
            id: id
          })
          .then(data => {
            this.$toast.center("删除成功")
            this.$router.back();
            this.actionShow = false
          })
          .catch(e => {
            this.$toast.center(e.msg || "删除失败，请重试")
          })
        return false;
      }
      plus.nativeUI.confirm("确认删除这篇文章?", function(e) {
        if (e.index == 0) {
          self.$store.dispatch("deleteEval", {
              id: id
            })
            .then(data => {
              self.$toast.center("删除成功")
              self.$router.back();
              self.actionShow = false
            })
            .catch(e => {
              self.$toast.center(e.msg || "删除失败，请重试")
            })
        }
      }, "确认删除", ["删除", "取消"]);
    },
    getHeightFromUrl:function(url){
      var url = url.split("/")
      url = url[url.length-1]
      let info = url.split(".")[0].split("$").slice(1,3),
          ww = window.innerWidth;
      if(info.length<=0){
        return false
      }
      let colW = ww>info[0]?info[0]:window.innerWidth
      return parseInt(info[1].replace("_thumb","")*(colW/info[0]))
    },
    getWidthFromUrl(url){
		var url = url.split("/")
		url = url[url.length-1];
    	return url.split(".")[0].split("$").slice(1,3)[0]
    },
	reinitPage(){
		const deviceWidth = window.screen.width;
	    var self = this;
	    this.$store.dispatch("getArticleDetail", this.pid).then((data) => {
			this.$f7.hideProgressbar();
			this.requestError = false
			this.hasFollowAuthor = this.detail.author.follow
			this.requestReady = true;
			this.$$('.content-inner-block img').each(function(index, el) {
				let h = self.getHeightFromUrl(el.src),
					w = self.getWidthFromUrl(el.src)
				self.$$(el).attr("height",h?h:"")
				if(w<deviceWidth-10){
					el.style.margin = "0 auto"
					el.style.width="initial"
				}
			});

		  	this.$$(this.$refs.contentDetail)
		  		.on("taphold",".content-inner-block img:not(.face)",function(){
		  		let image = self.$$(this).attr("src");
		  		self.saveGallery(image)
		  	})  
		  	this.$$(this.$refs.contentDetail)
		  		.on("click",".content-inner-block img:not(.face)",function(){
		  		let url = self.$$(this).attr("src");
			  	self.openImageBrowser(url)	
		  		
		  	})			
			this.$$(this.$refs.contentDetail).find("h2").each((index,value)=>{
				this.cata.push(value.innerText.replace("："," "))
			})
	    })
	    .catch((data)=>{
	    	if(data.code="5000"){
	    		self.requestReady = true
				self.requestError = true
	    		return false
	    	}
	    	self.$toast.center(data.msg)
	    })
		//this.$store.commit("changeReplyType", this.replyEval)
		plus.navigator.setStatusBarStyle(self.scrolltop>160?"dark":"light");
	},
	saveGallery(src){
		var self = this;
		var imageName = '_downloads/' + (src.lastIndexOf("/")?(src.substring(src.lastIndexOf("/")+1)):(new Date().getTime()+".jpg"));
					console.log(imageName) 

		plus.nativeUI.actionSheet({
			cancel:"取消",
			buttons:[{title:"保存图片"}]
		}, function(e){
			if(e.index==1){
				var w=plus.nativeUI.showWaiting("开始下载");
				var dtask = plus.downloader.createDownload(src, {
					filename:imageName
				}, function ( d, status ) {
					if ( status == 200 ) {
					console.log(imageName) 
						plus.gallery.save(imageName,function() {
							self.$toast.center('保存成功');
						}, function(e) {
							self.$toast.center('保存失败，请重试');
						});						
					} else {
						 self.$toast.center( "保存失败，请重试"); 
					}  
					plus.downloader.clear();
				});
				dtask.addEventListener( "statechanged", function(task,status){
					switch(task.state) {
						case 1: // 开始
							w.setTitle("开始下载");
						break;
						case 2: // 已连接到服务器
							w.setTitle("开始下载");
						break;
						case 3:
							var a = task.downloadedSize/task.totalSize*100;
							w.setTitle("已下载"+parseInt(a)+"%");
						break;
						case 4: // 下载完成
							w.close();
						break;
					}
				})		
				dtask.start(); 	

			}
		});				
	},
	scrollTo(index){
		var self = this;
		this.$$(this.$refs.scrollContent).scrollTop(self.cataHeight[index]+100,100)
	},
    openShareScreen() {
      this.actionShow = false
      this.$store.dispatch("setShare", true);
    },
	openImageBrowser(img){
		var self = this,
			initial = 0;
		initial = self.imagesBroswer.indexOf(img)
		let browser = this.$f7.photoBrowser({
		    zoom: 400,
		    theme:"dark",
		    navbar:false,
		    toolbar:false,
		    initialSlide:initial,
		    spaceBetween:0,
		    photos: self.imagesBroswer,
		    exposition:false,
		})
		browser.open()
		browser.swiper.on("click",function(){
			browser.close()
		})

	},    
    pageAnimated() {
      this.animateReady = true;
    }
  },
  filters:{
  	  replaceImage(e){},
  	  sliceTitle(title){
  	  	return title.length>14?title.slice(0,14)+"...":title
  	  }
  },
  mounted(){
  	var self = this

  },
  destroyed() {
    var self = this;
    this.$store.commit("ARTICLE_DETAIL", {})
    this.$store.dispatch("setShare", false);
  },
  computed: {
    pid() {
      return this.$route.params.eid;
    },
    detail() {
      return this.$store.getters.getArticleDetail;
    },
    contentReady() {
      return this.requestReady && this.animateReady
    },
    user() {
      return this.$store.getters.getUserInfo
    },
    hasLogin(){
    	return this.$store.getters.userHasLogin
    },
    shareMessage() {
      if (this.detail.author) {
        return {
          title: this.detail.title + '-' + this.detail.author.username,
          content: "来自格物志-发现世间好物",
          href: "http://m.grozii.com/post/" + this.detail.tid + ".html",
          thumbs: [this.detail.thumb]
        }
      } else {
        return {}
      }
    },
    replyType() {
      return this.$store.getters.replyType;
    },
    line() {
      return this.detail.goods.length <= 0
    }
  }
};
</script>
