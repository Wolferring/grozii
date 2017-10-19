<template>
<f7-page
  toolbar-fixed
  navbar-through
  no-page-content
  tabs
  id="postView"
  @touchstart="touchStartPostList()"
  @touchend="touchEndPostList()"
  @page:beforeanimation="reinitPage()"

>
<f7-navbar class="no-border">
      <f7-nav-left>
      </f7-nav-left>

      <f7-nav-center>
        <f7-link href="/search/">
          <div class="navbar-search">
            <label for="#">
              <i class="iconfont icon-Index_search_display"></i>
            </label>
            搜索你感兴趣的内容
          </div>
        </f7-link>
      </f7-nav-center>
      <f7-nav-right>
          <f7-link color="black" icon-only href="/news/">
              <i class="iconfont icon-index_notice" :class="{notify:user.hasNewMessage}">

              </i>
          </f7-link>
      </f7-nav-right>
        <f7-subnavbar class="tabbar no-border">
          <f7-link :tab-link="'#tab-post-'+index" v-for="(postType,index) in postTypes" :active="index==0" :key="index">
            <span>{{postType.name}}</span>
          </f7-link>
        </f7-subnavbar>
</f7-navbar>
<f7-page-content
  tab
  
  v-for="(tab,index) in types"
  :key="index"
  :active="index==0"
  :id="'tab-post-'+index"
  @tab:show="tabShow(index)"
  class="pull-to-refresh-content with-subnavbar infinite-scroll"
  data-distance="600"
  >
    <div class="pull-to-refresh-layer">
      <div class="preloader"></div>
      <div class="pull-to-refresh-arrow"></div>
    </div>
    <div class="post-water" v-if="postList[tab.id]">
      <div class="post-row">

        <div class="post-item" v-for="(item,key) in postList[tab.id].list" v-if="key%2==0" :key="item.id">
          <a :href="/postDetail/+item.id">
          <div class="image">
            <img
            :src="item.cover"
            v-once
            :height="(item.cover||'')|getHeightFromUrl"
            >
          <span class="post-multi-pics" v-if="item.files>1">
            <img src="../assets/images/multi-image.png" alt="">
          </span>             
          </div>
          <h3 class="title">{{item.title|titleFilter}}</h3>
          <div class="auth">
            <div class="author">
              <span class="avatar">
                <img :src="item.author.avatar" alt="">
              </span>
              <span class="name">{{item.author.username}}</span>
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
          <div class="post-item" v-for="(item,key) in postList[tab.id].list" v-if="key%2==1" :key="item.id">
            <a :href="/postDetail/+item.id">
              <div class="image">
                <img
                :src="item.cover"
                v-once
                :height="(item.cover||'')|getHeightFromUrl"
                >
              <span class="post-multi-pics" v-if="item.files>1">
                <img src="../assets/images/multi-image.png" alt="">
              </span>                  
              </div>
              <h3 class="title">{{item.title|titleFilter}}</h3>
              <div class="auth">
                <div class="author">
                  <span class="avatar">
                    <img :src="item.author.avatar" alt="">
                  </span>
                  <span class="name">{{item.author.username}}</span>
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

    <div class="infinite-scroll-preloader" v-if="types&&postList[tab.id]">
        <div class="preloader" v-show="types[index]['query']['more']&&postList[tab.id].list.length"></div>
        <p v-show="!types[index]['query']['more']||!postList[tab.id].list.length" class="infinite-tip">没有更多了</p>
    </div>
</f7-page-content>

<f7-toolbar
    tabbar
    labels
    class="main-tab-toolbar no-border">
    <f7-link tab-link="#tab-home" active>
      <img src="../assets/images/icons/home.png"alt="">
    </f7-link>
    <f7-link  tab-link="#tab-eval">
      <img src="../assets/images/icons/eval.png" alt="">
    </f7-link>
    <f7-link  tab-link="#tab-post" @click="postScrollTop">
          <img src="../assets/images/icons/post-active.png">
    </f7-link>
    <f7-link  tab-link="#tab-user">
      <img src="../assets/images/icons/me.png"  alt="">
    </f7-link>
</f7-toolbar>
<transition name="slide-right">
<f7-fab color="white" @touchstart.prevent.stop @touchend.prevent.stop class="fab-post-create" v-show="openPostCreateShow" @click="openPostCreate">
  <img src="../assets/images/posSendButton.png" >
</f7-fab>
</transition>
</f7-page>

</template>
<style lang="less">
#postView{
  background-color: #ececec;
  .page-content{
    background-color: inherit;
  }
}
.fab-post-create{
  background:initial!important;
  right: .26666667rem;
  bottom: 75px!important;
  img{
    widows: 100%;
  }
}
.btn-sendPost{
    position: absolute;
    width: 100%;
    top: 6px;
    transform-origin:center;
    display: block!important;
    padding:0!important;
    text-align: center;
    img{
        margin:0 auto;
    }
    &.active-state{
        opacity: .6;
    }
    animation:bounceInQuick .3s ease;
}
</style>
<script>
import api from '../store/api.js'

export default {
  data: function () {
    return {
      currentTab:0,
      hasMore:true,
      loading:false,
      openPostCreateShow:true,
      scrollTimer:""
    }
  },
  mounted(){
  	var self = this,
        tabPost = this.Dom7("#postView");
    tabPost.on("touchstart",()=>{
      this.touchStartPostList()
    })
    tabPost.on("touchend",()=>{
      this.touchEndPostList()
    })
    tabPost.on("refresh",function(){
        self.$store.commit("postPageQuery",{
             id:self.currentTab,
             query:{
                 page:1
             }
        })
        self.$store.dispatch("getFreshPostList",self.types[self.currentTab]["query"])
        .then(function(data){
            self.$f7.pullToRefreshDone('#tab-post-'+self.currentTab)
            if(data.list.length<=0){
                  self.$store.commit("postPageQuery",{
                      id:self.currentTab,
                      query:{
                          more:false
                      }
                  })
                return false;
            }
            if(data.list.length>=1){
                  self.$store.commit("postPageQuery",{
                      id:self.currentTab,
                      query:{
                          more:true,
                          page:self.types[self.currentTab]["query"]["page"] + 1
                      }
                  })
            }
            self.loading = false;
        })
        .catch(e=>{
          self.$f7.pullToRefreshDone('#tab-post-'+self.currentTab)
          this.$toast.center(e.msg||"刷新失败")
        })
    })
    tabPost.on("infinite",function(e){
      if(self.loading){
        return false;
      }
      self.loading = true;
      self.getNextPage();
    })
  	//self.getNextPage();
  },
  computed:{
    types(){
      return this.$store.getters.getPostTypes
    },
    postTypes(){
        return this.$store.getters.getPostTypes
    },
    postList(){
        return this.$store.getters.getPostList
    },
    user(){
      return this.$store.getters.getUser
    }

  },
  filters:{
    getHeightFromUrl:function(url){
      var url = url.split("/")
      url = url[url.length-1]
      let info = url.split(".")[0].split("$").slice(1,3);
      if(info.length<=0){
        return false
      }
      let colW = parseFloat(document.documentElement.style.fontSize)*4.58666667
      return parseInt(info[1].replace("_thumb","")*(colW/info[0]))
    },
    titleFilter(title){
      return title.length>30?(title.slice(0,30)+"..."):title
    }
  },
  methods: {
    tabShow(tab){
        this.currentTab = tab
    },
    reinitPage(){
        plus.navigator.setStatusBarStyle('dark');
    },
    postScrollTop(){
      let index = this.currentTab,
          tab = this.$$("#postView .page-content").eq(index),
          scrollTop = tab.scrollTop()/2
      tab.scrollTop(0, scrollTop>800?800:scrollTop)
    },
    touchStartPostList(){
      clearTimeout(this.scrollTimer)
      this.openPostCreateShow = false
    },
    touchEndPostList(){
      this.scrollTimer = setTimeout(()=>{
        this.openPostCreateShow = true
      },750)
    },
    openPostCreate(){
        var self = this;
        if(this.$store.getters.userHasLogin){
          var create = plus.webview.create("/createPost.html","create",{
              "kernel":"UIWebview",
          },{
            token:self.user.auth_token
          })
          create.show("slide-in-right");
        }else{
          self.$store.commit("COM_CONF",{
            isLoginScreenShow:true,
          })
        }
    },
    getNextPage(fn){
        var self = this;
        var tabPost = this.Dom7("#tab-post");
	  	  this.$store.dispatch("getPostList",self.types[self.currentTab]["query"])
        .then(function(data){
  	  		if(data.list.length<=0){
                  self.$store.commit("postPageQuery",{
                      id:self.currentTab,
                      query:{
                          more:false
                      }
                  })
  	  			return false;
  	  		}
  	  		if(data.list.length>=1){
  		  		// self.types[self.currentTab]["query"]["page"]++
                  self.$store.commit("postPageQuery",{
                      id:self.currentTab,
                      query:{
                          page:self.types[self.currentTab]["query"]["page"]+1
                      }
                  })
                  if(fn){fn()}
  	  		}
    	  	self.loading = false;
	  	})
    }

  }
}
</script>
