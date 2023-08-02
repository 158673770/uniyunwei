import { request } from '@/request/request.js'

// 获取首页列表
export const getIndexListApi = (data) => request(`/ysyunwei/Inspection/queryAppInspectionList2`,'GET',{},true)

// 获取列表详情   
export const getIndexListDetailApi = (data) => request(`/ysyunwei/Port/queryItemsByportId?portId=${data}`,'GET',{},true)

// 删除文件
export const delPhotoFileApi = (data) => request(`/ysyunwei/file/delUploadAttById?ids=${data}`,'GET',{},true)

// 获取首页列表个数
export const getDataCountApi = (data) => request(`/ysyunwei/Inspection/queryAppInspectionListTotal`,'GET',{},true)

// 查询城市转为经纬度
export function getWeatherCityLonLatApi(data) {
	return new Promise((resolve, reject) => {
		uni.request({
			method: "GET",
			url: `https://restapi.amap.com/v3/geocode/geo?key=2893e9e0359c52f8e9f1f73d8052d6fc&address=${data}&city=江西`,
			header: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
			},
			success: (res) => {
				resolve(res)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}