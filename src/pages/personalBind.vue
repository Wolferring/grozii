<template>
	<f7-page navbar-fixed class="personalBind no-toolbar">
	    <f7-navbar sliding>
          <f7-nav-left>
			<f7-link icon-only back>
				<i class="iconfont icon-back">

				</i>
			</f7-link>
    	  </f7-nav-left>
          <f7-nav-center>
          	激活手机号
          </f7-nav-center>
	 	  <f7-nav-right>
		  </f7-nav-right>
	    </f7-navbar>
        <f7-block class="bind-block">
    		<f7-list form class="no-top-border">
                <f7-list-item>
                    <f7-label class="text-left">
                    <div class="avatar">
		        		<img :src="authInfo.avatar" alt="">
                    </div>
                    </f7-label>
                    <f7-input 
                        id="username"
                        type="text" 
                        v-model="models.username"
                        :placeholder="authInfo.username"
                        v-once
                    />
                </f7-list-item>    		
                <f7-list-item>
                    <f7-label class="text-left">
                        <f7-icon class="iconfont icon-phone"></f7-icon>
                    </f7-label>
                    <f7-input 
                        maxlength=11  
                        type="tel" 
                        id="phone"
                        v-model="models.mobile"
                        placeholder="请填写注册手机号"
                    />
                </f7-list-item>
                <f7-list-item>
                    <f7-label class="text-left">
                        <f7-icon class="iconfont icon-identifyCode"></f7-icon>
                    </f7-label>
                    <f7-input 
                        maxlength=4 
                        type="tel" 
                        id="code"
                        v-model="models.code"
                        placeholder="请输入验证码"

                    />
                    <button 
                    	@click="sendVerify" 
                    	class="btn border" 
                    	type="button"
                    	:class="{disabled:(!phoneValid||countingDown)}"
                    >{{buttonLabel}}</button>
                </f7-list-item>  
                <f7-list-item>
                    <f7-label class="text-left">
                        <f7-icon class="iconfont icon-key"></f7-icon>
                    </f7-label>
                    <f7-input 
                        maxlength=11  
                        type="text" 
                        id="password"
                        v-model="models.password"
                        placeholder="设置一个密码"
                    />
                </f7-list-item>            
	            <p>为了能快速登录格物志以及国家相关法律法规限制，请补全您的资料</p>    
	            <p class="text-left error">
	            {{registerError}}
	            </p>
            </f7-list>
            <button 
                class="btn btn-xl round btn-gradient"
                :class="{disabled:(!infoValid)}"
                @click="bindAuthInfo"
            >
            进入格物志	
            </button>                                               
        </f7-block>	    
	</f7-page>
</template>
<style lang="less">
@import url('../assets/less/var.less');
	.personalBind{
		background-color: #fff;
	}
	.bind-block{
		padding: 0 .88rem;
        margin-top: .26666667rem;
		.list-block{
	        margin-top: 0rem;
	        position: relative;
			.item-content{
				padding: 0;
				.item-inner{
					padding: 5px 0;
				}
				.item-title{
					width: auto;
					height: 1.17333333rem;
					line-height: 1.17333333rem;
					padding: 0 .34666667rem;
					i{
						font-size: 25px;
					}
					color: #000;
				}
				.item-input{
					height: 1rem;
					line-height: 1;
					input{		
						height: 1rem;		
						font-size: 17px;
					}
				}
			}
			p{
				font-size: 12px;
				line-height: 1.5;
				margin: 15px 0;
	            padding-left:.34666667rem;
			}
	        .error{
	            color:@font-danger;
	            font-size: 14px;
	            margin: 0;
	            position: absolute;
	            bottom:-.74666667rem;
	            line-height:.5rem;
	            height: .5rem;
	            padding-left:.34666667rem;
	        }            
		}
	}
</style>
<script>
import api from '../store/api.js'

export default {
	data(){
		return {
			models:{
				mobile:"",
				password:"",
				code:"",
				username:"",
			},
            registerError:"",
            countingDown:false,
            buttonLabel:"获取验证码",
            statusStyle:""
		}
	},
	beforeCreate(){
		this.statusStyle = plus.navigator.getStatusBarStyle()||"light"
		plus.navigator.setStatusBarStyle('dark');
	},
	mounted(){

	},
	computed:{
		authInfo(){
			let info  = this.$store.getters.getThirdAuthInfo
			return info
		},
		phoneValid(){
			if(/^1[34578]\d{9}$/.test(this.models.mobile)){
				return true;
			}
			return false;
		},
        userNameValid(){
        	var name = this.models.username||this.authInfo.username
            if(!/^[a-zA-Z0-9\u4e00-\u9fa5]{4,20}$/.test(name)||this.strlen(name)>20){
                return false;
            }
            return true
        },
        passwordValid(){
            if(!/^[A-Za-z0-9]{6,12}$/.test(this.models.password)){
                return false;
            }
            return true
        },		
		infoValid(){
            if(!this.phoneValid||!this.passwordValid||!this.userNameValid){
                return false;
            }
            return true;
		},
		user(){
			return this.$store.getters.getUser
		},
	},	
	beforeDestroy() {
		let style = this.statusStyle
		plus.navigator.setStatusBarStyle(style);
	},
	methods:{
		sendVerify(){
            var self = this;
            try{
                plus.nativeUI.showWaiting()
            }catch(e){}
            api.getVerifyCode({
                mobile:this.models.mobile,
                type:3
            },function(data){
                plus.nativeUI.closeWaiting()
                if(data.code!=2000){
                    self.showErrorMessage(data.msg);
                    return false;
                }
                self.countingDown = true
                self.countDown(60);
            })
		},
        showErrorMessage(msg){
            var self = this;
            this.registerError = msg;
            setTimeout(() => {
                self.registerError = "";
            },3000)
        },	
		bindAuthInfo(){
			var self = this
			let query = {
				username:self.models.username||self.authInfo.username,
				openid:self.authInfo.openid,
				avatar:self.authInfo.avatar,
				password:self.models.password,
				mobile:self.models.mobile,
				code:self.models.code
			}
			this.$store.dispatch("getBindAuthInfo",query)
			.then((e)=>{
				if(e.code==2000){
                    self.$toast.center("登录成功，为您自动登录")
	                window.location.reload();
				}
			}, (e)=>{
				console.log(e)
			})
		},
        countDown(time){
            var time = time,
                self = this;
            var timer = setInterval(function(){
                self.buttonLabel = time+"秒后重发"
                if(time<=0){
                    clearInterval(timer);
                    self.countingDown = false;
                    self.buttonLabel = "重新发送"
                }
                time--;
            },1000)
        },	
        strlen(str){
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
	}
}
</script>
