import { request } from '@/request/request.js'

// 获取运维列表
export const getMessageListApi = (data) => request(`/ysyunwei/InspectionRecord/queryInspectionRecordList`,'GET',data,true)

// 获取列表详情   
export const getMessageListDetailApi = (data) => request(`/ysyunwei/InspectionRecord/queryInspectionRecord?portId=${data.portId}&recordId=${data.recordId}`,'GET',{},true)

// 获取城市列表
export const getCityListApi = () => request(`/ysyunwei/area/queryAreaMap`,'GET',{},true)