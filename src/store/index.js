import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    SUCCESS_TOKEN: '' || wx.getStorageSync('SUCCESS_TOKEN'),
    invitationCode: '' || wx.getStorageSync('INVITATION_CODE'),
    mobile: '' || wx.getStorageSync('MOBILE'),
    userId: '' || wx.getStorageSync('USER_ID'),
    userName: '' || wx.getStorageSync('USER_NAME'),
    userImage: '' || wx.getStorageSync('USER_IMAGE'),
    accountBank: '',
    bankName: '',
    switchData: false || wx.getStorageSync('SWITCH_DATA')
  },

  mutations: {
    // 开户银行
    setBankCode1 (state, val) {
      state.accountBank = val
    },

    // 开户支行
    setBankCode0 (state, val) {
      state.bankName = val
    },

    // 令牌
    setToken (state, val) {
      state.SUCCESS_TOKEN = val
      wx.setStorageSync('SUCCESS_TOKEN', val)
    },

    setInvitationCode (state, val) {
      state.invitationCode = val
      wx.setStorageSync('INVITATION_CODE', val)
    },

    // 手机号
    setMobile (state, val) {
      state.mobile = val
      wx.setStorageSync('MOBILE', val)
    },

    // 用户id
    setUserId (state, val) {
      state.userId = val
      wx.setStorageSync('USER_ID', val)
    },

    // 用户名
    setUserName (state, val) {
      state.userName = val
      wx.setStorageSync('USER_NAME', val)
    },

    // 用户头像
    setUserImage (state, val) {
      state.userImage = val
      wx.setStorageSync('USER_IMAGE', val)
    },

    // 数据开关
    setSwitch (state, val) {
      state.switchData = val
      wx.setStorageSync('SWITCH_DATA', val)
    }
  }
})

export default store
