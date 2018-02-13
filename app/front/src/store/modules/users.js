import axios from 'axios';
import config from '../config'
import router from '../../router/index'
export default {
  state: {
    tokens: {
      access_token: null,
      expires_in: null,
      refresh_token: null,
      token_type: null
    },
    authenticatedUser: {
      id: null,
      name: null,
      email: null,
      picture: null,
      created_at: null,
      updated_at: null,
    },
    allUsers: []
  },

  mutations: {
    UPDATE_TOKENS(state, tokens){
      state.tokens = tokens
    },
    DESTROY_TOKENS(state){
      state.tokens.access_token = null,
          state.tokens.expires_in = null,
          state.tokens.refresh_token = null,
          state.tokens.token_type = null,

          state.authenticatedUser.id = null,
          state.authenticatedUser.name = null,
          state.authenticatedUser.email = null,
          state.authenticatedUser.picture = null,
          state.authenticatedUser.created_at = null,
          state.authenticatedUser.updated_at = null
    },
    SET_AUTH_USER(state, authUser){
      state.authenticatedUser = authUser
    },
    SET_ALL_USERS(state, users){
      state.allUsers = users
    },
  },

  actions: {
    login(state, loginDetails){
      return new Promise((resolve, reject) => {
        let data = {
          grant_type: 'password',
          client_id: 2,
          client_secret: 'PA54awpBfEbfr4h4eJoar4jMnmwU3RUPo7mKT6NE',
          username: loginDetails.email,
          password: loginDetails.password,
          remember: loginDetails.remember,
          scope: ''
        };
        axios[config.loginMethod](config.apiUrl + config.loginRequest, data)
            .then(response => {
              let responseData = response.data;
              let now = Date.now();

              responseData.expires_in = responseData.expires_in + now;
              state.commit('UPDATE_TOKENS', responseData);

              resolve(response)
            })
            .catch(error => {
              reject(error)
            })

      })
    },
    checkToken({state, getters, commit}){
      let token = getters.getToken;

      if (Date.now() > parseInt(token.expiration)) {
        commit('DESTROY_TOKENS');
        return null
      } else {
        return true
      }
    },
    setAuthenticatedUser({commit, getters}) {
        return new Promise((resolve, reject) => {
          axios[config.getUserMethod](config.apiUrl + config.getUserRequest, {headers: getters.getHeader})
              .then(response => {
                let authUser = response.data;
                commit('SET_AUTH_USER', authUser);
                resolve(response)
              })
              .catch(error => {
                reject(error)
              })
        });
    },
    logout({commit}) {
      let redirect = '/';

      commit('DESTROY_TOKENS');
      router.push(redirect);
    },
    register(registerDetails){
      return new Promise((resolve, reject) => {
        axios[config.registerMethod](config.apiUrl + config.registerRequest, registerDetails)
            .then(response => {
              resolve(response)
            })
            .catch(error => {
              reject(error)
            })

      })
    },
    saveUpdatedUserData({getters}, userData){
      return new Promise((resolve, reject) => {
        axios[config.saveUserMethod](config.apiUrl + config.saveUserRequest + userData.id, userData, {headers: getters.getHeader})
            .then(function (response) {
              if (response.data.saved) {
                resolve(response)
              }
            })
            .catch(error => {
              reject(error);
            })
      })
    },
    setAllUsers({commit, getters}) {
      return new Promise((resolve, reject) => {
        axios[config.getAllUsersMethod](config.apiUrl + config.getAllUsersRequest, {headers: getters.getHeader})
            .then(response => {
              let users = response.data;
              commit('SET_ALL_USERS', users);
              resolve(response)
            })
            .catch(error => {
              reject(error)
            })
      })
    },
  },

  getters: {
    getToken(state) {
      let uToken = state.tokens.access_token;
      let uExpiration = state.tokens.expires_in;
      let token = {
        token: uToken,
        expiration: uExpiration
      };

      if ( !uToken || !uExpiration ) {
        return null
      } else {
        return token
      }
    },
    isAuthenticated(state, getters) {
      if (getters.getToken) {
        return true
      } else {
        return false
      }
    },
    getHeader(state, getters) {
      let header = {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + getters.getToken.token
      };
      return header
    },
    getAuthenticatedUser(state) {
      return state.authenticatedUser
    },
    getAllUsers(state) {
      return state.allUsers
    },
  },
}