import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import store from './store';
import SocketService from './utils/socket_service'
SocketService.Instance.connect()

// 插件导入式，与html导入皆可
// import * as echarts from 'echarts'
// Vue.prototype.$echarts = echarts
// 加载echarts主题
// import '../public/static/theme/chalk';
// import '../public/static/theme/vintage';

// 引入字体文件
import './assets/font/iconfont.css'

// 引入全局样式
import './assets/css/global.less';


axios.defaults.baseURL='http://127.0.0.1:8888/api/'
Vue.prototype.$http = axios;
Vue.prototype.$echarts = window.echarts
Vue.prototype.$socket=SocketService.Instance

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
