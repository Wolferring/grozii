import * as types from '../types.js'
import api from "../api";
import storage from "../../assets/js/storage.js";
const state = {
  changeInfo: "",
  myCollOriginal: Object,
  myCollReveal: Object,
  myPostOriginal: Object,
  myPostReveal: Object,
  userPostOriginal: Object,
  userPostReveal: Object,
  followingInfo: Object,
  followerInfo: Object,
  otherInfo: Object,
  followUser: Object,
  userFollowInfo: Object,
};

const actions = {
  myCollOriginal({commit}, payload) {
    return new Promise((resolve, reject) => {
      api.myCollPost(payload, function(result) {
        if (result.code != 2000) {
          reject(result);
          return false;
        }
        commit("myCollOriginal", result.data.data);
        resolve(result.data);
      });
    });
  },
  myCollReveal({commit}, payload) {
    return new Promise((resolve, reject) => {
      api.myCollFeeds(payload, function(data) {
        if (data.code != 2000) {
          reject(data);
          return false;
        }
        commit("myCollReveal", data.data.data);
        resolve(data.data);
      });
    });
  },
  myPostOriginal({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      api.myposts(payload, function(data) {
        if (data.code != 2000) {
          reject(data);
          return false;
        }
        commit("myPostOriginal", data.data.data);
        resolve(data.data);
      });
    });
  },
  myPostReveal({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      api.myFeeds(payload, function(data) {
        if (data.code != 2000) {
          reject(data);
          return false;
        }
        commit("myPostReveal", data.data.data);
        resolve(data.data);
      });
    });
  },
  userPostOriginal({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      api.userposts(payload, function(data) {
        if (data.code != 2000) {
          reject(data);
          return false;
        }
        commit("userPostOriginal", data.data.data);
        resolve(data.data);
      });
    });
  },
  userPostReveal({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      api.userFeeds(payload, function(data) {
        if (data.code != 2000) {
          reject(data);
          return false;
        }
        commit("userPostReveal", data.data.data);
        resolve(data.data);
      });
    });
  },
  getFollowingInfo({
    commit
  }) {
    return new Promise((resolve, reject) => {
      api.getFollowingInfo(function(data) {
        if (data.code != 2000) {
          reject(data);
          return false;
        }
        commit("getFollowingInfo", data.data);
        resolve(data.data);
      });
    });
  },
  getFollowerInfo({
    commit
  }) {
    return new Promise((resolve, reject) => {
      api.getFollowerInfo(function(data) {
        if (data.code != 2000) {
          reject(data);
          return false;
        }
        commit("getFollowerInfo", data.data);
        resolve(data.data);
      });
    });
  },
  changeMyInfo({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      api.changeMyInfo(payload, function(data) {
        if (data.code != 2000) {
          reject(data);
          return false;
        }
        commit("singleUserInfo", data.data);
        resolve(data.data);
      });
    });
  },
  getOtherInfo({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      api.getOtherInfo(payload, function(data) {
        if (data.code != 2000) {
          reject(data);
          return false;
        }
        commit("getOtherInfo", data.data);
        resolve(data.data);
      });
    });
  },
  followUser({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      api.followUser(payload, function(data) {
        if (data.code != 2000) {
          reject(data);
          return false;
        }
        commit("followUser", data.data);
        resolve(data.data);
      });
    });
  },
  userFollowInfo({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      api.userFollowInfo(payload, function(data) {
        if (data.code != 2000) {
          reject(data);
          return false;
        }
        commit("userFollowInfo", data.data);
        resolve(data.data);
      });
    });
  },
}

const getters = {
  changeUserInfo: state => state.changeInfo,
  myCollOriginal: state => state.myCollOriginal,
  myCollReveal: state => state.myCollReveal,
  myPostOriginal: state => state.myPostOriginal,
  myPostReveal: state => state.myPostReveal,
  userPostOriginal: state => state.userPostOriginal,
  userPostReveal: state => state.userPostReveal,
  followingInfo: state => state.followingInfo,
  followerInfo: state => state.followerInfo,
  getOtherInfo: state => state.otherInfo,
  userFollowInfo: state => state.userFollowInfo,
};

const mutations = {
  changeUserInfo(state, list) {
    state.changeInfo = list;
  },
  myCollOriginal(state, list) {
    state.myCollOriginal = list;
  },
  myCollReveal(state, list) {
    state.myCollReveal = list;
  },
  myPostOriginal(state, list) {
    state.myPostOriginal = list;
  },
  myPostReveal(state, list) {
    state.myPostReveal = list;
  },
  userPostOriginal(state, list) {
    state.userPostOriginal = list;
  },
  userPostReveal(state, list) {
    state.userPostReveal = list;
  },
  getFollowingInfo(state, list) {
    state.followingInfo = list;
  },
  getFollowerInfo(state, list) {
    state.followerInfo = list;
  },
  getOtherInfo(state, list) {
    state.otherInfo = list
  },
  followUser(state, list) {
    state.followUser = list
  },
  userFollowInfo(state, list) {
    state.userFollowInfo = list
  },
};

export default {
  state,
  actions,
  getters,
  mutations
};
