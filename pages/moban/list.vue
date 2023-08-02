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
			<u-tabs :list="Tabs" @click="clickTabs" itemStyle="width:24%;padding-left: 0; padding-right: 0; height: 34px;"></u-tabs>
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
	</view>
</template>

<script>
	import  *as API from '../../api/appApi.js'
	export default {
		data() {
			return {
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
				statEnd:''
			}
		},
		onLoad() {
		},
		// 下拉刷新
		onPullDownRefresh(){
			
		},
		onReachBottom(){
			
			
			
		},
		mounted() {
		},
		methods: {
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
				this.tapy = ''
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
				// this.initDataList()
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
	}
</style>