import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { Loading } from 'element-ui'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 900000 // request timeout
})

var load
function startLoad() {
  load = Loading.service({
    lock: true,
    spinner: 'el-icon-loading',
    customClass: 'custom-loading',
    background: 'rgba(0, 0, 0, 0.5)'
  })
}
function endLoad() {
  load.close()
}

// request interceptor
var num = 0
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
      config.headers.common['Authorization'] = 'Bearer ' + getToken()
    }
    num += 1
    startLoad()
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // response code=200
    const res = response.data
    num -= 1
    if (num <= 0) {
      endLoad()
    } else {
      startLoad()
    }
    return res
  },
  response => {
    // response code!=200
    num -= 1
    if (num <= 0) {
      endLoad()
    } else {
      startLoad()
    }

    if (response.response === undefined) {
      Message({
        message: '网络异常',
        type: 'error',
        duration: 3 * 1000
      })

      return Promise.reject('error')
    }

    if (response.response.status === 401 || response.response.status === 403) {
      if (response.response.status === 401) {
        Message({
          message: '对不起，您未登陆 或 页面已过期，请重新登陆！',
          type: 'error',
          duration: 3 * 1000
        })

        return Promise.reject('error')
      }

      if (response.response.status === 403) {
        Message({
          message: '对不起，您没有该权限，请联系管理员！',
          type: 'error',
          duration: 3 * 1000
        })

        return Promise.reject('error')
      }
    } else {
      if (response.response.status !== 200) {
        Message({
          message: '对不起，程序错误，请联系管理员',
          type: 'error',
          duration: 3 * 1000
        })
      }
    }
  },
  error => {
    num -= 1
    if (num <= 0) {
      endLoad()
    } else {
      startLoad()
    }
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
