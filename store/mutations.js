import * as types from "./mutations-types";

const mutations = {
  [types.SET_USERINFO](state, payload) {
    state.userInfo = payload;
  }
};

export default mutations;
