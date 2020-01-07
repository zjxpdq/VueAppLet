import Vue from 'vue'
import App from './App'
import { getRequest, postRequest } from './utils/request'
import { Toast } from './utils/toast'

Vue.config.productionTip = false
App.mpType = 'app'

Vue.prototype.getRequest = getRequest
Vue.prototype.postRequest = postRequest
Vue.prototype.Toast = Toast

const app = new Vue(App)
app.$mount()
