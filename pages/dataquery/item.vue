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
				<view slot="right" @click="gotu">
					列表
				</view>
			</u-navbar>
		</view>
		<view class="taps">
			<view class="Alarm_type">
				<!-- 切换选择报警类型以及时间 -->
				<view class="Alarm_type_list">
					<view class="Alarm_type_lis">
						<u-button :type="alarmDateTap == 1 ? 'success' : 'primary'" @click="alarmDate(1)" size="mini">日</u-button>
						<u-button :type="alarmDateTap == 2 ? 'success' : 'primary'" @click="alarmDate(2)" size="mini">月</u-button>
					</view>
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
					  keyName="label"
					  @cancel="tapy = ''"
					  closeOnClickOverlay
					  @close="tapy= ''"
					  @confirm="confirm1"
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
		<view class="charts_cant">
			<!-- <view class="charts-box-cart" v-if="sjlx.length != 0">
				<qiun-data-charts type="rose" :opts="opts" :chartData="chartData" />
			</view> -->
			<view class="charts-box-cart" v-if="sjlx.length == 0">
				<u-empty
					mode="data"
					icon="../../static/images/custom-empty-image.png"
				>
				</u-empty>
			</view>
			 <view class="charts-box" v-if="sjlx.length != 0">
			    <qiun-data-charts
				  :ontouch="true"
			      type="line"
			      :opts="opts"
			      :chartData="chartData"
			    />
			  </view>
		</view>
	</view>
</template>

<script>
	import  *as API from '../../api/appApi.js'
	export default {
		data() {
			return {
				sjlx:['1'],
				chartData: {},
				alarmDateTap:1,
				searchShow: false,
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
					tapy: 2
				}, {
					name: '污水处理',
					tapy: 3
				}, {
					name: '城市官网',
					tapy: 4
				}],
				tabType:1,
				// 下拉
				alarmList:[{
					name:'选择时间',
					tapy:3
				}],
				tapy:'',
				// 报警类型
				columns:[
					[
						{
							label: '报警类型1',
							id: 1
						},{
							label: '报警类型2',
							id: 2
						},{
							label: '报警类型3',
							id: 3
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
				// 开始时间
				StartTime:'',
				// 结束时间
				EndTime:'',
				// 开始结束时间切换
				statEnd:'',
				opts: {
					color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
					padding: [15,10,0,15],
					enableScroll: true,
					legend: {},
					xAxis: {
					  disableGrid: true,
					  // scrollShow: true,
					  itemCount: 4
					},
					yAxis: {
					  gridType: "dash",
					  dashLength: 2
					},
					extra: {
					  line: {
						type: "straight",
						width: 2,
						activeType: "hollow"
					  }
					}
				  },
				  query:{},
				  factorsCodes:''
			}
		},
		// onShow(){
		// 	 // plus.screen.lockOrientation('landscape-primary');
		// },
		// onUnload(){
		// 	 // plus.screen.lockOrientation('portrait-primary'); //锁死屏幕方向为竖屏
		// },
		onLoad(query) {
			this.query = query
			let time = new Date().getTime();
			this.StartTime = this.$u.date(time, 'yyyy-mm-dd 00:00:00');
			this.EndTime = this.$u.date(time, 'yyyy-mm-dd 23:59:59');
			this.getdateList();
		},
		// // 下拉刷新
		// onPullDownRefresh(){
			
		// },
		// onReachBottom(){
			
		// },
		// onResize(res) {
		// 	if (res.size.windowWidth > res.size.windowHeight) {
		// 	  // 横屏逻辑
		// 	  console.log('屏幕处于横屏状态');
		// 	  // uni.$forceUpdate()
		// 	  // 刷新页面或执行其他操作
		// 	} else {
		// 	  // 竖屏逻辑
		// 	  // uni.$forceUpdate()
		// 	  console.log('屏幕处于竖屏状态');
		// 	  // 刷新页面或执行其 他操作
		// 	}
		//   },
		mounted() {
			// this.getServerData();
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
					if(idArray.length > 0){
						this.factorsCodes = JSON.stringify(idArray)
					}
					this.getServerData();
					console.log('this.factorsCodes',this.factorsCodes)
				})
			},
			getServerData() { 
				let _this = this
				let obj = {
					dataType: _this.alarmDateTap  == 1 ? '2061' : '2031',//日2061 月 2031
					portId:_this.query.id,
					startDate:_this.StartTime,
					endDate:_this.EndTime,
					factorsCodes:this.factorsCodes,
					type:this.query.pollutionType
				}
				let apiinfo = ''
				
				if(this.query.type == 1){
					apiinfo = API.getDataStaticApp;
				}else if(this.query.type == 2){
					apiinfo = API.getwszDataStaticApp;
				}else if(this.query.type == 3){
					obj = {
						stationId:_this.query.id,
						openDate:_this.StartTime,
						endDate:_this.EndTime,
						factorsCodes:this.factorsCodes,
					}
					apiinfo = API.getszDataStaticApp;
				}else if(this.query.type == 4){
					obj = {
						dataType: _this.alarmDateTap  == 1 ? '2061' : '2031',//日2061 月 2031
						stationId:_this.query.id,
						openDate:_this.StartTime,
						endDate:_this.EndTime,
						factorsCodes:this.factorsCodes,
					}
					apiinfo = API.getgwDataStaticApp;
				}
				
				apiinfo(obj).then(res =>{
					console.log("res",res)
					
					let result = res.data.result
					console.log("result",result)
					let categoriesList = [] 
					console.log("Object.keys(result).length === 0",Object.keys(result).length === 0)
					if(Object.keys(result).length === 0){
						this.sjlx = []
					}else{
						this.sjlx = ['1']
					}
					const keys = Object.keys(result); // 获取所有日期的数组
					const values = Object.values(result); // 获取所有数组的数组
					
					keys.forEach((item,index) =>{
						categoriesList.push({
							date:item,
							values:values[index]
						})
					})
					categoriesList.sort((a, b) => {
					  const dateA = new Date(a.date);
					  const dateB = new Date(b.date);
					  return dateA - dateB;
					});
					// // 除了第一个和最后一个对象，其他对象去除日期中的年月日
					console.log("categoriesList",categoriesList)
					const modifiedData = categoriesList.map((item, index) => {
					  if (index === 0 || index === categoriesList.length - 1) {
					    return {time:item.date,values:item.values}; // 保留第一个和最后一个对象
					  } else {
					    const time = item.date.substring(11); // 提取时间部分
					    return { time, values: item.values };
					  }
					});
					
					// console.log("categories",modifiedData)
					// 获取日期
					let timeList = [];
					// let valueList = [];
					let seriesList = []
					console.log("modifiedData",modifiedData)
					modifiedData.forEach((item,index) =>{
						timeList.push(item.time);
						item.values.forEach((val,inst)=>{
							if(index == 0){
								seriesList.push({
									name: val.factorsName,
									data:[]
								})
							}
						})
					})
					
					modifiedData.forEach((item,index) =>{
						item.values.forEach((val,inst)=>{
							seriesList.forEach((nameval)=>{
								if(val.factorsName == nameval.name){
									nameval.data.push(val.fvalue)
								}
							})
							
						})
					})
					console.log("seriesList",seriesList,"timeList",timeList)
					let charRes = {
						categories:timeList,
						series:seriesList
					}
					_this.chartData = JSON.parse(JSON.stringify(charRes));
					// console.log("categories",categories.sort())
					// console.log("keys",keys,"values",result)
				})
			  //模拟从服务器获取数据时的延时
			 //  setTimeout(() => {
				// //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
				// let res = {
				// 	categories: ["2018","2019","2020","2021","2022","2023"],
				// 	series: [
				// 	  {
				// 		name: "成交量A",
				// 		data: [35,8,25,37,4,20]
				// 	  },
				// 	  {
				// 		name: "成交量B",
				// 		data: [70,40,65,100,44,68]
				// 	  },
				// 	  {
				// 		name: "成交量C",
				// 		data: [100,80,95,150,112,132]
				// 	  }
				// 	]
				//   };
				// this.chartData = JSON.parse(JSON.stringify(res));
			 //  }, 500);
			},
			alarmDate(val){
				this.alarmDateTap = val
				if(val == 1){
					this.timedate = 'date'
					this.StartTime = ''
					this.EndTime = ''
				}else{
					this.timedate = 'year-month'
					this.StartTime = ''
					this.EndTime = ''
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
				let sfm =  this.$u.date(dateObject, 'yyyy-mm-dd 23:59:59');
				
				let lastDay = this.getLastDayOfMonth(year, month);
				if(this.alarmDateTap == 1){
					// 点击确定时候开始结束时间赋值
					if(this.statEnd == '1'){
						this.StartTime = year + '-' + month + '-' + day + ' 00:00:00'
						this.timeshow = false
					}else if(this.statEnd == '2'){
						this.EndTime = sfm
						this.timeshow = false
					}
				}else{
					// 点击确定时候开始结束时间赋值
					if(this.statEnd == '1'){
						this.StartTime = year + '-' + month + '-01'
						this.timeshow = false
					}else if(this.statEnd == '2'){
						this.EndTime = year + '-' + month + '-' + lastDay
						this.timeshow = false
					}
				}
				
				// 两个时间选择完成隐藏时间选择器
				if(this.StartTime != '' && this.EndTime != ''){
					this.tapy = ''
					this.getServerData()
				}
			},
			// 获取每个月的最后一天
			getLastDayOfMonth(year, month) {
			  // 创建一个新的Date对象，将年份和月份作为参数传入
			  // 注意：JavaScript中的月份是从0开始的，所以要将传入的月份减1
			  var date = new Date(year, month - 1, 1);
			
			  // 将日期设置为下个月的第一天
			  date.setMonth(date.getMonth() + 1);
			
			  // 将日期设置为上个月的最后一天
			  date.setDate(date.getDate() - 1);
			
			  // 返回日期的天数
			  return date.getDate();
			},
			// 报警状态
			confirm2(val){
				console.log("val",val)
				this.tapy = ''
			},
			// 报警类型选择
			confirm1(val){
				console.log("val",val)
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
		.TabBar{
			padding-top: 145rpx;
			border-bottom: 1rpx solid #c9c9c9;
		}
		.taps {
			background-color: #fff;
			// .u-tabs{
			// 	.u-tabs__wrapper__nav{
			// 		justify-content: space-between;
			// 	}
			// }
		}
		.Alarm_type{
			padding: 25rpx 5%;
			border-bottom: 1rpx solid #c9c9c9;
			position: relative;
			.Alarm_type_list{
				display: flex;
				justify-content: space-between;
				.Alarm_type_lis{
					display: flex;
					justify-content: center;
					align-items: center;
					width: 33.3%;
					.u-button{
						width: 60rpx;
						margin-right: 10rpx;
					}
				}
			}
			.Alarm_type_cant{
				// position: absolute;
				// bottom: 0;
				// width: 100%;
				// background-color: #fff;
				
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
		.charts_cant{
			height: 60vh;
			.charts-box{
				height: 100%;
			}
		}
	}
</style>