import ajax from './ajax'
import jsonp from "jsonp"
import { message } from 'antd'

export const reqLogin = (username,password) => ajax({
  method:'POST',
  url:'/login',
  data:{username,password}
})

// 获取天气的函数
export const reqWeather = (city) => {
  return new Promise((resolve,reject) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    jsonp(url,{},(err,data) => {
      if(!err && data.status === 'success'){
        const {dayPictureUrl,weather} = data.results[0].weather_data[0]
        resolve({dayPictureUrl,weather})
      } else {
        message.error('获取天气失败！')
      }
    })
  })
}

// 获取分类列表
export const reqCategorys = () => ajax({
  url: '/manage/category/list'
})

// 添加分类
export const reqAddCategory = (categoryName) => ajax({
  url: '/manage/category/add',
  method : 'POST',
  data: {categoryName}
})

//更新分类
export const reqUpdateCategory = ({categoryId,categoryName}) => ajax.post(
  '/manage/category/update',
  {categoryId,categoryName}
)

//获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax.get(
  '/manage/product/list',
  {
    params:{
      pageNum,
      pageSize
    }
  }
)

//商品搜索分页
export const reqSearchProducts = ({pageNum,pageSize,searchType,searchName}) => ajax.get(
  '/manage/product/search',
  {
    params: {
      pageNum,
      pageSize,
      [searchType]: searchName
    }
  }
)

export const reqUpdateStatus = (productId, status) => ajax.post(
  '/manage/product/updateStatus',
  { productId,status }
)

export const reqProduct = (productId) => ajax({
  url: '/manage/product/info',
  params: {
    productId
  }
})

export const reqCategory = (categoryId) => ajax({
  url: '/manage/category/info',
  params: {
    categoryId
  }
})

//删除图片
export const reqDeleteImg = (name) => ajax({
  url:'/manage/img/delete',
  method: 'POST',
  data: {
    name
  }
})

//添加或更新商品
export const addOrUpdateProduct = product => ajax({
  url: '/manage/product/' + (product._id ? 'update' : 'add'),
  method: "POST",
  data: product
})

//获取所有角色列表
export const reqRoles = () => ajax('/manage/role/list')

//添加角色
export const reqAddRole = (roleName) => ajax.post('/manage/role/add',{roleName})

//设置权限？？？
export const reqUpdateRole = (role) => ajax.post('manage/role/update', role)


//添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax.post('/manage/user/'+(user._id ? 'update' : 'add'),user)

//获取所有用户列表
export const reqUsers = () => ajax('/manage/user/list')

//删除用户
export const reqDeleteUser = (userId) => ajax.post('/manage/user/delete',{userId})