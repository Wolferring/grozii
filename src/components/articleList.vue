<template>
<f7-list media-list class="no-top-border article-list-comp" no-border>
	<f7-list-item
	    :link="'/evalDetail/'+item.id"
	    class="article-item-comp"
	    v-for="item in list"
	    :key="item.id"
	  >
	  	<img :src="item.cover" slot="media" alt="">
	  	<span class="label label-digest" slot="media-start" v-if="item.is_digest">精华</span>
	  	<div class="content">{{item.title}}</div>
		<div class="auth">
			<div class="author">
				<span class="avatar">
					<img :src="item.author.avatar" alt="">
				</span>
				<span class="name">{{item.author.username}}</span>
			</div>
			<div class="likes">
				<span>
					<i class="iconfont icon-index_comment"></i>
					{{item.replies}}
				</span>
				<span>
					<i class="iconfont icon-index_good"></i>
					{{item.diggs|convertNumber}}
				</span>
			</div>
		</div>
	</f7-list-item>

</f7-list>
</template>
<style lang="less">
@import url('../assets/less/var.less');
.pixel-ratio-2 {
	.article-list-comp .item-content:after{
	    transform: scaleY(.5);
	}
}
.pixel-ratio-3{
	.article-list-comp .item-content:after{
	    transform: scaleY(.33);
	}
}
.article-list-comp{
	margin: 0;
	padding: 0 .26666667rem;
	ul:after{
		background-color: #e2dede;
	}
	.label.label-digest{
		position: absolute;
		left: 0;
		z-index: 2;
		top: 4px;
		font-size: 10px;
		color: #fff;
		padding: 0 4px;
	    margin-right: 5px;
	    height: 16px;
	    line-height: 16px;
	    vertical-align: text-bottom;
	    background-image: linear-gradient(338deg, #f8ad36, #ff6464);
	}
	.item-content{
		padding-left: 0;
		padding: .4rem 0;
		&:after{
		    content: '';
		    position: absolute;
		    left: 0;
		    bottom: 0;
		    right: auto;
		    top: auto;
		    height: 1px;
		    width: 100%;
		    background-color: #e2dede;
		    display: block;
		    z-index: 15;
		    -webkit-transform-origin: 50% 100%;
		    transform-origin: 50% 100%;
		}
		.item-media{
			width: 2.66666667rem;
			height: 2.66666667rem;
			padding: 0;
			border-radius: 2px;
			overflow:hidden;
			background-color: @place-color;
			position: relative;
			img{
				height: 100%;
				max-width: initial;
				position: absolute;
				left: -50%;
				right:-50%;
				margin: 0 auto;
			}
		}
		.item-inner{
			padding: 0!important;
			display: flex;
			flex-direction:column;
			justify-content:space-between;
			margin-left: .48rem;
			.item-title-row{
				display: none;
			}
			&:after{
				content: none;
			}
		}
		.content{
			font-size: 16px;
			text-align: left;
			font-weight: 500;
			width: 100%;
		}
		.auth{
			display: flex;
			color: #888;
			align-items:flex-end;
			justify-content:space-between;
			font-size: 11px;
			padding: .16rem 0;
			width: 100%;
			.author{
				.avatar{
					display: inline-block;
					width: .45333333rem;
					height: .45333333rem;
					vertical-align: bottom;
					overflow: hidden;
					border-radius: 50%;
					img{
						width: 100%;
					}
				}
				.name{
				}
			}
			.likes{
				.iconfont{
					font-size: 12px;
				}
				span{
					margin-right: .26666667rem;
				}
			}
		}
	}
}
</style>
<script>
export default{
	props:["list"],
	mounted(){
	},
}
</script>
