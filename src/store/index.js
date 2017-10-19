import Vue from 'vue'
import Vuex from 'vuex'
import com from './modules/com.js'
import home from './modules/home.js'
import user from './modules/user.js'
import article from './modules/article.js'
import post from './modules/post.js'
import search from './modules/search.js'
import news from './modules/news.js'
import comment from './modules/comment.js'
import evaluating from './modules/eval.js'
import personal from './modules/personal.js'
Vue.use(Vuex)
const store = new Vuex.Store({
    modules:{
    	com,
    	home,
    	user,
    	article,
    	post,
    	search,
        evaluating,
        news,
        comment,
        personal
    },
    strict:process.env.NODE_ENV !== 'production'
})

export default store;
