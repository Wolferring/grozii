import * as types from '../types.js'
import api from '../api'
import storage from '../../assets/js/storage.js'
const state = {
    newsList:{
        1:[],
        2:[],
        3:[],
        4:[]
    },
    newsMessage:[],
    newMessageSet:Object
}

const actions = {
    getNewsList({commit},id){
        return new Promise((resolve,reject)=>{
            api.getNewsList({type:id},function(data){
                if(data.code !=2000){
                    reject(data)
                    return false;
                }
                commit("setNewsList",{data:data.data.list,id:id})
                commit("newMessageSet",data.data.unread)
                resolve(data)
            })
        })
    },
    getNewsMessage({commit},id){
        return new Promise((resolve,reject)=>{
            api.getNewsMessage(id,function(data){
                if(data.code != 2000){
                    reject(data)
                    return false;
                }
                commit('setNewsMessage',{data:data.data.list,id:id})
                resolve(data)
            })
        })
    },
    replyMessage({commit},data){
        return new Promise((resolve,reject)=>{
            api.replyMessage(data,function(data){
                if(data.code != 2000){
                    reject(data)
                    return false;
                }
                commit('replyNewMessage',data)
                resolve(data)
            })
        })
    }
}

const getters = {
    getMessageList:state=>state.newsList,
    getNewMessageSet:state=>state.newMessageSet,
    newsMessage:state=>state.newsMessage
}

const mutations = {
    setNewsList(state,newsList){
        state.newsList[newsList.id] = newsList.data;
    },
    setNewsMessage(state,newsMessage){
        state.newsMessage = newsMessage.data;
    },
    replyNewMessage(state,replyInfo){
        state.replyInfo = replyInfo;
    },
    newMessageSet(state,set){
        state.newMessageSet = set;
    },
}

export default {
    state,
    actions,
    getters,
    mutations
}
