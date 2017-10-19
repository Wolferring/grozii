<template>

    <div class="comment-content">
        <ul>
            <li class="border-bottom" v-for="(innerItem,index) in list" v-if="index<3 || showCom" @click.stop="replyInnerCom(innerItem)">
                <!-- {{innerItem}} -->
                <span class="reply-user">{{innerItem.user_name}}:</span><span class="reply-text">{{innerItem.message}}</span>
            </li>
            <li class="show-more" @click="showmore" v-if="list.length > 3">
                <span><img src="../assets/images/comment/more.png" alt="" :class="showCom? '':'upsideImg' ">{{showCom?"收起评论":"展开更多评论"}}</span>
            </li>
        </ul>
    </div>

</template>
<style lang="less">
.comment-content{
    width: 7.83784rem;
    margin-top: 0.37838rem;
    text-align: left;
    ul{
        padding-left:0;
        background-color: #fbfbfb;
        li{
            padding: 0.27027rem;
            border: 1px solid #f2f2f2;
            .reply-user{
                font-size: 0.37838rem;
                color: #000;
            }
            .reply-text{
                font-size: 0.37838rem;
                color: #666;
                margin-left: 0.27027rem;
            }
        }
        .show-more{
            text-align: center;
            color:#3f8cea;
            font-size: 12px;
            .iconfont{
                display: inline-block;
                font-size: 14px;
            }
            .upsideImg{
                transform:rotate(180deg);
            }
            img{
                width: .32rem;
                margin-right: .13333333rem;
                vertical-align: initial;
            }
        }
    }
}
</style>
<script>
	export default{
        props:['list'],
        data(){
            return{
                showCom:false
            }
        },
        computed:{
            setReplyIds(){
              return this.$store.getters.setReplyIds
          },
          user(){
            return this.$store.getters.getUserInfo
          },
        },
        methods:{
            showmore(){
              this.showCom = !this.showCom;
            },
            replyInnerCom(innerItem){
                console.log(innerItem);
                if(innerItem.user_id == this.user.id){
                    this.$toast.center("不能回复自己的评论");
                    return false;
                }
                document.getElementById('replying').focus();
                this.$store.commit("setReplyIds", {
                    pid:innerItem.pid,
                    tfid:innerItem.tfid,
                    tid:innerItem.tid,
                    name:innerItem.name
                });
            }
        }
	}
</script>
