<template>
<f7-page navbar-fixed no-toolbar pull-to-refresh navbar-through class="chat-page" @ptr:refresh="onRefresh">
  <f7-navbar sliding class="navbar-black">
    <f7-nav-left>
      <f7-link icon-only back>
        <i class="iconfont icon-back">

  				</i>
      </f7-link>
    </f7-nav-left>
    <f7-nav-center v-if="newsMessage[0]">
      {{newsMessage[0].user.name}}
    </f7-nav-center>
    <f7-nav-right>

    </f7-nav-right>
  </f7-navbar>
  <div class="container">
    <div id='chatContent' v-for="(message,index) in newsMessage" :class="message.user.id == messageSender ? 'ask-block' :'answer-block'" :key="index">
      <div class="message-date">
        <timeago :since="message.dateline*1000" :max-time="86400" :format='tool.convertDate'></timeago>
      </div>
      <div class="ask-main">
        <div class="ask-left">
          <!-- <f7-link :href="'/otherInfo/'+ message.user.id "> -->
            <div class="headimg">
              <img :src="message.user.avatar" alt="">
            </div>
          <!-- </f7-link> -->
        </div>
        <div class="ask-right">
          <p>{{message.content.reply}}</p>
          <div class="ask-square"></div>
        </div>
      </div>
      <div class="answer-main">
        <div class="answer-left">
          <p>{{message.content}}</p>
          <div class="answer-square"></div>
        </div>
        <div class="answer-right">
          <!-- <f7-link :href="'/otherInfo/'+ message.user.id "> -->
            <div class="headimg">
              <img :src="message.user.avatar" alt="">
            </div>
          <!-- </f7-link> -->
        </div>
      </div>
    </div>
  </div>

  <div slot="fixed" class="reply-box">
    <div class="reply-input">
      <form @submit.prevent="submitChat">
        <input id="replying" @focus="replyCom" @blur="blur" v-model="messageReply" type="text" name="replying" placeholder="回复">
      </form>
    </div>
    <div class="reply-btn" :disabled="!validComment" :class="{'text-sub':validComment}" @click="submitChat">
      发送
    </div>
  </div>
</f7-page>
</template>

<style lang="less">
@import url('../assets/less/var.less');
.chat-page {
    background-color: #f5f5f5!important;
    .page-content{
      padding-top: 64px!important;
    }
    .message-date {
        font-size: 0.32432rem;
        text-align: center;
        color: #999;
        margin-bottom: 0.27027rem;
    }
    .headimg {
        width: 1.18919rem;
        height: 1.18919rem;
        border-radius: 50%;
        overflow: hidden;
        background-color: #eee;
        vertical-align: middle;
        img {
            width: 100%;
        }
    }
    .page-content {
        background-color: #f5f5f5!important;
        .container {
            padding-bottom: 1.72973rem;
            .ask-block {
                margin-top: 0.51351rem;
                margin-bottom: 0.16216rem;
                padding: 0 0.54054rem;
                .answer-main {
                    display: none;
                }
                .ask-main {
                    display: flex;
                    .ask-left {
                        margin-right: 0.32432rem;
                    }
                    .ask-right {
                        width: 7.56757rem;
                        padding: 0.32432rem;
                        background-color: #fff;
                        border-radius: 0.10811rem;
                        position: relative;
                        p {
                            font-size: 0.37838rem;
                            font-weight: 500;
                            color: #000;
                        }
                        .ask-square {
                            left: -5px;
                            top: 0.27027rem;
                            width: 0;
                            height: 0;
                            position: absolute;
                            border-top: 5px solid transparent;
                            border-right: 5px solid #fff;
                            border-bottom: 5px solid transparent;
                        }
                    }
                }
            }
            .answer-block {
                margin-top: 0.51351rem;
                margin-bottom: 0.16216rem;
                padding: 0 0.54054rem;
                .ask-main {
                    display: none;
                }
                .answer-main {
                    display: flex;
                    .answer-left {
                        width: 7.56757rem;
                        padding: 0.32432rem;
                        background:@sub-color;
                        border-radius: 0.10811rem;
                        position: relative;
                        p {
                            font-size: 0.37838rem;
                            font-weight: 500;
                            color: #fff;
                        }
                        .answer-square {
                            width: 0;
                            height: 0;
                            position: absolute;
                            top: 0.27027rem;
                            right: -5px;
                            border-top: 5px solid transparent;
                            border-left: 5px solid #17e6d5;
                            border-bottom: 5px solid transparent;
                        }
                    }
                    .answer-right {
                        margin-left: 0.32432rem;
                    }
                }
            }
        }
    }
    .reply-box {
        position: fixed;
        display: flex;
        justify-content: space-around;
        bottom: 0;
        width: 100%;
        height: 1.45946rem;
        background-color: #fff;
        border: solid 0.013514rem #ebebeb;
        z-index: 100;
        // text-align: center;
        .active-state {
            background: #e8e8e8;
        }
        .reply-input {
            flex: 1;
            display: relative;
            line-height: 1.45946rem;
            padding: 0;
            padding-left: 15px;
        }
        .reply-btn {
            padding: 0 15px;
            display: relative;
            line-height: 1.45946rem;
        }
        input {
            width: 100%;
            height: 0.89189rem;
            line-height: .32rem;
            border-radius: 4px;
            background-color: #fbfbfb;
            border: solid 0.5px #ebebeb;
            padding-left:  0.5rem;
            text-align: left;
            box-sizing: border-box;
        }
        label {
            position: absolute;
            top: 0.27027rem;
            // width: 100%;
            height: 0.89189rem;
            line-height: 0.89189rem;
            border-radius: 0.16216rem;
            background-color: #fbfbfb;
            text-align: center;
            font-size: 0.32432rem;
            color: #666;
            left: 50%;
            -webkit-transform: translateX(-50%);
            -moz-transform: translateX(-50%);
            -o-transform: translateX(-50%);
            -ms-transform: translateX(-50%);
            transform: translateX(-50%);
            img {
                width: 0.32432rem;
                margin: 12px auto 0;
                vertical-align: middle;
                padding-right: 0.13514rem;
            }
        }
        input::placeholder {
            font-size: 0.37838rem;
            font-weight: 500;
            color: #666;
        }
    }
}
</style>

<script>
export default {
  data() {
    return {
      messageReply: '',
      messageSender: this.$route.params.pid,
      screenHeight: '',
      timer:""
    }
  },
  created() {

  },
  mounted() {
    this.$store.dispatch("getNewsMessage", this.$route.params.pid)
    this.screenHeight = window.innerHeight
  },
  computed: {
    newsMessage() {
      return this.$store.getters.newsMessage
    },
    validComment(){
        return this.messageReply.length>2
    },        
  },
  methods: {
    replyCom() {
      const nowHeight = this.screenHeight - window.innerHeight;
      document.getElementById('chatContent').style.paddingBottom = nowHeight + 'px';
      this.timer = setInterval(function() {
          document.body.scrollTop = document.body.scrollHeight;
      }, 300)        
    },
    blur() {
      clearTimeout(self.timer)

    },
    showmore() {

    },
    onRefresh() {
      var self = this;
      self.$store.dispatch("getNewsMessage", this.$route.params.pid).then(function() {
        self.$f7.pullToRefreshDone()
      }, function(data) {

      })
    },
    submitChat() {
      let replyInfo = {
        user_id: this.messageSender,
        content: this.messageReply,
      }
      var self = this;
      if (this.messageReply == '') {
        self.$toast.center("回复内容不能为空!");
      } else {
        this.$store.dispatch("replyMessage", replyInfo).then(function(data) {
            self.$toast.center("回复成功");
            var refersh = setTimeout(
              self.$store.dispatch("getNewsMessage", self.$route.params.pid).then(function() {
                self.messageReply = '';
              }, function(data) {}), 2000)
          }),
          function() {}
      }
    }
  }
}
</script>
