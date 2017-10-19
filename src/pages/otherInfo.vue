<template>
<f7-page no-navbar toolbar-fixed class="other-info no-navbar" @page:afteranimation="reinit">
  <f7-navbar sliding class="navbar-hidden">
    <f7-nav-left>
      <f7-link icon-only back>
        <i class="iconfont icon-back">

        </i>
      </f7-link>
    </f7-nav-left>
    <f7-nav-center>
    </f7-nav-center>
    <f7-nav-right>
    </f7-nav-right>
  </f7-navbar>
  <div class="container" @scroll="handleScroll()" ref="userScroller">
    <div class="user-basic" :style="{height:headImageHeight+'px'}">
      <div class="user-avatar-back">
        <img src="../assets/images/loginBg.jpg" alt="">
      </div>
      <div class="head-bar">
        <f7-link icon-only back>
          <i class="iconfont icon-back back "></i>
        </f7-link>
        <f7-link
            icon-only
            @click="openAction($event)"
            class=""
            v-if="(otherInfo.id != user.info.id)">
                <i class="iconfont icon-more"></i>
        </f7-link>
      </div>

      <div class="user-avatar">
        <div class="avatar">
          <img :src="otherInfo.avatar" alt="">
        </div>
      </div>
      <div class="text-center">
        <p class='login-text'>{{otherInfo.username}}</p>
        <p class='login-text'>{{otherInfo.intro}}</p>
      </div>
      <div class="psn-about">
        <f7-link :href="'/userFollows/'+otherInfo.id">
          <div>
            <p class="about">关注</p>
            <p class="num">{{otherInfo.following}}</p>
          </div>
        </f7-link>
        <span></span>
        <f7-link :href="'/userFans/'+otherInfo.id">
          <div>
            <p class="about">粉丝</p>
            <p class="num">{{otherInfo.follower}}</p>
          </div>
        </f7-link>
      </div>
    </div>
    <div class="userTabbarContainer">
      <div class="tabbar infotabs" :class="infotabState? '':'infoTabFixed'">
        <f7-link :tab-link="'#original'+timeStamp" active>
          <span>原创</span>
        </f7-link>
        <f7-link :tab-link="'#objPost'+timeStamp">
          <span>晒物</span>
        </f7-link>
      </div>
    </div>
    <f7-tabs>
      <f7-tab :id="'original'+timeStamp" active @tab:show.prevent.stop="tabShow('original'+timeStamp)">
        <f7-list media-list v-if="userOri" class="no-top-border article-list-comp" no-border>
          <a @click="$router.load({url:'/evalDetail/'+ item.id,pushState:false})" href="javascript:void(0)" v-for="item in userOri">
            <f7-list-item class="article-item-comp list-no-type">
              <img :src="item.cover" slot="media" alt="">
              <span class="label label-digest" slot="media-start" v-if="item.is_digest">精华</span>
              
              <div class="content">{{item.content}}</div>
              <div class="auth">
                <div class="author">
                  <span class="avatar"><img :src="item.avatar" alt=""></span>
                  <span class="name">{{item.user_name}}</span>
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
        <div v-if="!userOri">
          <div class="noMessage">
            <img src="../assets/images/no-post.png" alt="">
          </div>
          <p class="no-any-message">还没有发布任何内容</p>
        </div>
      </f7-tab>
      <f7-tab :id="'objPost'+timeStamp" @tab:show.prevent.stop="tabShow('objPost'+timeStamp)">
        <div class="post-water" v-if="userRev">
          <div class="post-row">
            <!-- <transition-group name="fade"> -->
            <div class="post-item" v-for="(item,index) in userRev" v-if="index%2==0">
              <a :href="'/postDetail/'+ item.id">
                <div class="image">
                  <img :src="item.cover" class="">
                </div>
                <h3 class="title">{{item.content}}</h3>
                <div class="auth">
                  <div class="author">
                    <span class="avatar">
          						<img :src="item.avatar" alt="">
          					</span>
                    <span class="name">{{item.user_name}}</span>
                  </div>
                  <div class="like">
                    <i class="iconfont icon-index_like"></i>{{item.diggs}}
                  </div>
                </div>
              </a>
            </div>
            <!-- </transition-group> -->
          </div>
          <div class="post-row">
            <!-- <transition-group name="fade"> -->
            <div class="post-item" v-for="(item,index) in userRev" v-if="index%2!=0">
              <a :href="'/postDetail/'+ item.id">
                <div class="image">
                  <img :src="item.cover" class="">
                </div>
                <h3 class="title">{{item.content}}</h3>
                <div class="auth">
                  <div class="author">
                    <span class="avatar">
  						<img :src="item.avatar" alt="">
  					</span>
                    <span class="name">
  						{{item.user_name}}
  					</span>
                  </div>
                  <div class="like">
                    <i class="iconfont icon-index_like"></i> {{item.diggs}}
                  </div>
                </div>
              </a>
            </div>
            <!-- </transition-group> -->
          </div>
        </div>
        <div v-if="!userRev">
          <div class="noMessage">
            <img src="../assets/images/no-feed.png" alt="">
          </div>
          <p class="no-any-message">还没有发布任何内容</p>
        </div>
      </f7-tab>
    </f7-tabs>
  </div>
  </div>
  <f7-toolbar class="no-border text-center"  v-if="(otherInfo.id != user.info.id)">
      <f7-link @click="cancle" class="follow-link" :class="{'active':otherInfo.is_follow,'disabled':isFollowing}">
         <i class="iconfont" :class="otherInfo.is_follow?'icon-zhengque':'icon-xinjian'"></i>{{otherInfo.is_follow?"已关注":"关注"}}
      </f7-link>
  </f7-toolbar>
<div id="userAction" slot="fixed" class="action" v-if="actionShow">
    <div class="action-layer" @touchmove.prevent="" @click="actionShow=false">

    </div>
    <div class="action-list" :style="{'top':actionClickTop+'px'}">
        <f7-link class="action-item" @click="load({url: '/userReport/',query:{'report_link_type':'5','report_link_id':otherInfo.id}})"><i class="iconfont icon-jubao"></i>举报
        </f7-link>
    </div>
</div>
</f7-page>
</template>
<style lang="less">
@import url( '../assets/less/var.less');
.other-info {
    .list-no-type {
        list-style: none;
    }
    .page-content {
        background: #f5f5f5!important;
        -webkit-overflow-scrolling:none;
    }
    .toolbar{
        height: 50px;
    }
    a.follow-link{
        display: block!important;
        text-align: center;
        line-height: 50px;
        height: 50px;
        width: 100%;
        font-size:14px;
        color:@sub-color;
        .iconfont{
            margin-right: 8px;
            font-size: 12px;
        }
        &.active{
            color: #bbb;
        }
    }
    #userAction{
        z-index: 10001;
        position: absolute;
        width: 100%;
        height: 100%;
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
            box-sizing: border-box;
            .iconfont{
                font-size: 18px;
                color: #333;
                margin-right: 2px;
                &.icon-share{
                    font-size: 14px;
                }
            }
        }
        .action-item{
            display: block;
            border-bottom: .5px solid #ddd;
            line-height: 45px;
            height: 45px;
            padding-left: 10px;
            &:last-child{
                border-bottom: none;
            }
        }
    }
    .post-item {
        .image {
            img {
                width: 100%;
            }
        }
    }
    .user-basic {
        padding: 0.53333333rem 0;
        position: relative;
        width: 100%;
        margin-bottom: 45px;
        .head-bar {
            color: #fff;
            line-height: 25px;
            position: absolute;
            display: flex;
            justify-content:space-between;
            align-items:center;
            top:35px;
            width: 100%;
            padding: 0 10px;
            box-sizing: border-box;
            a {
                color: #fff;
            }
            .follow-op{
                float: right;
                position: relative;
                width: 90px;
                height: 25px;
                line-height: 25px;
                border-top-left-radius: 25px;
                border-bottom-left-radius: 25px;
                background-color: rgba(0,0,0,0.6);
                text-align: center;
                font-size: 12px;
                span {
                    display: inline-block;
                    margin: 0 auto;
                    padding: 0 10px;
                    transition: all 0.5s;
                    line-height: 26px;
                }
                .iconfont{
                    position: absolute;
                    top: 0;
                    left: 5px;
                    display: inline-block;
                    font-size: 15px;
                    transition:transform .3s ease;
                }
                .followbtn {
                    transform: scale(0.5,0.5) rotate(45deg);
                }
                .canclefollowbtn {
                    transform: scale(0.5,0.5);
                }
            }
        }
        .user-avatar-back {
            position: absolute;
            display: flex;
            left: 0;
            top: 0;
            height: 100%;
            width: 100%;
            z-index: -1;
            overflow: hidden;
            text-align: center;
            img {
                width: 100%;
                vertical-align: bottom;
            }
        }
        .user-avatar {
            margin: 0 auto;
            margin-top: 25px;
            .avatar {
                height: 2.13333333rem;
                width: 2.13333333rem;
                display: block;
                margin: 0 auto;
            }
            flex: 1;
        }
        .text-center {
            margin: 15px 0 20px;
            .login-text {
                font-size: 14px;
                color: #fff;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                a {
                    color: #fff;
                }
            }
        }
        .psn-about {
            position: absolute;
            background: #fff;
            left: 50%;
            transform: translateX(-50%);
            bottom: -25px;
            width: 300px;
            height: 38px;
            padding: 5px 0;
            box-shadow: 0 6px 21px 0 rgba(135, 141, 140, 0.1);
            border-radius: 4px;
            border: solid 1px #ededed;
            div {
                width: 50%;
                float: left;
                text-align: center;
                .about {
                    font-size: 14px;
                    color: #333;
                }
                .num {
                    font-size: 12px;
                    color: #999;
                }
            }
            span {
                position: absolute;
                width: 1px;
                height: 26px;
                background: #d4d4d4;
                top: 50%;
                transform: translateY(-50%);
            }
        }
    }
    .userTabbarContainer {
        height: 30px;
    }
    .noMessage {
        width: 4.59459rem;
        height: 4.59459rem;
        border-radius: 50%;
        margin: 1.5rem auto 0;
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
    .infotabs {
        overflow: hidden;
        a {
            display: block;
            float: left;
            width: 50%;
            text-align: center;
            span {
                padding-bottom: 5px;
            }
        }
    }
    .infoTabFixed {
        position: absolute;
        padding: 10px 0;
        top: 0;
        width: 100%;
        background: #fff;
        border-bottom: 0.5px solid #d5d5d5;
        a {
            position: relative;
            z-index: 999999;
        }
    }
    .list-block {
        margin: 10px 0 0;
        background-color: #fff;
    }
    .setting-list {
        .head-list {
            img {
                width: 44px;
                border-radius: 50%;
            }
            span {
                flex: 1;
                margin-left: 10px;
                font-size: 12px;
                color: #999;
            }
        }
        .item-content {
            min-height: 54px;
            padding-left: 0;
            .item-inner {
                padding-left: 20px;
            }
        }
    }
    .login-out {
        .item-inner {
            padding-right: 20px;
            span {
                font-size: 15px;
                margin: 0 auto;
                color: #e03c3c;
            }
        }
    }
}


</style>
<script>
export default {
  data() {
    return {
      ifFollow: true,
      headImageHeight: 180,
      currentTab: "original",
      infotabState: true,
      actionShow:false,
      actionClickTop:40,
      timeStamp: new Date().getTime(),
      isFollowing:false,
      postOriArg: {
        user_id: this.$route.params.ouid,
        page: 1,
        limit: 5
      },
      postRevArg: {
        user_id: this.$route.params.ouid,
        page: 1,
        limit: 5
      },
      infoArg: {
        user_id: this.$route.params.ouid,
      }
    };
  },
  mounted() {

  },
  computed: {
    pid() {
      return this.$route.params.ouid;
    },
    otherInfo() {
      return this.$store.getters.getOtherInfo;
    },
    userOri() {
      return this.$store.getters.userPostOriginal;
    },
    userRev() {
      return this.$store.getters.userPostReveal;
    },
    user() {
      return this.$store.getters.getUser
    }
  },
  beforeDestroy() {
    this.$store.commit('getOtherInfo', {})
    this.$store.commit('userPostOriginal', {})
    this.$store.commit('userPostReveal', {})

  },
  methods: {
    tabShow(tab) {
      this.currentTab = tab;
    },
    reinit() {
      var self = this;
      self.$store.dispatch("getOtherInfo", this.infoArg);
      self.$store.dispatch("userPostOriginal", this.postOriArg);
      self.$store.dispatch("userPostReveal", this.postRevArg);
      plus.navigator.setStatusBarStyle('light');

    },
    handleScroll() {
      const scrollTop = this.$refs.userScroller.scrollTop;
    },
    openAction(e){
        this.actionClickTop = e.y+20;
        this.actionShow = true
    },
    load(payload){
      var self = this
      this.actionShow = false
      const currentView = self.$f7.getCurrentView();
      currentView.router.load(payload);
    },
    cancle() {
      var self = this;
      this.ifFollow = !this.ifFollow;
      if(!this.user.hasLogin){
        this.$store.commit("COM_CONF",{
            isLoginScreenShow:true
        })
        return false
      }
      if(this.isFollowing){
        return false
      }
      this.isFollowing = true
      self.$store.dispatch('followUser', {
        uid: this.otherInfo.id
      })
      .then(()=>{
          self.$store.dispatch("getOtherInfo", self.infoArg);
          this.isFollowing = false
      })
      .catch(e=>{
          this.isFollowing = false
          this.$toast.center(e.msg||"操作失败")
      })
    }
  }
};
</script>
