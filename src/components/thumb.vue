<template>
<div class="comment-thumb">
  <f7-link @click="load({url: '/userReport/',query:{'report_link_type':(type=='post'? '4':'3'),'report_link_id':diggId}})">举报</f7-link>
  <a class="thumb-like" :class="{'digg_active' : thisIsDigg}" @click="digg(diggId)">{{thisDiggsNum}}<i class="iconfont icon-like icon-only"></i></a>
</div>
</template>
<style lang="less" scoped>
.comment-thumb{
    float: right;
    color: #999;
    font-size: 11px;
    width: auto;
    a{
      color: inherit;
      margin-left: 30px;
    }
  .thumb-like {
      .iconfont{
          display: inline-block;
          padding-left: 5px;
          font-size: 11px;

      }
  }
  .digg_active {
      color: #23deb1;
  }
}
</style>
<script>
export default {
  props: ['diggId','type','diggsNum','isDigg'],
  data() {
    return {
      thisIsDigg: this.isDigg,
      thisDiggsNum: this.diggsNum
    }
  },
  methods: {
    digg(diggId) {
        if(!this.thisIsDigg){
            this.thisDiggsNum++;
        }else{
            this.thisDiggsNum--;
        }
        this.thisIsDigg = !this.thisIsDigg;
        if ( this.type == 'eval') {
          this.$store.dispatch("postCommonDigg",this.diggId).then(function() {}, function(data) {})
        } else {
          this.$store.dispatch("evalCommonDigg",this.diggId).then(function() {}, function(data) {})
        }
    },
    load(payload){
      var self = this
      const currentView = self.$f7.getCurrentView();

      currentView.router.load(payload);
     
    }
  }
}
</script>
