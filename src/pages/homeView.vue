<template>
<f7-page
class="home"
id="homeView"
toolbar-fixed
navbar-fixed
pull-to-refresh @ptr:refresh="refreshHome"
@ptr:pullstart="refreshHomeStart"
@ptr:pullend="refreshHomeEnd"
@ptr:done="refreshHomeDone"
infinite-scroll @infinite="scrollHome"
:infinite-scroll-preloader='false'
@page:beforeanimation="reinitPage()"

>
<f7-navbar class="no-border" :class="{'top':isScrollTop}">
    <f7-nav-left>
      </f7-nav-left>
      <f7-nav-center>
      <transition name="fade">
        <f7-link href="/search/" v-if="comConf.homeNavShow">
          <div class="navbar-search">
            <label for="#">
              <i class="iconfont icon-Index_search_display"></i>
            </label>搜索你感兴趣的内容
          </div>
        </f7-link>
      </transition>
      </f7-nav-center>
      <f7-nav-right>
      <transition name="fade">
          <f7-link color="black" icon-only href="/news/" v-if="comConf.homeNavShow">
              <i class="iconfont icon-index_notice" :class="{notify:comConf.hasNewMessage}">

              </i>
          </f7-link>
      </transition>
      </f7-nav-right>
</f7-navbar>
<div class="home-banner">
	<f7-swiper :params="homeBannerConfig" :init="false"  pagination id="homeBanner">
	  <f7-swiper-slide v-for=" banner in home.focus" :data-banner="JSON.stringify(banner)" :key="banner.title">
		<f7-link>
		  	<img :src="banner.image" class="image" :alt="banner.title">
		</f7-link>
	  </f7-swiper-slide>
	</f7-swiper>
</div>
<div class="banner-back"  slot="fixed">
<transition name="fade">
	<img src="../assets/images/banner-back.png" alt="" v-show="comConf.homeNavShow">

</transition>
</div>
<div class="section padding">
    <div class="title border">
        <h3>精选好文</h3>
    </div>
	<div class="home-evals" v-if="home.evaluating">
		<a :href="'/evalDetail/'+eval.id" class="home-eval-item border-bottom" v-for="eval in home.evaluating" :key="eval.id">
			<div class="eval-img">
				<img :src="eval.cover" class="eval-banner" alt="">
				<div class="eval-author">
					<div>
						<span class="user avatar">
							<img :src="eval.author.avatar" alt="">
						</span>
						<span>{{eval.author.username}}</span>
					</div>
					<div>
						<span class="time">
							<timeago
							:since="eval.dateline*1000"
							:max-time="86400"
							:format="tool.convertDate"></timeago>
						</span>
					</div>
				</div>
			</div>
			<h4 class="eval-title">{{eval.title}}</h4>
			<div class="eval-info">
				<div class="classify">
					<span v-for="tag in eval.tag">#{{tag}}</span>
				</div>
				<div class="likes">
					<span>
						<i class="iconfont icon-index_comment"></i>
						{{eval.replies}}
					</span>
					<span>
						<i class="iconfont icon-index_good"></i>
						{{eval.diggs|convertNumber}}
					</span>
				</div>
			</div>
		</a>
	</div>
	<div class="home-evals" v-else>
		<a href="#" class="home-eval-item border-bottom" v-for="eval in 3">
			<div class="eval-img">
				<div class="eval-author">
					<div>
						<span class="user">
							<span class="place-10"></span>
						</span>
						<span>

						</span>
					</div>
					<div>
						<span class="time">
							-
						</span>
					</div>
				</div>
			</div>
			<h4 class="eval-title">{{eval.title}}</h4>
			<div class="eval-info">
				<div class="classify">

				</div>
				<div class="likes">
					<span>
						<i class="iconfont icon-index_comment"></i>
						-
					</span>
					<span>
						<i class="iconfont icon-index_good"></i>
						-
					</span>
				</div>
			</div>
		</a>
	</div>

</div>
<div class="section padding swiperflow">
    <div class="postBgContainer">
        <f7-swiper :init="false"  pagination id="BgBanner">
          <f7-swiper-slide v-for="post in home.share" class="bg-banner">
            <div class="layer"  :style="{backgroundImage: 'url(\''+post.cover+'\')'}">

            </div>
          </f7-swiper-slide>
        </f7-swiper>
    </div>
    <div class="title-post">
        <div class="title border">
            <h3>精选晒物
                <f7-link class="right transition" :class="{'text-disabled':!postMore}" :disabled="!postMore" @click="refreshPost">
                    <template v-if="postMore">
                        {{recommendPostLoading?"加载中":"换一批"}}
                    </template>
                    <template v-else>
                        {{postMore?"":"没有更多"}}
                    </template>
                </f7-link>
            </h3>
        </div>
    </div>
    <div class="postItemContainer" ref="postContainer" >
        <f7-swiper  :init="false" id="postBanner">
          <f7-swiper-slide v-for="post in home.share" :data-url="'/postDetail/'+post.id" class="post-banner" >
              <div class="banner-content">
                  <div class="layer" :style="{backgroundImage: 'url(\''+post.cover+'\')'}">
                  </div>
                  <div class="info">
                      <div class="content">
                          <h3>{{post.title}}</h3>
                      </div>
                      <div class="auth">
                          <div class="author">
                              <span class="avatar">
                                  <img :src="post.author.avatar" alt="">
                              </span>
                              <span class="name">
                                  {{post.author.username}}
                              </span>
                          </div>
                          <div class="likes">
                              <span>
                                  <i class="iconfont icon-index_good"></i>
                                  {{post.diggs|convertNumber}}
                              </span>
                          </div>
                      </div>
                  </div>
              </div>
          </f7-swiper-slide>
        </f7-swiper>
    </div>
</div>
<div class="section">
	<div class="title border">
		<h3>猜你喜欢</h3>
	</div>
	<div class="home-recommend border-bottom" v-for="block in guess">
		<transition name="fade">
			<article-list :list="block.evaluating" v-show="block"></article-list>
		</transition>
		<transition name="fade">
			<feed-row :list="block.share" v-show="block"></feed-row>
		</transition>

	</div>
</div>
<div class="text-center">
    <div class="preloader" v-if="guessLoading"></div>
    <p v-if="!guessMore&&!guessLoading" class="infinite-tip">没有更多了</p>
</div>
<template v-if="home">
	<home-alert slot="fixed" :events="home.event"></home-alert>
</template>
<f7-toolbar
  tabbar
  labels
  class="main-tab-toolbar no-border">
  <f7-link @click="scollTop" tab-link="#tab-home" active>
    <img src="../assets/images/icons/home-active.png" alt="">
  </f7-link>
  <f7-link  tab-link="#tab-eval">
    <img src="../assets/images/icons/eval.png"alt="">
  </f7-link>
  <f7-link  tab-link="#tab-post">
    <img src="../assets/images/icons/post.png" alt="">
  </f7-link>
  <f7-link  tab-link="#tab-user">
    <img src="../assets/images/icons/me.png" alt="">
  </f7-link>
</f7-toolbar>
</f7-page>
</template>
<script>
import articleList from '../components/articleList.vue'
import feedRow from '../components/feedRow.vue'
import homeAlert from '../components/homeAlert.vue'
import api from '../store/api.js'
import htmlPlus from "../config/plusInit.js"
export default{
	data(){
		return {
			homeBannerConfig:{
				loop:true,
				observer:true,
				initialSlide:0,
			},
            postBgConfig:{
                slidesPerView:1,
                centeredSlides:true,
                effect : 'fade'
            },
            postConfig:{
                width:window.innerWidth,
                effect:'coverflow',
                slidesPerView:'auto',
                centeredSlides:true,
                slideToClickedSlide:true,
                coverflow:{
                    rotate:0,
                    stretch:70,
                    depth: 70,
                    modifier: 2,
                    slideShadows : true
                }
            },
			homeSwiperConfig:{
				slidesPerView:2.6,
				spaceBetween:5,
				freeMode:true,
				slidesOffsetAfter:10,
				slidesOffsetBefore:10,
				freeModeMomentumRatio:0.8,
			},
			recommendSwiperConfig:{
				slidesPerView:2.5,
				spaceBetween:10,
				freeMode:true,
				slidesOffsetAfter:10,
				slidesOffsetBefore:10,
				freeModeMomentumRatio:0.5
			},
			homePost:{
				page:2,
				limit:4
			},
			homeGuess:{
				page:2,
				limit:5
			},
            slideleft:'',
            cascadeListAll:[],
            currentCascadeList:[],
			guessLoading:false,
			recommendPostLoading:false,
			guessMore:true,
			postMore:true,
			refreshing:false,

		}
	},
	props:["scrolled"],
	computed:{
	    home(){
	      return this.$store.getters.getHomeRecommend
	    },
	    guess(){
	    	return this.$store.getters.getHomeGuess
	    },
        postTypes(){
            return this.$store.getters.getPostTypes
        },
        comConf(){
            return this.$store.getters.getComConf
        },

        evalTypes(){
            return this.$store.getters.getEvalTypes
        },
        isScrollTop(){
          return this.scrolled>200?false:true
        },
	},
	mounted(){
        var self = this;
        self.slideleft = (window.screen.width/2 - 112.5)+'px'
        self.$store.dispatch("getRecommend").then((data)=>{
            self.$f7.swiper(self.$$("#homeBanner"),self.homeBannerConfig);
            let bgSwiper = self.$f7.swiper(self.$$("#BgBanner"),self.postBgConfig);
            let postSwiper = self.$f7.swiper(self.$$("#postBanner"),self.postConfig);
            postSwiper.slideTo(1);
            bgSwiper.slideTo(1);
            postSwiper.params.control = bgSwiper;

            postSwiper.on("transitionEnd",()=>{
            	let index = postSwiper.activeIndex;
            	self.$$("#postBanner .swiper-slide")
            	.removeClass('active-click')
            	.eq(index)
            	.addClass('active-click')
            })
            
        })
        .catch(err=>{
        	let msg = err.msg||"遇到了未知错误"
        	self.$toast.center(msg)
        })
        this.$$("#homeBanner").on('click', '.swiper-slide', function(event) {
        	let data = JSON.parse(self.$$(this).data("banner"))
        	self.bannerRedirect(data)
        });
        this.$$("#postBanner").on('click', '.active-click', function(event) {
        	let url = self.$$(this).data("url")
			var currentView = self.$f7.getCurrentView();
			currentView.router.load({url:url});
        });        
		htmlPlus.bind(function(){
	        plus.navigator.setStatusBarStyle(self.scrolled>200?"dark":'light');
			var wgtVersion = plus.runtime.version,
				osType = {"Android":"1","iOS":"0"}[plus.os.name]
			api.checkAppUpdate({
				type:osType,
				version:wgtVersion
			},function(data){
				if(data.code == 2000){
					var result = data.data;
					var version = plus.storage.getItem('home_alert_version')
					let buttons = ["前往更新"]
					if(!result.is_force){
						buttons.push("下次再说")
					}
					if(result.is_notify&&result.is_need){
						plus.nativeUI.confirm(result.content, function(e){
							if(e.index==0){
								var url = {
									"iOS":'itms-apps://itunes.apple.com/cn/app/id1274968835?l=zh&mt=8',
									"Android":"market://details?id=com.grozii.android"}[plus.os.name]
								plus.runtime.openURL(url);
							}
							plus.storage.setItem('home_alert_version',String(result.version))
						}, "发现新版本", buttons);
					}
				}
			})
		})

	},
	methods:{
		bannerRedirect(banner){
            console.log(banner.data);
			switch(banner.type){
				case 2:
				    var self = this,
					currentView = self.$f7.getCurrentView();
					currentView.router.load({url:"/postDetail/"+banner.data});
					break;
				case 1:
				var self = this,
					currentView = self.$f7.getCurrentView();
					currentView.router.load({url:"/evalDetail/"+banner.data});
					break;
				case 0:
				default :
					this.tool.openWebview(banner.data,banner.title)
					break;
                case 3:
                    var self = this,
                    currentView = self.$f7.getCurrentView();
                    currentView.router.load({url:"/topic/"+banner.data});
                    break;

			}
		},
		refreshHomeStart(){
			this.$store.commit("COM_CONF",{
				homeNavShow:false
			})
		},
		refreshHomeEnd(){
			if(!this.refreshing){
				this.$store.commit("COM_CONF",{
					homeNavShow:true
				})
			}
		},
		refreshHomeDone(){
	        this.refreshing = false;
			this.$store.commit("COM_CONF",{
				homeNavShow:true
			})
		},
		refreshHome(){
	        var tabHome = this.$$("#homeView .page-content"),
	        	self = this;
	        self.refreshing = true;
            self.$store.dispatch("refreshRecommend").then(function(data){
	            self.$f7.pullToRefreshDone("#homeView .page-content")
                self.$$("#homeBanner")[0].swiper.update();
                self.$$("#postBanner")[0].swiper.update();
                self.$$("#BgBanner")[0].swiper.update();
				self.guessMore = true
		    	self.guessLoading = false
		    	self.homeGuess.page = 2
		    	self.homePost.page = 2
				self.postMore = true;
    			self.$f7.attachInfiniteScroll(tabHome)
            },function(data){
	            self.$f7.pullToRefreshDone("#homeView .page-content")
	            self.$toast.center(data.msg||"未知错误")
            })
		},
		scollTop(){
			let index = this.currentTab,
				tab = this.$$("#homeView .page-content").eq(index),
				scrollTop = tab.scrollTop()/2
			tab.scrollTop(0, scrollTop>800?800:scrollTop)
		},
	    reinitPage(){
	    	let self = this
	        plus.navigator.setStatusBarStyle(self.scrolled>200?'dark':"light");

	    },
		scrollHome(){
	        var tabHome = this.Dom7("#homeView .page-content"),
	        	self = this;
	    	if(self.guessLoading){
	    		return false;
	    	}
	    	self.guessLoading = true
	    	if(self.homeGuess.page>=4){
				self.guessMore = false
		    	self.guessLoading = false
				self.$f7.detachInfiniteScroll(tabHome)
	    		return false
	    	}
	    	self.$store.dispatch("getHomeGuessPage",{
	    		dom:tabHome,
	    		page:self.homeGuess
	    	})
	    	.then(function(data){
	    		self.guessLoading = false
	    		self.homeGuess.page++
	    		if(data.data.share.length==0&&data.data.evaluating.length==0){
	    			self.$f7.detachInfiniteScroll(tabHome)
	    			self.guessMore = false
	    		}
	    	},function(data){
	    		self.guessLoading = false
    			self.guessMore = false
				self.$f7.detachInfiniteScroll(tabHome)
	    	})
		},
		refreshPost(){
			var self = this;
			this.recommendPostLoading = true
			this.$store.dispatch("refreshHomePost",{
				query:self.homePost
			})
			.then(()=>{
				if(length<=0){
					this.postMore = false;
				}
				this.recommendPostLoading = false
				this.homePost.page++
			})
			.catch(()=>{
				this.recommendPostLoading = false
				this.postMore = false;
			})
            self.$$("#BgBanner")[0].swiper.update();
            self.$$("#postBanner")[0].swiper.update();
		}
	},
	components:{
		articleList,
		feedRow,
		homeAlert
	}
}
</script>
<style lang="less">
	@import url('../assets/less/var.less');
	#homeView{
		.page-content{
			//margin-top: -64px;
			padding-top: 0;
			margin-top: -44px;
			height: calc(~"100% + 44px");
			.pull-to-refresh-layer{
				margin-top: 0;
			}
		}
	}
	.home{
		padding-bottom: .53333333rem;
		.home-banner{
			height: 6.10666667rem;
			background-color: @place-color;
			position: relative;
			.swiper-container{
				height: 100%;
                a{
                    opacity: 1!important;
                }
			}
		}
        .swiperflow{
            background-color: rgba(0, 0 ,0,.2,);
            padding:0!important;
            .title-post{
                padding: 0 10px;
                h3,a{
                    color: #fff;
                }
            }
        }
		.banner-back{
			position: fixed;
			top: 0;
			z-index: 100;
		}
		.home-tabs{
			.home-tabs-item{
				min-height: 100%;
			}
		}
		.home-topics{
			.home-topic-swiper{
				min-height: 30px;
			}
			.swiper-slide{
				background-color: @place-color;
				// margin-left: .13333333rem;
				// max-width: 3.73333333rem;
				&:first-child{
					// padding-left: .26666667rem;
				}

			}
			.home-topic-item{
				height:1.6rem;
				overflow:hidden;
				position: relative;
				border-radius: 2px;

				img{
					width:100%;
					height: 100%;
				}
				.layer{
					position: absolute;
					width: 100%;
					height: 100%;
					display: flex;
					align-items:center;
					justify-content: center;
					background-color: rgba(0,0,0,.6);
					color:#fff;
					z-index: 1;
					span{
						font-size: 14px;
						letter-spacing: 2px;
						max-width: 100%;
					    white-space: nowrap;
					    overflow: hidden;
					    text-overflow: ellipsis;
					}
				}
			}
		}
		.home-evals{
			min-height: 355px;
			.home-eval-item{
				position: relative;
				padding: .26666667rem 0;
				display: block;
				&:first-child{
					padding-top: 0;
				}
				.eval-img{
					height: 3.2rem;
					border-radius: 2px;
					overflow: hidden;
					position: relative;
					display: flex;
					align-items:flex-end;
					justify-content:space-between;
					background: url('../assets/home-evals-back.png');
					background-position:bottom;
					background-repeat: no-repeat;
					background-size: 100%;
					img{
						width: 100%;
					}
					.eval-banner{
						position: absolute;
						max-width: 100%;
						top: 50%;
						transform:translateY(-50%);
						z-index: -1;
					}
					.eval-author{
						display: flex;
						width: 100%;
						padding: .18666667rem .26666667rem;
						justify-content:space-between;
						color:white;
						font-size: 11px;
						.user{
							display: inline-block;
							width: .45333333rem;
							height: .45333333rem;
							border-radius: 50%;
							line-height: .45333333rem;
							overflow:hidden;
							vertical-align: bottom;
							margin-right: .10666667rem;
							img{
								width: 100%;
							}
						}
						.time{
							vertical-align: middle;
						}
					}
				}
				.eval-title{
					padding:.26666667rem 0;
					text-align: left;
					line-height:1.38;
					font-size: 16px;
					font-weight: 500;
					word-break:break-all;
				}
				.eval-info{
					display: flex;
					align-items:center;
					justify-content:space-between;
					color:#999;
					font-size: 12px;
					.classify{
						span{
							margin-right: .21333333rem;
							display: inline-block;
							height: 100%;
							i{
								vertical-align: middle;
							}
						}
					}
					.likes{
						.iconfont{
							font-size: 12px;
						}
						span{
							margin-left: .21333333rem;
							display: inline-block;
							height: 100%;
							i{
								vertical-align: middle;
							}
						}
					}
				}
			}
		}
        .postItemContainer{
            padding: 15px 0 50px;
            .post-banner{
            	width: 225px;
                .banner-content{
                    background-color: #fff;
                    padding: 5px;
                    border-radius: 3px;
                    .layer{
                        width: 215px;
                        height: 215px;
                        z-index: 0;
                        margin: 0 auto;
                        background-position: center;
                        background-size: cover;
                        img{
                            margin:0 auto;
                            max-width: initial;
                            min-height:100%;
                            min-width: 100%;
                            width: 100%;
                        }
                    }
                    .info{
                        .content{
                            h3{
                                font-size: 14px;
                                color:#333;
                                height:48px;
                                margin-top:10px;
                                display: inline-block;
                                padding: 0 5px;
                                word-break:break-word;
                                font-weight: 500;
                            }
                        }
                        .auth{
                            width: 100%;
                            box-sizing: border-box;
                            display: flex;
                            color: #fff;
                            align-items:flex-end;
                            justify-content:space-between;
                            font-size: 10px;
                            padding: .16rem .21333333rem;
                            .avatar{
                                display: inline-block;
                                width: .45333333rem;
                                height: .45333333rem;
                                vertical-align: middle;
                                overflow: hidden;
                                border-radius: 50%;
                                img{
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                            .author{
                                display: inline-block;
                                .name{
                                    color: #888;
                                }
                            }
                            .likes{
                                display: inline-block;
                                color: #999;
                            }
                        }
                    }
                }
            }
        }
        .postBgContainer{
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: -1;
            .layer{
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                transform:scale(1.2);
                background-position:center;
                background-repeat: no-repeat;
                background-size:cover;
                filter:blur(10px);

            }
            .swiper-container{
                height: 100%;
                .bg-banner{

                }
                .swiper-slide{
                    width: 100%;
                    height: 100%;
                }
            }
        }
		.home-posts{
			display: flex;
			align-items:center;
			justify-content:space-between;
			flex-wrap:wrap;
			margin-bottom: -.16rem;
			padding-bottom: .4rem;
			.post-item{
				width: 4.61333333rem;
				height: 4.61333333rem;
				overflow:hidden;
				position: relative;
				display: flex;
				align-items:flex-end;
				// background-color: #ccc;
				background-size: 100%;
				border-radius: 2px;
				overflow:hidden;
				margin-bottom: .16rem;
				border:.5px solid #dedede;
				.info{
					position: relative;
					width: 100%;
					height: 100%;
					background: url('../assets/images/home-post-back.png');
					background-position:bottom;
					background-repeat: no-repeat;
					background-size: 100%;
					z-index: 1;
					.auth{
						position: absolute;
						bottom: 0px;
						width: 100%;
						box-sizing: border-box;
						display: flex;
						color: #fff;
						align-items:flex-end;
						justify-content:space-between;
						font-size: 10px;
						padding: .16rem .21333333rem;

						.author{
							.avatar{
								display: inline-block;
								width: .45333333rem;
								height: .45333333rem;
								vertical-align: middle;
								overflow: hidden;
								border-radius: 50%;
								img{
									width: 100%;
								}
							}
							.name{
							}
						}
						.likes{
							.iconfont{
								font-size: 10px;
							}
						}
					}
					.content{
						padding: 0 .21333333rem;
						position: absolute;
						bottom: 30px;
						width: 100%;
						box-sizing: border-box;
						h3{
							color: #fff;
							font-size: 13px;
							font-weight: 500;
						    white-space: nowrap;
							overflow: hidden;
						    text-overflow: ellipsis;
						}
					}
				}
				.layer{
					position: absolute;
					width: 100%;
					height: 100%;
					z-index: 0;
					bottom: 0;
					background-color: @place-color;
					margin: 0 auto;
					background-position: center;
					background-size: cover;
					img{
						margin:0 auto;
						max-width: initial;
						min-height:100%;
						min-width: 100%;
						width: 100%;
					}
				}
			}
		}
		.home-recommend{
			margin-bottom: .4rem;
			margin-top: -.4rem;

			.swiper-container{
				margin-top: .26666667rem;
				background-color: #ececec;
				padding: .4rem 0;
				.swiper-slide{
					//background-color: #fff;
				}
				border:2px solid #fff;
			}
			position: relative;
			.eval-list{
				margin: 0;
				padding: 0 .26666667rem;
				.item-content{
					padding-bottom: .4rem;
					margin-bottom: .4rem;
				}
				ul:after{
					background-color: #e2dede;
				}
			}
		}
	}
</style>
