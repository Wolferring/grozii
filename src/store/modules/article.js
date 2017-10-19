import * as types from '../types.js'
import api from '../api'
import storage from '../../assets/js/storage.js'
const state = {
    articleDetail:Object,
    articleDetailList:Object,
    feedDetail:Object,
    feedDetailList:Object,
}

const actions = {
    getArticleDetail({commit},pid){
        return new Promise((resolve,reject)=>{
            // if (state.articleDetailList[pid]) {
            //     commit(types.ARTICLE_DETAIL,state.articleDetailList[pid])
            //     //如果存在这篇文章的详情
            //     resolve()
            //     return;
            // }
            api.getArticleDetail(pid,function(data){
                if(data.code!=2000){
                    reject(data)
                    return false;
                }
                // commit("articleDetailList",{
                //     pid:pid,
                //     detail:data.data
                // })
                commit(types.ARTICLE_DETAIL,data.data)
                resolve(data)
            })
        })

    },
    getFeedDetail({commit},pid){
        return new Promise((resolve,reject)=>{
            if (state.feedDetailList[pid]) {
                commit(types.FEED_DETAIL,state.feedDetailList[pid])
                //如果存在这篇文章的详情
                resolve()
                return;
            }
            api.getFeedDetail(pid,function(data){
                if(data.code!=2000){
                    reject(data)
                    return false;
                }
                // commit("feedDetailList",{
                //     pid:pid,
                //     detail:data.data
                // })
                commit(types.FEED_DETAIL,data.data)
                resolve(data)
            })
        })

    },
    articleCollect({commit},pid){
        return new Promise((resolve,reject)=>{
            api.getArticleCollect({id:pid},function(data){
                if(data.code!=2000){
                    reject(data)
                    return false;
                }
                commit("articleCollect",pid)
                resolve(data)
            })
        })
    },
    feedCollect({commit},pid){
        return new Promise((resolve,reject)=>{
            api.getFeedCollect({id:pid},function(data){
                if(data.code!=2000){
                    reject(data)
                    return false;
                }
                commit("feedCollect",pid)
                resolve(data)
            })
        })
    },
    articleCancelCollect({commit},pid){
        return new Promise((resolve,reject)=>{
            api.getArticleCancelCollect({id:pid},function(data){
                if(data.code!=2000){
                    reject(data)
                    return false;
                }
                commit("articleCancelCollect",pid)
                resolve(data)
            })
        })
    },
    articleLike({commit},pid){
        return new Promise((resolve,reject)=>{
            api.getArticleLike({id:pid},function(data){
                if(data.code!=2000){
                    reject(data)
                    return false;
                }
                commit("articleLike",pid)
                resolve(data)
            })
        })
    },
    feedLike({commit},pid){
        return new Promise((resolve,reject)=>{
            api.getFeedLike({id:pid},function(data){
                if(data.code!=2000){
                    reject(data)
                    return false;
                }
                commit("feedLike",pid)
                resolve(data)
            })
        })
    },
    articleCancelLike({commit},pid){
        return new Promise((resolve,reject)=>{
            api.getArticleCancelLike({id:pid},function(data){
                if(data.code!=2000){
                    reject(data)
                    return false;
                }
                commit("articleCancelLike",pid)
                resolve(data)
            })
        })
    }
}

const getters = {
	getArticleDetail:state=>state.articleDetail,
    getArticleDetailList:state=>state.articleDetailList,
    getFeedDetail:state=>state.feedDetail,
    getFeedDetailList:state=>state.feedDetailList,
}

const mutations = {
    [types.ARTICLE_DETAIL](state,detail){
        state.articleDetail = detail;
    },
    [types.FEED_DETAIL](state,detail){
        state.feedDetail = detail;
    },
    feedDetailList(state,payload){
        state.feedDetailList[payload.pid] = payload.detail
    },
    articleDetailList(state,payload){
        state.articleDetailList[payload.pid] = payload.detail
    },
    articleCollect(state,pid){
        state.articleDetail.extra.is_fav = true
        state.articleDetail.collects++
    },
    feedCollect(state,pid){
        state.feedDetail.extra.is_fav = !state.feedDetail.extra.is_fav
        if(state.feedDetail.extra.is_fav){
            state.feedDetail.collects++
        }else{
            state.feedDetail.collects--
        }
    },
    articleCancelCollect(state,pid){
        state.articleDetail.extra.is_fav = false
        state.articleDetail.collects--
    },
    articleLike(state,pid){
        state.articleDetail.extra.is_digg = true
        state.articleDetail.diggs++
    },
    feedLike(state,pid){
        state.feedDetail.extra.is_digg = !state.feedDetail.extra.is_digg
        if(state.feedDetail.extra.is_digg){
            state.feedDetail.diggs++
        }else{
            state.feedDetail.diggs--
        }
    },
    articleCancelLike(state,pid){
        state.articleDetail.extra.is_digg = false
        state.articleDetail.diggs--
    },
    clearAllDetailCache(state){
        // state.articleDetail = {}
        state.articleDetailList = {}
        // state.feedDetail = {}
        state.feedDetailList = {}
    }
}

export default {
    state,
    actions,
    getters,
    mutations
}
