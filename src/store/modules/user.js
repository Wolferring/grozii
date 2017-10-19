import * as types from '../types.js'
import api from '../api'
import storage from '../../assets/js/storage.js'
const state = {
    user:{
        info:{
        },
        auth_token:"",
        hasLogin:false,
    },
    authInfo:Object,
    getNewestVer:Object,
}

const actions = {
	getUser({commit},settings){
		commit(types.USER_INFO,settings)
	},
    getUserInfo({commit}){
        return new Promise((resolve,reject)=>{
            api.getUserInfo(function(data){
                if(data.code!=2000){
                    reject(data)
                    return false;
                }
                data.data.avatar = data.data.avatar+"?v="+new Date().getTime()
                commit(types.USER_INFO,data.data)
                commit("hasLogin",true)
                resolve(data)
            })
        })
    },
    refreshUserInfo({commit}){
        return new Promise((resolve,reject)=>{
            api.getUserInfo(function(data){
                if(data.code!=2001){
                    reject(data.msg)
                    return false;
                }
                data.avatar = data.avatar+"?v="+new Date().getTime()
                commit(types.USER_INFO,data)
                setTimeout(function(){
                    resolve(data.msg)
                },300)
            })
        })
    },
    getLogout({commit}){
        var query = {}
        if(window.plus){
            query['clientid'] = plus.push.getClientInfo()['clientid']
        }        
        commit(types.USER,null)
        commit("hasLogin",false)
        commit(types.AUTH_TOKEN,"")
        commit("clearAllDetailCache")
        window.localStorage.clear()
        api.userLogout(query,(data)=>{

        })
    },

    getLogin({dispatch,commit},data){
        return new Promise((resolve,reject)=>{
            if(window.plus){
                data = Object.assign(data,{
                    clientid:plus.push.getClientInfo()['clientid']
                })
            }
            api.userLogin(data,function(result){
                if(result.code!=2000){
                    reject(result)
                    return false;
                }
                window.localStorage.clear()
                commit(types.COM_CONF,{
                    isLoginScreenShow:false
                })
                commit(types.USER,result.data)
                commit("clearAllDetailCache")
                commit("hasLogin",true)
                storage.set("auth_token",result.data.accessToken)
                dispatch("refreshRecommend")
                resolve(result)
            })
        })
    },
    getRegister({commit},info){
        return new Promise((resolve,reject)=>{
            api.userRegister(info,function(data){
                if(data.code!=2000){
                    if(data.msg){
                        reject(data)
                    }else{

                    }
                    return false;
                }
                commit(types.USER,data.data)
                commit("hasLogin",true)
                storage.set("auth_token",data.data.accessToken)
                resolve(data)
            })
        })
    },    
    getThirdLogin({commit},user){
        return new Promise((resolve,reject)=>{
            api.userThirdLogin(user,function(data){
                if(data.code==2000){
                    commit(types.COM_CONF,{
                        isLoginScreenShow:false
                    })
                    commit(types.USER,data.data)
                    storage.set("auth_token",data.data.accessToken)
                    commit("hasLogin",true)
                    resolve(data)
                    return false
                }
                if(data.code==2005){
                    resolve(data)
                    return false
                }
            })
        })
    },
    getBindAuthInfo({commit},info){
        return new Promise((resolve,reject)=>{
            api.userBindAuthInfo(info,(data)=>{
                if(data.code!=2000){
                    reject(data)
                    return false
                }
                resolve(data)
                commit(types.USER,data.data)
                commit("hasLogin",true)
                storage.set("auth_token",data.data.accessToken)
            })
        })
    },
    getNewestVer({commit},payload){
        return new Promise((resolve,reject)=>{
            api.getNewestVer(payload,function(data){
                if(data.code!=2000){
                    reject(data)
                    return false;
                }
                commit('getNewestVer',data)
                resolve(data)
            })
        })
    },

}

const getters = {
	getUser:state=>state.user,
    getUserInfo:state=>state.user.info,
    getThirdAuthInfo:state=>state.authInfo,
    authToken:state=>state.user.auth_token,
    userHasLogin:state=>state.user.hasLogin,
    getNewestVer:state=>state.getNewestVer
}

const mutations = {
    [types.USER](state,user){
        if(user==null||!user){
            state.user.info = "";
            state.user.auth_token = ""
            storage.set("userInfo","");
            return;
        }
        state.user.info = user;
        state.user.auth_token = user.accessToken
        storage.set("userInfo",JSON.stringify(user));

    },
    [types.USER_INFO](state,userInfo){
        state.user.info = userInfo;
        storage.set("userInfo",JSON.stringify(userInfo));
    },
    singleUserInfo(state,userInfo){
        state.user.info = Object.assign(state.user.info,userInfo);
        storage.set("userInfo",JSON.stringify(state.user.info));
    },
    getNewestVer(state,list){
        state.getNewestVer = list
    },
    hasLogin(state,login){
        state.user.hasLogin = login
    },
    hasNewMessage(state,status){
        state.user.hasNewMessage = status
    },
    thirdAuthInfo(state,info){
        console.log(info)
        state.authInfo = info;
    },
    [types.AUTH_TOKEN](state,token){
        state.user.auth_token = token;
    },
}

export default {
    state,
    actions,
    getters,
    mutations
}
