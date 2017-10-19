<template>

    <div v-if=" type =='follow' " class="follow-block" @click="changeFollow">
        <button :disabled="following" class="btn btn-link" v-if="!isFan" :class="ifFollow ? 'cancle' : 'follow'">
            {{ifFollow? '已关注':'关注'}}
        </button>
        <button :disabled="following" class="btn btn-link" v-if="isFan" :class="ifFollow ? 'cancle' : 'follow'">
            {{ifFollow? '互相关注':'关注'}}
        </button>
    </div>

    <div v-else-if=" type =='fans' " class="follow-block" @click="changeFollow">
        <button :disabled="following" class="btn btn-link" v-if="!isFan" :class="ifFollow ? 'cancle' : 'follow'">
            {{ifFollow? '关注':'互相关注'}}
        </button>
        <button :disabled="following" class="btn btn-link" v-if="isFan" :class="ifFollow ? 'cancle' : 'follow'">
            {{ifFollow? '互相关注':'关注'}}
        </button>
    </div>
    <div v-else-if=" type=='other' && followId != user.info.id" class="follow-block" @click="changeFollow">
        <button class="btn btn-link" :disabled="following" v-if="!isMyFan && !isMyFollow" :class="ifFollow ? 'cancle' : 'follow'">
            {{ifFollow? '关注':'已关注'}}
        </button>
        <button class="btn btn-link" :disabled="following" v-if="isMyFan && !isMyFollow" :class="ifFollow ? 'cancle' : 'follow'">
            {{ifFollow? '关注':'互相关注'}}
        </button>
        <button class="btn btn-link" :disabled="following" v-if="!isMyFan && isMyFollow" :class="ifFollow ? 'cancle' : 'follow'">
            {{ifFollow? '已关注':'关注'}}
        </button>
        <button class="btn btn-link" :disabled="following" v-if="isMyFan && isMyFollow" :class="ifFollow ? 'cancle' : 'follow'">
            {{ifFollow? '互相关注':'关注'}}
        </button>
    </div>
    <div v-else-if=" type =='otherFollows' && followId != user.info.id" class="follow-block" @click="changeFollow">
        <div v-if="!isMyFan && !isMyFollow" :class="ifFollow ? 'cancle' : 'follow'">
            {{ifFollow? '关注':'已关注'}}
        </div>
        <div v-if="isMyFan && !isMyFollow" :class="ifFollow ? 'cancle' : 'follow'">
            {{ifFollow? '关注':'互相关注'}}
        </div>
        <div v-if="!isMyFan && isMyFollow" :class="ifFollow ? 'cancle' : 'follow'">
            {{ifFollow? '已关注':'关注'}}
        </div>
        <div v-if="isMyFan && isMyFollow" :class="ifFollow ? 'cancle' : 'follow'">
            {{ifFollow? '互相关注':'关注'}}
        </div>
    </div>

    <div v-else-if=" type =='otherFans' && followId != user.info.id" class="follow-block" @click="changeFollow">
        <div v-if="!isMyFan && !isMyFollow" :class="ifFollow ? 'cancle' : 'follow'">
            {{ifFollow? '关注':'已关注'}}
        </div>
        <div v-if="isMyFan && !isMyFollow" :class="ifFollow ? 'cancle' : 'follow'">
            {{ifFollow? '关注':'互相关注'}}
        </div>
        <div v-if="!isMyFan && isMyFollow" :class="ifFollow ? 'cancle' : 'follow'">
            {{ifFollow? '已关注':'关注'}}
        </div>
        <div v-if="isMyFan && isMyFollow" :class="ifFollow ? 'cancle' : 'follow'">
            {{ifFollow? '互相关注':'关注'}}
        </div>
    </div>

</template>
<style lang="less" scoped>
@import url('../assets/less/var.less');
 .follow-block{
    line-height: 64px;
    .btn{
        padding: 0;
        z-index: 10;
        width: 90px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        font-size: 12px;
        border-radius: 16px;
        transition:none;
    }
     .cancle{
         color: @sub-color;
         border:1px solid @sub-color;
     }
     .follow{
         color: #fff;
         background-color: @sub-color;
         border:1px solid @sub-color;
     }
 }
</style>
<script>
//type: follow,fans,other
	export default{
        props:['followId','isFan','type','isMyFan','isMyFollow'],
        data(){
            return{
                ifFollow:true,
                following:false
            }
        },
        computed:{
            user() {
              return this.$store.getters.getUser
            }
        },
        methods:{
            changeFollow(){
              this.following = true
              this.$store.dispatch('followUser',{uid:this.followId})
              .then(()=>{
                this.following = false
                this.ifFollow = !this.ifFollow
                this.$store.dispatch("getUserInfo")
                
              })
              .catch(e=>{
                this.$toast.center(e.msg||"操作失败，请重试")
              })
            },
        }
	}
</script>
