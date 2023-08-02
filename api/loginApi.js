import { request } from '@/request/request.js'

// 登录
export const loginApi = (data) => request(`/ysyunwei/sys/login`,'POST',data,true)


// 获取个人资料
export const geteUserPersonalApi = (data) => request(`/ysyunwei/sys/user/queryById?id=${data}`,'get',{},true)