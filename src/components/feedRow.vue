<template>
	<div class="share-row">
		<div class="share-wrapper" v-if="list.length>0">
			<f7-link v-for="share in list" :href="'/postDetail/'+share.id" class="recommend-post" :key="share.id">
				<div class="image" >
					<div class="layer" :style="{backgroundImage: 'url(\''+share.cover+'\')'}">
						
					</div>
					<span class="mark">晒物</span>
				</div>
				<div class="content">
					<h3 class="title">{{share.title}}</h3>
					<h3 class="auth">
						<span class="avatar"><img :src="share.author.avatar" alt=""></span>
						{{share.author.username}}
					</h3>
				</div>
			</f7-link>

		</div>
	</div>	
</template>
<style lang="less">
.share-row{
  background-color: #ececec;
  padding: 0 .26666667rem;
  .share-wrapper{
    width: auto;
    display: flex;
    overflow-x: scroll;
    padding: .4rem 0;
    .recommend-post{
      background-color: #fff;
      margin-right:.26666667rem;
      border:5px solid #fff;
      border-radius: 2px;
      width: 4rem;
      flex:1;
      .content{
        overflow: hidden;
        .title{
          font-size: 13px;
          padding: .32rem 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: normal;         
        }
      }
      .auth {
        padding: 0;
        font-size: 11px;
        font-weight: 400;
        color: #888;
        .avatar{
          width: 16px;
          height: 16px;
          vertical-align: bottom;
          margin-right: 6px;
        }
      }
      .image {
        width: 4rem;
        height: 4rem;     
        position: relative;
        display: flex;
        align-items: flex-end;
        color: #fff;
        border-radius: 2px;
        overflow: hidden;
        border-radius: 2px;
        .layer{
          position: absolute;
          left:0;
          top: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          width: 4rem;
          height: 4rem;
          z-index: 0;     
        }

        .mark{
          position: absolute;
          top: .37333333rem;
          left: 0;
          display: block;
          width: 1.06666667rem;
          height: .37333333rem;
          line-height: .37333333rem;
          background-color: rgba(0,0,0,.7);
          font-size: 10px;
          border-radius: 0 .18666667rem .18666667rem 0;
          text-align: center;
        }
      }      
    }

  }
  width: 100%;
  box-sizing: border-box;

}	
</style>
<script>
export default{
	props:["list"],
	mounted(){
	},
}
</script>