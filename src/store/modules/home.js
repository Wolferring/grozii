import * as types from '../types.js'
import api from '../api'
const state = {
    home:Object,
    homeActive:true,
    HomeGuessLike:[]
}

const actions = {
	refreshRecommend({commit}){
        return new Promise((resolve,reject)=>{
            api.getRecommendList(function(data){
                if(data.code!=2000){
                    reject(data)
                    return false;
                }
                commit("homeRecommendRefresh",data.data)
                commit(types.COM_CONF,{
                    hasNewMessage:data.data.message>0
                })                
                resolve(data)
            })
        })
	},
    refreshHomePost({commit},payload){
        return new Promise((resovle,reject)=>{
            api.getHomePostRefresh(payload.query,function(data){
                if(data.code!=2000){
                    reject(data)
                    return false;
                }
                commit("homePostList",data.data)
                resovle(data.data.length)
            })
        })
    },
    getHomeGuessPage({commit},payload){
        return new Promise((resolve,reject)=>{
            api.getHomeGuess(payload.page,function(data){
                if(data.code!=2000){
                    reject(data)
                    return false;
                }
                commit('homeGuess',data.data)
                resolve(data)
            })
        })
    },
    getRecommend({commit},dom){
        return new Promise((resolve,reject)=>{
            api.getRecommendList(function(data){
                if(data.code!=2000){
                    reject(data)
                    return false;
                }
                commit(types.HOME_RECOMMEND_LIST,data)
                commit(types.COM_CONF,{
                    hasNewMessage:data.data.message>0
                })
                resolve(data)
            })
        })
    }
}

const getters = {
	getHomeRecommend:state=>state.home,
    getHomeGuess:state=>state.HomeGuessLike,
    getHomeActive:state=>state.homeActive
}

const mutations = {
    [types.HOME_RECOMMEND_LIST](state,home){
        state.home = home.data
        state.HomeGuessLike.push(home.data.list)
    },
    homeRecommendRefresh(state,home){
        state.home = home
        state.HomeGuessLike = [home.list]
    },
    homeGuess(state,list){
        if(list.share.length>1||list.evaluating.length>1){
            state.HomeGuessLike.push(list)
        }
    },
    homeActive(state,bool){
        state.homeActive = bool
    },
    homePostList(state,list){
        let oldLen = state.home.share.length
        if(list.length<oldLen){
            state.home.share = list.concat(state.home.share.slice(list.length,oldLen))
            return ;
        }
        state.home.share = list
    }
}

export default {
    state,
    actions,
    getters,
    mutations
}
