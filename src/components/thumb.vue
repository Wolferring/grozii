<template>
<a class="thumb-like" :class="{'digg_active' : thisIsDigg}" @click="digg(diggId)">{{thisDiggsNum}}<i class="iconfont icon-like icon-only"></i></a>
</template>
<style lang="less" scoped>
.thumb-like {
    float: right;
    color: #999;
    font-size: 11px;
    .iconfont{
        display: inline-block;
        padding-left: 5px;
        font-size: 11px;

    }
}
.digg_active {
    color: #23deb1;
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
  }
}
</script>
