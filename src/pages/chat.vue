<template>
<f7-page navbar-fixed no-toolbar navbar-through id="chat-page" class="chat-page">
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
    <a class="reply-btn" :disabled="!validComment||sending" :class="{'text-sub':validComment}" @click="submitChat">
      发送
    </a>
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
        font-size: 12px;
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
                            font-size: 14px;
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
                            font-size: 14px;
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
                            border-left: 5px solid @sub-color;
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
        height: 50px;
        background-color: #fff;
        border: solid .5px #ebebeb;
        z-index: 100;
        // text-align: center;
        .active-state {
            background: #e8e8e8;
        }
        .reply-input {
            flex: 1;
            display: relative;
            line-height: 50px;
            padding: 0;
            padding-left: 15px;
        }
        .reply-btn {
            padding: 0 15px;
            line-height: 50px;
            font-size: 14px;
            
        }
        input {
            width: 100%;
            height: 0.89189rem;
            line-height: .32rem;
            border-radius: 2px;
            background-color: #fbfbfb;
            border: solid 0.5px #ebebeb;
            padding-left: 15px;
            text-align: left;
            box-sizing: border-box;
            font-size: 14px;
        }
        input::placeholder {
            font-size: 14px;
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
      messageSender: this.$route.params.chatid,
      screenHeight: '',
      timer:"",
      sending:false
    }
  },
  created() {

  },
  mounted() {
    this.$store.dispatch("getNewsMessage", this.$route.params.pid).then(e=>{
      this.scrollBottom()
    })
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
      setTimeout(()=>{
        this.scrollBottom()        
      },400)
      // this.timer = setInterval(function() {
      //     document.body.scrollTop = document.body.scrollHeight;
      // }, 300)
    },
    scrollBottom(){
      var page = this.$$("#chat-page .page-content")
      page.scrollTop(page.find(".container").height(),200)
    },
    blur() {
      // clearTimeout(self.timer)

    },
    showmore() {

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
        self.sending = true
        this.$store.dispatch("replyMessage", replyInfo)
        .then((data)=>{
            self.$toast.center("回复成功");
            self.messageReply = '';
            self.sending = false
            self.$store.dispatch("getNewsMessage", self.$route.params.chatid)
            .then(e=>{
                this.scrollBottom();
            })
        })
        .catch(e=>{
          this.$toast.center(e.msg||"发送失败")
          self.sending = false
        })
      }
    }
  }
}
</script>
