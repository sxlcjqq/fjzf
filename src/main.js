// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import '../static/css/common.css'

Vue.config.productionTip = false
Vue.use(mavonEditor) // 编辑器
Vue.use(ElementUI)

axios.defaults.withCredentials = true // 设置后服务器才能跨域保存session
axios.defaults.baseURL = 'http://127.0.0.1:3000/'
Vue.prototype.$http = axios

// 请求拦截（配置发送请求的信息）
axios.interceptors.request.use(function (config) {
  // 处理请求之前的配置、
  if (config.url !== '/article/login' && !sessionStorage.getItem('fjzflogin')) {
    Vue.prototype.$message({
      type: 'error',
      message: '请先登录！'
    })
  } else {
    return config
  }
}, function (error) {
  // 请求失败的处理
  return Promise.reject(error)
})

// 拦截响应response，并做一些错误处理
axios.interceptors.response.use((response) => {
  return response
}, (err) => { // 这里是返回状态码不为200时候的错误处理
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '请求错误'
        break

      case 401:
        err.message = '未授权，请登录'
        break

      case 403:
        err.message = '拒绝访问'
        break

      case 404:
        // err.message = `请求地址出错: ${err.response.config.url}`
        err.message = `资源没有找到`
        break

      case 408:
        err.message = '请求超时'
        break

      case 500:
        err.message = '服务器内部错误'
        break

      case 501:
        err.message = '服务未实现'
        break

      case 502:
        err.message = '网关错误'
        break

      case 503:
        err.message = '服务不可用'
        break

      case 504:
        err.message = '网关超时'
        break

      case 505:
        err.message = 'HTTP版本不受支持'
        break
      case 422:
        err.message = err.response.data.name[0]
        break
      default:err.message = '未知错误'
    }
    if (err.message) {
      Vue.prototype.$message({
        type: 'error',
        message: err.message
      })
    }
  }
  return Promise.reject(err)
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
