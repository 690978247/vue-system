import { login, logout, getInfo, getSystemInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  pagesizes: [],
  pagesize: 0
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PAGESIZE: (state, pagesize) => {
    state.pagesize = pagesize
  },
  SET_PAGESIZES: (state, pagesizes) => {
    state.pagesizes = pagesizes
  }
}

const actions = {
  updatePageSize({ commit }, pageSize) {
    commit('SET_PAGESIZE', pageSize)
  },
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then(response => {
          commit('SET_TOKEN', response.result.accessToken)
          setToken(response.result.accessToken)
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // 获取系统设置
  GetSystemSetting({ commit, state }) {
    return new Promise((resolve, reject) => {
      getSystemInfo('OperationAssistance')
        .then(response => {
          if (response != null) {
            // var setting = response.result
            // commit('SET_SKIN', setting.theme)
            // commit('SET_PAGESIZE', setting.pageSize)
            // commit('SET_COPYRIGHT', setting.copyrightInfo)
            // commit('SET_SYSTITLE', setting.systemTitle)
            resolve(response)
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const { result } = response

          if (!result) {
            reject('Verification failed, please Login again.')
          }

          const { roleNames, userName, id } = result

          // roles must be a non-empty array
          if (!roleNames || roleNames.length <= 0) {
            reject('getInfo: roles must be a non-null array!')
          }

          commit('SET_ROLES', roleNames)
          commit('SET_NAME', userName)
          /*           commit('SET_AVATAR', avatar) */
          commit('SET_INTRODUCTION', id)
          resolve(result)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resetRouter()
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, {
        root: true
      })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
