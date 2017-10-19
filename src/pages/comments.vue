<template>
<f7-page
@page:beforeinit="initPage"
@page:back="leavePage"
navbar-fixed
toolbar-fixed
pull-to-refresh
id="comments"
class="comments-page"
@page:beforeanimation="reinitPage"
@ptr:refresh="onRefresh">
  <f7-navbar>
    <f7-nav-left>
      <f7-link icon-only back>
        <i class="iconfont icon-back">
        </i>
      </f7-link>
    </f7-nav-left>
    <f7-nav-center>
      评论列表
    </f7-nav-center>
    <f7-nav-right>
    </f7-nav-right>
  </f7-navbar>
  <div v-if="!postComlist&&replyType=='post' || !evalComlist&&replyType=='eval'">
      <div class="noComment">
          <img src="../assets/images/noComment.png" alt="">
      </div>
      <p class="no-comment-title">沙发空缺~</p>
  </div>
  <f7-list>
    <f7-list-item v-for="(item, index) in evalComlist" :key="item.id" v-if="replyType=='eval'">
      <f7-link :href="'/otherInfo/'+ item.user_id">
        <div class="left-block">
            <div class="avatar">
              <img :src="item.avatar" alt="">
            </div>
        </div>
      </f7-link>
      <div class="right-block">
        <div class="info"><span>{{item.user_name}}</span>
          <thumb :diggId='item.pid' :type='replyType' :diggsNum='item.diggs' :isDigg='item.is_digg'></thumb>
        </div>
        <p class="date" v-if="item.dateline">
          <timeago :since="item.dateline*1000" :max-time="86400" :format='tool.convertDate'></timeago>
        </p>
        <commentMore :list="item.comments" v-if="item.comments"></commentMore>
        <p class="user-comment" @click="replyFCom(item.pid,item.tfid,item.tid,item.user_name)">{{item.message}}</p>
      </div>
    </f7-list-item>
    <f7-list-item v-for="(item, index) in postComlist" :key="item.id" v-if="replyType=='post'">
      <f7-link :href="'/otherInfo/'+ item.user_id ">
        <div class="left-block">
            <div class="avatar">
              <img :src="item.avatar" alt="">
            </div>
        </div>
      </f7-link>
      <div class="right-block">
        <div class="info">
          <span>{{item.user_name}}</span>
          <thumb :diggId='item.pid' :type='replyType' :diggsNum='item.diggs' :isDigg='item.is_digg'></thumb>
        </div>
        <p class="date" v-if="item.dateline">
          <timeago :since="item.dateline*1000" :max-time="86400" :format='tool.convertDate'></timeago>
        </p>
        <commentMore :list="item.comments" v-if="item.comments"></commentMore>
        <p class="user-comment" @click="replyFCom(item.pid,item.tfid,item.tid,item.user_name)">{{item.message}}</p>
      </div>
    </f7-list-item>
  </f7-list>
  <div slot="fixed" class="reply-box">
    <div class="reply-input">
      <form @submit.prevent="submitComment">
        <input id="replying"
        @focus="replyCom"
        @blur="focusOut"
        @click="fixScroll"
        v-model="commentContent"
        type="text"
        name="replying"
        :placeholder="this.ReplyIds.name =='本帖' ? '回复作者:':'回复 '+this.ReplyIds.name
	+'的评论:'">
        <!-- <label for="replying" id="replyingLable"><img src="../assets/images/comment/draw.png" alt=""></label> -->
      </form>
    </div>
    <button class="btn-link reply-btn" :disabled="!validComment" :class="{'text-sub':validComment}" @click="submitComment">
      发送
    </button>
  </div>

</f7-page>
</template>

<style lang="less">
.comments-page {
    .page-content{
        padding-top: 64px!important;
    }
    .digg_active {
        color: #23deb1;
    }
    .list-block {
        margin: 0;
        padding-bottom: 1.18919rem;
    }
    .noComment{
        width: 2.7027rem;
        border-radius: 50%;
        margin: 5.13514rem auto 0;
        img{
            width: 100%;
        }
    }
    .no-comment-title{
        margin-top: 0.32432rem;
        font-size: 16px;
        text-align: center;
        color: #999;
    }
    .item-content {
        padding: 0;
        .item-inner {
            padding: 0.54054rem 0;
            -webkit-align-items:flex-start;
            align-items:flex-start;
            .left-block {
                padding-left: 0.54054rem;
                .avatar{
                    width: 1.1rem;
                    height: 1.1rem;
                }
            }
            .right-block {
                flex: 1;
                width: 7.83784rem;
                overflow: hidden;
                margin-left: 0.16216rem;
                .info{
                    padding-left: 10px;
                }
                .date {
                    width: 100%;
                    text-align: left;
                    font-size: 0.32432rem;
                    text-align: left;
                    color: #999;
                    padding-left: 10px;
                }
                div {
                    width: 100%;
                    font-size: 0.37838rem;
                    text-align: left;
                    color: #000;
                    .like {
                        float: right;
                        i {
                            display: inline-block;
                        }
                    }
                }
                .comment-content {
                    width: 7.5rem;
                    margin-left: 10px;

                    ul {
                        padding-left: 0;
                    }
                }
                .user-comment {
                    width: 7.83784rem;
                    font-size: 0.37838rem;
                    text-align: left;
                    margin-top: 0.27027rem;
                    color: #666;
                    padding-left: 10px;
                }
            }
        }
    }
    .reply-box {
        position: fixed;
        display: flex;
        justify-content: space-between;
        top: auto;
        bottom: 0;
        width: 100%;
        height: 1.45946rem;
        background-color: #fff;
        border: solid 0.013514rem #ebebeb;
        z-index: 100;
        .active-state {
            background: #e8e8e8;
        }
        .reply-input {
            flex: 1;
            line-height: 1.45946rem;
            padding-left: 15px;
        }
        .reply-btn {
            padding: 0 15px;
            line-height: 1.45946rem;
        }
        input {
            width: 100%;
            height: 0.89189rem;
            border-radius: 4px;
            background-color: #fbfbfb;
            border: solid 0.01351rem #ebebeb;
            padding-left:  0.48649rem;
            text-align: left;
            box-sizing: border-box;
        }
        input::placeholder {
            padding-left: 5px;
            color: #666;
        }
    }
}
</style>

<script>
import commentMore from '../components/commentMore.vue'
import thumb from '../components/thumb.vue'
export default {
  data() {
    return {
      commentContent: '',
      showCom: false,
      replyTo: '',
      timer:""
    }
  },
  components: {
    commentMore,
    thumb
  },
  mounted() {
    console.log(this.replyType);
  },
  computed: {
    evalComlist() {
      return this.$store.getters.evalCommentList;
    },
    validComment(){
        return this.commentContent.length>2
    },
    user(){
      return this.$store.getters.getUser
    },
    postComlist() {
      return this.$store.getters.postCommentList;
    },
    ReplyIds() {
      return this.$store.getters.setReplyIds;
    },
    user(){
      return this.$store.getters.getUser;
    },
    replyType() {
      return this.$store.getters.replyType;
    }
  },
  methods: {
    reinitPage() {
      var self = this;
      if (this.replyType == 'eval') {
        this.$store.dispatch("getEvalCommentList", {
          tid: self.$route.params.pid,
          limit: 100,
          page: 1
        }).then(function() {}, function(data) {})
      } else {
        this.$store.dispatch("getPostCommentList", {
          id: self.$route.params.pid,
          limit: 100,
          page: 1
        }).then(function() {}, function(data) {})
      }
      self.$store.commit("setReplyIds", {
        pid: 0,
        tfid: 0,
        tid: self.$route.params.pid,
        name: '本帖'
      });
    },
    initPage() {
      plus.navigator.setStatusBarStyle('dark');
    },
    leavePage() {
      plus.navigator.setStatusBarStyle('light');
    },
    replyCom(){
      this.timer = setInterval(function() {
          document.body.scrollTop = document.body.scrollHeight;
      }, 300)
    //   console.log(this.ReplyIds);
    },
    focusOut() {
      var self = this;
    //   this.$store.commit("setReplyIds", {
    //     pid: 0,
    //     tfid: 0,
    //     tid: self.$route.params.pid,
    //     name: '本帖'
    //   });
      clearTimeout(self.timer)
    },
    showmore() {
      this.showCom = !this.showCom;
    },
    replyFCom(pid, tfid, tid, name) {
      if(name == this.user.username){
          this.$toast.center("不能回复自己的评论");
          return false;
      }
      document.getElementById('replying').focus();
      this.$store.commit("setReplyIds", {
        pid: pid,
        tfid: tfid,
        tid: tid,
        name: name
      });
      console.log(this.ReplyIds);
    },
    fixScroll(){
        //document.body.scrollTop = document.body.scrollHeight-30;
    },
    onRefresh() {
      var self = this;
      if (this.replyType == 'eval') {
        self.$store.dispatch("getEvalCommentList", {
          tid: self.$route.params.pid,
          limit: 100,
          page: 1
        }).then(function() {
          self.$f7.pullToRefreshDone()
        }, function(data) {})
      } else {
        self.$store.dispatch("getPostCommentList", {
          id: self.$route.params.pid,
          limit: 100,
          page: 1
        }).then(function() {
          self.$f7.pullToRefreshDone()
        }, function(data) {})
      }
    },
    submitComment() {
        var self = this;
        console.log(this.user);
        if(!this.user.hasLogin){
          this.$store.commit("COM_CONF",{
            isLoginScreenShow:true
          })
          return false;
        }
        if(!this.validComment){
            return false
        }
        if (this.ReplyIds.tfid == 0) {
            this.ReplyIds.tfid = this.ReplyIds.pid
        }
        if (this.replyType == 'post') {
          if (this.ReplyIds.pid) {
            this.$store.dispatch("replyPostComments",{
                cmt_id: this.ReplyIds.pid,
                tcmt_id: this.ReplyIds.tfid,
                feed_id: this.ReplyIds.tid,
                message: this.commentContent
            }).then(function(data) {
              self.$toast.center("回复成功")
              self.commentContent = '';
              self.$store.commit("setReplyIds", {
                pid: 0,
                tfid: 0,
                tid: self.$route.params.pid,
                name: '本帖'
              });
              self.$store.dispatch("getPostCommentList",{
                id: self.$route.params.pid,
                limit: 100,
                page: 1
              })
            })
          } else {
            this.$store.dispatch("replyPostComments",{
                cmt_id: 0,
                tcmt_id: 0,
                feed_id: self.$route.params.pid,
                message: this.commentContent
            }).then(function(data) {
              self.$toast.center("回复成功")
              self.commentContent = '';
              self.$store.commit("setReplyIds", {
                pid: 0,
                tfid: 0,
                tid: self.$route.params.pid,
                name: '本帖'
              });
              self.$store.dispatch("getPostCommentList", {
                id: self.$route.params.pid,
                limit: 100,
                page: 1
              })
            })
          }
        } else {
          if (this.ReplyIds.pid) {
            this.$store.dispatch("replyComments",{
                fid: this.ReplyIds.pid,
                tfid: this.ReplyIds.tfid,
                tid: this.ReplyIds.tid,
                message: this.commentContent
            }).then(function(data) {
              self.$toast.center("回复成功")
              self.commentContent = '';
              self.$store.commit("setReplyIds", {
                pid: 0,
                tfid: 0,
                tid: self.$route.params.pid,
                name: '本帖'
              })
              self.$store.dispatch("getEvalCommentList", {
                tid: self.$route.params.pid,
                limit: 100,
                page: 1
              })
            })
          } else {
            this.$store.dispatch("replyComments",{
                fid: 0,
                tfid: 0,
                tid: self.$route.params.pid,
                message: this.commentContent
            }).then(function(data) {
              self.$toast.center("回复成功")
              self.commentContent = '';
              self.$store.commit("setReplyIds", {
                pid: 0,
                tfid: 0,
                tid: self.$route.params.pid,
                name: '本帖'
              })
              self.$store.dispatch("getEvalCommentList", {
                tid: self.$route.params.pid,
                limit: 100,
                page: 1
              })
            })
          }
       }
    }
  }
}
</script>
