<template>
<f7-popup 
id="register-popup" 
v-if="!userLogin" 
@popup:close="resetRegister" 
@popup:opened="openedRegister">
<f7-view>
  <f7-pages >
    <f7-page navbar-fixed class="page-form">
        <f7-navbar class="no-border"> 
            <f7-nav-left>
                <f7-link icon-only close-popup>
                    取消
                </f7-link>
            </f7-nav-left>
        </f7-navbar>
        <transition-group name="fade">    
            <f7-block class="text-center" key="content" >
                <h3 class="tips-content">{{tips}}</h3>
        		<f7-list form class="no-top-border" 
                    :class="{'no-bottom-border':step==2,'step3-container':step==3,'step2-container':step==2}">
                        <div id="phone-info" class="text-center" v-if="step==2">
                            <p>验证码已发送至</p>
                            <h4>{{models.phone|splitPhone}}</h4>
                        </div>
                        <f7-list-item v-if="step==1" >
                            <f7-label class="text-left label-phone">
                                <f7-icon class="iconfont icon-phone"></f7-icon>
                                <span>+86</span>
                            </f7-label>
                            <f7-input 
                                maxlength=11  
                                type="tel" 
                                v-model="models.phone" 
                                id="phone"
                                placeholder="请填写手机号码"
                            />
                            <f7-label class="text-right label-phone-clear" >
                                <f7-link  @click="clearPhone" icon-only>
                                    <f7-icon class="iconfont icon-close"></f7-icon> 
                                </f7-link>
                            </f7-label>
                        </f7-list-item>
                        <f7-list-item v-if="step==2" class="verify-inputs">
                            <input type="tel" maxlength="4" id="verify-code" v-model="models.verifyCode" :class="{'no-font-size':this.$device.ios}">
                            <span>{{models.verifyCode.slice(0,1)}}</span>
                            <span>{{models.verifyCode.slice(1,2)}}</span>
                            <span>{{models.verifyCode.slice(2,3)}}</span>
                            <span>{{models.verifyCode.slice(3,4)}}</span>
                        </f7-list-item>  
                        <f7-list-item v-if="step==3" >
                            <f7-label class="text-left">
                                <f7-icon class="iconfont icon-user"></f7-icon>
                            </f7-label>
                            <f7-input 
                                maxlength=16 
                                type="text" 
                                v-model="models.userName" 
                                :class="{'danger':!userNameValid}"
                                id="userName"
                                placeholder="4-16位中英文数字"
                            />
                        </f7-list-item> 
                        <f7-list-item v-if="step==3" >
                            <f7-label class="text-left">
                                <f7-icon class="iconfont icon-key"></f7-icon>
                            </f7-label>
                            <f7-input 
                                maxlength=12 
                                :type="isPassword?'password':'text'" 
                                v-model="models.password" 
                                id="password"
                                placeholder="6-12位数字或字母"
                            />
                            <f7-label class="text-right label-eye" >
                                <f7-link icon-only @click="showPassword">
                                    <f7-icon class="iconfont icon-eye " :class="{active:!isPassword}"></f7-icon> 
                                </f7-link>
                            </f7-label>                        
                        </f7-list-item>                                                
                        <p class="text-left register-error">
                            {{registerError}}
                        </p>
                </f7-list>
            </f7-block>
    		<f7-block class="fixed-btn-container" key="button" >
    			<button 
                    class="btn btn-xl round border"
    				:class="{disabled:(!phoneValid||countingDown)}"
    				@click="sendVerify"
                    v-if="step==1"
    			>
    			发送验证码
    			</button>
                <button 
                    class="btn btn-xl round border"
                    :class="{disabled:(!verifyValid)}"
                    @click="checkVerify"
                    v-if="step==2"
                >
                下一步
                </button> 
                <button 
                    class="btn btn-xl round btn-gradient"
                    :class="{disabled:(!infoValid)}"
                    @click="completeRegister"
                    v-if="step==3"
                >
                完成
                </button>                        
    		</f7-block>
        </transition-group>
    </f7-page>
  </f7-pages>
</f7-view>
</f7-popup>
</template>
<style lang="less">
    @import url('../assets/less/var.less');
    .fade-enter-active, .fade-leave-active {
      transition: opacity .5s
    }
    .fade-enter, .fade-leave-active {
      opacity: 0;
    }    
    #register-popup{
        background: #fff;
        z-index: 11001; 
        .page-content{
            overflow-y: hidden;
        }
        .fixed-btn-container{
            position: absolute!important;
            width: 100%;
            left:0;
            top:6.3rem;
        }

        .navbar{
            background: inherit;
            color:#000;
            box-shadow: none;
            .close-popup.link{
                font-size: 16px;
                font-weight: bold;
                color: inherit;
            }
        }
        .content-block{
            margin-top: .2rem;
            margin-bottom: 1.89333333rem;
            padding: 0 .85333333rem;
            color: #000;
            position: relative;
            .list-block{
                margin-top: 1rem;
                position: relative;
                &.step3-container{
                    margin-top: .2rem;
                    .item-content{
                        padding: 0;
                        height: 1.65333333rem;
                        font-size: 17px;
                        .label{
                            line-height: 1.65333333rem;
                            height: 1.65333333rem;
                            .iconfont{
                                font-size: 22px;
                                &.active{
                                    color: @sub-color;
                                }
                            }
                            width: auto;
                        }
                        .item-input{
                            padding-left:.26666667rem; 
                            height: 100%;
                            line-height: 1.65333333rem;
                            input{
                                height: 100%;
                                line-height: .53333333rem;                                
                            }
                            &.danger{
                                
                            }
                        }
                    }
                }
                &.step2-container{
                    margin-top: 1.5rem;
                }
            }
            .item-content{
                padding: .29333333rem 0;
                position: relative;
                .item-inner{
                    padding: 0;
                }
                .item-title{
                }
                .item-input{
                    padding-left: .4rem;
                    height: 1.17333333rem;
                    line-height: 1.17333333rem;
                }
                .label-phone{
                    border-right: 1px solid #ddd;
                    width: auto;
                    padding-right: .4rem;
                    font-size: 17px;
                    height: 1.17333333rem;
                    line-height: 1.17333333rem;
                    span{
                        height: 1.17333333rem;
                        line-height: 1.17333333rem; 
                        display: inline-block;
                    }
                    .iconfont{
                        font-size: 22px;
                        vertical-align: middle;
                    }
                }
                .label-phone-clear{
                    width: 1.17333333rem;
                    font-size: 17px;
                    height: 1.17333333rem;
                    line-height: 1.17333333rem;
                    a{
                        color: #000;
                    }
                    .iconfont{
                        font-size: 17px;
                        color: #d6d6d6;
                        vertical-align: middle;
                    }                    
                }
                .label-eye{
                    width: 1.17333333rem;
                    font-size: 17px;
                    height: 1.17333333rem;
                    line-height: 1.17333333rem;
                    a{
                        color: #000;
                    }
                    .iconfont{
                        font-size: 17px!important;
                        color: #d6d6d6;
                        vertical-align: middle;
                    }                    
                }                
                #phone{
                    color:@font-black;                
                    font-size: 17px;    
                    letter-spacing: 1px;  
                    height:  1.17333333rem;            
                }
            }
            .verify-inputs{
                .row{
                    width: 100%;
                }
                .item-content{
                    padding: 0;
                    position: relative;
                    height: 1.65333333rem;
                    .item-inner{
                        justify-content:space-between;
                        span{
                            width: 1.33333333rem;
                            height: 1.33333333rem;
                            line-height: 1.38666667rem;
                            border:1px solid #d6d6d6;
                            font-size: 40px;
                            margin: 0 5px;

                        }
                        #verify-code{
                            position: absolute;
                            right:0;
                            top: 0;
                            height: 1.3333333rem;
                            line-height: 0;
                            font-size: 0.5px;
                            padding-left: -1rem;
                            color: rgba(0,0,0,0);
                            letter-spacing: -10px;
                            &:focus~span{
                                border:1px solid @sub-color;
                            }
                            &.no-font-size{
                                font-size: 0px;
                            }
                        }
                    }
                }
                .verify-input-item{
                    border:1px solid #ccc;
                    width: 1.38666667rem;
                    height: 1.38666667rem;
                    margin: 0 auto;
                    text-align: center;
                    font-size: 40px;
                    line-height: 1.38666667rem;
                }
            }
            .tips-content{
                margin: 0;
                font-size: 23px;
                font-weight: bold;
            }
            .register-error{
                color:@font-danger;
                font-size: 14px;
                margin: 0;
                position: absolute;
                bottom:-.74666667rem;
                line-height:.37333333rem;
                height: .37333333rem;
            }
            #phone-info{
                position: absolute;
                width:100%;
                top:-1.2rem;
                p{
                    color: #d6d6d6;
                    font-size: 14px;
                    margin-bottom: .16rem;
                }
                h4{
                    color: @sub-color;
                    font-weight: normal;
                    letter-spacing: 2px;
                    font-size: 14px;
                }
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
                verifyCode:"",
                userName:"",
                password:"",
            },
            registerError:"",
            countingDown:false,
            buttonLabel:"发送验证码",
            statusStyle:"",
            step:1,
            isPassword:true
		}
	},  
    methods:{
        openedRegister(){
            var self = this;
            this.$store.dispatch("setComConf",{
              isLoginScreenActive:false
            })                
            setTimeout(function(){
                document.getElementById("phone").focus()
            },10)
            this.statusStyle = plus.navigator.getStatusBarStyle()||'dark'
            plus.navigator.setStatusBarStyle('dark');
        },
        showPassword(){
            this.isPassword = !this.isPassword
        },
        sendVerify(){
            var self = this;
            api.getVerifyCode({
                mobile:this.models.phone,
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
        checkVerify(){
            var self = this;
            api.getRegisterVerifyCodeCheck({
                code:self.models.verifyCode,
                mobile:self.models.phone,
            },function(data){
                if(data.code!=2000){
                    self.showErrorMessage(data.msg);
                    self.models.verifyCode = ""
                    return false;
                }
                self.step = 3;
                self.models.userName = "用户"+self.models.phone.slice(0,7);
            })
        },
        inputVerifyItem(e){
            var dom = e.target,
                prev = dom.parentElement.previousElementSibling,
                next = dom.parentElement.nextElementSibling;
            if(e.which == 8){
                if(dom.value == ""&&prev){
                    prev.querySelector("input").focus();
                    return false;
                }
            }
            dom.value = dom.value.slice(0,1)
            if(dom.value !=""&&next){
                next.querySelector("input").focus();
            }           
        },
        completeRegister(){
            var self = this;
            this.$store.dispatch("getRegister",{
                username:self.models.userName,
                password:self.models.password,
                mobile:self.models.phone
            })
            .then(function(data){
                self.$toast.center("注册成功,为您自动登录")
                self.$store.dispatch("setComConf",{
                  isLoginScreenShow:false
                })
                setTimeout(()=>{
                    self.$f7.closeModal("#register-popup");
                    
                },1000)
                let style = this.statusStyle
                plus.navigator.setStatusBarStyle(style);                
            },function(data) {
                console.log(data);
                self.showErrorMessage(data.msg)
            })
        },         
        clearPhone(){
            this.models.phone = "";
            document.getElementById("phone").focus()
        },
        showErrorMessage(msg){
            var self = this;
            this.registerError = msg;
            setTimeout(() => {
                self.registerError = "";
            },3000)
        },
        backStep(){
            this.step = this.step-1
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
       
        resetRegister(){
            this.step = 1;
            this.$store.dispatch("setComConf",{
              isLoginScreenActive:true
            })              
            for(let model in this.models){
                this.models[model] = ""
            }
            let style = this.statusStyle
            plus.navigator.setStatusBarStyle(style);

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
	},
    filters:{
        splitPhone(value){
            var temp = [];
            temp[0] = value.slice(0, 3);
            temp[1] = value.slice(3, 7);
            temp[2] = value.slice(7);
            return temp.join("  ");            
        }
    },
	computed:{
		phoneValid(){
			if(/^1[34578]\d{9}$/.test(this.models.phone)){
				return true;
			}
			return false;
		},
        userLogin(){
            return this.$store.getters.userHasLogin
        },        
        verifyValid(){
            if(this.models.verifyCode.length<4){
                return false;
            }
            return true;
        },
        userNameValid(){
            if(!/^[a-zA-Z0-9\u4e00-\u9fa5]{4,20}$/.test(this.models.userName)||this.strlen(this.models.userName)>20){
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
            if(!this.userNameValid||!this.passwordValid){
                return false;
            }
            return true;
        },
        tips(){
            return {1:"请输入你的手机号码",2:"请输入短信验证码",3:"完善用户信息"}[this.step]
        }
	},
	mounted(){
    
	},
    beforeCreate(){

    }

}
</script>
