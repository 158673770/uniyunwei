<template>
	<view class="container_index">
		<view class="TabBar">
			<u-navbar>
				<view slot="left">
					<u-icon name="arrow-left" @click="gotu"></u-icon>
				</view>
				<view slot="center">
					<view style="text-align: center;font-size: 36rpx;">
						{{ query.title }}
					</view>
				</view>
			</u-navbar>
		</view>
		<view class="swiper_cant">
			<u-swiper :list="list1" height="200" keyName="uaPath"></u-swiper>
		</view>
		<view class="Shadow">
			<!-- 具体详情 -->
			<view class="Shadow_tap">
				<view class="Shadow_tap_lis" v-for="(item,index) in indexList" :key="index" @click="shadowRecord(item)"  v-show="item.type != query.type && item.types != query.type">
					<view class="Shadow_tap_lis_logo">
						<u-icon class="content_icon" :name="item.name" :size="36" color="#198ecc"></u-icon>
					</view>
					<view class="Shadow_tap_lis_title">
						{{ item.nameClass }}
					</view>
				</view>
			</view>
			<!-- 预警信息 -->
			<view class="Shadow_Read">
				<view class="Shadow_Read_lis" @click="tiaozhuan(1,resultTop.readNum)">
					未读报警{{ resultTop.readNum }}
				</view>
				<view class="Shadow_Read_lis" @click="tiaozhuan(1,resultTop.handerNum)">
					待处理报警{{ resultTop.handerNum }}
				</view>
			</view>
			<!-- 统计数据 -->
			<view class="charts-box" v-if="query.type != 3 && query.type != 4">
				<view class="charts_tap">
					<view class="charts_btn">
						<u-button type="primary" :plain="charIndex == 2" size="mini" text="日" @click="chartsTap(1,3)"></u-button>
						<u-button type="primary" :plain="charIndex == 1" size="mini" text="月" @click="chartsTap(2,2)"></u-button>
					</view>
					<view class="charts_date" v-if="charIndex == 1">
						<view class="charts_date_txt" @click="chartsData(0)">
							{{ charData0 == '' ? '开始时间' : charData0.slice(0, -9) }} --
						</view>
						<view class="charts_date_txt" @click="chartsData(1)">
							{{ charData1 == '' ? '结束时间' : charData1.slice(0, -9) }}
						</view>
					</view>
					<view class="charts_date" v-if="charIndex == 2">
						<u-icon name="arrow-left" color="#2979ff" size="20" @click="chartsADD(1)"></u-icon>
						<view class="charts_date_txt" @click="chartsData(2)">
							{{ charData2 }}
						</view>
						<u-icon name="arrow-right" color="#2979ff" size="20" @click="chartsADD(2)"></u-icon>
					</view>
				</view>
				<view class="charts-box-cart" v-if="sjlx.length != 0">
					<qiun-data-charts type="rose" :opts="opts" :chartData="chartData" />
				</view>
				<view class="charts-box-cart" v-if="sjlx.length == 0">
					<u-empty
						mode="data"
						icon="../../static/images/custom-empty-image.png"
					>
					</u-empty>
				</view>
			</view>
			<!-- 打卡数据 -->
			<view class="charts-box" v-if="query.type != 4">
				<view class="charts_tap">
					<view class="charts_btn">
						<u-button type="primary" :plain="ClockInIndex == 2" size="mini" text="日" @click="ClockInTap(1)"></u-button>
						<u-button type="primary" :plain="ClockInIndex == 1" size="mini" text="月" @click="ClockInTap(2)"></u-button>
					</view>
					<view class="charts_date" v-if="ClockInIndex == 1">
						<view class="charts_date_txt" @click="chartsData2(0)">
							{{ charData5  == '' ? '开始时间' : charData5 }} --
						</view>
						<view class="charts_date_txt" @click="chartsData2(1)">
							{{ charData3  == '' ? '开始时间' : charData3 }}
						</view>
					</view>
					<view class="charts_date" v-if="ClockInIndex == 2">
						<u-icon name="arrow-left" color="#2979ff" size="20" @click="chartsADD2(1)"></u-icon> 
						<view class="charts_date_txt" @click="chartsData2(2)">
							{{ charData4 }}
						</view>
						<u-icon name="arrow-right" color="#2979ff" size="20" @click="chartsADD2(2)"></u-icon>
					</view>
				</view>
				<!-- 打卡记录 -->
				<view class="ClockIn_list">
					<u-collapse>
					   <u-collapse-item
					      :title="`打卡天数${newdayList.attendanceDayConut}天`"
						  name="1"
					    >
						<!-- dayList -->
							<view class="ClockIn_collapse" v-for="(day,neind) in newdayList.dayList">
								<u-cell-group>
									<u-cell
									    size="large"
									    :title="`${day.attendanceTime}${dayweek[Number(day.weekNum)]}${dayId(day.id)}次`"
										@click="dayClick(day)"
									    isLink
									></u-cell>
								</u-cell-group>
							</view>
					    </u-collapse-item> 
					</u-collapse>
				</view>
				<view class="ClockIn_list">
					<u-collapse>
					   <u-collapse-item
					      :title="`打卡次数${newdayList.attendanceCount}次`"
						  name="1"
					    >
							<view class="ClockIn_collapse" v-for="(newd,dyin) in newdayList.list">
								<u-cell-group>
									<u-cell
									    size="large"
									    :title="`${newd.attendanceTime}${dayweek[Number(newd.weekNum)]}`"
										@click="newdClick(newd)"
									    isLink
									></u-cell>
								</u-cell-group>
							</view>
					    </u-collapse-item> 
					</u-collapse>
				</view>
				
			</view>
			<!-- 时间选择 -->
			<view>
				<u-datetime-picker
					:show="show"
					v-model="value1" 
					:mode="timedate"
					@cancel="show = false"
					closeOnClickOverlay
					@close="show=false"
					@confirm="confirm"
				></u-datetime-picker>
				<u-datetime-picker
					:show="show2"
					v-model="value2" 
					:mode="timedate2"
					@cancel="show2 = false"
					closeOnClickOverlay
					@close="show2 = false"
					@confirm="confirm2"
				></u-datetime-picker>
			</view>
			<!-- 消息提示 -->
			<u-notify ref="uNotify" message="Hi uView"></u-notify>
		</view>
	</view>
</template>

<script>
	import * as API from '../../api/appApi.js'
	export default {
		data() {
			return {
				sjlx:['1'],
				resultTop:{
					readNum:'',
					handerNum:''
				},
				dayweek:['星期一','星期二','星期三','星期四','星期五','星期六','星期天'],
				newdayList:{},
				charDataIndex:0,
				charData0:'',
				charData1:'',//统计日日期
				charData2:'选择近一月',//统计月日期
				charData3:'',//开始打卡时间
				charData4:'选择近一月',//统计月日期
				charData5:'',//结束打卡时间
				dkidnex:0,
				ksData1:'',
				ksData2:'',
				ksData3:'',
				ksData4:'',
				charIndex:1,//统计模块日与月状态
				ClockInIndex:1,
				value1: Number(new Date()),//时间选择器value
				value2: Number(new Date()),//时间选择器value
				timedate:'date',//时间选择器日月切换
				timedate2:'date',//时间选择器日月切换
				show: false,//时间选择器显示隐藏
				show2:false,//时间选择器显示隐藏
				list1: [
					// 'https://cdn.uviewui.com/uview/swiper/swiper1.png',
					// 'https://cdn.uviewui.com/uview/swiper/swiper2.png',
					// 'https://cdn.uviewui.com/uview/swiper/swiper3.png',
				],//轮播
				indexList:[{
						name:'map',
						nameClass:'打卡记录',
						url:'../selectsite/clockingRecord',
						lx:1,
						type:4,
						types:''
					},{
						name:'plus',
						nameClass:'台账记录',
						url:'../selectsite/clockingRecord',
						lx:2,
						type:4,
						types:3
					},{
						name:'error-circle',
						nameClass:'报警记录',
						url:'../selectsite/warningrecord',
						type:'',
						types:''
					},{
						name:'file-text',
						nameClass:'数据查询',
						url:'../dataquery/index',
						type:'',
						types:''
					},],
				chartData: {},
				//您可以通过修改 config-ucharts.js 文件中下标为 ['rose'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
				opts: {
					
					color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
						"#ea7ccc"
					],
					padding: [5, 5, 5, 5],
					enableScroll: false,
					legend: {
						show: true,
						position: "right",
						lineHeight: 25
					},
					extra: {
						rose: {
							type: "area",
							minRadius:20,
							activeOpacity: 0.5,
							activeRadius: 10,
							offsetAngle: 0,
							labelWidth: 15,
							border: false,
							borderWidth: 2,
							borderColor: "#FFFFFF"
						}
					}
				},
				// url参数
				query:'',
				// 
				dateType:'',
				openDate:'',
				endDate:''
			}
		},
		onReady() {
			// 微信小程序需要用此写法
			// this.$refs.datetimePicker.setFormatter(this.formatter)
		},
		onLoad(query) {
			this.query = query
			console.log("query",this.query)
		},
		// 下拉刷新
		onPullDownRefresh() {

		},
		onReachBottom() {
		},
		mounted() {
			if(this.query.type != 4){
				this.getServerData();
			}
			// 头部数据
			this.headDate()
		},
		methods: {
			// 跳转已读未读处理页面
			tiaozhuan(val,tnub){
				if(tnub>1){
					if(index == 1){
						uni.navigateTo({
							url: `../unreadalert/index?tapy=1`,
							animationType: 'pop-in',
							animationDuration: 200
						})
					}else{
						uni.navigateTo({
							url: `../unreadalert/index?tapy=2`,
							animationType: 'pop-in',
							animationDuration: 200
						})
					}
				}else{
					uni.showToast({
						title: '暂无数据',
						icon: 'none'
					})
				}
				
			},
			headDate(){
				let parmas = {
					id:this.query.id,
					type:this.query.type
				}
				API.AppInfoQuery(parmas).then(res=>{
					console.log("resresres",res)
					this.list1 = res.data.result.attList
					if(this.list1.length == 0){
						this.list1 = [{
							uaPath:'../../static/images/wd_bg.png'
						}]
					}
					
					this.resultTop = res.data.result
				});
			},
			dayClick(val){
				uni.navigateTo({
					url: `../selectsite/clockingRecord?ids=${val.id}&lx=1&type=${this.query.type}`,
				});
			},
			newdClick(val){
				uni.navigateTo({
					url: `../selectsite/clockingRecordDetails?id=${val.id}&dklx=1&type=${this.query.type}`,
				});
			},
			dayId(val){
				if(val != ''){
					let leng = val.split(",")
					return leng.length
				}
			},
			// 头部tapy跳转
			shadowRecord(item){
				if(item.lx == 1 || item.lx == 2){
					uni.navigateTo({
						url: `${item.url}?id=${this.query.id}&type=${this.query.type}&lx=${item.lx}`,
					});
				}else{
					uni.navigateTo({
						url: `${item.url}?id=${this.query.id}&type=${this.query.type}&pollutionType=${this.query.pollutionType}`,
					});
				}
				
			},
			chartsADD(val){
				if(!isNaN(Date.parse(this.charData2))){
					if(val == 1){
						this.charData2 = this.subtractOneMonth(this.charData2);
						let parmas = {
							dateType:this.dateType,
							dateTypeValue:this.charData2,
							contactId:this.query.id,
							type:this.query.type
						}
						// 玫瑰图数据
						this.ledgerTypeCount(parmas);
					}else if(val == 2){
						this.charData2 = this.addOneMonth(this.charData2);
						let parmas = {
							dateType:this.dateType,
							dateTypeValue:this.charData2,
							contactId:this.query.id,
							type:this.query.type
						}
						// 玫瑰图数据
						this.ledgerTypeCount(parmas);
					}
				}else{
					this.$refs.uNotify.show({
						top: 0,
						type: 'warning',
						message: '请选择时间',
						duration: 1000 * 3,
						fontSize: 20,
						safeAreaInsetTop:true
					})
				}
				
			},
			
			chartsADD2(val){
				if(!isNaN(Date.parse(this.charData4))){
					if(val == 1){
						this.charData4 = this.subtractOneMonth(this.charData4);
						let newdat = new Date(this.charData4)
						var year = newdat.getFullYear();
						var month = ('0' + (newdat.getMonth() + 1)).slice(-2);  // 加1是因为getMonth返回的月份范围是0-11
						console.log("newdat",year,month)
						// 每个月的最后一天
						let lastDay = this.getLastDayOfMonth(year, month);
						let dbdk = {
							id:this.query.id,
							type:this.query.type,
							startTime:year + '-' + month + '-' + '1',
							endTime:this.charData4 + '-' + lastDay,
						}
						// 底部打卡数据
						API.queryAttendanceDataById(dbdk).then(res =>{
							console.log("res底部打卡数据",res)
							this.newdayList = res.data.result
						})
					}else if(val == 2){
						this.charData4 = this.addOneMonth(this.charData4);
						let newdat = new Date(this.charData4)
						var year = newdat.getFullYear();
						var month = ('0' + (newdat.getMonth() + 1)).slice(-2);  // 加1是因为getMonth返回的月份范围是0-11
						console.log("newdat",year,month)
						// 每个月的最后一天
						let lastDay = this.getLastDayOfMonth(year, month);
						let dbdk = {
							id:this.query.id,
							type:this.query.type,
							startTime:year + '-' + month + '-' + '1',
							endTime:this.charData4 + '-' + lastDay,
						}
						// 底部打卡数据
						API.queryAttendanceDataById(dbdk).then(res =>{
							console.log("res底部打卡数据",res)
							this.newdayList = res.data.result
						})
					}
				}else{
					this.$refs.uNotify.show({
						top: 0,
						type: 'warning',
						message: '请选择时间',
						duration: 1000 * 3,
						fontSize: 20,
						safeAreaInsetTop:true
					})
				}
			},
			
			addOneMonth(dateStr) {
			  var parts = dateStr.split('-');
			  var year = parseInt(parts[0]);
			  var month = parseInt(parts[1]);
			  // 增加一个月
			  month += 1;
			  if (month > 12) {
			    month = 1;
			    year += 1;
			  }
			  // 格式化为 'YYYY-MM' 的字符串形式
			  var formattedDate = year + '-' + ('0' + month).slice(-2);
			  return formattedDate;
			},
			subtractOneMonth(dateStr) {
			  var parts = dateStr.split('-');
			  var year = parseInt(parts[0]);
			  var month = parseInt(parts[1]);
			
			  // 减去一个月
			  month -= 1;
			  if (month < 1) {
			    month = 12;
			    year -= 1;
			  }
			
			  // 格式化为 'YYYY-MM' 的字符串形式
			  var formattedDate = year + '-' + ('0' + month).slice(-2);
			
			  return formattedDate;
			},
			charClose(){
				this.show = false
			},
			ClockInTap(val){
				this.ClockInIndex = val
			},
			chartsTap(val,tapy){
				this.charIndex = val
				this.dateType = tapy
			},
			chartsData(val){
				
				if(val == 1 || val == 0){
					this.charDataIndex = val
					this.timedate = 'date'
				}else{
					this.timedate = 'year-month'
				}
				this.show = true
			},
			chartsData2(val){
				if(val == 1 || val == 0){
					this.dkidnex = val
					this.timedate2 = 'date'
				}else{
					this.timedate2 = 'year-month'
				}
				this.show2 = true
			},
			confirm(val){
				var dateObject = new Date(val.value);
				// let dateQt = new Date(val.value);
				// 使用 setDate() 方法将日期设置为七天前
				// console.log("val",val)
				// // 使用日期对象的方法获取年、月、日
				// var year = dateObject.getFullYear();
				// var month = ('0' + (dateObject.getMonth() + 1)).slice(-2);  // 加1是因为getMonth返回的月份范围是0-11
				// var day = ('0' + dateObject.getDate()).slice(-2);
				// // 获取七天前日期
				// let ksDataqt = new Date(dateQt.setDate(dateQt.getDate() - 7))
				// let qtyear = ksDataqt.getFullYear();
				// let qtmonth =('0' + (ksDataqt.getMonth() + 1)).slice(-2); 
				// let qtday = ('0' + ksDataqt.getDate()).slice(-2);
				
				// // 组合年、月、日形成日期字符串
				// var formattedDate = '';
				if(this.charIndex == 1){
					// formattedDate = year + '-' + month + '-' + day;
					// this.ksData1 =  qtyear + '-' + qtmonth + '-' + qtday
					// this.charData1 = formattedDate
					if(this.charDataIndex == 0){
						this.charData0 = this.$u.date(dateObject, 'yyyy-mm-dd 00:00:00');
					}else if(this.charDataIndex == 1){
						this.charData1 = this.$u.date(dateObject, 'yyyy-mm-dd 23:59:59');
					}
					let parmas = {
						dateType:this.dateType,
						openDate:this.charData0,
						endDate:this.charData1,
						contactId:this.query.id,
						type:this.query.type
					}
					if(this.charData0 != '' && this.charData1 != ''){
						console.log("parmas",parmas)
						// 玫瑰图数据
						this.ledgerTypeCount(parmas);
					}
				}else if(this.charIndex == 2){
					// formattedDate = year + '-' + month
					// this.ksData2 =  qtyear + '-' + qtmonth
					this.charData2 =this.$u.date(dateObject, 'yyyy-mm');
					let parmas = {
						dateType:this.dateType,
						dateTypeValue:this.charData2,
						contactId:this.query.id,
						type:this.query.type
					}
					// 玫瑰图数据
					this.ledgerTypeCount(parmas);
					
				}
				this.show = false 
			},
			ledgerTypeCount(parmas){
				API.ledgerTypeCount(parmas).then(res =>{
					console.log("玫瑰图数据",res)
					let resut = res.data.result
					this.sjlx = resut
					resut.forEach(item =>{
						item.value = item.num
						item.name = item.ledgerTypeName
					})
					let resdata = {
						series: [{
							data: resut
						}]
					};
					this.chartData = JSON.parse(JSON.stringify(resdata));
				})
			},
			confirm2(val){
				let dateObject = new Date(val.value);
				let dateQt = new Date(val.value);
				// // 使用日期对象的方法获取年、月、日
				let year = dateObject.getFullYear();
				let month = ('0' + (dateObject.getMonth() + 1)).slice(-2);  // 加1是因为getMonth返回的月份范围是0-11
				// let day = ('0' + dateObject.getDate()).slice(-2);
				// // 前七天数据
				// let ksDataqt = new Date(dateQt.setDate(dateQt.getDate() - 7))
				// let qtyear = ksDataqt.getFullYear();
				// let qtmonth =('0' + (ksDataqt.getMonth() + 1)).slice(-2); 
				// let qtday = ('0' + ksDataqt.getDate()).slice(-2);
				// // 每个月的最后一天
				let lastDay = this.getLastDayOfMonth(year, month);
				// console.log("lastDay",lastDay)
				// 组合年、月、日形成日期字符串
				// let formattedDate = '';
				if(this.ClockInIndex == 1){
					// if(this.dkidnex == 0){
						
					// }
					if(this.dkidnex == 0){
						this.charData5 = this.$u.date(dateObject, 'yyyy-mm-dd');
					}else if(this.dkidnex == 1){
						this.charData3 = this.$u.date(dateObject, 'yyyy-mm-dd');
					}
					// formattedDate = year + '-' + month + '-' + day;
					// this.charData3 = formattedDate
					let dbdk = {
						id:this.query.id,
						type:this.query.type,
						startTime:this.charData5,
						endTime:this.charData3,
					}
					console.log("dbdk",dbdk)
					if(this.charData5 != '' && this.charData3 != ''){
						// 底部打卡数据
						API.queryAttendanceDataById(dbdk).then(res =>{
							console.log("res底部打卡数据",res)
							this.newdayList = res.data.result
						})
					}
					
				}else if(this.ClockInIndex == 2){
					
					// formattedDate = year + '-' + month
					this.charData4 = year + '-' + month + '-' + lastDay
					let dbdk = {
						id:this.query.id,
						type:this.query.type,
						startTime:year + '-' + month + '-' + '1',
						endTime:this.charData4,
					}
					console.log("dbdk",dbdk)
					// 底部打卡数据
					API.queryAttendanceDataById(dbdk).then(res =>{
						console.log("res底部打卡数据",res)
						this.newdayList = res.data.result
					})
				}
				this.show2 = false
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
			getServerData() {
				
				
				
				let dateObject = new Date();
				let dateQt = new Date();
				let year = dateObject.getFullYear();
				let month = ('0' + (dateObject.getMonth() + 1)).slice(-2);  // 加1是因为getMonth返回的月份范围是0-11
				let day = ('0' + dateObject.getDate()).slice(-2);
				// 获取七天前日期
				// let ksDataqt = new Date(dateQt.setDate(dateQt.getDate() - 7))
				// let qtyear = ksDataqt.getFullYear();
				// let qtmonth =('0' + (ksDataqt.getMonth() + 1)).slice(-2); 
				// let qtday = ('0' + ksDataqt.getDate()).slice(-2);
				
				
				
				let dbdk = {
					id:this.query.id,
					type:this.query.type,
					startTime:year + '-' + month + '-' + day + ' 00:00:00',
					endTime:year + '-' + month + '-' + day + ' 23:59:59',
				}
				// 底部打卡数据
				API.queryAttendanceDataById(dbdk).then(res =>{
					console.log("res底部打卡数据",res)
					this.newdayList = res.data.result
				})
				// 玫瑰图
				
				let parmas = {
					dateType:3,
					openDate:year + '-' + month + '-' + day + ' 00:00:00',
					endDate:year + '-' + month + '-' + day + ' 23:59:59',
					contactId:this.query.id,
					type:this.query.type
				}
				
				console.log("parmas",parmas)
				// dateType:'',
				// openDate:'',
				// endDate:''
				if(this.query.type != 3){
					API.ledgerTypeCount(parmas).then(res =>{
						console.log("玫瑰图数据",res)
						let resut = res.data.result
						this.sjlx = resut
						resut.forEach(item =>{
							item.value = item.num
							item.name = item.ledgerTypeName
						})
						let resdata = {
							series: [{
								data: resut
							}]
						};
						this.chartData = JSON.parse(JSON.stringify(resdata));
					})
				}
				
				//模拟从服务器获取数据时的延时
				// setTimeout(() => {
				// 	//模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
				// 	let res = {
				// 		series: [{
				// 			data: 
				// 		}]
				// 	};
				// 	this.chartData = JSON.parse(JSON.stringify(res));
				// }, 500);
			},
			// 返回上一页
			gotu() {
				uni.navigateBack({
					delta: 1, //返回层数，2则上上页
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container_index {
		.TabBar{
			margin-top: 145rpx;
		}
		// .swiper_cant {
		// 	margin-top: 145rpx;
		// }
		.Shadow{
			transform: translate(0, -60rpx);
			padding: 0 3%;
			.Shadow_tap{
				display: flex;
				justify-content: left;
				flex-wrap: wrap;
				padding: 15rpx 3%;
				background-color: #fff;
				border-radius: 10rpx;
				border: 1px solid #eee;
				.Shadow_tap_lis{
					width: 25%;
					display: flex;
					justify-content: center;
					flex-wrap: wrap;
					text-align: center;
					.Shadow_tap_lis_title{
						width: 100%;
						font-size: 26rpx;
					}
				}
			}
			.Shadow_Read{
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				padding: 45rpx 5%;
				background-color: #fff;
				border-radius: 10rpx;
				border: 1px solid #eee;
				margin-top: 15rpx;
				.Shadow_Read_lis{
					width: 45%;
					text-align: center;
				}
			}
			
			
			.charts-box{
				padding: 10rpx 5%;
				background-color: #fff;
				border-radius: 10rpx;
				border: 1px solid #eee;
				margin-top: 15rpx;
				.charts_tap{
					display: flex;
					justify-content: space-between;
					.charts_btn{
						display: flex;
						justify-content: left;
						.u-button{
							width: 26rpx;
							margin-right: 10rpx;
						}
					}
				}
				.charts_date{
					display: flex;
					justify-content: right;
					.charts_date_txt{
						margin: 0 5rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						line-height: 20rpx;
					}
				}
				.charts-box-cart{
					width: 100%;
					height: 400rpx;
				}
				
				.ClockIn_list{
					margin-top: 30rpx;
					.ClockIn_collapse{
						margin-bottom: 10rpx;
					}
				}
			}
		}
	}
</style>