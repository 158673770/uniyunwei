<template>
	<view class="container_index">
		
		<view class="TabBar">
			<u-navbar>
				<view slot="left">
					<u-icon name="arrow-left" @click="gotu"></u-icon>
				</view>
				<view slot="center">
					<view v-if="!searchShow" style="text-align: center;font-size: 36rpx;">
						报警管理
					</view>
				</view>
			</u-navbar>
		</view>
		
		<view class="taps">
			<!-- 筛选 -->
			<!-- <u-tabs :list="Tabs" @click="clickTabs" itemStyle="width:24%;padding-left: 0; padding-right: 0; height: 34px;"></u-tabs> -->
			<view class="Alarm_type">
				<!-- 切换选择报警类型以及时间 -->
				<view class="Alarm_type_list">
					<view class="Alarm_type_lis" v-for="(item,index) in alarmList" :key="item.tapy" @click="alarmTapy(item)">
						{{ item.name }}<u-icon :name="tapy == item.tapy ? 'arrow-up' : 'arrow-down'"></u-icon>
					</view>
				</view>
				<view class="Alarm_type_cant">
					<!-- 选择开始结束时间 -->
					<view class="Alarm_type_date" v-if="tapy == '3'">
						<view class="Alarm_type_date_lis" @click="TimeClick(1)">
							{{ StartTime == '' ? '开始时间' : StartTime }}
						</view>
						--
						<view class="Alarm_type_date_lis" @click="TimeClick(2)">
							{{ EndTime == '' ? '开始时间' : EndTime }}
						</view>
					</view>
					<!-- 报警类型选择 -->
					<u-picker 
					  :show="tapy == '1'" 
					  :columns="columns" 
					  keyName="alarmTypeName"
					  @cancel="tapy = ''"
					  closeOnClickOverlay
					  @close="tapy= ''"
					  @confirm="confirm1"
					  :key="index"
					></u-picker>
					<!-- 报警状态选择 -->
					<u-picker
					  :show="tapy == '2'" 
					  :columns="columns2" 
					  keyName="label"
					  @cancel="tapy = ''"
					  closeOnClickOverlay
					  @close="tapy= ''"
					  @confirm="confirm2"
					></u-picker>
					<!-- 时间选择 -->
					<u-datetime-picker
						:show="timeshow"
						v-model="value" 
						:mode="timedate"
						@cancel="timeshow = false"
						closeOnClickOverlay
						@close="timeshow = false"
						@confirm="confirm3"
					></u-datetime-picker>
				</view>
			</view>
		</view>
		<!-- 列表模块 -->
		<view class="AlarmManagementList">
			<u-empty
				mode="list"
				icon="../../static/images/custom-empty-image.png"
				v-if="gementList.length == 0"
			>
			</u-empty>
			<view class="AlarmManagementLis" v-for="(gemen,index) in gementList" :key="gemen.id" @click="AlarmClick(gemen)">
				<view class="AlarmManagementList_title">
					{{ gemen.titleName }}
				</view>
				<view class="AlarmManagementList_val" v-if="gemen.name">
					
					{{ listName[Number(tabType)] }}：{{ gemen.name }}
				</view>
				<view class="AlarmManagementList_val">
					报警类型：{{ gemen.alarmName }}
				</view>
				<view class="AlarmManagementList_val">
					报警时间：{{ gemen.handleDate }}
				</view>
				<view class="AlarmManagementList_val">
					报警内容：{{ gemen.content }}
				</view>
				<view class="AlarmManagementList_clzt">
					<view :class="{'AlarmManagementList_zt':gemen.status != '0'}">
						{{ gemen.status != '0' ? '已处理' : '待处理' }}
					</view>
					<view class="AlarmManagementList_bg" v-if="gemen.readStatus == '0'">
						
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import  *as API from '../../api/appApi.js'
	export default {
		data() {
			return {
				listName:[
					'',
					'企业名称',
					'所属污水处理站',
					'',
					''
				],
				gementList:[],
				searchShow: false,
				index:1,
				// 选择时间
				value:Number(new Date()),
				// 时间选择器显示隐藏
				timeshow:false,
				//时间选择器日月切换
				timedate:'date',
				Tabs: [{
					name: '污染源',
					tapy: 1
				}, {
					name: '水质监测',
					tapy: 3
				}, {
					name: '污水处理',
					tapy: 2
				}, {
					name: '城市官网',
					tapy: 4
				}],
				tabType:1,
				// 下拉
				alarmList:[{
					name:'报警类型',
					tapy:1
				},{
					name:'报警状态',
					tapy:2
				},{
					name:'报警时间',
					tapy:3
				}],
				tapy:'',
				// 报警类型
				columns:[
					[
						
					]
				],
				// 报警状态
				columns2:[
					[
						{
							label: '全部',
							id: ''
						},
						{
							label: '待处理',
							id: 0
						},{
							label: '已处理',
							id: 1
						}
					]
				],
				// 开始时间
				StartTime:'',
				// 结束时间
				EndTime:'',
				// 开始结束时间切换
				statEnd:'',
				alarmTypeId:'',
				status:'',
				query:''
			}
		},
		onLoad(query) {
			this.query = query
		},
		// 下拉刷新
		onPullDownRefresh(){
			this.getData();
		},
		// 上拉加载
		onReachBottom(){
			console.log("上拉加载")
			// uni.startPullDownRefresh()
		},
		mounted() {
			this.getData();
			this.getbjlx();
		},
		methods: {
			async getbjlx(){
				// 报警记录报警类型接口
				let res = await API.AlarmRecordTapy();
				// console.log("res",res)
				if(res.data.code == 200){
					this.index ++
					this.columns[0] = res.data.result
					this.columns[0].unshift({
						alarmTypeName: '全部',
						id: ''
					});
				}
			},
			// 跳转详情
			AlarmClick(gemen){
				console.log("gemen",gemen)
				// 类型id
				// this.tabType
				uni.navigateTo({
					url: `../alarmmanagement/item?id=${gemen.id}&type=${this.query.type}`,
				});
			},
			async getData(){
				
				let data = {
					monitoringId:this.query.id,
					alarmType:this.alarmTypeId,
					status:this.status,
					startDate:this.StartTime,
					endDate:this.EndTime,
					type:this.query.type
				}
				console.log("data",data)
				// StartTime:'',
				// // 结束时间
				// EndTime:'',
				// 报警列表接口
				this.gementList = [];
				
				let res = await API.AlarmRecord(data);
				
				console.log("res",res)
				if(res.data.code == 200){
					// 去除下拉刷新控件
					uni.stopPullDownRefresh();
					this.gementList = res.data.result.list
				}
			},
			// 时间选择显示隐藏
			TimeClick(tapy){
				this.statEnd = tapy;
				this.timeshow = true
			},
			// 时间选择
			confirm3(val){
				var dateObject = new Date(val.value);
				// 使用日期对象的方法获取年、月、日
				var year = dateObject.getFullYear();
				var month = ('0' + (dateObject.getMonth() + 1)).slice(-2);  // 加1是因为getMonth返回的月份范围是0-11
				var day = ('0' + dateObject.getDate()).slice(-2);
				
				// 点击确定时候开始结束时间赋值
				if(this.statEnd == '1'){
					this.StartTime = year + '-' + month + '-' + day
					this.timeshow = false
				}else if(this.statEnd == '2'){
					this.EndTime = year + '-' + month + '-' + day
					this.timeshow = false
				}
				// 两个时间选择完成隐藏时间选择器
				if(this.StartTime != '' && this.EndTime != ''){
					this.tapy = ''
					this.getData();
				}
			},
			// 报警状态
			confirm2(val){
				console.log("val",val.value[0].id)
				this.status = val.value[0].id
				this.tapy = ''
				this.getData();
			},
			// 报警类型选择
			confirm1(val){
				console.log("val",val.value[0].alarmTypeId)
				this.alarmTypeId = val.value[0].alarmTypeId
				this.tapy = ''
				this.getData();
			},
			// 返回上一页
			gotu(){
				uni.navigateBack({
					delta:1,//返回层数，2则上上页
				})
			},
			// 切換不同类型站点数据
			clickTabs(val) {
				
				console.log("val", val)
				this.tabType = val.tapy
				this.getData()
				
			},
			alarmTapy(item){
				
				console.log("this.columns",this.columns)
				if(this.tapy == item.tapy){
					this.tapy = ''
				}else{
					this.tapy = item.tapy
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container_index {
		
		.taps {
			padding-top: 145rpx;
			background-color: #fff;
			// .u-tabs{
			// 	.u-tabs__wrapper__nav{
			// 		justify-content: space-between;
			// 	}
			// }
		}
		.Alarm_type{
			padding: 25rpx 5%;
			.Alarm_type_list{
				display: flex;
				justify-content: left;
				.Alarm_type_lis{
					display: flex;
					justify-content: center;
					width: 33.3%;
				}
			}
			.Alarm_type_cant{
				.Alarm_type_date{
					display: flex;
					justify-content: center;
					align-items: center;
					padding: 40rpx 0;
					.Alarm_type_date_lis{
						border: 1rpx solid #eee;
						padding: 15rpx;
					}
				}
			}
		}
		// 列表
		.AlarmManagementList{
			background-color: rgba(242, 242, 242, 1);
			padding: 25rpx;
			.AlarmManagementLis{
				padding: 15rpx;
				border: 1rpx solid #eee;
				background-color: #fff;
				border-radius: 15rpx;
				position: relative;
				margin-bottom: 20rpx;
				.AlarmManagementList_title{
					width: 75%;
					font-size: 36rpx;
					margin-bottom: 16rpx;
				}
				.AlarmManagementList_val{
					margin-bottom: 16rpx;
					font-size: 26rpx;
				}
				.AlarmManagementList_clzt{
					position: absolute;
					right: 15rpx;
					top: 15rpx;
					color: #039D12;
					display: flex;
					justify-content: space-between;
					align-items: center;
					width: 24%;
					.AlarmManagementList_zt{
						color: #D9001B;
					}
					.AlarmManagementList_bg{
						margin-left: 16rpx;
						display: block;
						width: 30rpx;
						height: 30rpx;
						border-radius: 50%;
						background-color: #D9001B;
					}
				}
			}
		}
	}
</style>