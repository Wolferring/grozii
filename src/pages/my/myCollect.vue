<template>
<f7-page
navbar-fixed
with-subnavbar
class="myCollect no-toolbar page-meesage"
id='myCollect'
@page:beforeanimation="reinitPage()"

>
  <f7-navbar sliding class="no-border">
    <f7-nav-left>
      <f7-link icon-only back>
        <i class="iconfont icon-back">

        </i>
      </f7-link>
    </f7-nav-left>
    <f7-nav-center>
      我收藏的
    </f7-nav-center>
    <f7-nav-right>
    </f7-nav-right>
    <f7-subnavbar class="tabbar">
      <f7-link tab-link="#original" active>
        <span>好文</span>
      </f7-link>
      <f7-link tab-link="#objPost">
        <span>晒物</span>
      </f7-link>
    </f7-subnavbar>
  </f7-navbar>

  <div class="collect-container">
    <f7-tabs class="collect-tabs">
      <f7-tab id="original" active @tab:show.prevent.stop="tabShow('original')">
        <div class="loader text-center" v-if="originalLoading">
          <f7-preloader></f7-preloader>
        </div>
        <f7-list media-list class="no-top-border article-list-comp" no-border>
          <a :href="'/evalDetail/'+ item.id" v-for="item in myCollOri">
            <f7-list-item class="article-item-comp list-no-type">
              <img :src="item.cover" slot="media" alt="">
              <span class="label label-digest" slot="media-start" v-if="item.is_digest">精华</span>
              
              <div class="content">{{item.content}}</div>
              <div class="auth">
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
        <template v-if="!myCollOri">
        <div class="no-message-container">
          <img src="../../assets/images/no-post.png" alt="">
          <p class="no-any-message">还没有收藏的原创</p>
        </div>
        </template>
      </f7-tab>
      <f7-tab  id="objPost" @tab:show.prevent.stop="tabShow('objPost')">
        <div class="loader text-center" v-if="shareLoading">
          <f7-preloader></f7-preloader>
        </div>
        <div class="post-water" v-if="myCollRev">
          <div class="post-row">
            <!-- <transition-group name="fade"> -->
            <div class="post-item" v-for="(reveal,index) in myCollRev" v-if="index%2==0">
              <a :href="'/postDetail/'+ reveal.id">
                <div class="image">
                  <img :src="reveal.cover" class="">
                </div>
                <h3 class="title">
                  {{reveal.content}}
                </h3>
                <div class="auth">
                  <div class="author">
                    <span class="avatar">
                        <img :src="reveal.avatar" alt="">
                    </span>
                    <span class="name">
                        {{reveal.user_name}}
                    </span>
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
            <!-- <transition-group name="fade"> -->
            <div class="post-item" v-for="(reveal,index) in myCollRev" v-if="index%2!=0">
              <a :href="'/postDetail/'+ reveal.id">
                <div class="image">
                  <img :src="reveal.cover" class="">
                </div>
                <h3 class="title">
                  {{reveal.content}}
                </h3>
                <div class="auth">
                  <div class="author">
                    <span class="avatar">
                        <img :src="reveal.avatar" alt="">
                    </span>
                    <span class="name">
                        {{reveal.user_name}}
                    </span>
                  </div>
                  <div class="like">
                    <i class="iconfont icon-index_like"></i>{{reveal.diggs}}
                  </div>
                </div>
              </a>
            </div>
            <!-- </transition-group> -->
          </div>
        </div>
        <template v-if="myCollRev == undefined">
        <div class="no-message-container">
          <img src="../../assets/images/no-feed.png" alt="">
          <p class="no-any-message">还没有收藏的晒物</p>
        </div>          
        </template>
      </f7-tab>
    </f7-tabs>
  </div>
  <!-- <div class="infinite-scroll-preloader">
      <div class="preloader" v-if="guessLoading"></div>
      <p v-if="!guessMore" class="infinite-tip">没有更多了</p>
    </div> -->
</f7-page>
</template>
<style lang="less">
@import url( '../../assets/less/var.less');
  .pixel-ratio-2 {
      .article-list-comp .item-content:after {
          transform: scaleY(.5);
      }
  }
  .pixel-ratio-3 {
      .article-list-comp .item-content:after {
          transform: scaleY(.33);
      }
  }
  .article-list-comp {
      margin: 0;
      padding: 0 0.26666667rem;
      ul:after {
          background-color: #e2dede;
      }
  }
  .collect-container {
      height: 100%;
      width: 100%;
      overflow-y: scroll;
      position: relative;
  }
  .myCollect {
    .page-content{
      background-color: #f5f5f5!important;
    }

      .list-no-type {
          list-style-type: none;
      }
      .post-item {
          image {
              width: 100%;
          }
      }
      .item-content {
          padding: 0.4rem 0;
          &:after {
              content: '';
              position: absolute;
              left: 0;
              bottom: 0;
              right: auto;
              top: auto;
              height: 1px;
              width: 100%;
              background-color: #e2dede;
              display: block;
              z-index: 15;
              -webkit-transform-origin: 50% 100%;
              transform-origin: 50% 100%;
          }
          .item-media {
              width: 2.66666667rem;
              height: 2.66666667rem;
              padding: 0;
              border-radius: 2px;
              overflow: hidden;
              background-color: @place-color;
              position: relative;
              img {
                  height: 100%;
                  max-width: initial;
                  position: absolute;
                  left: -50%;
                  right: -50%;
                  margin: 0 auto;
              }
          }
          .item-inner {
              padding: 0;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              margin-left: 0.48rem;
              .item-title-row {
                  display: none;
              }
              &:after {
                  content: none;
              }
          }
          .content {
              font-size: 16px;
              text-align: left;
              font-weight: 500;
              width: 100%;
          }
          .auth {
              display: flex;
              color: #888;
              align-items: flex-end;
              justify-content: space-between;
              font-size: 11px;
              padding: 0.16rem 0;
              width: 100%;
              .author {
                  .avatar {
                      display: inline-block;
                      width: 0.45333333rem;
                      height: 0.45333333rem;
                      vertical-align: bottom;
                      overflow: hidden;
                      border-radius: 50%;
                      img {
                          width: 100%;
                      }
                  }
                  .name {}
              }
              .likes {
                  .iconfont {
                      font-size: 12px;
                  }
                  span {
                      margin-right: 0.26666667rem;
                  }
              }
          }
      }

      .navbar .navbar-inner .right {
          .link {
              font-size: 0.40541rem;
              font-weight: 500;
          }
      }
      .collect-tabs {
          #objPost,
          #original {
              .swiper-slide-active {
                  margin: 0;
              }
              .noMessage {
                  width: 4.59459rem;
                  height: 4.59459rem;
                  border-radius: 50%;
                  margin: 2.43243rem auto 0;
                  img {
                      width: 100%;
                  }
              }
              .no-any-message {
                  margin-top: 0.40541rem;
                  font-size: 15px;
                  text-align: center;
                  color: #333;
              }
          }
      }
      .article-item-comp{
        background-color: #fff;
        padding: 0 .26666667rem;

      }
      .article-list-comp{
        padding: 0;
        margin-top: .4rem;
      }      
  }
</style>
<script>
export default {
  data() {
    return {
      currentTab: 1,
      tabState: {
        ori: 0,
        obj: 0
      },
      originalLoading:true,
      shareLoading:true
    };
  },
  computed: {
    myCollOri() {
      return this.$store.getters.myCollOriginal;
    },
    myCollRev() {
      return this.$store.getters.myCollReveal;
    }
  },
  mounted() {
  },
  beforeCreate() {
  },
  destroyed() {
  },
  methods: {
    reinitPage(){
        var self = this;
        this.$store.dispatch("myCollOriginal", {
          page: 1,
          limit: 10
        })
        .then(()=>{
          self.originalLoading = false
      });
      plus.navigator.setStatusBarStyle('dark');
    },
    tabShow(tab) {
      var self = this;
      switch (tab) {
        case "original":
          this.currentTab = 1;
          break;
        case "objPost":
          this.$store.dispatch("myCollReveal", {
            page: 1,
            limit: 10
          })
          .then(()=>{
            self.shareLoading = false
          })
          this.currentTab = 2;
          break;
      }
      // this.$store.dispatch("getNewsList",this.currentTab);
    },
  }
};
</script>
