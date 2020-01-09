import Vue from 'vue'
import App from './index'

// 添加这个来处理异常
Vue.config.errorHandler = function (err) {
  if (console && console.error) {
    console.error(err)
  }
}

const app = new Vue(App)
app.$mount()
