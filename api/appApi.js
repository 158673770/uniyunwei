import { request2,request } from '@/request/request.js'

// 获取首页数据 pages/tabbar/index 1
export const home = (data) => request(`/ysyunwei/app/homePage/query`,'GET',data,true)

// 获取通知列表 pages/tabbar/message
export const inform = (data) => request(`/ysyunwei/app/ysNoticeMessage/list`,'GET',data,true)

// 管理站点列表 pages/selectsite/index 1
export const DevOpsList = (data) => request(`/ysyunwei/app/homePage/queryStationList`,'GET',data,true)
// 管理站点详情 pages/selectsite/item 1
export const AppInfoQuery = (params) => request(`/ysyunwei/appInfo/query`,'GET',params,true)
// 未读预警列表 
export const queryUnreadAlarm = (params) => request(`/ysyunwei/app/homePage/queryUnreadAlarm`,'GET',params,true)
// 未处理预警列表 
export const queryPendingProcessingAlarm = (params) => request(`/ysyunwei/app/homePage/queryPendingProcessingAlarm`,'GET',params,true)
// 管理站点打卡数据 
export const queryAttendanceDataById = (params) => request(`/ysyunwei/station/ysAttendance/queryAttendanceDataById`,'GET',params,true)
// 打卡详情  pages/clockingstation/item  
export const queryStationInfo = (params) => request(`/ysyunwei/app/homePage/queryStationInfo`,'GET',params,true)
// 打卡详情删除附件接口 pages/clockingstation/item  
export const delUploadAttById = (params) => request(`/ysyunwei/file/delUploadAttById`,'GET',params,true)
// 打卡提交 pages/clockingstation/item  
export const YsAttendanceAdd = (params) => request(`/ysyunwei/station/ysAttendance/add`,'POST',params,true)
// 玫瑰图数据
export const ledgerTypeCount = (params) => request(`/ysyunwei/appInfo/ledgerTypeCount`,'get',params,true)
// 台账上传提交 pages/clockingstation/item  
export const YsLedgerAdd = (params) => request(`/ysyunwei/app/ysLedger/appAdd`,'POST',params,false)

// 台账上报列表 pages/accountreporting/index 1
export const YsLedgerList = (data) => request(`/ysyunwei/app/ysLedger/List`,'GET',data,true)

// 台账记录详情 pages/selectsite//clockingRecordDetails 1
export const queryById = (params) => request(`/ysyunwei/app/ysLedger/queryById`,'GET',params,true)
// 打卡记录列表  pages/selectsite/clockingRecord  1
export const ysAttendanceList= (params) => request(`/ysyunwei/station/ysAttendance/list`,'GET',params,true)
// 打卡记录详情 pages/selectsite/clockingRecordDetails 1
export const ysAttendanceQueryById = (params) => request(`/ysyunwei/station/ysAttendance/queryById`,'GET',params,true)
// 报警记录列表 pages/alarmmanagement/index 1
export const AlarmRecord = (data) => request(`/ysyunwei/commonalarm/alarmListAPP`,'POST',data,false)
// 报警记录报警类型接口 pages/alarmmanagement/index 1
export const AlarmRecordTapy = (data) => request(`/ysyunwei/alarmtype/alarmType/list`,'GET',data,true)
// 报警记录详情 pages/alarmmanagement/item 1
export const AlarmDetails = (params) => request(`/ysyunwei/commonalarm/getAlarmAPP`,'POST',params,false)
// 报警记录处理接口 pages/alarmmanagement/item 1
export const handleAlarmAPP = (params) => request(`/ysyunwei/commonalarm/handleAlarmAPP`,'POST',params,false)
// 报警记录已读未读 pages/alarmmanagement/item 1
export const readrecordApp = (data) => request(`/ysyunwei/commonalarm/readrecordApp`,'POST',data,false)
// 基础信息 --- 污染源排口-水质监测点-污水站排口-城市官网-列表 pages/sortord/index 1
export const AppInfoList = (params) => request(`/ysyunwei/appInfo/list`,'GET',params,true)
// 行政区域
export const queryAreaMap = (params) => request(`/ysyunwei/area/queryAreaMap`,'GET',params,true)

// 台账记录列表 /pages/selectsite/clockingRecord 1
export const ClockingRecord = (params) => request(`/ysyunwei/app/ysLedger/List`,'get',params,true)
// 数据字典
export const list2 = (params) => request(`/ysyunwei/sys/dictItem/list2`,'GET',params,true)

// 查询因子数据查询
export const getPortFactorsList = (params) => request(`/ysyunwei/dischargePort/getPortFactorsList`,'GET',params,true)
// 污染源 数据查询 pages/dataquery/index
export const getDataByPortFactorsListApp = (params) => request(`/ysyunwei/pollution/getDataByPortFactorsListApp`,'GET',params,'Accept')
// 污水处理厂-数据查询-列表 getDataByPortFactorsListApp 1 getDataByPortFactorsList 2 waterList 3 getCityStaionData4
export const getDataByPortFactorsList = (params) => request(`/ysyunwei/app/sewage/getDataByPortFactorsList`,'GET',params,'Accept')
// 水站-数据查询-列表
export const waterList = (params) => request(`/ysyunwei/app/water/list`,'GET',params,'Accept')
// 城市官网数据查询
export const getCityStaionData = (params) => request(`/ysyunwei/api/cityStaionData/getCityStaionData`,'GET',params,'Accept')

// 污染源曲线图数据 pages/dataquery/item
export const getDataStaticApp = (params) => request(`/ysyunwei/pollution/getDataStaticApp`,'GET',params,'Accept')
// 污水站曲线图数据 pages/dataquery/item
export const getwszDataStaticApp = (params) => request(`/ysyunwei/app/sewage/getDataStaticApp`,'GET',params,'Accept')
// 水站曲线图数据 pages/dataquery/item
export const getszDataStaticApp = (params) => request(`/ysyunwei/app/water/getDataStaticApp`,'GET',params,'Accept')
// 官网曲线图数据 pages/dataquery/item
export const getgwDataStaticApp = (params) => request(`/ysyunwei/api/cityStaionData/getCityStaionDataApp`,'GET',params,'Accept')


