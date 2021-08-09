
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import store from './store/store.js'
// 引入第三方发送请求的包
import { $http } from '@escook/request-miniprogram'

Vue.config.productionTip = false

App.mpType = 'app'

// 挂载到全局对象uni上
uni.$http = $http

// 请求根目录
$http.baseUrl = 'https://www.uinav.com'

// 请求拦截器
$http.beforeRequest = function(options){
	// 请求数据之前添加一个loading
	uni.showLoading({
		title: '数据加载中...'
	})
}

// 响应拦截器
$http.afterRequest = function () {
	// ？？？？？？这个API是什么作用
  uni.hideLoading()
}

// 封装网络请求失败弹窗
uni.$showMsg = function(title = '数据请求失败',duration = 1500){
	uni.showToast({
		title,
		duration,
		icon:'none'
	})
}
const app = new Vue({
    ...App,
		store,
})

app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif