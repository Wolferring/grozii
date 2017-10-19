<template>
<f7-page
  toolbar-fixed
  navbar-through
  no-page-content
  tabs
  id="evalView"
  with-subnavbar
  @page:beforeanimation="reinitPage()"
>
<f7-navbar sliding class="no-border">
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
              <i class="iconfont icon-index_notice notify">

              </i>
          </f7-link>
      </f7-nav-right>
      <f7-subnavbar class="tabbar no-border">
        <f7-link :tab-link="'#tab-eval-'+index" v-for="(evalType,index) in evalTypes" :active="index==0" :key="index">
          <span>{{evalType.name}}</span>
        </f7-link>
      </f7-subnavbar>
</f7-navbar>
<f7-page-content
  v-for="(tab,index) in evalTypes"
  :key="index"
  :active="index==0"
  :id="'tab-eval-'+index"
  @tab:show="tabShow(index)"
  class="pull-to-refresh-content with-subnavbar infinite-scroll"
  data-distance="400"
  tab
  >
  <div class="pull-to-refresh-layer">
    <f7-preloader></f7-preloader>
    <div class="pull-to-refresh-arrow">
    </div>
  </div>   
  <articleList :list="evalList[tab.id].list" v-if="evalList[tab.id]"></articleList>

  <div class="infinite-scroll-preloader" v-if="evalTypes&&evalList[tab.id]">
      <div class="preloader" v-show="evalTypes[index]['query']['more']&&evalList[tab.id].list.length"></div>
      <p v-show="!evalTypes[index]['query']['more']||!evalList[tab.id].list.length" class="infinite-tip">没有更多了</p>
  </div>
</f7-page-content>

<f7-toolbar
    tabbar
    labels
    class="main-tab-toolbar no-border">
    <f7-link tab-link="#tab-home">
      <img src="../assets/images/icons/home.png"alt="">
    </f7-link>
    <f7-link  tab-link="#tab-eval" @click="evalScrollTop" active>
      <img src="../assets/images/icons/eval-active.png" alt="">
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
<style lang="less" scoped>
  .evaluating-view{
    width: 100%;
    position: relative;
  }
</style>
<script>
import api from '../store/api.js'
import articleList from '../components/articleList.vue'

export default {
  data: function () {
    return {
      currentTab:0,
      hasMore:true,
      loading:false
    }
  },
  mounted(){
  	var self = this;
    var tabEval = this.$$("#evalView");

    tabEval.on("refresh",function(){
        self.$store.commit("evalPageQuery",{
             id:self.currentTab,
             query:{
                 page:1
             }
        })
        self.$store.dispatch("getFreshEvalList",self.evalTypes[self.currentTab]["query"])
          .then(function(data){
  	  		if(data.list.length<=0){
                self.$store.commit("evalPageQuery",{
                    id:self.currentTab,
                    query:{
                        more:false
                    }
                })
  	  			return false;
  	  		}
  	  		if(data.list.length>=1){
  		  		// self.types[self.currentTab]["query"]["page"]++
                self.$store.commit("evalPageQuery",{
                    id:self.currentTab,
                    query:{
                        page:self.evalTypes[self.currentTab]["query"]["page"]+1
                    }
                })
  	  		}
      	  self.loading = false;
          self.$f7.pullToRefreshDone('#tab-eval-'+self.currentTab)
        })
        .catch(err=>{
          self.$f7.pullToRefreshDone('#tab-eval-'+self.currentTab)
        })
    })
    tabEval.on('infinite',function(){
      self.scrollEval()
    })
  },
  computed:{
    evalTypes(){
      return this.$store.getters.getEvalTypes
    },
    evalList(){
      return this.$store.getters.getEvalList
    },
    user(){
      return this.$store.getters.getUser
    }
  },
  methods: {
    tabShow(tab){
        this.currentTab = tab
    },
    reinitPage(){
        plus.navigator.setStatusBarStyle('dark');
    },    
    evalScrollTop(){
      let index = this.currentTab,
          tab = this.$$("#evalView .page-content").eq(index),
          scrollTop = tab.scrollTop()/2
      tab.scrollTop(0, scrollTop>800?800:scrollTop)
    },  
    scrollEval(){
      var self = this
      if(self.loading){
        return false;
      }
      self.loading = true;
      self.getNextPage();      
    },
    getNextPage(fn){
        var self = this;
        var tabPost = this.Dom7("#tab-post");
  	  	this.$store.dispatch("getEvalList",self.evalTypes[self.currentTab]["query"])
          .then(function(data){
  	  		if(data.list.length<=0){
                self.$store.commit("evalPageQuery",{
                    id:self.currentTab,
                    query:{
                        more:false
                    }
                })
  	  			return false;
  	  		}
  	  		if(data.list.length>=1){
  		  		// self.types[self.currentTab]["query"]["page"]++
                self.$store.commit("evalPageQuery",{
                    id:self.currentTab,
                    query:{
                        page:self.evalTypes[self.currentTab]["query"]["page"]+1
                    }
                })
                if(fn){fn()}
  	  		}
      	  self.loading = false;
  	  	})
    },

  },
  components:{
    articleList
  }
}
</script>
