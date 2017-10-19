import * as types from '../types.js'
import api from '../api'
import storage from '../../assets/js/storage.js'
const state = {
    hot:[],
    history:[],
    result:{
        share:[],
        all:[],
        evaluating:[],
        user:[]
    }
}

const actions = {
    getSearchHotList({commit}){
        return new Promise((resolve,reject)=>{
            api.getSearchHot(function(data){
                if(data.code!=2000){
                    reject(data)
                    return false;
                }
                commit(types.SEARCH_HOT_LIST,data.data)
                resolve(data.data)
            })            
        })
    },
    getSearchHistory({commit}){
        return new Promise((resolve,reject)=>{
            api.getSearchHistory(function(data){
                if(data.code!=2000){
                    reject(data)
                    return false;
                }
                commit(types.SEARCH_HISTORY,data.data)
                resolve(data.data)
            })            
        })
    },  
    getSearchResult({commit},payload){
        return new Promise((resolve,reject)=>{
            api.getSearchResult(payload,function(data){
                if(data.code!=2000){
                    reject(data)
                    return false;
                }
                if(data.data.all.evaluating.length<1&&data.data.all.share.length<1){
                    reject(data)
                    return false;
                }
                commit('searchResult',data.data)
                resolve(data.data)
            })            
        })
    },
    getSearchMore({commit},payload){
        return new Promise((resolve,reject)=>{
            api.getSearchResult(payload,function(data){
                if(data.code!=2000){
                    reject(data)
                    return false;
                }
                commit('searchMoreResult',data.data)
                resolve(data.data)
            })            
        })        
    },
    getSearchHistoryClear({commit},payload){
        return new Promise((resolve,reject)=>{
            api.getSearchHistoryClear(data=>{
                if(data.code!=2000){
                    reject(data)
                    return false;
                }                
                commit(types.SEARCH_HISTORY,[])
                resolve(data)
            })
        })
    }        
}

const getters = {
    getSearchHotList:state=>state.hot,
    getSearchHistory:state=>state.history,
    getSearchResult:state=>state.result
}

const mutations = {
    [types.SEARCH_HOT_LIST](state,list){
        state.hot = list;
    },
    [types.SEARCH_HISTORY](state,list){
        state.history = list;
    },   
    searchResult(state,result){
        state.result['share'] = result.share
        state.result['evaluating'] = result.evaluating
        state.result['all'] = [result.all]
        state.result['user'] = result.user
    },
    searchMoreResult(state,result){
        for(let i in result){
            if(state.result[i]){
                if(i=='all'){
                    if(result[i].share.length&&result[i].evaluating.length){
                        state.result[i].push(result[i])
                    }
                    return false
                }
                if(result[i].length){
                    state.result[i] = state.result[i].concat(result[i])
                }
            }
        }
    },
    clearSearchResult(state,result){
        state.result = {
            share:[],
            all:[],
            evaluating:[],
            user:[]
        }
    }
    
}

export default {
    state,
    actions,
    getters,
    mutations
}