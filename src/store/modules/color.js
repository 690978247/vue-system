import skin from '@/styles/common.scss'
const state = {
    backColor: skin.backColor,
    textColor: skin.textColor,
    btnColor: skin.btnColor,
  }
  
  const mutations = {
    CHANGE_BACK: (state,back) => {
      state.backColor = back
    },
    CHANGE_TEXT: (state,text) => {
      state.textColor = text
    },
    CHANGE_BTN: (state,btn) => {
      state.btnColor = btn
    }
  }
  
  const actions = {
    changeBack({ commit },data) {
      commit('CHANGE_BACK',data)
    },
    changeText({ commit },data) {
      commit('CHANGE_TEXT',data)
    },
    changeBtn({ commit }) {
      commit('CHANGE_BTN',data)
    }
  }
export default {
    namespaced: true,
    state,
    mutations,
    actions
  }
  