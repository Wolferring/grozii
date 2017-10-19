    <template>
      <!-- App -->
      <div id="app">
        <f7-views tabs>
          <f7-view 
          tab 
          active 
          id="tab-home"
          class="with-subnavbar"
          :dynamic-navbar="true"
          @tab:show="homeTabShow('tab-home')"
          @tab:hide="homeTabHide('tab-home')"          
          >
            <!-- Pages -->
            <f7-navbar class="no-border" :class="{'top':isScrollTop}">
                <f7-nav-left>
                  </f7-nav-left>
                  <f7-nav-center>
                  <transition name="fade">
                    <f7-link href="/search/" v-if="comConf.homeNavShow">
                      <div class="navbar-search">
                        <label for="#">
                          <i class="iconfont icon-Index_search_display"></i>
                        </label>
                        搜索你感兴趣的内容
                      </div>
                    </f7-link>
                  </transition>
                  </f7-nav-center>
                  <f7-nav-right>
                  <transition name="fade">
                      <f7-link color="black" icon-only href="/news/" v-if="comConf.homeNavShow">
                          <i class="iconfont icon-index_notice" :class="{notify:comConf.hasNewMessage}">

                          </i>
                      </f7-link>
                  </transition> 
                  </f7-nav-right>
            </f7-navbar>
            <f7-pages>
                <home-view :scrolled="homeScrollTop">
                  
                </home-view>
            </f7-pages>
          </f7-view>


          <f7-view 
          tab 
          id="tab-post" 
          class="with-subnavbar"
          
          @tab:show="homeTabShow('tab-post')"
          @tab:hide="homeTabHide('tab-post')"
          :dynamic-navbar="true"
          sliding
          >
            <f7-navbar class="no-border">
                  <f7-nav-left>
                  </f7-nav-left>
                  <f7-nav-center>
                    <f7-link href="/search/">
                      <div class="navbar-search">
                        <label for="#">
                          <i class="iconfont icon-Index_search_display"></i>
                        </label>
                        搜索你感兴趣的内容
                      </div>
                    </f7-link>
                  </f7-nav-center>
                  <f7-nav-right>
                      <f7-link color="black" icon-only href="/news/">
                          <i class="iconfont icon-index_notice" :class="{notify:comConf.hasNewMessage}">

                          </i>
                      </f7-link>
                  </f7-nav-right>
            </f7-navbar>          
            <f7-pages>
              <post-view>
                
              </post-view> 
            </f7-pages>
          </f7-view> 


          <f7-view 
          tab 
          id="tab-eval" 
          class="with-subnavbar"
          @tab:show="homeTabShow('tab-eval')"
          @tab:hide="homeTabHide('tab-eval')"
          :dynamic-navbar="true"
          sliding
          >        
            <f7-navbar class="no-border">
                  <f7-nav-left>
                  </f7-nav-left>
                  <f7-nav-center>
                    <f7-link href="/search/">
                      <div class="navbar-search">
                        <label for="#">
                          <i class="iconfont icon-Index_search_display"></i>
                        </label>
                        搜索你感兴趣的内容
                      </div>
                    </f7-link>
                  </f7-nav-center>
                  <f7-nav-right>
                      <f7-link color="black" icon-only href="/news/">
                          <i class="iconfont icon-index_notice" :class="{notify:comConf.hasNewMessage}">

                          </i>
                      </f7-link>
                  </f7-nav-right>
            </f7-navbar>             
            <f7-pages>
              <evaluating-view>

              </evaluating-view>  
            </f7-pages>
          </f7-view> 


          <f7-view 
          tab 
          id="tab-user"
          :dynamic-navbar="true"
          sliding
          @tab:show="homeTabShow('tab-user')"
          @tab:hide="homeTabHide('tab-user')"
          >
            <f7-navbar class="no-border navbar-hidden">
                  <f7-nav-left>
                  </f7-nav-left>
                  <f7-nav-center>
                    
                  </f7-nav-center>
                  <f7-nav-right>

                  </f7-nav-right>
            </f7-navbar>          
            <f7-pages>
              <user-view>
                
              </user-view> 
            </f7-pages>
          </f7-view>                     

        
        </f7-views>

  <login-screen v-if="!user.hasLogin">

  </login-screen>
  <register-view v-if="!user.hasLogin"></register-view>
<f7-popup 
id="launch-popup"
v-if="comConf.needGuide"
opened
>
<f7-swiper class="guide-banner">
  <f7-swiper-slide>
      <button class="btn btn-sm round guide-close-btn" @click="closeGuide">跳过</button>
      <img src="./assets/images/guide-1.jpg">
  </f7-swiper-slide>
  <f7-swiper-slide>
      <button class="btn btn-sm round guide-close-btn" @click="closeGuide">跳过</button>
      <img src="./assets/images/guide-2.jpg">
  </f7-swiper-slide>
  <f7-swiper-slide>
      <img src="./assets/images/guide-3.jpg">
      <div class="text-center guide-close">
          <button class="btn btn-lg round" @click="closeGuide">进入格物志</button>
      </div>
  </f7-swiper-slide>    
</f7-swiper>
</f7-popup>  

</div>
</template>
<style lang="less" scoped>
    #tab-user{
        background: #f5f5f5;
        padding-top: 0;
    }
    #launch-popup{
      .guide-banner{
        width: 100%;
        height: 100%;
        overflow: hidden;
        img{
          width: 100%;
          height: 100%;
        }
        .guide-close-btn{
            position: absolute;
            z-index: 100;
            right: .53333333rem;
            top: .53333333rem;
            background-color: initial;
            border:.5px solid #fff;
            font-size: 12px;
            padding: 2px 15px;
        }
        .guide-close{
          position: absolute;
          width: 100%;
          z-index: 100;
          top: 50%;
          margin-top: -40px;
          .btn{
            background-color: rgba(0,0,0,.7);
            font-size: 15px;
            padding: 10px 1.2rem;
            border:1px solid #fff;
            font-weight: bold;
            letter-spacing: 2px;
          }
        }
      }
    }
    .btn-sendPost{
        position: absolute;
        width: 100%;
        top: 6px;
        transform-origin:center;
        display: block!important;
        padding:0!important;
        text-align: center;
        img{
            margin:0 auto;
        }
        &.active-state{
            opacity: .6;
        }
    }
</style>
<script>
  import homeView from './pages/homeView'
  import loginScreen from './pages/login'
  import userView from './pages/userView'
  import storage from './assets/js/storage.js'
  import postView from './pages/postView'
  import registerView from "./pages/register.vue"
  import evaluatingView from './pages/evaluatingView.vue'
  export default {
    data(){
      return {
        activeTab:"tab-home",
        homeScrollTop:0,
        tabState:{
            home:0,
            user:0,
            post:0,
            eval:0
        }
      }
    },
    beforeCreate(){
      document.documentElement.classList.remove('with-statusbar-overlay')
    },
    created(){
      this.initData();
    },
    mounted(){
      var self = this;
      this.$$("#tab-home #homeView .page-content").on('scroll', function(event) {
        self.homeScrollTop = self.$$(this).scrollTop()
        if(!self.comConf.homeNavShow){
          self.$store.commit("COM_CONF",{
            homeNavShow:true
          })
        }
        plus.navigator.setStatusBarStyle(self.homeScrollTop>200?"dark":'light');

      });
    },
    methods:{
        initData(){
          //获取用户信息，判断token过期
          //获取token
          var self = this;
          let token = storage.get("auth_token");
          if(token){
            this.$store.commit("AUTH_TOKEN",token)
          }
          //加载用户信息
          var userInfo = storage.get("userInfo");
          if(userInfo){
              this.$store.commit("USER_INFO",userInfo)
              this.$store.commit("hasLogin",true)
          }
          //加载文章分类
          this.$store.dispatch("getPostTypes")
          this.$store.dispatch("getEvalTypes")          
        },
        closeGuide(){
            this.$f7.closeModal("#launch-popup")
            plus.storage.setItem("launchFlag","true")
        },
        homeTabHide(tab){
            switch(tab){
              case "tab-find":
                    break;
              case "tab-user":
                  this.$store.commit("COM_CONF",{
                      narbarShadow:true
                  })
                  break;
              case "tab-eval":
              case "tab-post":
                    this.$store.commit("COM_CONF",{
                        narbarShadow:true
                    })
                    break;
              case "tab-home":
              default:
                  break;
            }
        },
        homeTabShow(tab){
            var self = this
            this.activeTab = tab;
            switch(this.activeTab){
              case "tab-user":
                  this.tabState.user ++;
                  if(this.tabState.user==1&&this.user.hasLogin){
                      this.$store.dispatch("getUserInfo")
                  }
                  plus.navigator.setStatusBarStyle('light');
                  break;
              case "tab-post":
                    this.tabState.post ++;
                    if(this.tabState.post==1){
                        this.$store.dispatch("getPostFirstList")
                        .then(data=>{
                          this.$f7.initPullToRefresh("#postView .page-content")
                          this.$f7.attachInfiniteScroll("#postView .page-content")
                        })
                    }
                    this.$store.commit("COM_CONF",{
                        narbarShadow:false
                    })
                    plus.navigator.setStatusBarStyle('dark');
                  break;
              case "tab-eval":
                    this.tabState.eval ++;
                    if(this.tabState.eval==1){
                        this.$store.dispatch("getEvalFirstList")
                        .then(data=>{
                          this.$f7.initPullToRefresh("#evalView .page-content")
                          this.$f7.attachInfiniteScroll("#evalView .page-content")
                        })
                    }
                    this.$store.commit("COM_CONF",{
                        narbarShadow:false
                    })
                    plus.navigator.setStatusBarStyle('dark');
                  break;
              case "tab-home":
                  plus.navigator.setStatusBarStyle(self.homeScrollTop>200?'dark':'light');
                  break;
              default:
                  break;
            }
        },
        openPostCreate(){
            var self = this;
            if(this.$store.getters.userHasLogin){
              var create = plus.webview.create("/createPost.html","create",{
                  "kernel":"UIWebview",
              },{
                token:localStorage.auth_token
              })
              create.show("slide-in-right");
            }else{
              self.$store.commit("COM_CONF",{
                isLoginScreenShow:true,
              })
            }          
        }
    },
    computed:{
        comConf(){
            return this.$store.getters.getComConf
        },
        isScrollTop(){
          return this.homeScrollTop>200?false:true
        },
        user(){
            return this.$store.getters.getUser
        },
    },
    components:{
      homeView,
      loginScreen,
      userView,
      postView,
      registerView,
      evaluatingView
    }
  }
  </script>
