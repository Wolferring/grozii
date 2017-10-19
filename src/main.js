// Import Vue
import Vue from "vue";
// Import F7
import Framework7 from "framework7";

// Import F7 Vue Plugin
import Framework7Vue from "framework7-vue";

// Import F7 iOS Theme Styles
import Framework7Theme from "framework7/dist/css/framework7.ios.min.css";
import Framework7ThemeColors from "framework7/dist/css/framework7.ios.colors.min.css";
/* OR for Material Theme:
import Framework7Theme from 'framework7/dist/css/framework7.material.min.css'
import Framework7ThemeColors from 'framework7/dist/css/framework7.material.colors.min.css'
*/

// Import Routes
import Routes from "./routes.js";

// Import App Component
import App from "./app.vue";

import "./config/index.js";
import conf from "./config/config.js";
//5+初始化
import htmlPlus from "./config/plusInit.js";

//vuex
import store from "./store/";

//推送处理

//自定义工具方法
import tool from  './assets/js/tool.js'
Vue.prototype.tool = tool.tool
import "vue2-toast/lib/toast.css";
import Toast from "vue2-toast";
import VueTimeago from 'vue-timeago';
// Init F7 Vue Plugin
Vue.use(Framework7Vue);
Vue.use(Toast);
Vue.use(VueTimeago,{
  name:'timeago',
  locale:'zh-CN',
  locales:{
    'zh-CN':require('vue-timeago/locales/zh-CN.json')
  }
})
// import VueScroll from "vue-scroll";
// Vue.use(VueScroll);

// 自定义样式
import "./assets/less/style.less";

// Init App
var root = new Vue({
  template: "<app/>",
  store,
  // Init Framework7 by passing parametb v bn ers here
  framework7: {
    root: "#app",
    /* Uncomment to enable Material theme: */
    // material: true,
    showBarsOnPageScrollEnd: false,
    swipeBackPageActiveArea:100,
    scrollTopOnStatusbarClick:true,
    routes: Routes
  },
  // Register App Component
  components: {
    app: App
  },
  beforeCreate() {
    var self = this;
    htmlPlus.init(self);
  },
  created(){
 
  }
});
if (conf.env.browser) {
  root.$mount("#app");
} else {
  root.$mount("#app");
  htmlPlus.bind(function() {
    let needGuide = plus.storage.getItem("launchFlag")=="true"?false:true
    store.commit("COM_CONF",{
      needGuide:needGuide
    }) 
    if(needGuide){
      setTimeout(()=>{
        plus.navigator.closeSplashscreen()
      },500)
    }else{
        plus.navigator.closeSplashscreen()
    }
    plus.navigator.setStatusBarStyle('light');
    plus.nativeUI.closeWaiting()
  });
}
