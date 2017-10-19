<template>
    <f7-login-screen 
    @loginscreen:open="loginOpen" 
    @loginscreen:close="loginClose" 
    v-if="!userLogin" 
    id="login-screen"

    :opened="comConf.isLoginScreenShow">
        <f7-view class="login" name="login" id="login-view">
            <f7-pages>
                <f7-page login-screen overflowbar-hidden >
                    <div @touchmove.stop.prevent>
                        
                    <div class="login-screen-back" >
                        <img src="../assets/images/loginscreen.png" alt="">
                    </div>
                    <f7-block class="login-block">
                        <div class="login-head">
                            <p class="login-title">登录到格物志</p>
                            <f7-link><i class="iconfont icon-close icon-only" @click="closeLoginPop"></i></f7-link>
                        </div>
                        <f7-list form class='login-form'>
                            <f7-list-item>
                                <span><i class="iconfont icon-phone"></i></span>
                                <f7-input name="username" type="tel" v-model.trim="username" @keyup="change($event)" placeholder="请输入手机号"></f7-input>
                            </f7-list-item>
                            <f7-list-item>
                                <span><i class="iconfont icon-key"></i></span>
                                <f7-input id='pwdinput' name="password" :type="pwdtype" v-model.trim="password"  @keyup="changepwd($event)"placeholder="请输入密码" ></f7-input>
                                <span><i class="iconfont icon-eye icon-only" @click="showPwd"  :class="{'':hidePwd , 'icon-eye-show':!hidePwd}"></i></span>
                            </f7-list-item>
                            <f7-list-item class="register-item">
                                <f7-link open-popup="#register-popup">立即注册</f7-link>
                                <f7-link href="/user/resetPassword/" >忘记密码?</f7-link>
                            </f7-list-item>
                        </f7-list>
                        <div class="login-box">
                            <f7-button @click="login" :class="{disaled:!loginFormValid}" class='btn login-btn btn-gradient' :disabled="!loginFormValid">登&nbsp;&nbsp;录</f7-button>
                        </div>
                    </f7-block>
                    <div class="or-box" v-if="authService.length>0">
                        <span class="login-line"></span><span class="login-or">or</span><span class="login-line"></span>
                    </div>
                    <f7-grid>
                        <f7-link v-if="weixin" @click="thirdLogin('weixin')">
                            <div class="third-login login-wx">
                                <i class="iconfont icon-weixin1"></i>
                            </div>
                        </f7-link>
                        <f7-link v-if="sinaweibo" @click="thirdLogin('sinaweibo')">
                            <div class="third-login login-weibo">
                                <i class="iconfont icon-weibo"></i>
                            </div>
                        </f7-link>  
                        <f7-link v-if="qq" @click="thirdLogin('qq')">
                            <div class="third-login login-qq">
                                <i class="iconfont icon-anonymous-iconfont"></i>
                            </div>
                        </f7-link>                                                
                    </f7-grid>
                    <p class="bottom-title">注册即代表你同意<f7-link href="/userAgreement/">《格物志用户协议》</f7-link></p>
                    </div>

                </f7-page>
            </f7-pages>
        </f7-view>
        <keep-alive >
            <register-view></register-view>
        </keep-alive>
    </f7-login-screen>
</template>
<style lang="less">
    @import "../assets/less/var.less";
    .login{
        .login-screen-back{
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            z-index: -2;
            background-color: rgba(0,0,0,.8);
            &:after{
                content: "";
                display: block;
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 10;
                background-color: rgba(0,0,0,.8);

            }
            img{
                width: 100%;
                height: 100%;
                vertical-align: bottom;
            }
        }
        .bottom-title{
            width:100%;
            margin-top: 1rem;
            color:#c9c9c9;
            a{
                color: #c9c9c9;
            }
            font: 0.35135rem;
            text-align: center;
        }
        .login-screen-content{
            .login-block{
                position: relative;
                width:8.78378rem;
                margin-top:1.08108rem!important;
                margin: auto;
                padding: 0.75676rem 1.08108rem 0rem 1.08108rem;
                background-color:#fff;
                border-radius: 0.16216rem;
                item-input{
                    line-height: 1.83784rem;
                }
                input{
                    height: 1.83784rem;
                }
                input::-webkit-input-placeholder{
                    font: 0.37838rem;
                    color:#dfdfdf;
                }
                input::-moz-placeholder{
                    font: 0.37838rem;
                    color:#dfdfdf;
                }
                input::-ms-input-placeholder{
                    font: 0.37838rem;
                    color:#dfdfdf;
                }
                .item-inner{
                    padding-right: 0;
                }
                .login-form{
                    margin: 0 auto;
                }
                .register-item{
                    padding-bottom: 0.67568rem;
                    .item-inner{
                        padding-top: 0.59459rem;
                        padding-bottom: 0.67568rem;
                        a:first-child{
                            color:@sub-color;
                        }
                        a:last-child{
                            color:#bfbfbf;
                        }
                    }
                }
                .login-head{
                    height: 1.10811rem;
                    line-height: 1.10811rem;
                    .login-title{
                        display: inline-block;
                        margin:0;
                        font-size: 0.75676rem;
                        color: #000;
                    }
                    a{
                        float: right;
                        vertical-align: middle;
                        color:#6d6d72;
                    }
                }
                .login-title{
                    font: 0.75676rem;
                    color: #000;
                    margin:0;
                    i{
                        margin-left: 1.62162rem;
                        vertical-align: middle;
                    }
                }
                .login-box{
                    position: absolute;
                    width: 6.86486rem;
                    bottom: -0.67568rem;
                    margin: 0 auto;
                    .login-btn{
                        width: 6.86486rem !important;
                        height: 1.32432rem;
                        margin:0;
                        padding:0;
                        line-height:1.32432rem!important;
                        border-radius:1.32432rem;
                        font-size: 0.48649rem;
                        color: #fff;
                    }
                }
            }
            .or-box{
                position: relative;
                width: 7.37838rem;
                height: 0.54054rem;
                margin:1.66216rem auto 0;
                z-index: -1;
                .login-line{
                    width:3.24324rem;
                    height: 0.02703rem;
                    display: inline-block;
                    background-color:#dfdfdf;
                    float:left;
                }
                .login-line:last-child{
                    float:right;
                }
                .login-or{
                    position: absolute;
                    display: inline-block;
                    top: -0.24324rem;
                    left: 50%;
                    padding:0 0.54054rem;
                    font-size: 0.37838rem;
                    color:#dfdfdf;
                    -webkit-transform: translateX(-50%);
                    -moz-transform: translateX(-50%);
                    -o-transform: translateX(-50%);
                    -ms-transform: translateX(-50%);
                    transform: translateX(-50%);
                    z-index: 10;
                }
            }
            .row{
                max-width: 7.37838rem;
                margin: 0 auto;
                justify-content:space-around;
            }
            .third-login{
                position: relative;
                width: 1.67568rem;
                height: 1.67568rem;
                margin:0.83784rem auto;
                border-radius: 50%;
                background-color: #fff;
                text-align: center;
                i{
                    line-height: 1.67568rem;
                    font-size: 2.6em;
                    color:inherit;
                }
                &.login-wx{
                    color: #35C657;
                }
                &.login-weibo{
                    color: #e6162d;
                }
                &.login-qq{
                    color: #22b9e6;
                }
            }
            .login-form{
                .item-content{
                    padding-left: 0;
                    // width: 6.75676rem;
                    width: 100%;
                    span{
                        padding-right: 0.45946rem;
                    }
                    span:last-child{
                        padding-right: 0;
                    }
                    i{
                        color:#6d6d72;
                    }
                    .icon-eye-show{
                        color:@sub-color;
                    }
                }
            }
        }
    }
</style>
<script>
  import registerView from "./register.vue"
  import htmlPlus from '../config/plusInit.js'
  export default{
    components:{
      registerView
    },
    data(){
      return {
        username:"",
        password:"",
        pwdtype:'password',
        hidePwd:true,
        authService:"",
        statusStyle:"",
        weixin:false,
        sinaweibo:false,
        qq:false
      }
    },
    created:function(){
        var self = this
        htmlPlus.bind(function(){
          self.getAuthService()
        })
    },
    methods:{
        openResetPassword(){
            this.$f7.views.login.router.load({url:'/resetPassword/'})
        },
        loginOpen(){
            this.statusStyle = plus.navigator.getStatusBarStyle()||'dark'
            plus.navigator.setStatusBarStyle('light');
        },
        loginClose(){
            let style = this.statusStyle
            plus.navigator.setStatusBarStyle(style);
        },
        getAuthService(){
            var self = this;
            plus.oauth.getServices(function(services) {
                self.authService = services
                for(let i in services){
                    self[services[i].id] = true
                }
            }, function(e) {
                return null;
            });        
        },
        closeLoginPop(){
            this.username = '';
            this.password = '';
            this.$store.dispatch("setComConf",{
              isLoginScreenShow:false
            })
        },
        showPwd(){
          this.hidePwd = !this.hidePwd
          this.hidePwd ?　this.pwdtype = 'password' : this.pwdtype = 'text';
        },
        login(){
            let user = {
              username:this.username,
              password:this.password
            }
            self = this;
            if((typeof plus != "undefined")){
                plus.nativeUI.showWaiting()
            }
            this.$store.dispatch("getLogin",user).then(function(data){
                self.$toast.center("登录成功")
                plus.nativeUI.closeWaiting()    
                //window.location.reload();
            },function(data){
                self.$toast.center(data.msg||"登录失败,请重试")
                try{
                    plus.nativeUI.closeWaiting()
                }
                catch(e){

                }
                    
            })
                
        },
        thirdLogin(type){
            var service,
                self = this;
            for (var i = 0; i < this.authService.length; i++) {
                if (this.authService[i].id == type) {
                    service = this.authService[i];
                    break;
                }
            }
            if (!service.authResult) {
                service.login(function(e) {
                    self.thirdUserInfo(type);
                }, function(e) {
                    console.log("登录认证失败！");
                });
            }
        },
        thirdUserInfo(type){
            var service,
                self = this;
            for (var i = 0; i < this.authService.length; i++) {
                if (this.authService[i].id == type) {
                    service = this.authService[i];
                    break;
                }
            }
            if (!service.authResult) {
                console.log("未授权登录！");
            } else {
                service.getUserInfo(function(e) {
                    var jsonObj = service;
                    self.thirdDoLogin(jsonObj,type)
                    setTimeout(function(){
                        self.thirdLogout();
                    },100)
                }, function(e) {
                    console.log("获取用户信息失败：" + e.message + " - " + e.code);
                });
            }          
        },
        thirdDoLogin(user,type){
            var self = this;
            var data = {
                type:type,
                user:Object.assign(user.authResult,user.userInfo)
            }
            this.$store.dispatch("getThirdLogin",data).then(function(data){
                if(data.code==2005){
                    self.$store.commit('thirdAuthInfo',data.data)
                    self.$f7.views.login.router.load({
                        url:"/personalBind/",
                    })
                }
            },function(){})
        },
        thirdLogout() {
            for (var i in this.authService) {
                var service = this.authService[i];
                if (service.authResult) {
                    service.logout();
                }
            }
        },    
        change(e){
            this.username = e.target.value.slice(0,11);
        },
        changepwd(e){
            this.password = e.target.value.slice(0,12);
        },
    },
    computed:{
        comConf(){
            return this.$store.getters.getComConf
        },
        phoneValid(){
            if(/^1[34578]\d{9}$/.test(this.username)){
                return true;
            }
            return false;
        },        
        userLogin(){
            return this.$store.getters.userHasLogin
        },
        passwordValid(){
            if(!/^[A-Za-z0-9]{6,12}$/.test(this.password)){
                return false;
            }
            return true
        },        
        loginFormValid(){
            return this.passwordValid&&this.phoneValid
        }
    },
  }
</script>
