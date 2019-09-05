import storageUtils from './storageUtils'
export default {
  // 存储当前登陆用户
  user: storageUtils.getUser(), // 多次读取, 会读多次local
  product: {}
}
