import api from '../api'
import storage from '../../assets/js/storage.js'
const state = {
    evalComlist:Object,
    postComlist:Object,
    reComment:Object,
    rePostComment:Object,
    replyIds:{
        name:'本帖',
    },
    replyType:'',
    evalCommonDigg:Object,
    postCommonDigg:Object,
}

const actions = {
    getEvalCommentList({commit},payload){
        return new Promise((resolve,reject)=>{
            api.evalCommonList(payload,function(data){
                if(data.code !=2000){
                    reject(data)
                    return false;
                }
                commit("setEvalCommonList",data.data.list)
                resolve(data)
            })
        })
    },
    getPostCommentList({commit},payload){
        return new Promise((resolve,reject)=>{
            api.postCommonList(payload,function(data){
                if(data.code !=2000){
                    reject(data)
                    return false;
                }
                commit("setPostCommonList",data.data.list)
                resolve(data)
            })
        })
    },
    replyComments({commit},payload){
        return new Promise((resolve,reject)=>{
            api.replyComments(payload,function(data){
                if(data.code !=2000){
                    reject(data)
                    return false;
                }
                commit("replyCom",data.data)
                resolve(data)
            })
        })
    },
    replyPostComments({commit},payload){
        return new Promise((resolve,reject)=>{
            api.replyPostComments(payload,function(data){
                if(data.code !=2000){
                    reject(data)
                    return false;
                }
                commit("replyPostCom",data.data)
                resolve(data)
            })
        })
    },

    evalCommonDigg({commit},pid){
        return new Promise((resolve,reject)=>{
            api.evalCommonDigg({id:pid},function(data){
                if(data.code !=2000){
                    reject(data)
                    return false;
                }
                commit("evalCommonDigg",data.data)
                resolve(data)
            })
        })
    },
    postCommonDigg({commit},pid){
        return new Promise((resolve,reject)=>{
            api.postCommonDigg({id:pid},function(data){
                if(data.code !=2000){
                    reject(data)
                    return false;
                }
                commit("postCommonDigg",data.data)
                resolve(data)
            })
        })
    },
}

const getters = {
    evalCommentList:state=>state.evalComlist,
    postCommentList:state=>state.postComlist,
    setReplyIds:state=>state.replyIds,
    replyType: state => state.replyType,
}

const mutations = {
    setEvalCommonList(state,list){
        state.evalComlist = list;
    },
    setPostCommonList(state,list){
        state.postComlist = list;
    },
    replyCom(state,list){
        state.reComment = list;
    },
    replyPostCom(state,list){
        state.rePostComment = list;
    },
    setReplyIds(state,list){
        state.replyIds = list;
    },
    changeReplyType(state,list){
        state.replyType = list;
    },
    evalCommonDigg(state,list){
        state.evalCommonDigg = list;
    },
    postCommonDigg(state,list){
        state.postCommonDigg = list;
    },
}

export default {
    state,
    actions,
    getters,
    mutations
}
