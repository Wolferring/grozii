<template>
	<f7-page navbar-fixed  with-subnavbar class="myPost no-toolbar page-meesage" id='myPost' @page:beforeanimation="reinitPage">

        <f7-navbar sliding class="no-border">
          <f7-nav-left>
			<f7-link icon-only back>
				<i class="iconfont icon-back">

				</i>
			</f7-link>
          </f7-nav-left>
          <f7-nav-center>
          		我发布的
          </f7-nav-center>
		  <f7-nav-right>

		  </f7-nav-right>
			<f7-subnavbar class="tabbar">
				<f7-link tab-link="#original" active >
					<span>原创</span>
				</f7-link>
	            <f7-link tab-link="#objPost">
	                <span>晒物</span>
	            </f7-link>
			</f7-subnavbar>
	    </f7-navbar>

	    <div class="info-container">
		    <f7-tabs class="user-post-container">
			  <f7-tab class="" id="original" active @tab:show.prevent.stop="tabShow('original')">
			  <div class="loader text-center" v-if="originalLoading">
				  <f7-preloader></f7-preloader>
			  </div>
	  	        <f7-list media-list class="no-top-border article-list-comp" v-if="myPostOri" no-border>
				  <a :href="'/evalDetail/'+ item.id" v-for="item in myPostOri">
	  	          <f7-list-item   class="article-item-comp list-no-type">
						<img :src="item.cover" slot="media" alt="">
		  	            <div class="content" slot="inner-start">{{item.content}}</div>
		  	            <div class="auth" slot="inner">
		  	              <div class="author">
		  	                <span class="avatar">
		  	                    <img :src="item.avatar" alt="">
		  	                  </span>
		  	                <span class="name">
		  	                    {{item.user_name}}
		  	                  </span>
		  	              </div>
		  	              <div class="likes">
		  	                <span>
		  	                    <i class="iconfont icon-index_comment"></i>
		  	                    {{item.replies}}
		  	                  </span>
		  	                <span>
		  	                    <i class="iconfont icon-index_good"></i>
		  	                    {{item.diggs}}
		  	                  </span>
		  	              </div>
		  	            </div>
	  	          </f7-list-item>
				  </a>
	  	        </f7-list>
	  	        <div v-if="!myPostOri">
	  	          <div class="noMessage">
	  	            <img src="../../assets/images/noPost.png" alt="">
	  	          </div>
	  	          <p class="no-any-message">还没有发布过原创</p>
	  	        </div>
	  	      </f7-tab>
	  	      <f7-tab class="with-back" id="objPost" @tab:show.prevent.stop="tabShow('objPost')">
			  <div class="loader text-center" v-if="shareLoading">
				  <f7-preloader></f7-preloader>
			  </div>		  	      
	  	        <div class="post-water" v-if="myPostRev">
	  	          <div class="post-row">
	  	            <!-- <transition-group name="fade"> -->
	  	            <div class="post-item" v-for="(reveal,index) in myPostRev" v-if="index%2==0">
	  	              <a :href="'/postDetail/'+ reveal.id">
	  	                <div class="image">
	  	                  <img :src="reveal.cover" class="">
	  	                </div>
	  	                <h3 class="title">{{reveal.content}}</h3>
	  	                <div class="auth">
	  	                  <div class="author">
	  	                    <span class="avatar">
	  	                        <img :src="reveal.avatar" alt="">
	  	                    </span>
	  	                    <span class="name">{{reveal.user_name}}</span>
	  	                  </div>
	  	                  <div class="like">
	  	                    <i class="iconfont icon-index_like"></i>{{reveal.diggs}}
	  	                  </div>
	  	                </div>
	  	              </a>
	  	            </div>
	  	            <!-- </transition-group> -->
	  	          </div>
	  	          <div class="post-row">
	  	            <div class="post-item" v-for="(reveal,index) in myPostRev" v-if="index%2!=0">
	  	              <a :href="'/postDetail/'+ reveal.id">
	  	                <div class="image">
	  	                  <img :src="reveal.cover" class="">
	  	                </div>
	  	                <h3 class="title">{{reveal.content}}</h3>
	  	                <div class="auth">
	  	                  <div class="author">
	  	                    <span class="avatar">
	  	                        <img :src="reveal.avatar" alt="">
	  	                    </span>
	  	                    <span class="name">{{reveal.user_name}}</span>
	  	                  </div>
	  	                  <div class="like">
	  	                    <i class="iconfont icon-index_like"></i>{{reveal.diggs}}
	  	                  </div>
	  	                </div>
	  	              </a>
	  	            </div>
	  	          </div>
	  	        </div>
	  	        <div v-if="!myPostRev">
	  	          <div class="noMessage">
	  	            <img src="../../assets/images/noPost.png" alt="">
	  	          </div>
	  	          <p class="no-any-message">还没有发布过晒物</p>
	  	        </div>
	  	      </f7-tab>
		    </f7-tabs>
	    </div>
		<!-- <div class="infinite-scroll-preloader">
			<div class="preloader" v-if="guessLoading"></div>
			<p v-if="!guessMore" class="infinite-tip">没有更多了</p>
		</div> -->
	</f7-page>
</template>
<style lang="less" scoped>
	@import url('../../assets/less/var.less');

	.page-meesage{
	}
	.myPost{
		.post-item{
			image{
				width: 100%;
			}
		}
		.list-no-type{
			list-style: none;
		}
		.info-container{
			height: 100%;
			width: 100%;
			overflow-y: scroll;
			position: relative;
			.swiper-slide{
				.preloader{
					width: 20px;
					height: 20px;
					margin-left: -10px;
				    margin-top: -10px;
				}
			}
		}
		.swipeout-delete-item{
			background-color: red;
		}
		.user-post-container{
	        #original,#objPost{
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
					font-size: 0.43243rem;
					text-align: center;
					color: #a4a4a4;
				}
	        }
		}
	}
</style>
<script>
import articleList from '../../components/articleList.vue'
export default {
  data() {
    return {
		currentTab:1,
		tabState:{
			ori:0,
			obj:0,
		},
		originalLoading:true,
		shareLoading:true
    };
  },
  components: {
  	articleList
  },
  computed:{
	 myPostOri(){
	   return this.$store.getters.myPostOriginal;
     },
	 myPostRev(){
	   return this.$store.getters.myPostReveal;
	 }
  },
  mounted() {
	var self =this;
	this.$store.dispatch("myPostOriginal", {
	  page: 1,
	  limit: 10
	})
	.then(()=>{
		self.originalLoading = false
	})
	
  },
	methods: {
		reinitPage(){
			plus.navigator.setStatusBarStyle('dark');
		},
		swipeDeletePost(id){

		},
		tabShow(tab){
			var self = this;
			switch(tab){
			  case "original":
				  this.currentTab  = 1;
				  break;
			  case "objPost":
				  	this.currentTab = 2;
				  	if(this.shareLoading){
						this.$store.dispatch("myPostReveal", {
						  page: 1,
						  limit: 10
						})
						.then(()=>{
							self.shareLoading = false
						})				  
				  	}
				  break;
			}
		},
		goEval(id){
			var self = this;
			self.$f7.mainView.router.load({url:"evalDetail"+id});
		}
	}
}
</script>
