import Vue from 'vue'
import App from './App'
import { getRequest, postRequest } from './utils/request'

Vue.config.productionTip = false
App.mpType = 'app'

Vue.prototype.getRequest = getRequest
Vue.prototype.postRequest = postRequest

const app = new Vue(App)
app.$mount()
