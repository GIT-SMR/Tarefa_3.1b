import { authService } from "@/api/auth.service.js";
import {
  AUTH_LOGIN,
  AUTH_REGISTER,
  AUTH_INFO,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGOUT_SUCCESS,
  AUTH_REGISTER_SUCCESS,
  SET_MESSAGE
} from "./auth.constants";

import { STORAGE_ACCESS_TOKEN, STORAGE_USER_PROFILE } from "../constants";

const state = {
  message: "",
  token:
    localStorage.getItem(STORAGE_ACCESS_TOKEN) ||
    sessionStorage.getItem(STORAGE_ACCESS_TOKEN) ||
    "",
  profile: JSON.parse(
    localStorage.getItem(STORAGE_USER_PROFILE) ||
      sessionStorage.getItem(STORAGE_USER_PROFILE) ||
      "{}"
  )
};

// getters
const getters = {
  isUserLoggedIn: state => state.token != "",
  getProfileName: state => state.profile.name,
  getUserType: state => state.profile.type,
  getProfile: state => state.profile,
  getMessage: state => state.message
};

// actions
const actions = {
  [AUTH_LOGIN]: async ({ commit }, payload) => {
    return new Promise((resolve, reject) => {
      authService
      .login(payload)
      .then(res => {
          commit(AUTH_LOGIN_SUCCESS, {token: res.token, profile: res.profile});
          commit(SET_MESSAGE, `Bem-vindo, ${res.profile.name}!`);
          resolve(res);
      })
      .catch(err => reject(err))

    })
  },

  [AUTH_REGISTER]: async ({ commit }, payload) => {
    return new Promise((resolve, reject) => {
      authService.register(payload)
      .then(res => {
          commit(SET_MESSAGE, `O utilizador ${res.body.name} foi adicionado com sucesso!`);
          resolve(res);
      })
      .catch(err => reject(err))
    });
  },

  [AUTH_INFO]: async ({ commit, state }) => {
    commit(
      SET_MESSAGE,
      await authService.getInfo(state.token)
    );
  }
};

// mutations
export const mutations = {
  [AUTH_LOGIN_SUCCESS]: (state, data) => {
    state.token = data.token;
    localStorage.STORAGE_ACCESS_TOKEN = data.token;
    state.profile = data.profile;
    localStorage.STORAGE_USER_PROFILE = JSON.stringify(data.profile);
  },

  [AUTH_LOGOUT_SUCCESS]: state => {
    state.token = "";
    state.profile = {};
    localStorage.removeItem(STORAGE_ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_USER_PROFILE);
  },
  [AUTH_REGISTER_SUCCESS]: (state, data) => {
    state.register = data;
  },
  [SET_MESSAGE]: (state, message) => {
    state.message = message;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
