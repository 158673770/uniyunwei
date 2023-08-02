<template>
	<view class="container_index">
		<view class="TabBar">
			<u-navbar>
				<view slot="left">
					<u-icon name="arrow-left" @click="gotu"></u-icon>
				</view>
				<view slot="center">
					<view v-if="!searchShow" style="text-align: center;font-size: 36rpx;">
						历史数据
					</view>
				</view>
				<view slot="right" @click="quxian(query)">
					曲线
				</view>
			</u-navbar>
		</view>
		<view class="taps">
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
						<view class="Alarm_type_date_lis" @click="TimeClick(1)" v-if="dataType != 2011 && dataType != 2051">
							{{ StartTime == '' ? '开始时间' : StartTime }}
						</view>
						{{ dataType != 2011 && dataType != 2051 ? '--' : '' }}
						<view class="Alarm_type_date_lis" @click="TimeClick(2)">
							{{ EndTime == '' ? '开始时间' : EndTime }}
						</view>
					</view>
					<!-- 报警类型选择 -->
					<u-picker 
					  
					  :show="tapy == '1'" 
					  :columns="columns"
					  keyName="label"
					  @cancel="tapy = ''"
					  closeOnClickOverlay
					  @close="tapy= ''"
					  @confirm="confirm1"
					></u-picker>
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
		<view class="company-list-box">
			<view class="company-list">
				<view class="table-box">
					<view class="table-header box">
						<view class="table-header-time" v-show="factorData.length">时间</view>
						<view class="table-right">
							<view style="width: 100%;overflow-x: auto;position: relative;" @touchmove.stop.prevent="">	
								<view class="table-header-row" :style="'position: relative;left: -' + parseInt(scrollLeft) + 'px;'">
									<view class="table-header-item" style="display: inline-block;" v-for="i in factorData">{{ i.name }}</view>
								</view>
							</view>
						</view>
					</view>
					<view class="table-body-box">
						<mescroll-uni
							top="scrollTop"
							height="auto"
							ref="mescrollRef"
							@init="mescrollInit"
							@down="downCallback"
							@up="upCallback"
							:down="downOption"
							:up="upOption"
							@scroll="scrollChange"
						>
							<view class="table-body box">
								<view class="table-body-time">
									<view class="table-time-item" v-for="i in dataTime">{{ i }}</view>
								</view>
								<view class="table-right">
									<scroll-view @scroll="bodyScroll" :scroll-anchoring="true" scroll-x="true" style="width: 100%;overflow-anchor: auto;">
										<view class="table-factor-row" v-for="(i, index) in dataTime" :key="index">
											<view class="table-factor-item" v-for="(item,ind) in factorData" :key="ind">
												<text :style="item.data[index].isExceed > 0 ? 'color: red;':''">{{ item.data[index].val}}</text>
											</view>
										</view>
									</scroll-view>
								</view>
							</view>
							<mescroll-empty :option="optEmpty" v-if="factorData.length == 0"></mescroll-empty>
						</mescroll-uni>
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
				factorName:[],
				factorData: [],
				dataTime:[],
				dataList:[],
				optEmpty: {
					use: true,
					icon: null,
					tip: '暂无相关数据',
					btnText: '',
					fixed: true,
					top: '100rpx',
					zIndex: 1
				},
				scrollLeft: 0,
				pixelRatio: 1,
				mescroll: null, // mescroll实例对象 (此行可删,mixins已默认)
				// 下拉刷新的配置(可选, 绝大部分情况无需配置)
				downOption: {},
				// 上拉加载的配置(可选, 绝大部分情况无需配置)
				upOption: {
					page: {
						size: 20 // 每页数据的数量,默认10
					},
					onScroll: true,
					noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					empty: {
						tip: '暂无相关数据'
					}
				},
				searchShow: false,
				// 选择时间
				value:Number(new Date()),
				// 时间选择器显示隐藏
				timeshow:false,
				//时间选择器日月切换
				timedate:'date',
				tabType:1,
				// 下拉
				alarmList:[{
					name:'数据类型',
					tapy:1
				},{
					name:'选择时间',
					tapy:3
				}],
				tapy:'',
				// 报警类型
				columns:[
					[
						{
							label: '实时数据',
							id: 2011
						},{
							label: '小时数据',
							id:2061
						},{
							label: '分钟数据',
							id:2051
						},{
							label: '日数据',
							id: 2031
						}
					]
				],
				// 报警状态
				columns2:[
					[
						{
							label: '报警状态1',
							id: 1
						},{
							label: '报警状态2',
							id: 2
						},{
							label: '报警状态3',
							id: 3
						}
					]
				],
				params: {
					openDate: '',
					endDate: '',
					pageCount: 20,
					pageNo: 1,
					portId: ''
				},
				// 开始时间
				StartTime:'',
				// 结束时间
				EndTime:'',
				// 开始结束时间切换
				statEnd:'',
				query:'',
				factorsCodes:[],
				index:0,
				dataType:2011
			}
		},
		onLoad(query) {
			this.query = query
			console.log("query",query)
			let time = new Date().getTime();
			this.StartTime = this.$u.date(time, 'yyyy-mm-dd 00:00:00');
			this.EndTime = this.$u.date(time, 'yyyy-mm-dd hh:MM:ss');
			if(this.query.type == 4){
				this.columns[0].splice(2, 1);
				// console.log("this",columns.splice(2, 1);)
			}
			if(this.query.type == 3){
				this.alarmList= [{
					name:'选择时间',
					tapy:3
				}]
			}
		},
		// 下拉刷新
		onPullDownRefresh(){
		},
		onReachBottom(){
		},
		mounted() {
			this.getdateList()
		},
		methods: {
			// 查询因子
			getdateList(){
				
				API.getPortFactorsList({portId:this.query.id,type:this.query.type}).then(res =>{
					// this.index++
					// this.columns[0] = res.data.result
					let List = res.data.result
					let idArray = List.map(item => item.factorsCode);
					console.log("idArray",idArray)
					this.factorsCodes = JSON.stringify(idArray)
					console.log('this.factorsCodes',this.factorsCodes)
					this.mescroll.resetUpScroll();
				})
			},
			// 曲线
			quxian(query){
				console.log(query)
				uni.navigateTo({
					url: `../dataquery/item?id=${query.id}&type=${query.type}&pollutionType=${query.pollutionType}`,
				})
			},
			bodyScroll(event) {
				let scrollLeft = event.detail.scrollLeft;
				this.pixelRatio = event.detail.scrollWidth/896 * 1.55
				// this.bodyScrollLeft = scrollLeft
				
				this.scrollLeft = scrollLeft;
			},
			scrollChange(mescroll) {
				// console.log("mescroll",mescroll)
			},
			
			/*上拉加载的回调*/
			upCallback(page){
				// console.log("page",page)
				// console.log("this.$u",this.$u)
				let pageNo= page.num; // 页码, 默认从1开始
				let pageSize = page.size; // 页长, 默认每页10条
				
				let obj = {
					pageNo,
					pageSize,
					dataType:this.dataType,
					portId:this.query.id,
					startDate:this.StartTime,
					endDate:this.EndTime,
					factorsCodes:this.factorsCodes,
					type:this.query.pollutionType != 'null' ? this.query.pollutionType : ''
				}
				
				let apiinfo = ''
				
				if(this.query.type == 1){
					apiinfo = API.getDataByPortFactorsListApp;
				}else if(this.query.type == 2){
					apiinfo = API.getDataByPortFactorsList;
				}else if(this.query.type == 3){
					obj= {
						stationId:this.query.id,
						factorsCodes:this.factorsCodes,
						pageNo,
						pageSize,
						openDate:this.StartTime,
						endDate:this.EndTime
					}
					apiinfo = API.waterList;
				}else if(this.query.type == 4){
					obj= {
						dataType:this.dataType,
						stationId:this.query.id,
						factorsCodes:this.factorsCodes,
						pageNo,
						pageSize,
						openDate:this.StartTime,
						endDate:this.EndTime
					}
					apiinfo = API.getCityStaionData;
				}
				// getDataByPortFactorsListApp 1 getDataByPortFactorsList 2 waterList 3 getCityStaionData4
				apiinfo(obj).then((res)=>{
					
					// console.log("res",res)
					let result = res.data.result
					let factorData = []
					if (page.num == 1){
						this.dataTime = [];
						this.factorData = [];
						// this.factorData = result.records;
						this.dataList = [];
						this.factorName = [];
						if(result.records){
							this.dataList = this.dataList.concat(result.records);
						}
						// console.log("this.factorData",this.factorData) 
						// 获取表格表头
						this.dataList.forEach((item,index) =>{
							// 时间
							this.dataTime.push(item.datatime);
							// 数据
							for(let attr in item){
								if(index == 0){
									if (
										attr != 'CompanyName' &&
										attr != 'createDate' &&
										attr != 'datatime' &&
										attr != 'portName' &&
										attr != 'regionName' &&
										attr != 'cityStationName' &&
										attr != 'watersGradeName' &&
										attr != 'stationName'
									) {
										this.factorName.push(attr);
									}
								}else{
									if (
										attr != 'CompanyName' &&
										attr != 'createDate' &&
										attr != 'datatime' &&
										attr != 'portName' &&
										attr != 'regionName' &&
										attr != 'stationName' &&
										attr != 'cityStationName' &&
										attr != 'watersGradeName' &&
										this.factorName.indexOf(attr) == -1
									) {
										this.factorName.push(attr);
									}
								}
							}
						})
						// console.log(this.factorName);
						// 获取表格内容
						this.factorName.forEach((item, index) => {
							let obj = {
								name: item,
								data: [],
							};
							this.dataList.forEach((i, index) => {
								if (i[item] && i[item].newfvalue != null) {
									// 增加exceeding区分颜色 0:无超标 其他超标
									if(i[item].exceeding){
										obj.data.push({val:i[item].newfvalue,isExceed:i[item].exceeding});
									}else{
										obj.data.push({val:i[item].newfvalue,isExceed:0});
									}
								} else {
									if(i[item].exceeding){
										obj.data.push({val:0,isExceed:i[item].exceeding});
									}else{
										obj.data.push({val:i[item].newfvalue,isExceed:0});
									}
								}
							});
							
							factorData.push(obj);
						});
						this.factorData = factorData
						
					}else{
						this.dataTime = [];
						this.dataList = this.dataList.concat(result.records);
						this.dataList.forEach(item =>{
							// 时间
							this.dataTime.push(item.datatime);
						})
						this.factorName.forEach((item, index) => {
							let obj = {
								name: item,
								data: [],
							};
							this.dataList.forEach((i, index) => {
								if (i[item] && i[item].newfvalue != null) {
									// 增加exceeding区分颜色 0:无超标 其他超标
									if(i[item].exceeding){
										obj.data.push({val:i[item].newfvalue,isExceed:i[item].exceeding});
									}else{
										obj.data.push({val:i[item].newfvalue,isExceed:0});
									}
								} else {
									if(i[item].exceeding){
										obj.data.push({val:0,isExceed:i[item].exceeding});
									}else{
										obj.data.push({val:i[item].newfvalue,isExceed:0});
									}
								}
							});
							factorData.push(obj);
						});
						factorData.forEach(item => {
							this.factorData.forEach(itemOne => {
								if (itemOne.name == item.name) {
									itemOne.data = item.data;
								}
							});
						});
						
					}
					console.log("this.dataTime",this.dataTime)

					console.log("this.factorData",this.factorData)
					// console.log('this.factorData',this.factorData)
					this.mescroll.endByPage(result.size, result.total);
					
				})
			},
			secTimeFormat() {
				let time = new Date().getTime();
				this.params.endDate = this.$u.date(time, 'yyyy-mm-dd hh:MM:ss');
				this.params.openDate = this.$u.date(time - 86400000, 'yyyy-mm-dd hh:MM:ss');
			},
			minTimeFormat() {
				let time = new Date().getTime();
				this.params.endDate = this.$u.date(time, 'yyyy-mm-dd hh:MM');
				this.params.openDate = this.$u.date(time - 86400000, 'yyyy-mm-dd hh:MM');
			},
			hourTimeFormat() {
				let time = new Date().getTime();
				this.params.endDate = this.$u.date(time, 'yyyy-mm-dd hh:');
				this.params.openDate = this.$u.date(time - 86400000, 'yyyy-mm-dd hh:');
			},
			dayTimeFormat() {
				let time = new Date().getTime();
				this.params.endDate = this.$u.date(time, 'yyyy-mm-dd');
				this.params.openDate = this.$u.date(time - 86400000, 'yyyy-mm-dd');
			},
			/*下拉刷新的回调, 有3种处理方式:*/
			downCallback() {
				// 绝大部分情况methods中都不用写downCallback的,此时会默认调MescrollMixin的downCallback (效果同第2种)
			
				this.mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
				// 第3种: 下拉刷新什么也不处理, 可直接调用或者延时一会调用 mescroll.endSuccess() 结束即可
				// //  请求失败,隐藏加载状态
				// this.mescroll.endErr();
				
				
			},
			/*mescroll组件初始化的回调,可获取到mescroll对象 (此处可删,mixins已默认)*/
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
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
					if(this.dataType != 2011 && this.dataType != 2051){
						this.EndTime = year + '-' + month + '-' + day
						this.timeshow = false
					}else{
						this.StartTime = year + '-' + month + '-' + day + ' 00:00:00'
						this.EndTime = year + '-' + month + '-' + day + ' 23:59:59'
						this.timeshow = false
					}
					
				}
				// 两个时间选择完成隐藏时间选择器
				if(this.StartTime != '' && this.EndTime != ''){
					this.tapy = ''
					this.downCallback();
				}
			},
			// 报警状态
			confirm2(val){
				console.log("val",val)
				this.tapy = ''
			},
			// 报警类型选择
			confirm1(val){
				console.log("val",val)
				this.dataType = val.value[0].id
				this.downCallback();
				this.tapy = ''
			},
			// 返回上一页
			gotu(){
				uni.navigateBack({
					delta:1,//返回层数，2则上上页
				})
			},
			alarmTapy(item){
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
				justify-content: center;
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
		.company-list-box {
			height: calc(100vh - 228rpx);
			background: #f6f8fc;
		
			.filter-box {
				background: transparent;
				box-shadow: -10px 0px 10px rgba(155, 155, 155, 0.06), /*左边阴影*/ 0px -10px 10px rgba(155, 155, 155, 0.06), /*上边阴影*/ 10px 0px 10px rgba(155, 155, 155, 0.06),
					/*右边阴影*/ 0px 10px 10px rgba(155, 155, 155, 0.06); /*下边阴影*/
				.date-box {
					width: 50%;
					height: 60rpx;
					margin: 20rpx;
					background: #fff;
					box-sizing: border-box;
					justify-content: space-between;
					line-height: 60rpx;
					color: #666;
					border-radius: 14rpx;
					.open-date {
						margin-left: 20rpx;
						font-size: 24rpx;
					}
					.end-date {
						margin-left: 20rpx;
						font-size: 24rpx;
					}
				}
			}
		
			.company-list {
				height: calc(100% - 100rpx);
				// width: 100%;
				padding: 20rpx 20rpx;
				.table-box {
					background: #fff;
					border-radius: 14rpx;
					color: #666;
					height: 100%;
					overflow: auto;
					box-shadow: -10px 0px 10px rgba(155, 155, 155, 0.06), /*左边阴影*/ 0px -10px 10px rgba(155, 155, 155, 0.06), /*上边阴影*/ 10px 0px 10px rgba(155, 155, 155, 0.06),
						/*右边阴影*/ 0px 10px 10px rgba(155, 155, 155, 0.06); /*下边阴影*/
					.table-header {
						height: 80rpx;
						display: flex;
						.table-header-time {
							width: 400rpx;
							text-align: center;
							line-height: 80rpx;
							height: 80rpx;
							// .table-header-item {
							// 	width: 300rpx;
							// 	text-align: center;
							// 	line-height: 60rpx;
							// 	height: 60rpx;
							// }
						}
						.table-right {
							width: calc(100% - 400rpx);
							// overflow-x: scroll;
							.table-header-row {
								height: 80rpx;
								white-space: nowrap;
								.table-header-item {
									line-height: 80rpx;
									// height: 80rpx;
									// line-height: 40rpx;
									justify-content: center;
									max-height: 80rpx;
									width: 200rpx;
									text-align: center;
									display: inline-block;
									white-space: normal;
								}
							}
						}
					}
					.table-body-box {
						height: calc(100% - 80rpx);
						overflow-y: scroll;
						.table-body {
							display: flex;
							align-items: flex-start;
							.table-body-time {
								width: 400rpx;
								.table-time-item {
									width: 400rpx;
									text-align: center;
									line-height: 80rpx;
									height: 80rpx;
								}
							}
							.table-right {
								width: calc(100% - 400rpx);
								// overflow-x: scroll;
								.table-factor-row {
									white-space: nowrap;
									.table-factor-item {
										height: 80rpx;
										line-height: 80rpx;
										width: 200rpx;
										text-align: center;
										display: inline-block;
									}
								}
							}
						}
					}
				}
			}
		}
	}
</style>