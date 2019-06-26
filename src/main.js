import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import '@/assets/iconfont/iconfont.css' // iconfont
import './permission' // permission control
import './utils/error-log' // error log
import common from './assets/js/common'
import directive from './assets/js/directive'
import storage from '@/assets/js/storage.js'

import * as filters from './filters' // global filters
import '@/styles/theme/blue.scss' // ????

/**
 * If you don't want to use mock-server
 * you want to use mockjs for request interception
 * you can execute:
 *
 * import { mockXHR } from '../mock'
 * mockXHR()
 */

import { mockXHR } from '../mock'
mockXHR()

Vue.use(common, directive)
Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.prototype.$storage = storage

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
