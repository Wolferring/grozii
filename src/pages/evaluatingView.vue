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
    <f7-link 
      :tab-link="'#tab-eval-'+index" 
      v-for="(evalType,index) in evalTypes" 
      :active="index==0" 
      :key="index">
      <span>{{evalType.name}}</span>
    </f7-link>
    <div class="nav-filter" v-if="evalTypes[currentTab]">
      <f7-link  class="nav-link" :class="{'active':evalTypes[currentTab]['query']['sort']==1}" @click="setSortType(1)">最新排序</f7-link>
      <f7-link class="nav-link" :class="{'active':evalTypes[currentTab]['query']['sort']==2}" @click="setSortType(2)">最热排序</f7-link>
      <f7-link class="nav-link" :class="{'active':filterShow}" @click="showFilter">筛选</f7-link>
    </div>
  </f7-subnavbar>
</f7-navbar>
<transition name="slide">
<div class="filter" @touchmove.stop.prevent v-if="evalTypes[currentTab]" @click="cancleFilter" v-show="filterShow">
  <div class="filter-layer">
    
  </div>
  <div class="filter-content border-top" @click.stop >
    <div class="filter-row">
      <div class="row grid">
        <f7-link  
        class="filter-item normal " 
        :class="{'active':evalTypes[currentTab]['query']['filter']=='all'}" @click="setFilter('all')">全部</f7-link> 
        <f7-link 
        :class="{'active':evalTypes[currentTab]['query']['filter']=='digest'}" 
        class="filter-item normal" @click="setFilter('digest')">只看精华</f7-link> 
      </div>
    </div>
    <div class="filter-row" >
      <h3 class="filter-title">标签</h3>
      <div class="row grid">
<!--         <f7-link 
        class="filter-item tag" 
        v-for="(name,id) in evalTypes[currentTab]['tags']"
        :class="{'active':evalTypes[currentTab]['query']['tags'].includes(parseInt(id))}"
        @click="filterToggleTag(id)"
        >{{name}}
        </f7-link>  -->
        <template v-for="(name,id) in evalTypes[currentTab]['tags']">
        <input type="checkbox" style="display:none" :id="'evalFilterTag'+id" :value="id" @change="filterTagChange($event)">
        <label class="filter-item tag" 
        :class="{'active':evalTypes[currentTab]['query']['tags'].includes(id)}"
        :for="'evalFilterTag'+id">{{name}}</label>     
        </template>
        <!-- <f7-link class="filter-item tag">科技</f7-link>  -->
      </div>
    </div> 

    <div class="filter-action grid">
      <f7-link @click="cancleFilter">取消</f7-link>
      <f7-link @click="triggerFilter">筛选</f7-link>
    </div>
  </div>
</div>
</transition>  

<f7-page-content
  v-for="(tab,index) in evalTypes"
  :key="index"
  :active="index==0"
  :id="'tab-eval-'+index"
  tab
  @tab:show="tabShow(index)"
  class="pull-to-refresh-content with-subnavbar infinite-scroll"
  data-distance="300"
  >
  <div class="pull-to-refresh-layer">
    <f7-preloader></f7-preloader>
    <div class="pull-to-refresh-arrow">
    </div>
  </div> 

  <articleList :list="evalList[tab.id].list" v-if="evalList[tab.id]"></articleList>
  <div class="infinite-scroll-preloader" v-if="evalTypes&&evalList[tab.id]">
      <div class="preloader" v-show="evalTypes[index]['query']['more']&&evalList[tab.id].list.length"></div>
      <p v-show="!evalTypes[index]['query']['more']" class="infinite-tip">没有更多了</p>
  </div>
</f7-page-content>

<f7-toolbar
    tabbar
    labels
    class="main-tab-toolbar no-border">
    <f7-link tab-link="#tab-home">
      <img src="../assets/images/icons/home.png"alt="">
    </f7-link>
    <f7-link  tab-link="#tab-eval" @click="evalScrollTop(true)" active>
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
@import url("../assets/less/var.less");
  #evalView{
    .page-content{
      padding-top: 124px!important;
    }
  }
  .subnavbar{
    box-shadow: none;
  }
  .filter{
    position: absolute;
    letter-spacing: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 5002;
    padding-top: 124px;
    .filter-layer{
      position: absolute;
      z-index: -1;
      top: 124px;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,.3);
      -webkit-backdrop-filter:blur(10px);

    }
    .filter-content{
      background-color: #fff;
      padding-top: 10px;
      .filter-action{
        justify-content:space-between;
        margin-top: 10px;
        .link{
          display: block;
          width: 50%;
          padding: 10px 0;
          text-align: center;
          color: #999;
          background-color: #f4f4f4;
          &:last-child{
            color: #4288f0;
          }
        }
      }
      .filter-row{
        padding: 10px 25px;
        .filter-title{
          font-size: 14px;
          font-weight: normal;
          margin-bottom: 5px;
        }
        .row{
          justify-content:flex-start;
          align-items:center;
        }        
        .filter-item{
          position: relative;
          padding: 5px 0px;
          margin-right: 20px;
          color: #999;
          font-size: 12px;
          &.tag{
            display: inline-block;
            border: .5px solid #999;
            padding: 2px 10px;
            margin-top: 10px;
            margin-right: 15px;
            &.active{
              border-color: @sub-color;
              color:@sub-color;
              background-color: rgba(35,222,177,.1);
            }
          }
          &.normal.active{
            &:after{
              content: "";
              position: absolute;
              width: 100%;
              height: 2.5px;
              left: 0;
              bottom: 0;
              border-radius: 2.5px;
              background: #23deb1;
              background-image: linear-gradient(337deg, #26d9c2, #2ee36e);              
            }
          }
        }

      }
    }
  }
  .nav-filter{
    position: absolute;
    top: 30px;
    left: 0;
    display: flex;
    z-index: 1000;
    width: 100%;
    background-color: #fff;
    height: 30px;
    justify-content:space-around;
    box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.02);
    a.nav-link{
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      color: #999;
      &.active{
        color: @sub-color;
        font-weight: 500;
      }
    }
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
      loading:false,
      filterShow:false,
      oldFilter:Object
    }
  },
  mounted(){
  	var self = this;
    var tabEval = this.$$("#evalView");
    tabEval.on("refresh",function(){
        const currentTime = new Date().getTime()
        self.$store.commit("evalPageQuery",{
             id:self.currentTab,
             query:{
                 page:1
             }
        })
        self.$store.dispatch("getFreshEvalList",self.evalTypes[self.currentTab]["query"])
        .then(function(data){
          let time = new Date().getTime() - currentTime  
  	  		if(data.list.length>=1){
              self.$store.commit("evalPageQuery",{
                  id:self.currentTab,
                  query:{
                      more:true,
                      page:self.evalTypes[self.currentTab]["query"]["page"]+1
                  }
              })
  	  		}
          if(data.list.length<6){
                self.$store.commit("evalPageQuery",{
                    id:self.currentTab,
                    query:{
                        more:false
                    }
                })
          }          
      	  self.loading = false;
          if(time>500){
              self.$f7.pullToRefreshDone('#tab-eval-'+self.currentTab)
          }else{
              setTimeout(function(){
                self.$f7.pullToRefreshDone('#tab-eval-'+self.currentTab)
              },500-time)
          }          
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
    evalScrollTop(time){
      let index = this.currentTab,
          tab = this.$$("#evalView .page-content").eq(index),
          scrollTop = tab.scrollTop()/2
      tab.scrollTop(0, time?(scrollTop>800?800:scrollTop):0)
    }, 
    filterTagChange(el){
      let choosedTag = this.evalTypes[this.currentTab]['query']['tags'].concat([])
      let tag = el.target.value,
          index = choosedTag.indexOf(tag)
      if(index>-1){
          choosedTag.splice(index,1)
      }else{
        choosedTag.push(tag)
      }
      this.$store.commit("evalPageQuery",{
           id:this.currentTab,
           query:{
              tags:choosedTag
           }
      })      

    },
    setFilter(rule){
        let self = this;
        this.$store.commit("evalPageQuery",{
             id:this.currentTab,
             query:{
                filter:rule
             }
        })
    },
    setSortType(sort){
        let self = this;
        this.$store.commit("clearEvalList",this.currentTab)
        this.$store.commit("evalPageQuery",{
             id:this.currentTab,
             query:{
                 sort:sort,
                 page:1,
                 more:true
             }
        })
        this.$f7.pullToRefreshTrigger('#tab-eval-'+self.currentTab)      
    },
    showFilter(){
      this.filterShow = true
      this.oldFilter = JSON.parse(JSON.stringify(this.evalTypes[this.currentTab]['query']))
      //拷贝对象，不适用于function属性
    }, 
    cancleFilter(){
      let self = this
      this.filterShow = false;
      this.$store.commit("evalPageQuery",{
           id:this.currentTab,
           query:self.oldFilter
      })
      self.oldFilter = {}      
    },
    triggerFilter(){
      this.filterShow = false;
      this.$store.commit("clearEvalList",this.currentTab)
      this.$f7.pullToRefreshTrigger('#tab-eval-'+this.currentTab)      
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
                        more:true,
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
