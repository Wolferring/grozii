<template>
<f7-page 
no-toolbar
class="goods"
navbar-fixed
 >
    <f7-navbar sliding>
      <f7-nav-left>
		<f7-link icon-only back>
			<i class="iconfont icon-back">

			</i>
		</f7-link>
      </f7-nav-left>
      <f7-nav-center>
      		文中商品
      </f7-nav-center>
      <f7-nav-right>
      </f7-nav-right>          
    </f7-navbar>
    <f7-block>
      <h3>{{detail.title}}</h3>
    </f7-block>
    <f7-list>
      <f7-list-item @click="handleLink(item.url)" link="/" :title="item.name" v-for="item in goods"></f7-list-item>
      
    </f7-list>
</f7-page>
</template>
<style lang="less">
.goods{
  padding: .4rem 0;
  color: #333;
  .page-content{
    padding-top: 64px!important;
  }
  .list-block{
    margin: 0;
    .item-inner{
      font-size: 14px;
    }
  }
  .content-block{
    margin: .26666667rem 0;
  }
}
</style>
<script>
export default {
	data(){
		return {

		}
	},
	computed:{
    detail() {
      return this.$store.getters.getArticleDetail;
    },    
    goods(){
      return this.detail['goods']
      }
    },
    beforeCreate(){
        plus.navigator.setStatusBarStyle("dark");
    },
    beforeDestroy(){ 
        plus.navigator.setStatusBarStyle("light");

    },
    methods:{
    	handleLink(url){
    		this.tool.openWebview(url)
    	}
    }
}
</script>
