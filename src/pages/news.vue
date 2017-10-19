<template>
	<f7-page
	toolbar-fixed
	navbar-fixed
	no-page-content
	no-toolbar
	tabs
	class="news page-message"
	id='news'
	@page:beforeanimation="reinitPage()"
	>
		<div class="navbar no-border">
		  <div class="navbar-inner">
		    <div class="left">
				<f7-link icon-only back>
					<i class="iconfont icon-back">
					</i>
				</f7-link>
		    </div>
		    <div class="center">消息</div>
		    <div class="right">
		    </div>
			<f7-subnavbar class="tabbar no-border message-subnav">
				<f7-link tab-link="#system-news" active :class="{'notify':newMessageSet['1']>0}">
					<span >系统消息</span>
				</f7-link>
			    <f7-link tab-link="#my-news" :class="{'notify':newMessageSet['2']>0}">
			        <span >我的消息</span>
			    </f7-link>
				<f7-link tab-link="#my-comments">
					<span >我的评论</span>
				</f7-link>
				<f7-link tab-link="#comment-me" :class="{'notify':newMessageSet['3']>0}">
					<span >评论我的</span>
				</f7-link>
			</f7-subnavbar>
		  </div>
		</div>

	    <!-- <div class="newsContainer"> -->
		    <!-- <f7-tabs class="message-container"> -->
				<f7-page-content tab class="page-content pull-to-refresh-content" id="system-news" active @tab:show.prevent.stop="tabShow('system-news')" >
					<div class="pull-to-refresh-layer">
					  <f7-preloader></f7-preloader>
					  <div class="pull-to-refresh-arrow">
					  </div>
					</div>
						 <ul class="news-page">
	                          <li class="system-list" v-for="(news,index) in newslist[1] ">
	                              <p>{{news.content.reply}}</p>
	                              <p class="date">
	    							<timeago :since="news.dateline*1000" :max-time="86400" :format='tool.convertDate'></timeago>
	    						  </p>
	                          </li>
	                      </ul>
	    				  <div v-if="newslist[1].length == 0">
	    					  <div class="noMessage">
	    						  <img src="../assets/images/nomessage.png" alt="">
	    					  </div>
	    					  <p class="no-any-message">没有任何消息</p>
	    					  <p class="go-anywhere">去其他地方看看吧</p>
	    				  </div>
			    </f7-page-content>
			    <f7-page-content tab class="page-content pull-to-refresh-content" id="my-news" @tab:show.prevent.stop="tabShow('my-news')">
					<div class="pull-to-refresh-layer">
					  <f7-preloader></f7-preloader>
					  <div class="pull-to-refresh-arrow">
					  </div>
					</div>
						<ul class="news-page">
	                         <li class="my-news-list" v-for="(news,index) in newslist[2]">
								 <f7-link :href="'/otherInfo/'+ news.user.id ">
		                            <div class="left-side">
			                            <div class="avatar">
			                                <img :src="news.user.avatar" alt="">
			                            </div>
		                            </div>
								</f7-link>
	                            <div class="right-side">
	                                <p class="username">{{news.user.name}}</p>
									<p class="date">
									  <timeago :since="news.dateline*1000" :max-time="86400" :format='tool.convertDate'></timeago>
									</p>
	                                <f7-link :href="'/chat/'+ news.user.id">
	                                	<div class="reply">回复</div>
	                                </f7-link>
	                                <div class="content">{{news.content.reply}}</div>
	                            </div>
	                         </li>
	                     </ul>
						 <div v-if="newslist[2].length == 0">
							 <div class="noMessage">
								 <img src="../assets/images/nomessage.png" alt="">
							 </div>
							 <p class="no-any-message">没有任何消息</p>
							 <p class="go-anywhere">去其他地方看看吧</p>
						 </div>
			    </f7-page-content>
   			    <f7-page-content tab class="page-content pull-to-refresh-content" id="my-comments" @tab:show.prevent.stop="tabShow('my-comments')">
					<div class="pull-to-refresh-layer">
					  <f7-preloader></f7-preloader>
					  <div class="pull-to-refresh-arrow">
					  </div>
					</div>
	                    <ul class="news-page">
	                        <li class="my-com-list" v-for="(news,index) in newslist[3]">
								<f7-link :href="'/evalDetail/'+news.form_id" v-if="news.form_type == 'thread'">
									<div class="title">{{news.content.title}}</div>
								</f7-link>
								<f7-link :href="'/postDetail/'+news.form_id" v-if="news.form_type == 'feed'">
									<div class="title">{{news.content.title}}</div>
								</f7-link>
	                            <div class="about">

	                                <div class="left-side">
		                                <div class="avatar">
		                                    <img :src="user.info.avatar" alt="">
		                                </div>
	                                </div>
	                                <div class="right-side">
	                                    <p class="username">
	                                    	<small>对 </small>
											<f7-link :href="'/otherInfo/'+ news.user.id ">
		                                    	{{news.user.name}}
	                                    	</f7-link>
	                                    	<span class="date">
	                                    		<timeago :since="news.dateline*1000" :max-time="86400" :format='tool.convertDate'></timeago>
		                                    </span>
	                                    </p>
	                                    <div class="content"><small>说 </small>{{news.content.reply}}</div>
	                                </div>
	                            </div>
	                        </li>
	                    </ul>
						<div v-if="newslist[3].length == 0">
							<div class="noMessage">
								<img src="../assets/images/nomessage.png" alt="">
							</div>
							<p class="no-any-message">没有任何消息</p>
							<p class="go-anywhere">去其他地方看看吧</p>
						</div>
			    </f7-page-content>
                <f7-page-content tab class="page-content pull-to-refresh-content" id="comment-me" @tab:show.prevent.stop="tabShow('comment-me')">
					<div class="pull-to-refresh-layer">
					  <f7-preloader></f7-preloader>
					  <div class="pull-to-refresh-arrow">
					  </div>
					</div>
	                    <ul class="news-page"  >
	                        <li class="com-me-list" v-for="(news,index) in newslist[4]">
	                            <div class="top-side">
									<f7-link :href="'/otherInfo/'+ news.userid ">
		                                <div class="top-left avatar">
		                                    <img :src="news.user.avatar" alt="">
		                                </div>
									</f7-link>
	                                <div class="top-right">
	                                     <p class="commentter">
	                                        <span>{{news.user.name}}</span>
	                                        <span class="date">
	                                        	<timeago :since="news.dateline*1000" :max-time="86400" :format='tool.convertDate'></timeago>
	                                        </span>
	                                    </p>
	                                    <div class="content">
	                                        {{news.content.reply}}
	                                    </div>
	                                </div>
	                            </div>
								<a :href="'/evalDetail/'+news.form_id" class="bottom-side" v-if="news.form_type == 'thread'">{{news.content.title}}</a>
								<a :href="'/postDetail/'+news.form_id" class="bottom-side" v-if="news.form_type == 'feed'" >{{news.content.title}}</a>
	                        </li>
	                    </ul>
						<div v-if="newslist[4].length == 0">
							<div class="noMessage">
								<img src="../assets/images/nomessage.png" alt="">
							</div>
							<p class="no-any-message">没有任何消息</p>
							<p class="go-anywhere">去其他地方看看吧</p>
						</div>
                </f7-page-content>
		    <!-- </f7-tabs> -->
	    <!-- </div> -->
	</f7-page>
</template>
<style lang="less">
	.page-message{
		&>.page-content{
			padding-top: 60px!important;
		}
		.pull-to-refresh-content{
			.pull-to-refresh-layer{
				margin-top: -10px;
				background: inherit;
			}
		}
	}
	.message-subnav{
		.notify{
			position: relative;
			&:after{
				top: 5px;
				left: 85%;

			}
		}
	}
	.page-message{
		background-color: #f5f5f5!important;
		.avatar{
			width: 1.17333333rem;
			height: 1.17333333rem;
		}

		.newsContainer{
			height: 100%;
			width: 100%;
			overflow-y: scroll;
			position: relative;
			background-color: #f5f5f5;
			.swiper-slide{
				.preloader{
					width: 20px;
					height: 20px;
					margin-left: -10px;
				    margin-top: -10px;
				}
			}
		}
        #system-news,#my-news,#my-comments,#comment-me{
            background-color: #f5f5f5;
            padding-top: 44px;
			.swiper-slide-active{
				margin:0;
			}
			.noMessage{
				width: 4.59459rem;
				height: 4.59459rem;
				border-radius: 50%;
				margin: 2.43243rem auto 0;
				img{
					width: 100%;
				}
			}
			.no-any-message{
				margin-top: 0.40541rem;
				font-size: 15px;
				text-align: center;
				color: #333;
			}
			.go-anywhere{
				margin-top: 0.21622rem;
				font-size: 15px;
				text-align: center;
				color: #a4a4a4;
			}
        }
        .news-page{
            width: 100%;
            padding:0;
            background:inherit;
            list-style-type: none;
			margin-top:10px;
            li{
                margin:0.013514rem 0 0.27027rem;
                background: #fff;
                font-size: 14px;
                color: #666;
            }
            .system-list{
                padding:0.48649rem 0.35135rem 0.35135rem 0.40541rem;
                .activity{
                    color: #3e7feb;
                    text-decoration:underline;
                }
                .date{
                    font-size: 11px;
                    text-align: right;
                    margin-top: 0.18919rem;
                }
            }
            .my-news-list{
                padding: 0.43243rem 0.54054rem 0.67568rem;
                display: flex;
                .left-side{
                    // margin-left: 20px;
                    img{
                        min-width: 1.18919rem;
                        border-radius: 50%;
                    }
                }
                .right-side{
                    margin-left: 0.21622rem;
                    text-align: left;
                    flex:1;
                    position: relative;
                    .username{
                        font-size: 14px;
                        color: #000;
                    }
                    .date{
                        margin-top: 0.27027rem;
                        font-size: 11px;
                        color: #999;
                    }
                    .reply{
                        position: absolute;
                        top: 0.16216rem;
                        right: 0.54054rem;
                        width: 1.64865rem;
                        height: 0.67568rem;
                        line-height: 0.67568rem;
                        border: solid 0.01351rem #dedede;
                        border-radius: 0.10811rem;
                        text-align: center;
                        color: #000;
                        font-size: 13px;
                    }
                    .content{
						margin-top: 0.43243rem;
						font-size: 14px;
						color: #666;
						text-align: left;
						display: -webkit-box;
						-webkit-line-clamp: 3;
						-webkit-box-orient: vertical;
						overflow: hidden;
                    }
                }
            }
            .my-com-list{
                padding:0 0.54054rem;
                .title{
                    padding:0.43243rem 0 0.2973rem;
                    font-size: 16px;
                    font-weight: 500;
                    color: #000;
                    border-bottom: 0.013514rem solid #f5f5f5;
                }
                .about{
                    padding: 0.32432rem 0 0.40541rem;
                    display: flex;
                    .left-side{
                        img{
                            width: 1.18919rem;
                            border-radius: 50%;
                        }
                    }
                    .right-side{
                        margin-left: 0.35135rem;
						width: 100%;
                        .username{
                        	display: inline-block;
                            font-size: 14px;
							width: 	100%;
                            font-weight: 500;
                            color: #000;
                        }
                        .date{
                            float: right;
							display: inline-block;
                            font-size: 13px;
                            color: #999;
                        }
                        .content{
                            margin-top: 0.43243rem;
                            font-size: 14px;
                            color: #666;
                            text-align: left;
                            display: -webkit-box;
                            -webkit-line-clamp: 3;
                            -webkit-box-orient: vertical;
                            overflow: hidden;
                        }
                    }
                }
            }
            .com-me-list{
                padding: 0.54054rem 0.45946rem;
                .top-side{
                    display: flex;
                    .top-right{
                        margin-left: 0.35135rem;
                        flex:1;
                        .commentter{
                        	display: flex;
                        	justify-content:space-between;
							width: 100%;
							line-height: .53333333rem;
                            font-size: 14px;
                            color: #000;
                            text-align: left;
                            .date{
                                font-size: 12px;
                                color: #999;
                            }
                        }
                        .content{
                            margin-top: 0.16216rem;
                            font-size: 14px;
                            text-align: left;
                            color: #666;
                        }
                    }
                }
                .bottom-side{
                	display: block;
                    margin-top: 0.27027rem;
                    padding:0.40541rem 0.16216rem;
                    border-radius: 4px;
                    background-color: #f5f5f5;
                    font-size: 15px;
                    font-weight: 500;
                    color: #000;
                }
            }
        }
	}
</style>
<script>
export default {
	data() {
		return {
			currentTab:1,
			replyPid:'',
			tabState:{
				sys:0,
				my:0,
				myCom:0,
				comMe:0
			}
		};
	},
	computed:{
	  	newslist(){
			return this.$store.getters.getMessageList
		},
		user(){
			return this.$store.getters.getUser
		},
		newMessageSet(){
			return this.$store.getters.getNewMessageSet
		}
	},
	beforeCreate(){
		plus.navigator.setStatusBarStyle('dark');
	},
	mounted() {
		this.$store.commit("COM_CONF",{
			narbarShadow:false,
			hasNewMessage:false
		})
		try{
			plus.runtime.setBadgeNumber(0)
		}catch(e){}
		var self =this;
		self.$f7.pullToRefreshTrigger('#system-news');
		self.$store.dispatch("getNewsList",1).then(function(){
			self.$f7.pullToRefreshDone()
		})
		var newsPage = this.$$('#news');
		newsPage.on('refresh',function(){
			if(!self.user.hasLogin){
				self.$store.commit("COM_CONF",{
					isLoginScreenShow:true,
				})
				self.$f7.pullToRefreshDone()
				return
			}
			self.$store.dispatch("getNewsList",self.currentTab).then(function(){
				self.$f7.pullToRefreshDone()
			})
			.catch((data)=>{
				self.$f7.pullToRefreshDone()
				self.$toast.center(data.msg||"未知错误")
			})
		})
	},
	destroyed() {
		this.$store.commit("COM_CONF", {
		  narbarShadow: true
		});
		this.currentTab = 1;
	},
	methods: {
	    reinitPage(){
	        plus.navigator.setStatusBarStyle('dark');
	    },
		tabShow(tab){
			var self = this;
			switch(tab){
			  case "system-news":
				  this.currentTab  = 1;
				  break;
			  case "my-news":
				  this.currentTab = 2;
				  if(this.tabState.my == 0){
					  self.$f7.pullToRefreshTrigger('#my-news');
					  this.tabState.my++
				  }
				  break;
			  case "my-comments":
				  this.currentTab = 3;
				  if(this.tabState.myCom == 0){
					  self.$f7.pullToRefreshTrigger('#my-comments');
					  this.tabState.myCom++
				  }
				  break;
			  case "comment-me":
			      this.currentTab = 4;
				  if(this.tabState.comMe == 0){
					  self.$f7.pullToRefreshTrigger('#comment-me');
					  this.tabState.comMe++
				  }
				  break;
			}
			return false
		}
	}
}
</script>
