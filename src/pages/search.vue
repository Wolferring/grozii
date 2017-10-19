<template>
	<f7-page navbar-fixed
		class="page-search with-subnavbar no-toolbar"
		infinite-scroll
		@infinite="loadMoreResult"
		:infinite-scroll-preloader="false"
		:infinite-scroll-distance="100"
        @page:beforeanimation="reinitPage()"
		>
	    <f7-navbar class="no-border">
		  <f7-nav-left></f7-nav-left>
          <f7-nav-center>
          	<div class="search-input">
	          	<form action="" @submit.prevent.stop="doSearch">
	          		<input type="search"
	          			@focus="showSearchTool"
	          			v-model="searchInput"
	          			id="searchInput"
	          			:placeholder="searchPlaceholder" />
	          	</form>
          		<span class="label">
          			<i class="iconfont icon-Index_search_display"></i>
          		</span>
          		<f7-link class="clear" v-show="searchInput.length>1" @click="clearSearchInput">
          			<i class="iconfont icon-close"></i>
          		</f7-link>
          	</div>
          </f7-nav-center>
          <f7-nav-right v-show="searchToolShow">
	          <f7-link icon-only @click="checkSearchTool">
	          	取消
	          </f7-link>
          </f7-nav-right>
	      <f7-nav-right v-show="!searchToolShow">
	          <f7-link icon-only back>
	          	取消
	          </f7-link>
          </f7-nav-right>
	    </f7-navbar>
		<f7-subnavbar class="tabbar no-border" v-show="!searchToolShow">
			<f7-link tab-link="#tab-search-all" active>
				<span>综合</span>
			</f7-link>
			<f7-link tab-link="#tab-search-evaluating">
				<span>原创</span>
			</f7-link>
			<f7-link tab-link="#tab-search-share">
				<span>晒物</span>
			</f7-link>
			<f7-link tab-link="#tab-search-user">
				<span>用户</span>
			</f7-link>			
		</f7-subnavbar>

	    <div class="search-container">
		    <transition name="slide">
		    <div class="search-tool" v-show="searchToolShow">
			    <div class="section padding search-container search-recommend">
			    	<div class="title bottom">
			    		<h3>热门搜索
			    		</h3>
		    			<f7-link class="icon-only" @click="refreshHotSearch">
				    		<i class="iconfont icon-refresh right text-sub icon-only"   ></i>
		    			</f7-link>
			    	</div>
			    	<div class="recommend-row">
			    	<transition name="fade" v-for="(hot,index) in hotSearch" :key="index">
			    		<f7-link :key="index"  @click="quickSearch(hot)" class="recommend-item">
			    			{{hot}}
			    		</f7-link>
			    	</transition>
			    	</div>
			    </div>
			    <div class="divider"></div>
			    <div class="section padding search-container search-history" v-if="searchHistory&&searchHistory.length">
			    	<div class="title bottom">
			    		<h3>搜索历史</h3>
		    			<f7-link class="icon-only" @click="removeSearchHistory">
				    		<i class="iconfont icon-delete right"></i>
		    			</f7-link>
			    	</div>
			    	<div class="recommend-row">
			    		<f7-link class="recommend-item" @click="quickSearch(history)" v-for="(history,index) in searchHistory" :key="index">
			    			{{history}}
			    		</f7-link>
			    	</div>
			    </div>
		    </div>
		    </transition>

		    <f7-tabs class="search-result" v-show="!searchToolShow">
				<f7-tab id="tab-search-all" class="infinite-scroll" @tab:show.prevent.stop="tabShow('all')" active>
					<template v-for="item in searchResult['all']">
						<article-list :list="item.evaluating"></article-list>
						<feed-row :list="item.share"></feed-row>
					</template>
				    <div class="infinite-scroll-preloader" >
			            <f7-preloader v-if="query.all.more&&query.all.loading"></f7-preloader>
					    <p class="infinite-tip" v-if="!query.all.more">没有更多了</p>
				    </div>
			    </f7-tab>
			    <f7-tab id="tab-search-evaluating" class="infinite-scroll" @tab:show.prevent.stop="tabShow('evaluating')">
					<article-list :list="searchResult['evaluating']"></article-list>
					<div class="infinite-scroll-preloader" >
			            <f7-preloader v-if="query.evaluating.more&&query.evaluating.loading"></f7-preloader>
					    <p class="infinite-tip" v-if="!query.evaluating.more">没有更多了</p>
				    </div>
				    <div class="no-message-container" v-if="!searchResult['evaluating'].length">
				      <img src="../assets/images/no-post.png" alt="">
				      <p class="no-any-message">没有搜索到原创</p>
				    </div>	
			    </f7-tab>
   			    <f7-tab id="tab-search-share" class="infinite-scroll with-back" @tab:show.prevent.stop="tabShow('share')">
	   			    <div class="post-water" v-if="searchResult['share'].length">
	   			    	<div class="post-row">
			                <div class="post-item" v-for="(item,key) in searchResult['share']" v-if="key%2==0" :key="item.id">
			                  <a :href="/postDetail/+item.id">
			                  <div class="image">
			                    <img
			                    :src="item.cover"
			                    >
			                  </div>
			                  <h3 class="title">
			                    {{item.title|titleFilter}}
			                  </h3>
			                  <div class="auth">
			                    <div class="author">
			                      <span class="avatar">
			                        <img :src="item.author.avatar" alt="">
			                      </span>
			                      <span class="name">
			                        {{item.author.username}}
			                      </span>
			                    </div>
			                    <div class="like">
			                      <i class="iconfont icon-index_like"></i>
			                      {{item.diggs|convertNumber}}
			                    </div>
			                  </div>
			                  </a>
			                </div>
	   			    	</div>
	   			    	<div class="post-row">
			                <div class="post-item" v-for="(item,key) in searchResult['share']" v-if="key%2==1" :key="item.id">
			                  <a :href="/postDetail/+item.id">
			                  <div class="image">
			                    <img
			                    :src="item.cover"
			                    >
			                  </div>
			                  <h3 class="title">
			                    {{item.title|titleFilter}}
			                  </h3>
			                  <div class="auth">
			                    <div class="author">
			                      <span class="avatar">
			                        <img :src="item.author.avatar" alt="">
			                      </span>
			                      <span class="name">
			                        {{item.author.username}}
			                      </span>
			                    </div>
			                    <div class="like">
			                      <i class="iconfont icon-index_like"></i>
			                      {{item.diggs|convertNumber}}
			                    </div>
			                  </div>
			                  </a>
			                </div>
	   			    	</div>
	   			    </div>
	   			    <div class="infinite-scroll-preloader" >
			            <f7-preloader v-if="query.share.more&&query.share.loading"></f7-preloader>
					    <p class="infinite-tip" v-if="!query.share.more">没有更多了</p>
				    </div>
				    <div class="no-message-container" v-if="!searchResult['share'].length">
				      <img src="../assets/images/no-feed.png" alt="">
				      <p class="no-any-message">没有搜索到晒物</p>
				    </div>				    
			    </f7-tab>
   			    <f7-tab id="tab-search-user" class="infinite-scroll" @tab:show.prevent.stop="tabShow('user')">
					<ul class="search-user" v-if="searchResult['user'].length">
					  <li
						v-for="user in searchResult['user']"
						:key="user.user_id"
						class="search-user-item"
					  >
						  <f7-link :href="'/otherInfo/'+ user.user_id" >
							  <div class="avatar">
							  	  <img class="left" :src="user.avatar" alt="">
							  </div>
					      </f7-link>
					      <div class="inner grid border-bottom ">
						      <div class="auth">
						          <p class="name">{{user.username}}</p>
						          <p class="about"><span>{{user.following}}关注</span><span>{{user.follower}}粉丝</span></p>
						      </div>
						      <button @click="doFollow(user)" class="btn btn-md border round" :class="{active:user.is_follow}">{{user.is_follow?"已关注":"关注"}}</button>
					      </div>					  	
					  </li>
					</ul>
	   			    <div class="infinite-scroll-preloader" >
			            <f7-preloader v-if="query.user.more&&query.user.loading"></f7-preloader>
					    <p class="infinite-tip" v-if="!query.user.more">没有更多了</p>
				    </div>	
				    <div class="no-message-container" v-if="!searchResult['user'].length">
				      <img src="../assets/images/no-user.png" alt="">
				      <p class="no-any-message">没有搜索到用户</p>
				    </div>				    			    
			    </f7-tab>			    
		    </f7-tabs>
	    </div>
	</f7-page>
</template>
<style lang="less" scoped>
@import url('../assets/less/var.less');
	.slide-enter-active, .slide-leave-active {
	  transition: all .3s
	}
	.slide-enter, .slide-leave-active {
	  opacity: 0;
	  transform: translate(0,50px);
	}

	.search-container{
		width: 100%;
		height: 100%;
		overflow-y: scroll;
		position: relative;
	}
	.section .title{
		line-height: 44px;
		padding: 0;
	}
	.icon-only{
		line-height: 44px;
	}
	.left{
		// margin-right: 0;
	}
	.center{
		justify-content:flex-start;
		left: 0!important;
		flex-shrink:1;
		flex:1;
		margin: 0;
		transition:all .3s ease;
		height: 44px;

	}
	.navbar .navbar-inner .right{
		.link{
			font-size: 15px;
			font-weight: 500;
		}
	}
	.search-input{
		background-color: #ececec;
		border-radius: 4px;
		position: relative;
		width: 100%;
		transition:all .3s ease;
		color: #000;
		.clear{
			position: absolute;
			right: 10px;
			top:6px;
			height: 18px;
			width: 18px!important;
			z-index: 100;
			line-height: 18px;
			background: #e2e2e2;
			border-radius: 50%;
			justify-content:center;
			align-items:center;
			.iconfont{
				font-size: 18px;
				transform:scale(0.5);
				vertical-align: middle;
			}
		}
		.label{
			position: absolute;
			left: .21333333rem;
			top: 0;
			z-index: 999;
			height: 30px;
			line-height: 30px;
			display: block;
			.iconfont{
				font-size:20px ;
			}

		}
		input{
			background: none;
			width: 100%;
			height: 30px;
			padding-left: .96rem;
			font-size: 13px;
		}
	}
	.search-tool{
		min-height:100%;
		width: 100%;
		overflow-y: scroll;
		position: absolute;
		top: 0;
		z-index: 999;
		background: #fff;
	}
	.search-result{
		height: calc(~"100% - 30px");
		padding-top: 30px;
		.tab{
			box-sizing: border-box;
			height: 100%;
			overflow-y: scroll;
		}
		.search-user{
			padding: 0 15px;
			margin: 0;
			margin-top: 10px;
		}
		.search-user-item{
			display: flex;
			justify-content:space-between;
			.avatar{
				width: 1.17333333rem;
				height: 1.17333333rem
			}
			.link{
				padding: 10px 0;
				margin-right: 20px;
			}
			.auth{
				.name{
					font-size: 15px;
					color: #000;
					line-height: 2;
				}
				.about{
					font-size: 12px;
					color:#999;
					span{
						margin-right: 20px;
					}
				}
			}
			.inner{
				padding:10px 0; 
				display: flex;
				flex:1;
				justify-content:space-between;
				.btn{
					margin: 0;
					height: 25px;
					line-height: 25px;
					border-radius: 25px;
					&.active{
						background-color: @sub-color;
						color: #fff;
					}
				}
			}
		}
	}
	.search-container{
		&.padding{
			padding: 0 .48rem;
		}
		.title{
			display: flex;
			justify-content:space-between;
			h3{
				color:#000;
				font-size: 14px;
			}
			.link{
				font-size: 15px;
			}
			&:after{
				background-color: #ececec;
			}
		}
		.recommend-row{
			display: flex;
			justify-content:flex-start;
			flex-wrap:wrap;
			padding-top: 20px;
			padding-bottom: 16px;
			.recommend-item{
				height: 26px;
				line-height: 26px;
				border:0.5px solid #dcdcdc;
				border-radius: .66666667rem;
				padding: 0 .42666667rem;
				font-size: 13px;
				color:#666;
				margin-right: .4rem;
				margin-bottom: 14px;
			}
		}

	}
	.divider{
		height: 9px;
		background-color: #ececec;
	}
	input[type=search]::-webkit-search-cancel-button{
	    -webkit-appearance: none;//此处只是去掉默认的小×
	}
	input::-webkit-input-placeholder{
		color:#999;
	}

</style>
<script>

import feedRow from '../components/feedRow.vue'
import articleList from '../components/articleList.vue'
export default {
	data(){
		return {
			searchToolShow:false,
			searchInput:"",
			currentTab:"all",
			query:{
				'all':{
					page:2,
					limit:6,
					type:3,
					more:true,
					loading:false
				},
				'evaluating':{
					page:2,
					limit:6,
					type:1,
					more:true,
					loading:false
				},
				'share':{
					page:2,
					limit:6,
					type:2,
					more:true,
					loading:false
				},
				'user':{
					page:2,
					limit:12,
					more:true,
					loading:false,
					type:4
				}

			}
		}
	},
	components:{
		articleList,
		feedRow
	},
	mounted(){
		this.$store.commit("COM_CONF",{
			narbarShadow:false
		})
		this.$store.dispatch("getSearchHotList")
		this.$store.dispatch("getSearchHistory")
        setTimeout(function(){
            document.getElementById("searchInput").focus()
        },600)
	},
	beforeDestroy(){
		this.$store.commit("COM_CONF",{
			narbarShadow:true
		})
		this.$store.commit('clearSearchResult')
	},
	computed:{
		hotSearch(){
			return this.$store.getters.getSearchHotList
		},
		searchHistory(){
			return this.$store.getters.getSearchHistory
		},
		searchResult(){
			return this.$store.getters.getSearchResult
		},
		hasResult(){
			if(!this.searchResult||!this.searchResult.all.length){
				return false
			}
			return true
		},	
		searchPlaceholder(){
			return this.hotSearch[0]||"搜索你感兴趣的内容"
		},

	},
	methods:{
		checkSearchTool(){
			if(this.hasResult){
				this.searchToolShow = false
				return false;
			}
			this.$router.back();
		},
        doFollow(user){
            if(this.$store.getters.userHasLogin){
				this.$store.dispatch('followUser',{uid:user.user_id})
				.then(data=>{
					user.is_follow = !user.is_follow
				})

            }else{
				this.$store.commit("COM_CONF",{
					isLoginScreenShow:true,
				})
            }        	
        },		
		tabShow(tab){
			this.currentTab = tab;
		},
		showSearchTool(){
			this.searchToolShow = true
		},
		hideSearchTool(){
			this.searchToolShow = false
		},
		clearSearchInput(){
			this.searchInput = "";
            document.getElementById("searchInput").focus()
		},
		refreshHotSearch(){
			this.$store.dispatch("getSearchHotList")
		},
		quickSearch(query){
			this.searchInput = query;
			this.doSearch()
		},
		removeSearchHistory(){
			this.$store.dispatch('getSearchHistoryClear')
		},
        reinitPage(){
            plus.navigator.setStatusBarStyle('dark');
        },		
		doSearch(){
			var self = this;
			if(self.searchInput==""){
				self.searchInput = self.searchPlaceholder
			}
			let query = {
				key:self.searchInput
			}
			try{
				plus.nativeUI.showWaiting()
			}catch(e){}
			this.$store.dispatch('getSearchResult',query)
			.then(data=>{
				this.searchToolShow = false
	            document.getElementById("searchInput").blur()
                 plus.nativeUI.closeWaiting()

			},data=>{
				this.$toast.top("没有搜索结果")
                plus.nativeUI.closeWaiting()

			})
			return false;
		},
		loadMoreResult(){
			if(this.query[this.currentTab].loading||!this.query[this.currentTab].more){
				return false;
			}
			let self = this;
			this.query[this.currentTab].loading = true
			let query = Object.assign({
				key:this.searchInput,
			},this.query[this.currentTab])
			delete query.loading
			delete query.more
			console.log(query)
			this.$store.dispatch('getSearchMore',query).then(data=>{
				this.query[this.currentTab].loading = false
				this.query[this.currentTab].page++
				console.log(data)
				if(data.count<=0){
					this.query[this.currentTab].more = false
				}
			})

		}
	},
	filters:{
		titleFilter(title){
			return title.length>30?(title.slice(0,30)+"..."):title
		}
	}
}
</script>
