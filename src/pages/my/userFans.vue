<template>
<f7-page navbar-fixed class="userFans no-toolbar "  @page:beforeanimation="reinit" @ptr:refresh="onRefresh">
  <f7-navbar sliding class="navbar-black">
    <f7-nav-left>
      <f7-link icon-only back>
        <i class="iconfont icon-back">

          </i>
      </f7-link>
    </f7-nav-left>
    <f7-nav-center>
      粉丝
    </f7-nav-center>
    <f7-nav-right>
    </f7-nav-right>
  </f7-navbar>
  <user-list :users="userFollowInfo" v-if="userFollowInfo.length" :type="'other'"></user-list>
  <template v-else>
    <div class="no-message-container">
      <img src="../../assets/images/no-user.png" alt="">
      <p class="no-any-message">Ta还没有粉丝...</p>
    </div>
  </template>  
</f7-page>
</template>
<style lang="less">
@import "../../assets/less/var.less";
.userFans {
    .page-content {
        background: #f5f5f5!important;
        padding-top: 64px!important;
    }
    .no-more {
        font-size: 12px;
        color: #999;
        text-align: center;
        margin-top: 13px;
    }
    .pull-to-refresh-layer{
        margin-top: -45px;
    }
}
</style>
<script>
import userList from '../../components/userList.vue'
export default {
  data() {
    return {}
  },
  components: {
    userList
  },
  mounted() {
    // var self = this;
    // self.$store.dispatch("userFollowInfo",{
    //     user_id:this.$route.params.pid,
    //     type:0
    // });
  },
  computed: {
    userFollowInfo() {
      return this.$store.getters.userFollowInfo;
    },
    hotSearch() {
      return this.$store.getters.getSearchHotList;
    },
    pid() {
      return this.$route.params.user_id
    }
  },
  destroyed() {
    //this.$store.dispatch("getUserInfo")
  },
  methods: {
    reinit() {
      var self = this;
      self.$store.dispatch("userFollowInfo", {
        user_id: self.pid,
        type: 0
      });
      plus.navigator.setStatusBarStyle('dark');

    },
    onRefresh() {
      var self = this;
      self.$store.dispatch("getFollowerInfo", {
        user_id: self.pid,
        type: 0
      }).then(function() {
        self.$f7.pullToRefreshDone()
      }, function(data) {})
    },
  }
}
</script>
