<template>
	<f7-page class="no-toolbar post-create"
		navbar-fixed
		@page:beforeinit="beforeInit"
		@page:back="beforeBack"
		>
	    <f7-navbar sliding>
          <f7-nav-left>
	    	<f7-link back icon-only>
				<i class="iconfont icon-back">

				</i>
	    	</f7-link>
          </f7-nav-left>
          <f7-nav-center>
          	晒物
          </f7-nav-center>
          <f7-nav-right>
          	<f7-link @click="sendShare" class="text-sub" :disabled="readyShare">
          		发布
          	</f7-link>
          </f7-nav-right>
	    </f7-navbar>
	    <div class="create-container">
	    	<div class="padding background border-bottom">
		    	<div class="input-cate grid">
		    		<label for="null">选择分类:</label>
		    		<f7-link class="cate btn border" :class="{'active':models.cate==cate.id}" @click="setCate(cate.id)" v-for="(cate,index) in postTypes" :key="index">{{cate.name}}</f7-link>
		    	</div>
	    	</div>
	    	<div class="padding input-title ">
	    	<div class="border-bottom">
				<input type="text" class="input "  maxlength="30" v-model="models.title" placeholder="起一个酷酷的标题">
				<span class="count">
					{{30-models.title.length}}
				</span>
	    	</div>
	    	</div>
	    	<div class="padding input-content">
				<textarea type="textarea" v-model="models.content" rows="4" :placeholder="contentPlace.content"></textarea>
				<span class="count">{{200-models.content.length}}</span>
	    	</div>

	    	<div class="padding">
	    		<div class="input-container">
		    		<div class="input-images grid">
		    			<f7-link @click="showActions(index)" v-for="(image,index) in models.imageUrlList" class="image" :key="index">
		    				<img :src="image" alt="">
		    			</f7-link>
		    			<div class="image image-upload">
		    				<f7-link @click="chooseImage">
		    					<img src="../assets/images/postChooseImage.jpg" alt="">
		    				</f7-link>
		    			</div>
		    		</div>
	    		</div>
	    	</div>
	    </div>
		<f7-actions :opened="actionOpen" @actions:close="actionOpen==false">
		  <!-- Actions Group -->
		  <f7-actions-group>
		    <!-- Actions Label -->
		    <!-- Actions Buttons -->
		    <f7-actions-button @click="removeImage">删除</f7-actions-button>
		  </f7-actions-group>
		  <!-- Another Group -->
		  <f7-actions-group>
		    <!-- Cancel/Close Button -->
		    <f7-actions-button @click="hideAction">取消</f7-actions-button>
		  </f7-actions-group>
		</f7-actions>
	</f7-page>
</template>
<style lang="less">
@import url('../assets/less/var.less');
	.post-create{
		.padding.background{
			background: #fafafa;
		}
		.input-cate{
			padding: 10px 0;
			label{
				font-size: 15px;
			}
			.cate{
				border-radius: 25px;
				height: 25px;
				line-height: 25px;
				background: none;
				border: .5px solid #666;
				font-size: 13px;
				color:#666;
				padding:0 13px;
				margin: 0;
				transition:none;
				&.active{
					color:@sub-color;
					border-color: @sub-color;
					background-color: #e7f7f3;
				}
			}
		}
		.input-title{
			input{
				outline: none;
				border:none;
				line-height:15px;
				font-size: 15px;
				color:#333;
				padding: 12px 0;
				width: 100%;
				user-select:auto;
				-webkit-user-select:auto;
			    -webkit-appearance: none;
			    border-radius: 0;
			    padding-right: 15px;
			    box-sizing: border-box;
			    &::-webkit-input-placeholder{
			    	color:#999;
			    }
			}

			position: relative;
			.count{
				position: absolute;
				right: 0px;
				top:16px;
				color: #999;
				font-size: 12px;
			}
		}
		.input-content{
			position: relative;
			textarea{
				width: 100%;
				border:none;
				outline:none;
				resize:none;
				padding: 10px 0;
				user-select:auto;
				-webkit-user-select:auto;
				font-size: 15px;
				color: #333;
			}
			.count{
				position: absolute;
				right: 10px;
				bottom: 0;
				font-size: 12px;
				color:#999;

			}
		}
		.input-container{
			width: 100%;
			overflow:hidden;
		}
		.input-images{
			justify-content:flex-start;
			flex-wrap:nowrap;
			overflow-x: scroll;
			margin-top: 12px;
			padding-bottom: 10px;
			width: auto;
			.image{
				width: auto;
				height: 2.66666667rem;
				margin-right:.26666667rem;
				line-height: 2.66666667rem;
				text-align: center;
				box-sizing: border-box;
				// border: .5px solid red;
				position: relative;
				&.image-upload{
					width: 2.66666667rem;
					height: 2.66666667rem;
				}
				img{
					max-width: 2.66666667rem;
					max-height: 2.66666667rem;
					vertical-align: middle;
					margin: 0 auto;
				}
				.link{
					display: block;
					height: 100%;
					width: 100%;
				}
			}
		}
	}
</style>
<script>
	export default{
		data(){
			return {
				models:{
					title:"",
					content:"",
					cate:0,
					imageUrlList:[],
				},
				contentPlace:{
					content:"随便说点什么吧...",
					show:true
				},
				imageUrl:"",
				actionOpen:false
			}
		},
		methods:{
			beforeInit(){
				this.$store.commit("COM_CONF",{
					tabPostShow:false,
					narbarShadow:true
				})
			},
			beforeBack(){
				this.$store.commit("COM_CONF",{
					tabPostShow:true,
					narbarShadow:false
				})
			},
			setCate(cate){
				this.models.cate = cate
			},
			showActions(index){
				this.actionOpen = true
				this.actionIndex = index
			},
			hideAction(){
				this.actionOpen = false
			},
			removeImage(){
				console.log(this.actionIndex)
				this.models.imageUrlList.splice(this.actionIndex,1)
			},
			chooseImage(){
				var self = this;
				if(self.models.imageUrlList.length>9){
					this.$toast.center("最多选择9张图片")
					return false
				}
				plus.gallery.pick( function(path){
					self.models.imageUrlList = []
					self.models.imageList = []
					for(let img in path.files){
						self.showImage(path.files[img])
					}
			    }, function (e) {
			    	console.log( "取消选择图片" );
			    }, {filter:"image",system:false,maximum:9,multiple:true,selected:self.models.imageUrlList});
			},
			showImage(url){
			    var self = this;
			    this.models.imageUrlList.push(url)
			},
			sendShare(){
				let self = this;
				var task = plus.uploader.createUpload("http://api.gwz.eptonic.biz/v1/post",
					{ method:"POST",blocksize:204800,priority:100},
					function (t,status ) {
						// 上传完成
						if (status == 200){
							alert( "Upload success: " + JSON.parse(t.responseText).msg );
							let result = JSON.parse(t.responseText)
							if(result.code!=2000){
								self.$toast.center(result.msg)
								return false;
							}
							self.$router.back();
						} else {
							self.$toast.center("上传失败了")
						}
					}
				)
				task.setRequestHeader('Authorization',self.$store.getters.authToken);
				for(var file in self.models.imageUrlList){
					console.log(self.models.imageUrlList[file])
					task.addFile(self.models.imageUrlList[file]);
				}
				task.addData( "title", self.models.title );
				task.addData( "content", self.models.content );
				task.addData( "cate", String(self.models.cate));
				task.start()

			},
			start(el){
				el.target.focus()
				this.contentPlace.show = false
			}
		},
		mounted(){
			// this.$$('.subnavbar').hide();
		},
		beforeDestroy(){

		},
		computed:{
	        postTypes(){
	            return this.$store.getters.getPostTypes
	        },
	        readyShare(){
	        	if(this.models.title==""||this.models.content==""||this.models.cate==0){
	        		return true
	        	}
	        	return false
	        }
		}
	}
</script>
