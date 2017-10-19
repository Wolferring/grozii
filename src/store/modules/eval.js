import * as types from '../types.js'
import api from '../api'
import storage from '../../assets/js/storage.js'
const state = {
    types:[],
    list:Object,
}

const actions = {
    getEvalTypes({commit}){
        return new Promise((resolve,reject)=>{
            api.getEvalTypeList(function(data){
                if(data.code!=2000){
                    reject(data)
                    return false;
                }
                let type = data.data;
                for(let i in type){
                    type[i] = Object.assign(type[i],{query:{
                        page:2,
                        limit:6,
                        sort:1,
                        more:true,
                        type:type[i].id,
                        filter:"all",
                        tags:[]
                    }})
                }
                resolve(data)
                commit(types.EVAL_TYPE,type)
            })
        })
    },
    getEvalList({commit},payload){
        return new Promise((resolve,reject)=>{
            api.getArticleList(payload,function(data){
                if(data.code!=2000){
                    reject(data)
                    return false;
                }
                commit("evalCateList",{data:data.data,type:payload.type})
                resolve(data.data)
            })
        })
    },
    getFreshEvalList({commit},payload){
        return new Promise((resolve,reject)=>{
            api.getArticleList(payload,function(data){
                if(data.code!=2000){
                    reject(data)
                    return false;
                }
                commit("evalFreshCateList",{data:data.data,type:payload.type})
                resolve(data.data)
            })
        })
    },
    getEvalFirstList({commit},payload){
        let query = {
            limit:6,
        }
        return new Promise((resolve,reject)=>{
            api.getArticleFirstList(query,function(data){
                let result = data.data
                if(data.code==2000){
                    resolve(data)
                    commit(types.EVAL_LIST,result)
                }
            })
        })
    },
    deleteEval({commit},payload){
        return new Promise((resolve,reject)=>{
            api.getArticleDelete(payload,(data)=>{
                let result = data.data
                if(data.code!=2000){
                    reject(data)
                    return false;
                }
                resolve(data)
            })
        })
    }
}

const getters = {
    getEvalTypes:state=>state.types,
    getEvalList:state=>state.list
}

const mutations = {
    [types.EVAL_LIST](state,list){
        console.log(list)
        state.list = list;
    },
    [types.EVAL_TYPE](state,types){
        state.types = types
    },
    evalPageQuery(state,payload){
        state.types[payload.id]['query'] = Object.assign(state.types[payload.id]['query'],payload.query)
    },
    evalCateList(state,data){
        let current = state.list[data.type].list
        state.list[data.type].list = current.concat(data.data.list)
    },
    evalFreshCateList(state,data){
        let current = state.list[data.type].list
        state.list[data.type].list = data.data.list
    },
    evalListRefresh(state,data){
        state.list[data.cate_id].list = data.list
    },
    clearEvalList(state,id){
        let type = state.types[id]['query']['type']
        console.log()
        state.list[type].list = []
    }
}

export default {
    state,
    actions,
    getters,
    mutations
}
