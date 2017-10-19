<template>
<f7-page no-toolbar no-navbar @page:afteranimation="pageAnimated" @page:beforeanimation="reinitPage" ref="topicScroller" id="topic" class="topic">
	<f7-navbar class="navbar-hidden">
		<!-- <f7-progressbar v-show="!contentReady" infinite color="green"></f7-progressbar> -->
	</f7-navbar>
	<f7-subnavbar class="userTabbarContainer border-top" v-show="!barstyle">
		<div class="infotabs">
			<f7-link @click="changetriangle(1)" :class="this.triangle == 1? 'actived':'' ">原创
			</f7-link>
			<f7-link @click="changetriangle(2)" :class="this.triangle == 2? 'actived':'' ">晒物
			</f7-link>
		</div>
	</f7-subnavbar>

	<div class="container">
		<div class="head-image-box" id="headImage" ref="headImage":style="{backgroundImage: 'url(\''+topicContent.cover+'\')'}">
		<transition name="fade">
			<div class="head-image" :style="{backgroundImage: 'url(\''+topicContent.cover+'\')'}" v-show="topicContent.cover" alt=""></div>
		</transition>
		</div>
		<div class="topic-desc" ref="desc">
			<p v-html="topicContent.intro">

			</p>
		</div>
		<div style="height:40px;" >
			<div class="userTabbarContainer border-top "  v-show="barstyle" ref="tabbar">
				<div class="infotabs">
					<f7-link @click="changetriangle(1)" :class="this.triangle == 1? 'actived':'' ">原创</f7-link>
					<f7-link @click="changetriangle(2)" :class="this.triangle == 2? 'actived':'' ">晒物</f7-link>
				</div>
			</div>
		</div>
		<div class="ori-content" ref="oriContent">
			<div class="topic-img">
				<img src="../assets/images/topic-ori.png" alt="">
			</div>
			<f7-list media-list class="no-top-border article-list-com" no-border v-for="threads in topicContent.thread">
				<f7-list-item>
					<a :href="'/evalDetail/'+ threads.id">
					<div class="ori-list-img" :style="{backgroundImage: 'url(\''+threads.cover+'\')'}">
						<ul class='tags'>
							<li v-for="tag in threads.tag">{{tag}}</li>
						</ul>
					</div>
					<div class="ori-list-content">
						<p class="title">{{threads.title}}</p>
						<div class="auth">
							<div class="author">
								<span class="avatar">
							<img :src="threads.author.avatar" alt="">
						</span>
								<span class="name">{{threads.author.username}}</span>
							</div>
							<div class="about">
								<div class="like">
									<i class="iconfont icon-comment"></i>{{threads.replies}}
								</div>
								<div class="like">
									<i class="iconfont icon-index_like"></i>{{threads.diggs}}
								</div>
							</div>
						</div>
					</div>
				</a>
				</f7-list-item>
			</f7-list>
		</div>
		<div class="post-content"  ref="postContent">
			<div class="topic-img">
				<img src="../assets/images/topic-post.png" alt="">
			</div>
			<div class="post-water">
				<div class="post-row">
					<div class="post-item" v-for="(feeds,index) in topicContent.feed" v-if="index%2==0">
						<a :href="'/postDetail/'+ feeds.id">
							<div class="image">
								<img :src="feeds.cover" class="">
							</div>
							<h3 class="title">{{feeds.title}}</h3>
							<div class="auth">
								<div class="author">
									<span class="avatar">
									<img :src="feeds.author.avatar" alt="">
								</span>
									<span class="name">{{feeds.author.username}}</span>
								</div>
								<div class="like">
									<i class="iconfont icon-index_like"></i>{{feeds.diggs}}
								</div>
							</div>
						</a>
					</div>
				</div>
				<div class="post-row">
					<div class="post-item" v-for="(feeds,index) in topicContent.feed" v-if="index%2!=0">
						<a :href="'/postDetail/'+ feeds.id">
							<div class="image">
								<img :src="feeds.cover" class="">
							</div>
							<h3 class="title">{{feeds.title}}</h3>
							<div class="auth">
								<div class="author">
									<span class="avatar">
									<img :src="feeds.author.avatar" alt="">
									</span>
									<span class="name">{{feeds.author.username}}</span>
								</div>
								<div class="like">
									<i class="iconfont icon-index_like"></i>{{feeds.diggs}}
								</div>
							</div>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div slot="fixed" id="headerBar" class="back-share" :class="{'back-share-down':backShareType,'blur':this.$device.ios}" ref="backShare">
		<f7-link class="back float-l" back>
			<i id="leftIcon" class="iconfont icon-back icon-only"></i>
		</f7-link>
		<span id="headerText" class="back-share-span">{{topicContent.title}}</span>
		<f7-link class="share float-r" @click="openShareScreen">
			<i id="rightIcon" class="iconfont icon-share icon-only"></i>
		</f7-link>
	</div>
	<share slot="fixed" :message="shareMessage" ></share>
</f7-page>
</template>

<style lang="less">
@import url( '../assets/less/var.less');
.topic {
	.subnavbar{
		top: 64px;
	}
	.back-share-span{
		display: inline-block!important;
		font-size: 18px;
		font-weight: bold;
		color: rgba(0, 0, 0, 0);
	}
    .head-image-box {
        position: relative;
        width: 100%;
        height: 280px;
        max-height: 400px;
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        overflow: hidden;
        img {
            vertical-align: bottom;
        }
        .head-image {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            z-index: -2;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            margin: 0 auto;
        }
        .title {
            height: 100%;
            position: relative;
            font-weight: 700;
            text-align: left;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: flex-end;
            p {
                margin: 0 auto;
                width: 100%;
                padding: 0 0.53333333rem;
                color: #fff;
                margin-bottom: 0.40541rem;
                box-sizing: border-box;
                word-break: break-all;
                font-size: 0.50666667rem;
                line-height: 1.5;
            }
        }
    }
    .topic-desc {
        padding: 20px;
        font-size: 16px;
        color: #333;
        text-indent: 2em;
    }
	.scroll-fixed{
		position: fixed;
		top: 64px;
		z-index: 9999;
	}
    .userTabbarContainer {
		width: 100%;
        height: 40px;
    	background: #fff;
        line-height: 40px;
        display: flex;
        justify-content:space-between;
        .infotabs {
        	display: flex;
        	justify-content:space-between;
            height: 40px;
            box-sizing: border-box;
            border-left: 0;
            border-right: 0;
			position: relative;
			width: 100%;
			text-align: center;
            .link{
                display: block;
                flex:1;
                text-align: center;
                color: #999;
                font-weight: bold;
                font-size: 14px;
                position: relative;
                height: 100%;
                box-sizing: border-box;
				&:before{
					content: "";
					position: absolute;
					height: 20px;
					width: 1px;
					background-color: #dedede;
					right: 0;
					top: 10px;
				}
				&:last-child:before{
					display: none;
				}
                &.actived{
					color: #333;
					&:after{
						content:"";
			            width: 0;
			            height: 0;
			            border-left: 9px solid transparent;
			            border-right: 9px solid transparent;
			            border-top: 6px solid #fff;
			            position: absolute;
			            top:100%;
			            margin-top: -2px;
			            left: 50%;
			            transform: translateX(-50%);
			            z-index: 99999;
					}
				}
            }
        }
    }
    .ori-content {
        position: relative;
        background-color: #333;
        padding: 10px;
        .list-block {
            margin: 15px 0;
        }
        .article-list-com {
            ul {
                background-color: #333;
            }
            ul:after {
                background-color: #333;
            }
            .item-content {
                padding: 0 !important;
                .item-inner {
                    margin: 0 !important;
                    padding: 0 !important;
                    border-radius: 3px;
                }
            }
        }
        .topic-img {
            width: 78px;
            margin: 10px auto;
        }
        .ori-list-img {
            width: 100%;
            height: 150px;
            // background-image: url('../assets/images/loginBg.jpg');
            background-size: 100%;
            position: relative;
            .tags {
                position: absolute;
                left: 15px;
                padding: 0;
                bottom: 10px;
                list-style-type: none;
                overflow: hidden;
                background-color: rgba(0,0,0,0);
                li {
                    float: left;
                    width: 50px;
                    height: 22px;
                    margin-right: 10px;
                    line-height: 22px;
                    border-radius: 20px;
                    color: #fff;
                    text-align: center;
                    font-size: 12px;
                    background-color: rgba(0,0,0,0.4);
                    border: 1px solid #fff;
                }
            }
        }
        .ori-list-content {
            background-color: #fff;
            padding: 10px 17px;
            border: 0;
            .title {
                font-size: 16px;
                color: #333;
                margin-bottom: 15px;
            }
            .auth {
                overflow: hidden;
                .author {
                    font-size: 11px;
                    color: #999;
                    float: left;
                    .avatar {
                        margin-right: 5px;
                    }
                }
                .about {
                    float: right;
                    div:first-child {
                        margin-right: 15px;
                    }
                    .like {
                        font-size: 12px;
                        color: #999;
                        float: left;
						display: inline-block;
                        i {
							font-size: 12px;
                            margin-right: 5px;
							vertical-align: middle;

                        }
                    }
                }
            }
        }
    }
	.post-content-top{
		margin-top: 40px;
	}
    .post-content {
        background-color: #ececec;
        padding: 10px;
        .topic-img {
            width: 78px;
            margin: 10px auto;
        }
		.like{
			font-size: 12px;
			color: #999;
			float: left;
			display: inline-block;
			i{
				font-size: 12px;
				margin-right: 3px;
				vertical-align: middle;
			}
		}
		.post-item{
			border-radius: 3px;
		 }
    }
    .post-water {
        background-color: #ececec;
        padding: 0;
        justify-content: space-around;
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
				// background-color: rgba(255,255,255,.7);
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
			vertical-align: middle;
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
			infotabState: true,
			animateReady:false,
			timeStamp: new Date().getTime(),
			backShareType: false,
			scrolled: false,
			scrolltop:0,
			triangle: true,
			actionShow:false,
			bartop:'',
			barstyle:true,
		}
	},
	components: {
	  share
	},
	created() {},
	mounted() {
		var self = this
		this.$$("#topic .page-content").on("scroll",function(e){
			e.preventDefault()
			e.stopPropagation()
			self.handleTopicScroll()
		})
	},
	computed: {
		topicContent(){
		  return this.$store.getters.topicContent;
		},
		shareMessage(){
			if(this.topicContent){
				return {
					title:this.topicContent.title,
					content:"来自格物志-发现世间好物",
					href:"http://m.grozii.com/topic/"+this.topicContent.id+".html",
					thumbs: [this.topicContent.cover]
				}
			}else{
				return {}
			}
		},
	},
	methods: {
		handleTopicScroll:commonTool.tool.throttle(function(){
			var self = this;
			const scrolltop = this.$$("#topic .page-content").scrollTop();
			const postHeight =  this.$refs.headImage.offsetHeight + this.$refs.desc.offsetHeight + this.$refs.oriContent.offsetHeight - 64;
			if(scrolltop>=(this.bartop-64)){
				self.barstyle = false;
			}else{
				self.barstyle = true;
			}
			if(scrolltop < postHeight){
				self.triangle = 1;
			}else{
				self.triangle = 2;
			}
			this.scrolltop = scrolltop
			if(scrolltop >= 200){
				this.backShareType = true;
				plus.navigator.setStatusBarStyle('dark');
			}else{
				this.backShareType = false;
				plus.navigator.setStatusBarStyle('light');
			}
		},300),
		reinitPage() {
			this.$store.dispatch("getTopicContent",this.$route.params.topicId)
			.then(e=>{
				this.bartop = this.$refs.tabbar.offsetTop;
			})
		},
		pageAnimated(){
	    	this.animateReady = true;
	    },
	    openShareScreen() {
	    	this.actionShow = false;
			this.$store.dispatch("setShare", true);
	    },
		changetriangle(num) {
			var self=this;
			this.triangle = num;
			var tab = this.$$("#topic .page-content")
			var oriHeight = this.$refs.headImage.offsetHeight + this.$refs.desc.offsetHeight-64;
			var postHeight =  oriHeight+ this.$refs.oriContent.offsetHeight ;
			if (num == 1) {
				this.barstyle = false;
				tab.scrollTop(oriHeight,200);
			} else if (num == 2){
				this.barstyle = false;
				tab.scrollTop(postHeight,200);
			}
		},
	}
}
</script>
