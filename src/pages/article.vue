
<template>
<f7-page class="evaluating" no-navbar no-toolbar @page:afteranimation="pageAnimated">
  <f7-navbar>
  </f7-navbar>
  <f7-progressbar v-show="!contentReady" infinite color="green"></f7-progressbar>
  <div class="container">
    <div class="head-image-box" id="headImage">
      <transition name="fade">
        <img class="head-image" :src="detail.cover" v-show="detail.cover" alt="">
      </transition>
      <div class="title">
        <p>{{detail.title}}</p>
      </div>
    </div>
    <div class="content">
      <div class="content-head">
        <div class="auth">
          <div class="avatar">
            <img :src="detail.author.avatar" v-if="detail.author" alt="">
          </div>
          <span class="userID" v-if="detail.author">{{detail.author.username}}</span>
          <span class="date" v-if="detail.dateline">
							<timeago :since="detail.dateline*1000" :max-time="86400" :format='tool.convertDate'></timeago>
						</span>
        </div>
        <div class="tags" v-if="detail.tag">
          <i class="iconfont icon-tag" @click=""></i>
          <span class="tag" v-for="(tag,index) in detail.tag" :key="index" >{{tag}}</span>
        </div>
      </div>
      <div class="content-text">

        <transition name="fade">
          <div inner class="content-inner-block" v-if="detail.content" v-show="contentReady" v-html="detail.content">
          </div>
        </transition>
      </div>
    </div>
  </div>
  <div slot="fixed" id="headerBar" class="back-share" :class="{'back-share-down':backShareType}" ref="backShare">
    <f7-link class="back float-l" back>
      <i id="leftIcon" class="iconfont icon-back icon-only"></i>
    </f7-link>
    <span id="headerText" class="back-share-span">好文详情</span>
    <f7-link class="share float-r" @click="openShareScreen">
      <i id="rightIcon" class="iconfont icon-share icon-only"></i>
    </f7-link>
  </div>

  <div slot="fixed" class="footer" v-if="detail.extra">
    <!-- {{detail}} -->
    <div class="footer-left">
      <f7-grid no-gutter>
        <f7-link :href="'/comments/'+detail.tid" class="col-auto footer-item">
          <i class="iconfont icon-comment icon-only" @click=""></i>
          <span>{{detail.replies}}</span>
          <span v-if="line" class="rightLine"></span>
        </f7-link>
        <f7-link class="col-auto footer-item" @click="doCollect" :class="{'active':detail.extra.is_fav}">
          <i class="iconfont icon-collect icon-only">
			  	</i>
          <span>
			  		{{detail.collects}}
			  	</span>
          <span v-if="line" class="rightLine">
		  		</span>
        </f7-link>
        <f7-link class="col-auto footer-item" @click="doLike" :class="{'active':detail.extra.is_digg,'bounceInQuick':detail.extra.is_digg}">
          <i class="iconfont icon-like icon-only">
			  	</i>
          <span>{{detail.diggs}}</span>
        </f7-link>
      </f7-grid>
    </div>
    <div class="footer-right" v-if="!line">
      <img src="../assets/images/article/goods.png" alt="">
      <f7-grid>
        <f7-col><i class="iconfont icon-cart icon-only"></i><span>商品链接</span></f7-col>
      </f7-grid>
    </div>
  </div>
  <share></share>
</f7-page>
</template>
<style lang="less" scoped>
@import url( '../assets/less/var.less');
.progressbar {
    position: absolute;
}
.statusbar-overlay {
    height: 0;
}
.evaluating {
    position: relative;
    // padding-bottom: 54px;
    .page-content {
        overflow: hidden;
        .container {
            overflow-y: scroll;
            height: 100%;
        }
    }
    .head-image-box {
        position: relative;
        width: 100%;
        height: 220px;
        min-height: 220px;
        max-height: 400px;
        background: url('../assets/images/article/hide.png');
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        overflow: hidden;
        img {
            vertical-align: bottom;
        }
        .head-image {
            position: absolute;
            min-width: 100%;
            height: 100%;
            top: 0;
            left: -50%;
            right: -50%;
            z-index: -2;
            margin: 0 auto;
        }
        .title {
            height: 100%;
            position: relative;

            font-weight: 700;
            text-align: left;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: flex-end;
            img {
                position: absolute;
                bottom: 0;
                z-index: -1;
            }
            p {
                margin: 0 auto;
                width: 100%;
                padding: 0 0.53333333rem;
                color: #fff;
                margin-bottom: 0.40541rem;
                box-sizing: border-box;
                word-break: break-all;
                font-size: 0.50666667rem;
                line-height: 1.5;
                // -webkit-transform: translateX(-50%);
                // -moz-transform: translateX(-50%);
                // -o-transform: translateX(-50%);
                // -ms-transform: translateX(-50%);
                // transform: translateX(-50%);
            }
        }
    }
    .content {
        padding-bottom: 1.45946rem;
        overflow-x: hidden;
        .content-head {
            display: flex;
            justify-content: space-between;
            height: 0.64865rem;
            line-height: 0.64865rem;
            margin: 0.54054rem auto;
            padding: 0 0.53333333rem;
            font-size: 0.32432rem;
            color: #999;
            .avatar {
                width: 0.64865rem;
                height: 0.64865rem;
            }
            .userID {
                margin-right: 0.27027rem;
            }
            .tag {
                margin: 0 0.16rem;
            }
            .iconfont {
                font-size: 0.32432rem;
            }
        }
        .content-text {
            padding: 0 0.53333333rem 0.54054rem;
            .content-block {
                margin: 0.27027rem 0 0;
                .content-inner-block {
                    padding: 0 !important;
                }
                .content-inner-block::after {
                    background: #fff;
                }
            }
        }
    }
    .footer {
        position: absolute;
        bottom: 0;
        height: 1.43243rem;
        line-height: 1.43243rem;
        z-index: 999;
        width: 100%;
        border-top: solid 0.01351rem #ebebeb;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        color: #999;
        .footer-left {
            flex: 1;
            text-align: center;
            .footer-item {
                position: relative;
                display: flex;
                justify-content: center;
                transition: all 0.3s ease;
                font-size: 0.32432rem;
                i {
                    display: inline-block;
                    min-width: 0.67568rem;
                }
                &.active {
                    color: @sub-color;
                }
                .rightLine {
                    position: absolute;
                    right: 0;
                    display: inline-block;
                    width: 0.02703rem;
                    height: 0.51351rem;
                    border-right: 0.0.13514rem solid #e2e2e2;
                    top: 50%;
                    -webkit-transform: translateY(-50%);
                    -moz-transform: translateY(-50%);
                    -o-transform: translateY(-50%);
                    -ms-transform: translateY(-50%);
                    transform: translateY(-50%);
                }
            }
        }
        .footer-right {
            width: 3.21rem;
            display: inline-block;
            text-align: center;
            position: relative;
            color: #fff;
            overflow: hidden;
            i {
                display: inline-block;
                min-width: 0.67568rem;
            }
            img {
                width: 120%;
                position: absolute;
                left: 0;
                top: 50%;
                -webkit-transform: translateY(-50%);
                -moz-transform: translateY(-50%);
                -o-transform: translateY(-50%);
                -ms-transform: translateY(-50%);
                transform: translateY(-50%);
                z-index: -1;
            }
        }
        .link {
            color: #999;
        }
    }
    .back-share-down {
        border-bottom: solid 0.01351rem #ebebeb;
    }
    .back-share-span {
        display: inline-block!important;
        font-size: 0.48649rem;
        font-weight: bold;
        color: rgba(0, 0, 0, 0);
    }
    .no-shadow {
        border: 0 !important;
        box-shadow: none!important;
    }
    .back-share {
        position: absolute;
        top: 0;
        width: 100%;
        height: 1.18919rem;
        line-height: 1.18919rem;
        z-index: 200;
        text-align: center;
        box-sizing: border-box;
        padding: 0 0.266667rem;
        span {
            display: none;
        }
        .back {
            height: 1.18919rem;
        }
        .share {
            height: 1.18919rem;
        }
        i {
            display: inline-block;
            color: #fff;
            font-size: 0.54054rem;
        }
    }
}
</style>
<script>
import share from "../components/share";

export default {
  data() {
    return {
      loadingProgress: 10,
      animateReady: false,
      requestReady: false,
      showbar: false,
      line: true,
      scrolled: false,
      scrolltop: 0,
      touchtop: 0,
      headImageHeight: 220,
      backShareType: false,
      message:{
        title:"123"
      }
    };
  },
  components: {
    share
  },
  mounted() {
    const deviceWidth = window.screen.width;
    const rem = parseFloat(document.documentElement.style.fontSize)
    var self = this;
    this.loadingProgress = 70;
    this.$store.dispatch("getArticleDetail", this.pid).then(function() {
      self.$f7.hideProgressbar();
      self.$('.content-inner-block img').on('load', function(e) {
        if (this.naturalWidth >= deviceWidth) {
          this.style.maxWidth = deviceWidth + "px"
          this.style.width = deviceWidth + "px"
          this.style.height = "auto"
          this.style.marginLeft = -(0.5333333 * rem) + "px"
        }
      });
      self.requestReady = true;
      window.addEventListener(
        "scroll", self.handleScroll, true
      );
    }, function(data) {
      self.$toast.center(data.msg)
    });
    console.log(this.shareMessage)
  },
  methods: {
    handleScroll() {
      const scrolltop = document.getElementsByClassName("container")[0].scrollTop;
      this.scrolltop = scrolltop
      const headerBar = document.getElementById('headerBar');
      const leftIcon = document.getElementById('leftIcon');
      const rightIcon = document.getElementById('rightIcon');
      const headerText = document.getElementById('headerText');
      const headImage = document.getElementById('headImage').offsetHeight;
      const opcaity = (scrolltop / headImage > 1) ? 1 : scrolltop / headImage;
      headerBar.style.background = 'rgba(255,255,255,' + opcaity + ')';
      headerText.style.color = 'rgba(0,0,0,' + opcaity + ')';
      leftIcon.style.color = 'rgb(' + 255 * (1 - opcaity) + ',' + 255 * (1 - opcaity) + ',' + 255 * (1 - opcaity) + ')';
      rightIcon.style.color = 'rgb(' + 255 * (1 - opcaity) + ',' + 255 * (1 - opcaity) + ',' + 255 * (1 - opcaity) + ')';
      if (scrolltop >= headImage) {
        this.backShareType = true;
      } else {
        this.backShareType = false;
      }
    },
    articleTouchStart(e) {
      this.touchtop = e.touches[0].clientY
    },
    articleTouchEnd(e) {
      this.touchtop = 0;
      this.headImageHeight = 220;
    },
    articleTouchMove(e) {
      if (e.touches[0].clientY - this.touchtop < 0) {
        return false;
      }
      if (this.scrolltop <= 0) {
        console.log(e.touches[0].clientY - this.touchtop)
        this.headImageHeight = (e.touches[0].clientY - this.touchtop) / 6 + 220;
        e.stopPropagation()
        e.preventDefault()
        return
      }
    },
    doLike() {
      var self = this
      let query = this.detail.extra.is_digg ? "articleCancelLike" : "articleLike";
      this.$store.dispatch(query, self.pid).then(function() {}, function(data) {
        self.$toast.bottom(data.msg)
      })
    },
    doCollect() {
      var self = this;
      let query = this.detail.extra.is_fav ? "articleCancelCollect" : "articleCollect"

      this.$store.dispatch(query, self.pid).then(function() {}, function(data) {
        self.$toast.bottom(data.msg)
      })

    },
    openShareScreen() {
      
      this.$store.dispatch("setShare", true);
    },
    pageAnimated() {
      this.animateReady = true;
    }
  },
  filters: {
    replaceImage(e) {}
  },
  destroyed() {
    var self = this;
    window.removeEventListener("scroll", self.handleScroll, true);
    this.$store.commit("ARTICLE_DETAIL", {})
  },
  computed: {
    pid() {
      return this.$route.params.pid;
    },
    detail() {
      return this.$store.getters.getArticleDetail;
    },
    contentReady() {
      return this.requestReady && this.animateReady
    },


  }
};
</script>
