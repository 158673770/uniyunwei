<template>
	<view class="container_index">
		<view class="TabBar">
			<u-navbar>
				<view slot="left">
					<u-icon name="arrow-left" @click="gotu"></u-icon>
				</view>
				<view slot="center">
					<view v-if="!searchShow" style="text-align: center;font-size: 36rpx;">
						{{ query.lx == '1' ? '打卡记录' : '台账记录' }}
					</view>
				</view>
			</u-navbar>
		</view>
		<view class="taps">
			<view class="Alarm_type_list">
				<view class="Alarm_type_lis" v-for="(item,index) in alarmList" :key="item.tapy" @click="alarmTapy(item)" v-if="query.lx == '2'">
					<view class="Alarm_type_lis_tap">
						{{ item.name }}<u-icon :name="tapy == item.tapy ? 'arrow-up' : 'arrow-down'"></u-icon>
					</view>
				</view>
				<view class="Alarm_type_lis" @click="alarmTapy" v-if="query.lx == '1'">
					{{ StartTime == '' ? '开始时间' : StartTime }}--{{ EndTime == '' ? '开始时间' : EndTime }}<u-icon :name="tapy == '' ? 'arrow-up' : 'arrow-down'"></u-icon>
				</view>
			</view>
			<view class="Alarm_type_cant" v-if="tapy == '1'">
				<view class="Alarm_type_date">
					<view class="Alarm_type_date_lis" @click="TimeClick(1)">
						{{ StartTime == '' ? '开始时间' : StartTime }}
					</view>
					--
					<view class="Alarm_type_date_lis" @click="TimeClick(2)">
						{{ EndTime == '' ? '开始时间' : EndTime }}
					</view>
					
				</view>
			</view>
		</view>
		<!-- 打卡记录 -->
		<view class="clock_in_records_list" v-if="query.lx == '1'">
			<u-empty
				mode="list"
				icon="../../static/images/custom-empty-image.png"
				v-if="datelist.length == 0"
			>
			</u-empty>
			<view class="clock_in_records_lis" v-for="(item,index) in datelist" @click="clockgo(item,1)">
				<view class="clock_in_records_img">
					<image :src="item.attList[0] ? item.attList[0].uaPath :'../../static/images/tx.png'"></image>
				</view>
				<view class="clock_in_records_right">
					<view class="clock_in_records_tit">
						{{item.contactName}}
					</view>
					<view class="clock_in_records_val">
						{{ item.stationName }}
					</view>
					<view class="clock_in_records_val">
						<view class="recor_pas">
							{{ item.userName }}
						</view>
						<view class="recor_pas">
							{{ item.attendanceTime }}
						</view>
					</view>
					<view class="clock_in_records_val">
						{{ item.address }}
					</view>
				</view>
			</view>
		</view>
		<view class="ledger" v-if="query.lx == '2'">
			<u-empty
				mode="list"
				icon="../../static/images/custom-empty-image.png"
				v-if="datelist.length == 0"
			>
			</u-empty>
			<view class="ledger_lis" v-for="(item,index) in datelist" @click="clockgo(item,2)">
				<view class="ledger_tit">
					<view class="ledger_tit_le">
						{{ item.portName }}
					</view>
					<view class="ledger_tit_re">
						{{ item.ledgerTypeName }}
					</view>
				</view>
				<view class="ledger_val">
					{{ item.escalationDate }}
				</view>
				<view class="ledger_val" style="font-size: 16rpx;">
					<!-- 南昌市某某路 -->
					{{ item.demo }}
				</view>
				<view class="ledger_img">
					<u-album :urls="item.attList" keyName="uaPath" :key="index"></u-album>
				</view>
			</view>
		</view>
		<u-datetime-picker
			:show="timeshow"
			v-model="value" 
			:mode="timedate"
			@cancel="timeshow = false"
			closeOnClickOverlay
			@close="timeshow = false"
			@confirm="confirm3"
		></u-datetime-picker>
		
		<!-- 报警状态选择 -->
		<u-picker
		  :show="tapy == '2'" 
		  :columns="columns2" 
		  keyName="itemText"
		  :key="index"
		  @cancel="tapy = ''"
		  closeOnClickOverlay
		  @close="tapy= ''"
		  @confirm="confirm2"
		></u-picker>
	</view>
</template>

<script>
	import  *as API from '../../api/appApi.js'
	export default {
		data() {
			return {
				alarmList:[{
					name:'开始结束--时间',
					tapy:1
				},{
					name:'台账类型',
					tapy:2
				}],
				// 报警状态
				columns2:[
					[
						{
							label: '台账类型1',
							id: 1
						},{
							label: '台账类型2',
							id: 2
						},{
							label: '台账类型3',
							id: 3
						}
					]
				],
				searchShow: false,
				keyword: '',
				// 开始时间
				StartTime:'',
				// 结束时间
				EndTime:'',
				// 时间选择器显示隐藏
				timeshow:false,
				timedate:'date',
				value:Number(new Date()),
				tapy:'',
				query:'',
				pageNo:1,
				pageSize:10,
				index:0,
				ledgerType:'',
				datelist:[]
			}
		},
		onLoad(query) {
			this.query = query
			console.log("this.query",this.query )
		},
		// 下拉刷新
		onPullDownRefresh(){
			
		},
		// 上拉加载
		onReachBottom(){
			console.log("上拉加载")
			
		},
		mounted() {
			this.listsjzt();
			this.getData();
		},
		methods: {
			listsjzt(){
				API.list2({code:'ledger_type'}).then(res =>{
					console.log("ledger_type",res)
					
					this.columns2[0] = res.data.result
					
					this.index++
					this.columns2[0].unshift({
						itemText: '全部',
						id: ''
					});
					console.log("this.columns2",this.columns2)
				})
				// API.list2();
			},
			getData(){
				// 打卡与台账接口
				let parmas = {
					contactId:this.query.id,
					ledgerType:this.ledgerType ? this.ledgerType : '',
					type:this.query.type,
					pageNo:this.pageNo,
					pageSize:this.pageSize
				}
				if(this.query.lx == 1){
					if(this.query.ids && this.query.ids != ''){
						let parms = {
							ids:this.query.ids,
							type:this.query.type
						}
						console.log("ids")
						API.ysAttendanceList(parms).then(res =>{
							console.log("res",res)
							this.datelist = res.data.result.records
						})
					}else{
						let parms = {
							id:this.query.id,
							type:this.query.type,
							startTime:this.StartTime,
							endTime:this.EndTime,
							pageNo:this.pageNo,
							pageSize:this.pageSize
						}
						console.log("id")
						API.ysAttendanceList(parms).then(res =>{
							console.log("res",res)
							this.datelist = res.data.result.records
						})
					}
					console.log("res打卡记录")
				}else{
					let parms = {
						contactId:this.query.id,
						ledgerType:this.ledgerType,
						type:this.query.type,
						openDate:this.StartTime,
						endDate:this.EndTime,
						pageNo:this.pageNo,
						pageSize:this.pageSize
					}
					
					API.ClockingRecord(parmas).then(res =>{
						console.log("res台账记录",res)
						this.index++
						this.datelist = res.data.result.records
					})
				}
				
			},
			// 筛选选择台账类型
			confirm2(val){
				console.log("val",val)
				this.ledgerType = val.value[0].itemValue
				this.tapy = ''
				this.getData();
			},
			// 跳转详情页面
			clockgo(item,lx){
				if(lx == 1){
					uni.navigateTo({
						url: `../selectsite/clockingRecordDetails?id=${item.id}&type=${this.query.type}&dklx=${lx}`,
					});
				}else{
					uni.navigateTo({
						url: `../selectsite/clockingRecordDetails?id=${item.ledgerId}&type=${this.query.type}&dklx=${lx}`,
					});
					
				}
				// 断网模拟id
				
				
			},
			// 显示隐藏时间筛选
			alarmTapy(item){
				if(this.query.lx == '1'){
					if(this.tapy == '1'){
						this.tapy = ''
					}else{
						this.tapy = '1'
					}
				}else{
					if(this.tapy == item.tapy){
						this.tapy = ''
					}else{
						this.tapy = item.tapy
					}
				}
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
				// // 两个时间选择完成隐藏时间选择器
				if(this.StartTime != '' && this.EndTime != ''){
					this.tapy = ''
					this.getData()
				}
			},
			// 时间选择显示隐藏
			TimeClick(tapy){
				this.statEnd = tapy;
				this.timeshow = true
			},
			// 返回上一页
			gotu(){
				uni.navigateBack({
					delta:1,//返回层数，2则上上页
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container_index {
		.TabBar{
			padding-top:145rpx;
			border-bottom: 1rpx solid #c9c9c9;
		}
		.taps{
			padding: 15rpx 0;
			.Alarm_type_list{
				display: flex;
				justify-content: center;
				padding: 0 10%;
				.Alarm_type_lis{
					display: flex;
					justify-content: center;
					margin: 0 5%;
					.Alarm_type_lis_tap{
						width: 100%;
						display: flex;
						justify-content: center;
					}
					// width: 33.3%;
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
		// 打卡
		.clock_in_records_list{
			padding: 20rpx 3%;
			background-color: rgba(242, 242, 242, 1);
			.clock_in_records_lis{
				display: flex;
				justify-content: space-between;
				background-color: #fff;
				padding: 15rpx;
				border-radius: 15rpx;
				margin-bottom: 15rpx;
				.clock_in_records_img{
					width: 25%;
					display: flex;
					justify-content: center;
					align-items: center;
					image{
						width: 145rpx;
						height: 145rpx;
					}
				}
				.clock_in_records_right{
					width: 70%;
					.clock_in_records_tit{
						font-size: 36rpx;
						padding: 15rpx 0;
					}
					.clock_in_records_val{
						font-size: 20rpx;
						padding-bottom: 10rpx;
						padding-right: 10%;
						display: flex;
						justify-content: space-between;
					}
				}
			}
		}
		// 台账
		.ledger{
			padding: 20rpx 3%;
			background-color: rgba(242, 242, 242, 1);
			.ledger_lis{
				background-color: #fff;
				padding: 15rpx;
				border-radius: 15rpx;
				margin-bottom: 15rpx;
				.ledger_tit{
					display: flex;
					justify-content: space-between;
					padding: 10rpx 3% 10rpx 0;
				}
				.ledger_val{
					padding: 5rpx 0;
				}
			}
		}
	}
</style>