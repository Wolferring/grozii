<template>

    <div class="comment-content">
        <ul>
            <li class="border-bottom" v-for="(innerItem,index) in list" v-if="index<3 || showCom" @click="replyInnerCom(innerItem.pid,innerItem.tfid,innerItem.tid,innerItem.user_name)">
                <!-- {{innerItem}} -->
                <span class="reply-user">{{innerItem.user_name}}:</span><span class="reply-text">{{innerItem.message}}</span>
            </li>
            <li class="show-more" @click="showmore" v-if="list.length > 3">
                <span><img src="../assets/images/comment/more.png" alt="" :class="showCom? '':'upsideImg' ">{{showCom?"折叠":"展开更多评论"}}</span>
            </li>
        </ul>
    </div>

</template>
<style lang="less">
.comment-content{
    width: 7.83784rem;
    margin-top: 0.37838rem;
    // border-radius: 2px;
    // border: solid .5px #f3f3f3;
    font-weight: 500;
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
            i{
                display: inline-block;
            }
            .upsideImg{
                transform:rotate(180deg);
            }
            img{
                width: 0.32432rem;
                margin-right: 0.08108rem;
                vertical-align: middle;
            }
        }
    }
    p{
        color:#666;
        font-size:0.37838rem;
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
            }
        },
        methods:{
            showmore(){
              this.showCom = !this.showCom;
            },
            replyInnerCom(pid,tfid,tid,name){
                document.getElementById('replying').focus();
                this.$store.commit("setReplyIds", {
                    pid:pid,
                    tfid:tfid,
                    tid:tid,
                    name:name
                });
                console.log(this.setReplyIds);
            }
        }
	}
</script>
