<template>
	<f7-page navbar-fixed class="userFollows no-toolbar" pull-to-refresh @page:beforeanimation="reinit"  @ptr:refresh="onRefresh">
	    <f7-navbar sliding class="navbar-black">
			<f7-nav-left>
		      <f7-link icon-only back>
		        <i class="iconfont icon-back">

		        </i>
		      </f7-link>
		    </f7-nav-left>
          <f7-nav-center>
          	关注
          </f7-nav-center>
		  <f7-nav-right>
		  </f7-nav-right>
	    </f7-navbar>
      <user-list :users="userFollowInfo" v-if="userFollowInfo.length" :type="'other'"></user-list>
     <p v-else class="no-more">Ta还没有关注的人</p>
	</f7-page>
</template>
<style lang="less">
    @import "../../assets/less/var.less";
    .userFollows{
      background-color: #f5f5f5;
        .page-content{
            background: #f5f5f5!important;
        }
        .no-more{
            font-size: 12px;
            color:#999;
            text-align: center;
            margin-top: 13px;
        }
    }
</style>
<script>
import userList from '../../components/userList.vue'
export default {
  data() {
    return {};
  },
  mounted() {
  },
  components:{
	  userList
  },
  computed: {
    userFollowInfo() {
      return this.$store.getters.userFollowInfo;
    },
  	pid(){
  		return this.$route.params.pid
  	},
  },
  methods: {
	reinit(){
		var self = this;
		self.$store.dispatch("userFollowInfo",{
			user_id:self.pid,
			type:1
		});
    plus.navigator.setStatusBarStyle('dark');
    
	},
	onRefresh() {
	  var self = this;
	  self.$store.dispatch("userFollowInfo", {
		user_id: this.$route.params.pid,
		type: 1
	  }).then(function() {
		self.$f7.pullToRefreshDone()
	  }, function(data) {})
	},
  }
};
</script>
