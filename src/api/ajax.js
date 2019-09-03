import axios from "axios"
import qs from 'qs'
import { message } from 'antd'

//指定基础url
//axios.defaults.baseURL = 'http://localhost:5000'

axios.interceptors.request.use((config) => {

  // 1. 将post请求参数转换为urlencoded(默认json格式)
  let data = config.data
  if (data && data instanceof Object) {
    config.data = qs.stringify(data)
  }

  return config
})

// 使用响应拦截器
axios.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    message.error('请求出错: ' + error.message)
    return new Promise(() => {}) // 中断promise链
  }
)

// 默认暴露axios
export default axios