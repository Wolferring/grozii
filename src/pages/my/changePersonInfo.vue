<template>
	<f7-page navbar-fixed class="changePerInfo no-toolbar" id="changePerInfo" :class=" changeUserInfo == 3 ?  'pageCbgcf5' : 'pageCbgcfff'">
	    <f7-navbar sliding class="navbar-black">
          <f7-nav-left>
			<f7-link icon-only back>
				<i class="iconfont icon-back">

				</i>
			</f7-link>
          </f7-nav-left>
          <f7-nav-center v-if="changeUserInfo == 1">
          	 修改用户名
          </f7-nav-center>
		  <f7-nav-center v-if="changeUserInfo == 2">
			 修改性别
		  </f7-nav-center>
          <f7-nav-center v-if="changeUserInfo == 3">
             修改个人简介
          </f7-nav-center>
          <f7-nav-center v-if="changeUserInfo == 4">
             修改邮箱
          </f7-nav-center>
          <f7-nav-right >
              <f7-link @click="submitChange" class="text-sub">保存</f7-link>
          </f7-nav-right>
	    </f7-navbar>
		<f7-list class="setting-list">
			<f7-list-item v-if="changeUserInfo == 1">
                <input type="text" autofocus="autofocus" id="userNameInput" :placeholder='user.info.username' v-model="newName">
                <i class="iconfont icon-close icon-only" @click="clearInput"></i>
			</f7-list-item>
            <f7-list-item v-if="changeUserInfo == 3">
                <textarea name="name" rows="8" cols="80" maxlength="20" autofocus="autofocus" id="personBrief" @input="descInput" v-model="newIntro" :placeholder='user.info.intro'></textarea>
                <span class="calcnum">{{this.remnant}}/20</span>
            </f7-list-item>
            <f7-list-item v-if="changeUserInfo == 4">
                <input type="email" autofocus="autofocus" id="emailAdd" :placeholder="user.info.email" v-model="newEmail">
                <i class="iconfont icon-close icon-only" @click="clearInput"></i>
            </f7-list-item>
		</f7-list>

		<div class="list-block" v-if="changeUserInfo == 2">
		  <ul>
		    <li>
		      <label class="label-radio item-content">
		        <input type="radio" name="my-radio" value="0" v-model="picked">
		        <div class="item-inner">
		          <div class="item-title">男</div>
		        </div>
		      </label>
		    </li>
		    <li>
		      <label class="label-radio item-content">
		        <input type="radio" name="my-radio" value="1" v-model="picked">
		        <div class="item-inner">
		          <div class="item-title">女</div>
		        </div>
		      </label>
		    </li>
		  </ul>
		</div>
	</f7-page>
</template>
<style lang="less">
    .pageCbgcfff{
        .page-content{
            background: #fff!important;
        }
    }
    .pageCbgcf5{
        .page-content{
            background: #f5f5f5!important;
        }
    }
    .changePerInfo{
        .page-content{
            .list-block{
                margin:0;
                ul:after{
                    height: 0;
                }
                ul:before{
                    height: 0;
                }
                .item-content{
                    padding-top: 10px;
                    .item-inner{
                        position: relative;
                        input{
                            border-bottom: 1px solid #d3d3d3;
                        }
                        i{
                            position: absolute;
                            right: 10px;
                            color: #d3d3d3;
                            top: 50%;
                            transform:translateY(-50%);
                            font-size: 12px;
                        }
                        .calcnum{
                            display: inline-block;
                            position: absolute;
                            right: 10px;
                            bottom: 0;
                            color: #999;
                        }
                    }
                }
            }
			.change-sex{
				.item-inner{
					div{
						width: 100%;
					}
				}
			}
        }
        input,textarea{
    		user-select:auto;
			resize:none;
        }
		input::-webkit-input-placeholder, textarea::-webkit-input-placeholder{
			color:#999;
		}
    }

</style>
<script>
export default {
	data(){
		return {
            remnant:0,
			newName:'',
			newIntro:'',
			picked:'',
			newEmail:''
		}
	},
	mounted(){
        if(this.changeUserInfo == 1){
            document.getElementById('userNameInput').focus();
        }else if(this.changeUserInfo == 2){
			this.picked = this.user.info.sex
		}else if(this.changeUserInfo == 3){
            document.getElementById('personBrief').focus();
        }else if(this.changeUserInfo == 4){
            document.getElementById('emailAdd').focus();
        }
	},
	computed:{
		user(){
			return this.$store.getters.getUser
		},
        changeUserInfo(){
		  return this.$store.getters.changeUserInfo
		}
	},
	destroyed() {
	},
	methods:{
        descInput(){
            var txtVal = this.newIntro.length;
            this.remnant = txtVal;
        },
		clearInput(){
			if(this.changeUserInfo == 1){
				this.newName = '';
			}else if(this.changeUserInfo == 3){
				this.newIntro = '';
			}else if(this.changeUserInfo == 4){
				this.newEmail = '';
			}
		},
		submitChange(){
			function strlen(str){
				var len = 0;
				for (var i=0; i<str.length; i++) {
				 var c = str.charCodeAt(i);
				//单字节加1
				 if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
				   len++;
				 }
				 else {
				  len+=2;
				 }
				}
				return len;
			}

			var self = this;
			switch(this.changeUserInfo){
				case "1" :
					if(!/^[a-zA-Z0-9\u4e00-\u9fa5]{4,16}$/.test(this.newName)||strlen(this.newName)>16){
						self.$toast.center("请输入正确的用户名");
			            document.getElementById('userNameInput').focus();
					}else{
						this.$store.dispatch("changeMyInfo",{username:this.newName})
						.then(data=>{
							self.$toast.center("修改成功");
							this.$router.back();
						})
						.catch(e=>{
							self.$toast.center(e.msg||"修改失败");
						})
					}
					break;
				case "2":
					this.$store.dispatch("changeMyInfo",{sex:this.picked})
					.then(data=>{
						self.$toast.center("修改成功");
						this.$router.back();
					})
					.catch(e=>{
						self.$toast.center(e.msg||"修改失败");
					})
					break;
				case "3":
					this.$store.dispatch("changeMyInfo",{intro:this.newIntro})
					.then(data=>{
						self.$toast.center("修改成功");
						this.$router.back();
					})
					.catch(e=>{
						self.$toast.center(e.msg||"修改失败");
					})
					break;
				case "4":
					if(!/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.newEmail)){
						self.$toast.center("请输入正确的邮箱");
			            document.getElementById('emailAdd').focus();
					}else{
						this.$store.dispatch("changeMyInfo",{email:this.newEmail})
						.then(data=>{
							self.$toast.center("修改成功");
							this.$router.back();
						})
						.catch(e=>{
							self.$toast.center(e.msg||"修改失败");
						})
					}	
					break;			
				default:

					
			}

		}
	}
}
</script>
