<template>
	<f7-page navbar-fixed  class="reset-password no-toolbar">
	    <f7-navbar  sliding>
          <f7-nav-left>
	    	<f7-link back icon-only>
				取消
	    	</f7-link>
          </f7-nav-left>
          <f7-nav-center>
          		重设密码
          </f7-nav-center>
          <f7-nav-right>
          </f7-nav-right>          
	    </f7-navbar>
        <f7-block>
    		<f7-list form class="no-top-border">
                <f7-list-item>
                    <f7-label class="text-left">
                        <f7-icon class="iconfont icon-phone"></f7-icon>
                    </f7-label>
                    <f7-input 
                        maxlength=11  
                        type="tel" 
                        id="phone"
                        v-model="models.phone"
                        placeholder="请填写注册手机号"
                        :disabled="user.hasLogin"
                    />
                </f7-list-item>
                <f7-list-item>
                    <f7-label class="text-left">
                        <f7-icon class="iconfont icon-identifyCode"></f7-icon>
                    </f7-label>
                    <f7-input 
                        maxlength=4 
                        type="number" 
                        id="verify"
                        v-model="models.verify"
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
                        maxlength=12
                        type="text" 
                        id="password"
                        v-model="models.password"
                        placeholder="设置新密码"
                    />
                </f7-list-item>   
                <p class="text-left register-error">
                    {{registerError}}
                </p>
            </f7-list>
            <button 
                class="btn btn-xl round btn-gradient"
                :class="{disabled:(!infoValid)}"
                @click="resetPassword"
            >
            确认	
            </button>                                               
        </f7-block>	    
	</f7-page>
</template>
<style lang="less">
@import url('../assets/less/var.less');
	.reset-password{
        .page-content{
            background-color: #fff!important;
        }
		.content-block{
			padding: 0 .88rem;
            margin-top: .53333333rem;
		}
		.list-block{
            margin-top: 0rem;
            position: relative;
			.item-content{
				padding: 0;
				.item-inner{
					padding: 10px 0;
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
					height: 1.17333333rem;
					line-height: 1.17333333rem;
					input{		
						height: 1.17333333rem;		
						font-size: 17px;
					}
				}
			}
            .register-error{
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
				phone:"",
				password:"",
				verify:""
			},
            registerError:"",
            countingDown:false,
            buttonLabel:"获取验证码",
            statusStyle:""

		}
	},
	mounted(){
        var self = this;
		this.models.phone = this.user.info.mobile
        setTimeout(function(){
            self.$store.dispatch("setComConf",{
              isLoginScreenActive:false
            })
        },500)
        plus.navigator.setStatusBarStyle("dark");
    },
    beforeCreate(){
        this.statusStyle = plus.navigator.getStatusBarStyle()
    },
    beforeDestroy(){
        this.$store.dispatch("setComConf",{
          isLoginScreenActive:true
        })   
        let style = this.statusStyle
        plus.navigator.setStatusBarStyle(style);

    },
	methods:{
		sendVerify(){
            var self = this;
            api.getVerifyCode({
                mobile:this.models.phone,
                type:2
            },function(data){
                if(data.code!=2000){
                    self.showErrorMessage(data.msg);
                    return false;
                }
                self.step=2;
                self.countingDown = true
                self.countDown(60);
            })
		},
		resetPassword(){
			let user = {
				mobile:this.models.phone,
				password:this.models.password,
				code:this.models.verify
			}
            var self = this;
			api.resetPassword(user,function(data){
                if(data.code!=2000){
                    self.showErrorMessage(data.msg);
                    return false;
                }
                if(self.user.hasLogin){
                    self.$store.dispatch("getLogout")
                    self.$router.back();
                    self.$f7.alert("密码重置成功,请重新登录","格物志")
                    return;
                }
                self.$router.back();
                self.$f7.alert("密码重置成功","格物志")

                			
			})
			
		},
		showErrorMessage(msg){
            var self = this;
            this.registerError = msg;
            setTimeout(() => {
                self.registerError = "";
            },3000)            

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
	},
	computed:{
		phoneValid(){
			if(/^1[34578]\d{9}$/.test(this.models.phone)){
				return true;
			}
			return false;
		},
        passwordValid(){
            if(!/^[A-Za-z0-9]{6,12}$/.test(this.models.password)){
                return false;
            }
            return true
        },		
		infoValid(){
            if(!this.phoneValid||!this.passwordValid){
                return false;
            }
            return true;
		},
		user(){
			return this.$store.getters.getUser
		},
	},

}
</script>