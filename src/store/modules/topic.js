import * as types from '../types.js'
import api from "../api";
import storage from "../../assets/js/storage.js";

const state = {
    content:Object,
    allTopic:Object,
}
const actions = {
    getTopicContent({commit}, payload) {
      return new Promise((resolve, reject) => {
        api.getTopicContent(payload, function(data) {
          if (data.code != 2000) {
            reject(data);
            return false;
          }
          commit("getTopicContent", data.data);
          resolve(data.data);
        });
      });
    },
    getAllTopic(payload){
      return new Promise((resolve, reject) => {
        api.getAllTopic(function(data) {
          if (data.code != 2000) {
            reject(data);
            return false;
          }
          commit("getAllTopic", data.data);
          resolve(data.data);
        });
      });
    }
}

const getters = {
    topicContent:state => state.content,
    allTopic:state => state.allTopic
}

const mutations = {
    getTopicContent(state, list) {
      state.content = list;
    },
    getAllTopic(state,list){
      state.allTopic = list
    }
}

export default {
    state,
    actions,
    getters,
    mutations
}
