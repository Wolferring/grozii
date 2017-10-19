<template>
<f7-page navbar-fixed class="fans no-toolbar " pull-to-refresh @page:beforeanimation="reinit"  @ptr:refresh="onRefresh">
  <f7-navbar sliding class="navbar-black">
    <f7-nav-left>
      <f7-link icon-only back>
        <i class="iconfont icon-back">

        </i>
      </f7-link>
    </f7-nav-left>
    <f7-nav-center>
      粉丝({{followerInfo.length |convertNumber}})
    </f7-nav-center>
    <f7-nav-right>

    </f7-nav-right>
  </f7-navbar>
  <user-list :users="followerInfo" :type="'fans'"></user-list>
  <template v-if="!followerInfo.length">
    <div class="no-message-container">
      <img src="../assets/images/no-user.png" alt="">
      <p class="no-any-message">你还没有粉丝</p>
    </div>
  </template>   
</f7-page>
</template>
<style lang="less">
@import "../assets/less/var.less";
.fans{
    background: #f5f5f5!important;
    .page-content {
        background: #f5f5f5!important;
    }
    .no-more {
        font-size: 12px;
        color: #999;
        text-align: center;
        margin-top: 13px;
    }
}
</style>
<script>
import userList from '../components/userList.vue'
export default {
  data() {
    return {}
  },
  mounted() {
  },
  components:{
    userList
  },
  computed: {
    followerInfo() {
      return this.$store.getters.followerInfo;
    },
    hotSearch() {
      return this.$store.getters.getSearchHotList
    }
  },
  destroyed() {
    this.$store.dispatch("getUserInfo")
  },
  methods: {
    reinit() {
      var self = this;
      self.$store.dispatch("getFollowerInfo");
      plus.navigator.setStatusBarStyle('dark');

    },
    onRefresh() {
      var self = this;
      self.$store.dispatch("getFollowerInfo").then(function() {
        self.$f7.pullToRefreshDone()
      }, function(data) {})
    },
  }
}
</script>
