import * as types from '../types.js'
import api from '../api'
const state = {
	online:true,
    isLoginScreenShow:false,
    isLoginScreenActive:false,
	shareScreenShow:false,
    narbarShadow:true,
    tabPostShow:true,
    needGuide:false,
    hasNewMessage:false,
    homeNavShow:true
}

const actions = {
	setComConf({commit},settings){
		commit(types.COM_CONF,settings)
	},
	setShare({commit},settings){
		commit(types.SET_SHARE_STATUS,settings)
	},
}

const getters = {
	setShare:state=>state,
	getComConf:state=>state,
	online:state=>state.online,
}

const mutations = {
    [types.COM_CONF](state,settings){
        state = Object.assign(state,settings)
    },
	[types.SET_SHARE_STATUS](state,status){
		state.shareScreenShow = status
	}
}

export default {
    state,
    actions,
    getters,
    mutations
}
