<template>
  <ul class="user-list">
    <li v-for="user in users" :key="user.id" class="user-item">
      <f7-link :href="'/otherInfo/'+user.id">
        <div class="avatar">
          <img  :src="user.avatar" alt="">
        </div>
      </f7-link>
      <div class="right">

        <f7-link class="info" :href="'/otherInfo/'+user.id">
          <p class="name">{{user.username}}</p>
          <p class="about"><span>{{user.follows}}关注</span><span>{{user.fans}}粉丝</span></p>
        </f7-link>
        <follow 
        :followId='user.id' 
        :isMyFan='user.fans_my||false' 
        :isMyFollow='user.follows_my||false' 
        :isFan='user.is_follow||false' 
        :type="type"></follow>
      </div>
    </li>
  </ul>
</template>
<style lang="less" scoped>
    .user-list {
        border-top: solid 1px #e2e2e2;
        list-style-type: none;
        background: #fff;
        margin: 0;
        padding:0px 15px;
        .user-item{
            display: flex;
            width: 100%;
            height: 64px;
            line-height: 64px;
            .avatar {
              width: 1.2rem;
              height: 1.2rem;
            }
            .right {
                width: 100%;
                border-bottom: 0.5px solid #e2e2e2;
                position: relative;
                display: flex;
                justify-content:space-between;
                align-items:center;
                .info{
                    padding-left: 10px;
                }
                .name {
                    font-size: 15px;
                    font-weight: 500;
                    color: #000;
                    height: 40px;
                    line-height: 40px;
                }
                .about {
                    height: 24px;
                    line-height: 20px;
                    font-size: 12px;
                    color: #999;
                    span{
                    	margin-right: 20px;
                    }
                    span:last-child {
                        margin-right: 0;
                    }
                }
                .cancle {
                    font-size: 12px;
                    position: absolute;
                    height: 32px;
                    line-height: 32px;
                    width: 60px;
                    text-align: center;
                    right: 9px;
                    top: 50%;
                    padding: 0px 14px;
                    border-radius: 25px;
                    color: #23deb1;
                    border: 1px solid #23deb1;
                    transform: translateY(-50%);
                }
                .follow {
                    font-size: 12px;
                    position: absolute;
                    text-align: center;
                    width: 60px;
                    right: 9px;
                    top: 50%;
                    padding: 7px 14px;
                    border-radius: 25px;
                    color: #fff;
                    background-color: #23deb1;
                    border: 1px solid #23deb1;
                    transform: translateY(-50%);
                }
            }
            &:last-child{
            	.right{
            		border-bottom: none;
            	}
            }
        }
    }
</style>
<script>
import follow from '../components/follow.vue'

export default{
	props:["users",'isFan','type','isMyFan','isMyFollow'],
	mounted(){
	},
	components: {
		follow
	},
}
</script>