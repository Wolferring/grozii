import * as types from '../types.js'
import api from '../api'
import storage from '../../assets/js/storage.js'
const state = {
    types:[],
    list:Object,
}

const actions = {
    getPostList({commit},payload){
        return new Promise((resolve,reject)=>{
            api.getFeedList(payload,function(data){
                if(data.code!=2000){
                    reject(data)
                    return false;
                }
                data.data['cate_id'] = payload.tag_id
                commit("postCateList",data.data)
                resolve(data.data)
            })
        })
    },
    getFreshPostList({commit},payload){
        return new Promise((resolve,reject)=>{
            api.getFeedList(payload,function(data){
                if(data.code!=2000){
                    reject(data)
                    return false;
                }
                data.data['cate_id'] = payload.tag_id
                
                commit("postFreshCateList",data.data)
                resolve(data.data)
            })
        })
    },
    getPostTypes({commit}){
        return new Promise((resolve,reject)=>{
            api.getFeedTypeList(function(data){
                if(data.code!=2000){
                    reject(data)
                    return false;
                }
                let type = data.data;
                for(let i in type){
                    type[i] = Object.assign(type[i],{query:{
                        page:2,
                        limit:8,
                        more:true,
                        tag_id:type[i].id
                    }})
                }
                resolve(data)
                commit(types.POST_TYPE,type)
            })
        })
    },
    getPostFirstList({commit},payload){
        let query = {
            limit:8,
        }
        return new Promise((resolve,reject)=>{
            api.getFeedFirstList(query,function(data){
                let result = data.data
                if(data.code==2000){
                    resolve(data)
                    commit(types.POST_LIST,result)
                }
            })
        })
    },
    deletePost({commit},payload){
        return new Promise((resolve,reject)=>{
            api.getFeedDelete(payload,(data)=>{
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
    getPostTypes:state=>state.types,
    getPostList:state=>state.list
}

const mutations = {
    [types.POST_LIST](state,list){
        state.list = list;
    },
    [types.POST_TYPE](state,types){
        state.types = types
    },
    postPageQuery(state,payload){
        state.types[payload.id]['query'] = Object.assign(state.types[payload.id]['query'],payload.query)
        // console.log(state.types[payload.id]['query'])
    },
    postCateList(state,data){

        let current = state.list[data.cate_id].list
        state.list[data.cate_id].list = current.concat(data.list)
    },
    postFreshCateList(state,data){
        let current = state.list[data.cate_id].list
        state.list[data.cate_id].list = data.list
    }
}

export default {
    state,
    actions,
    getters,
    mutations
}
