import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'

// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入vue-table-with-tree-grid
import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 导入Nprogress包对应的js和css
import Nprogress from 'nprogress'

// 导入axios
import axios from 'axios'
// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 设置拦截器request，保证用户是在有token的前提下操作后台
axios.interceptors.request.use(config => {
  // 展示进度条 Nprogress.start()
  Nprogress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 必须返回config
  return config
})

// 设置拦截器response，隐藏进度条 Nprogress.done()
axios.interceptors.response.use(config => {
  Nprogress.done()
  // 必须返回config
  return config
})

// 将axios挂载到vue原型上
Vue.prototype.$http = axios

// 使用vue-table-with-tree-grid
Vue.component('tree-table', TreeTable)

Vue.config.productionTip = false

// 定义事件过滤器
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

// 将富文本编辑器注册为全局可用组件
Vue.use(VueQuillEditor)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
