import axios from 'axios'
import config from '../config/config'
import storage from '../assets/js/storage.js'
import store from './index.js'

var network = navigator.onLine;
try{
    network = plus.networkinfo.getCurrentType()
}catch(e){}
if(typeof plus =="undefined"){
    window.addEventListener("online",function(){
        network = true
        store.commit('COM_CONF',{
            online:true
        })
    },true)
    window.addEventListener("offline",function(){
        network = false
        store.commit('COM_CONF',{
            online:false
        })
    },true)
}

document.addEventListener("netchange",function(){
    const  CURRENT_NET = plus.networkinfo.getCurrentType()
    switch (CURRENT_NET){
        case plus.networkinfo.CONNECTION_ETHERNET:
        case plus.networkinfo.CONNECTION_WIFI:
        case plus.networkinfo.CONNECTION_CELL2G:
        case plus.networkinfo.CONNECTION_CELL3G:
        case plus.networkinfo.CONNECTION_CELL4G:
            network = true
            store.commit('COM_CONF',{
                online:true
            })
            break;
        default:
            network = false
            store.commit('COM_CONF',{
                online:false
            })
            break;
    }
}, false );

var url = process.env.NODE_ENV != 'production' ? config.host.dev : config.host.prod;


var asyncGet = (options,cb) => {
    //判断是否离线
    if(!network){
        console.log(options.url+"，调用离线数据 [asyncGet]")
        let result = storage.get(options.url)
        cb(result||{code:5000})
        return false;
    }
    var options = Object.assign(options,{
        headers:{
            Authorization:store.getters.authToken
        },
        timeout:10000
    })
    axios(options)
    .then((res) => {
        // 数据回来以后判断请求状态
        if(res.status >= 200 && res.status <305){
            //判断请求是否需要缓存
            if(options.cache&&res.data&&res.data.code==2000){
                if(res.data.data instanceof Array){
                    if(res.data.data.length<=0){
                        cb(res.data)
                        return false;
                    }
                }
                console.log(options.url+" 该接口需要缓存[asyncGet]")
                storage.set(options.url,JSON.stringify(res.data))
            }
            if(res.data&&res.data.code==4002){
                store.dispatch("getLogout")
            }
            cb(res.data)
        }
    })
    .catch((error)=>{
        let result = storage.get(options.url)
        cb(result||error)
        return Promise.reject(error);
    })
}
export default {
    userTest:(cb) => {
        asyncGet({
            url:url+"/v1/user/test",
            method:"GET",
            cache:true
        },cb)
    },
    getUserInfo:(cb) => {
        asyncGet({
            url:url+"/v1/user/account",
            method:"GET",
            cache:true
        },cb)
    },
    userLogin:(data,cb) =>{
        asyncGet({
            url:url+"/v1/user/login",
            method:"POST",
            data:data,
            cache:false
        },cb)
    },
    userLogout:(data,cb) =>{
        asyncGet({
            url:url+"/v1/user/logout",
            method:"POST",
            data:data,
            cache:false
        },cb)
    },
    userThirdLogin:(data,cb)=>{
        asyncGet({
            url:url+"/v1/user/third-login",
            method:"POST",
            data:data,
            cache:false
        },cb)
    },
    userBindAuthInfo:(data,cb)=>{
        asyncGet({
            url:url+"/v1/user/bind",
            method:"POST",
            data:data,
            cache:false
        },cb)
    },
    userRegister:(data,cb) => {
        asyncGet({
            url:url+"/v1/user/register",
            method:"POST",
            data:data,
            cache:false
        },cb)
    },
    getVerifyCode:(data,cb)=>{
        asyncGet({
            url:url+"/v1/user/send-sms",
            method:"GET",
            params:data,
            cache:false
        },cb)
    },
    getRegisterVerifyCodeCheck:(data,cb)=>{
        asyncGet({
            url:url+"/v1/user/verify-sms",
            method:"GET",
            params:data,
            cache:false
        },cb)
    },
    //reset password
    resetPassword:(data,cb) => {
        asyncGet({
            url:url+"/v1/user/reset-pwd",
            method:"POST",
            data:data,
            cache:false
        },cb)
    },
    //评测接口
    getArticleDetail:(pid,cb) => {
        asyncGet({
            url:url+"/v1/post/"+pid,
            method:"GET",
            cache:false
        },cb)
    },
    getArticleList:(data,cb)=>{
        asyncGet({
            url:url+"/v1/post",
            params:data,
            method:"GET",
            cache:true
        },cb)
    },
    getFeedList:(data,cb)=>{
        asyncGet({
            url:url+"/v1/feed/index",
            params:data,
            method:"GET",
            cache:true
        },cb)
    },
    //feed详情
    getFeedDetail:(pid,cb) => {
        asyncGet({
            url:url+"/v1/feed/"+pid,
            method:"GET",
            cache:false
        },cb)
    },
    //获取晒物列表首屏数据
    getArticleFirstList:(data,cb)=>{
        asyncGet({
            url:url+"/v1/post/all",
            params:data,
            method:"GET",
            cache:true
        },cb)
    },
    getFeedFirstList:(data,cb)=>{
        asyncGet({
            url:url+"/v1/feed/all",
            params:data,
            method:"GET",
            cache:true
        },cb)
    },
    //获取晒物,评测分类
    getFeedTypeList:(cb)=>{
        asyncGet({
            url:url+"/v1/feed/cate",
            method:"GET",
            cache:true
        },cb)
    },
    getEvalTypeList:(cb)=>{
        asyncGet({
            url:url+"/v1/post/type",
            method:"GET",
            cache:true
        },cb)
    },

    //收藏
    getArticleCollect:(data,cb)=>{
        asyncGet({
            url:url+"/v1/post/collect",
            method:"GET",
            params:data,
            cache:false
        },cb)
    },
    getFeedCollect:(data,cb)=>{
        asyncGet({
            url:url+"/v1/feed/collect",
            method:"GET",
            params:data,
            cache:false
        },cb)
    },
    //取消收藏
    getArticleCancelCollect:(data,cb)=>{
        asyncGet({
            url:url+"/v1/post/cancel-collect",
            method:"GET",
            params:data,
            cache:false
        },cb)
    },
    //赞
    getArticleLike:(data,cb)=>{
        asyncGet({
            url:url+"/v1/post/digg",
            method:"GET",
            params:data,
            cache:false
        },cb)
    },
    getFeedLike:(data,cb)=>{
        asyncGet({
            url:url+"/v1/feed/digg",
            method:"GET",
            params:data,
            cache:false
        },cb)
    },
    getArticleCancelLike:(data,cb)=>{
        asyncGet({
            url:url+"/v1/post/cancel-digg",
            method:"GET",
            params:data,
            cache:false
        },cb)
    },
    //删除文章
    getArticleDelete:(data,cb)=>{
        asyncGet({
            url:url+"/v1/post",
            method:"DELETE",
            data:data,
            cache:false
        },cb)
    },
    getFeedDelete:(data,cb)=>{
        asyncGet({
            url:url+"/v1/feed",
            method:"DELETE",
            data:data,
            cache:false
        },cb)
    },

    //首页
    getRecommendList:(cb)=>{
        asyncGet({
            url:url+"/v1/site/dashboard",
            method:"GET",
            cache:true
        },cb)
    },
    getHomePostRefresh:(payload,cb)=>{
        asyncGet({
            url:url+"/v1/site/page-share",
            method:"GET",
            params:payload,
            cache:true
        },cb)
    },
    getHomeGuess:(payload,cb)=>{
        asyncGet({
            url:url+"/v1/site/page-load",
            method:"GET",
            params:payload,
            cache:false
        },cb)
    },
    //用户反馈
    postUserAdvice:(payload,cb)=>{
        asyncGet({
            url:url+"/v1/site/suggest",
            method:"POST",
            data:payload,
            cache:false
        },cb)
    },
    //搜索接口
    getSearchHistory:(cb)=>{
        asyncGet({
            url:url+"/v1/search/history",
            method:"GET",
            cache:true
        },cb)
    },
    getSearchHistoryClear:(cb)=>{
        asyncGet({
            url:url+"/v1/search/clear",
            method:"GET",
            cache:false
        },cb)
    },
    getSearchHot:(cb)=>{
        asyncGet({
            url:url+"/v1/search/index",
            method:"GET",
            cache:true
        },cb)
    },
    getSearchResult:(query,cb)=>{
        asyncGet({
            url:url+"/v1/search/search",
            method:"GET",
            params:query,
            cache:true
        },cb)
    },
    //消息接口
    getNewsList:(id,cb)=>{
        asyncGet({
            url:url+"/v1/message",
            method:'GET',
            params:id,
            cache:false
        },cb)
    },
    getNewsMessage:(id,cb)=>{
        asyncGet({
            url:url+"/v1/message/"+id,
            method:'GET',
            // params:id,
            cache:true
        },cb)
    },
    replyMessage:(data,cb)=>{
        asyncGet({
            url:url+"/v1/message/reply",
            method:'POST',
            params:data,
            cache:false
        },cb)
    },
    //好文评论列表接口
    evalCommonList:(data,cb)=>{
        asyncGet({
            url:url+"/v1/comment",
            method:'GET',
            params:data,
            cache:false
        },cb)
    },
    //晒物评论列表接口
    postCommonList:(data,cb)=>{
        asyncGet({
            url:url+"/v1/comment/feed-index",
            method:'GET',
            params:data,
            cache:false
        },cb)
    },
    //好文评论点赞
    evalCommonDigg:(data,cb)=>{
        asyncGet({
            url:url+"/v1/feed/comment-digg",
            method:'GET',
            params:data,
            cache:true
        },cb)
    },
    //晒物评论点赞
    postCommonDigg:(data,cb)=>{
        asyncGet({
            url:url+"/v1/post/comment-digg",
            method:'GET',
            params:data,
            cache:true
        },cb)
    },
    replyComments:(data,cb)=>{
        asyncGet({
            url:url+"/v1/post/reply",
            method:'POST',
            data:data,
            cache:true
        },cb)
    },
    //回复晒物评论
    replyPostComments:(data,cb)=>{
        asyncGet({
            url:url+"/v1/feed/reply",
            method:'POST',
            data:data,
            cache:true
        },cb)
    },
    // 我的收藏/发布的好文/晒物
    myposts:(data,cb)=>{
        asyncGet({
            url:url+"/v1/account/my-posts",
            method:'GET',
            cache:true
        },cb)
    },
    myFeeds:(data,cb)=>{
        asyncGet({
            url:url+"/v1/account/my-feeds",
            method:'GET',
            cache:true
        },cb)
    },
    myCollPost:(data,cb)=>{
        asyncGet({
            url:url+"/v1/account/my-col-posts",
            method:'GET',
            cache:true
        },cb)
    },
    myCollFeeds:(data,cb)=>{
        asyncGet({
            url:url+"/v1/account/my-col-feeds",
            method:'GET',
            cache:true
        },cb)
    },
    //用户好文/晒物列表
    userposts:(data,cb)=>{
        asyncGet({
            url:url+"/v1/user/posts",
            method:'GET',
            params:data,
            cache:true
        },cb)
    },
    userFeeds:(data,cb)=>{
        asyncGet({
            url:url+"/v1/user/feeds",
            method:'GET',
            params:data,
            cache:true
        },cb)
    },
    //关注/粉丝 列表
    getFollowerInfo:(cb)=>{
        asyncGet({
            url:url+"/v1/account/follows?type=0",
            method:'GET',
            cache:true
        },cb)
    },
    getFollowingInfo:(cb)=>{
        asyncGet({
            url:url+"/v1/account/follows?type=1",
            method:'GET',
            cache:true
        },cb)
    },
    //获取他人个人信息
    getOtherInfo:(data,cb)=>{
        asyncGet({
            url:url+"/v1/user/profile",
            method:'GET',
            params:data,
            cache:true
        },cb)
    },
    //关注/取关用户
    followUser:(data,cb)=>{
        asyncGet({
            url:url+"/v1/account/follow",
            method:'GET',
            params:data,
            cache:false
        },cb)
    },
    //修改用户资料
    changeMyInfo:(data,cb)=>{
        asyncGet({
            url:url+"/v1/account/setting",
            method:'POST',
            data:data,
            cache:false
        },cb)
    },
    //获取最新版本
    getNewestVer:(data,cb)=>{
        asyncGet({
            url:url+"/v1/app/newest-version",
            method:'Get',
            params:data,
            cache:false
        },cb)
    },
    //修改用户头像
    changeMyAvatar:(data,cb)=>{
        asyncGet({
            url:url+"/v1/account/setting",
            method:'POST',
            'Content-Type': 'multipart/form-data',
            data:data,
            cache:false
        },cb)
    },
    //检查更新
    checkAppUpdate:(data,cb)=>{
        asyncGet({
            url:url+"/v1/app/check-newest",
            method:'GET',
            params:data,
            cache:false
        },cb)
    },
    userFollowInfo:(data,cb)=>{
        asyncGet({
            url:url+"/v1/account/user-follows",
            method:'GET',
            params:data,
            cache:false
        },cb)
    },
}
