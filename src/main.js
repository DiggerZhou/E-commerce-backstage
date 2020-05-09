import Vue from 'vue'
import App from './App'
import router from './router'
// 导入全局样式表
import 'assets/css/global.css'
// 导入字体图标
import 'assets/fonts/iconfont.css'

// 引入elementui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 引入axios
import axios from 'axios'
// Vue.prototype.$http = axios
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// axios.interceptors.request.use(config =>{
//   config.headers.Authorization = window.sessionStorage.getItem('token')
//   return config
// })
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
