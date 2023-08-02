<template>
	<view class="container_index">
		<view class="TabBar">
			<u-navbar>
				<view slot="left">
					<u-icon name="arrow-left" @click="gotu"></u-icon>
				</view>
				<view slot="center">
					<view v-if="!searchShow"  style="text-align: center;font-size: 36rpx;">
						{{ query.name }}
					</view>
				</view>
			</u-navbar>
		</view>
		<view class="taps">
			<!-- <u-tabs :list="Tabs" @click="clickTabs" itemStyle="width:24%;padding-left: 0; padding-right: 0; height: 34px;"></u-tabs> -->
			<view class="Alarm_type">
				<!-- 切换选择报警类型以及时间 -->
				<view class="Alarm_type_list">
					
					
					<uni-data-picker v-slot:default="{data, error, options}" @nodeclick="onchange" :localdata="items" @popupopened="tapy = 1" @popupclosed="tapy = ''" popup-title="请选择所在地区">
						
					 <!-- <view v-if="error" class="error">
						<text>{{error}}</text>
					  </view>
					  <view v-else-if="data.length" class="selected">
						<view v-for="(item,index) in data" :key="index" class="selected-item">
						  <text>{{item.text}}</text>
						</view>
					  </view>
					  <view v-else>
						<text>行政区划</text>
					  </view> -->
					  <view class="Alarm_type_lis">
							行政区划
							<u-icon :name="tapy == 1 ? 'arrow-up' : 'arrow-down'"></u-icon>
					  </view>
					  <!-- {
					  	name:'行政区划',
					  	tapy:1
					  }, -->
					</uni-data-picker>
					<view class="Alarm_type_lis" v-for="(item,index) in alarmList" :key="item.tapy" @click="alarmTapy(item)" v-show="query.type != 4">
						{{ item.name }}<u-icon :name="tapy == item.tapy ? 'arrow-up' : 'arrow-down'"></u-icon>
					</view>
				</view>
				<view class="Alarm_type_cant">
					
					<!-- 报警类型选择 -->
					<!-- <uni-data-picker ref="datapicker" :localdata="items" popup-title="请选择班级" @change="onchange" @nodeclick="onnodeclick"></uni-data-picker> -->
					<!-- <u-picker 
					  :show="tapy == '1'" 
					  :columns="columns" 
					  keyName="label"
					  @cancel="tapy = ''"
					  closeOnClickOverlay
					  @close="tapy= ''"
					  @confirm="confirm1"
					></u-picker> -->
					<!-- 报警状态选择 -->
					<u-picker
					  :show="tapy == '2'"
					  :keyName='query.type == "3" ? "itemText" : "label"'
					  :key="index"
					  @cancel="tapy = ''"
					  closeOnClickOverlay
					  @close="tapy= ''"
					  @confirm="confirm2"
					  :columns="columns2" 
					></u-picker>
				</view>
			</view> 
		</view>
		<view class="clock_in_records_list">
			<u-empty
				mode="list"
				icon="../../static/images/custom-empty-image.png"
				v-if="recordsList.records && recordsList.records.length == 0"
			>
			</u-empty>
			<view class="clock_in_records_lis" v-for="(item,index) in recordsList.records" @click="clockgo(item)">
				<view class="clock_in_records_img">
					<image :src="item.attList.length > 0 ? item.attList[0].uaPath : '../../static/images/tx.png'" ></image>
				</view>
				<view class="clock_in_records_right">
					<view class="clock_in_records_tit">
						<!-- 某某排口 -->
						{{ item.title }}
					</view>
					<view class="clock_in_records_val">
						<!-- 某某企业 -->
						{{ item.content }}
					</view>
					<view class="clock_in_records_val">
						<!-- 江西南昌怡杉环保 -->
						{{ item.address }}
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
				classes: '1-2',
				 items: [{
				  text: "一年级",
				  value: "1-0",
				  children: [
					{
					  text: "1.1班",
					  value: "1-1"
					},
					{
					  text: "1.2班",
					  value: "1-2"
					}
				  ]
				},
				{
				  text: "二年级",
				  value: "2-0"
				},
				{
				  text: "三年级",
				  value: "3-0"
				}],
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
					name:'排口类型',
					tapy:2
				}],
				tapy:'',
				// 报警类型
				columns:[
					[
						{
							label: '行政区划1',
							id: 1
						},{
							label: '行政区划2',
							id: 2
						},{
							label: '行政区划3',
							id: 3
						}
					]
				],
				// 报警状态
				columns2:[
					// [
					// 	{
					// 		label: '排口类型1',
					// 		id: 1
					// 	},{
					// 		label: '排口类型2',
					// 		id: 2
					// 	},{
					// 		label: '排口类型3',
					// 		id: 3
					// 	}
					// ]
				],
				// 开始时间
				StartTime:'',
				// 结束时间
				EndTime:'',
				// 开始结束时间切换
				statEnd:'',
				// 路由取值
				query:'',
				recordsList:[],
				xzqhValue:'',
				queryType:'',
				index:0,
				pageSize:10,
				pageNo:1
			}
		},
		onLoad(query) {
			this.query =query
			if(this.query.type == 1){
				this.alarmList[0].name = "排口类型"
				this.columns2[0] = [
					{
						label: '全部',
						id: ''
					},
					{
						label: '废水',
						id: 4
					},{
						label: '废气',
						id: 3
					}
				]
			}else if(this.query.type == 2){
				this.alarmList[0].name = "污水处理站类型"
				this.columns2[0] = [
					{
						label: '全部',
						id: ''
					},
					{
						label: '集镇污水处理站',
						id: 116
					},{
						label: '村庄污水处理站',
						id: 115
					}
				]
			}else if(this.query.type == 3){
				this.alarmList[0].name = "水质等级"
				// this.columns2[0] = [
					// {
					// 	label: '废水',
					// 	id: 1
					// },{
					// 	label: '废气',
					// 	id: 2
					// }
				// ]
			}
		},
		// 下拉刷新
		onPullDownRefresh(){
			this.pageNo=1
			this.getdata();
		},
		onReachBottom(){
			
			this.pageNo++
			this.getdata();
		},
		mounted() {
			this.getdata();
			this.xzqhFunc();
		},
		methods: {
			onchange(e){
				console.log('onchange:', e);
				this.xzqhValue = e.value;
				this.getdata();
			},
			xzqhFunc() {
				// water_grade水质
				// 行政区域
				// console.log("this.columns2",this.columns2)
				
				
				
				// this.index++
				if(this.query.type == 3){
					API.list2({code:'water_grade'}).then(ress =>{
						console.log("ress",ress)
						// this.$forceUpdate();
						this.index++
						
						this.columns2[0]= ress.data.result
						this.columns2[0].unshift({
							itemText: '全部',
							id: ''
						});
						// this.columns2= Object.assign({}, this.columns2);
						// console.log(this.columns2)
					})
				}
				
				API.queryAreaMap().then(res =>{
					console.log("res行政区域",res)
					let xzqh = res.data.result
					// this.items
					function action(data){ // 使用递归函数
					    // if(!(data?.length <= 0)){ 
					    // 等价于
						if(!data || data.length <= 0){ // 递归的出口
							return null;
						}
						return data.map(x => { // 循环数据
						    const model = { // 把后端返回过来的数据里面的键给替换成我想要的键
							    source: x,
								text: x.name,
								value: x.id,
							};
						    const children = action(x.children); // 子级数据
												
						    if(children){ // 一直往下循环查找有没有children这个键，如果有就直接添加一个子级字段名，这个字段名就是存子级数据
							    model.children = children;
						    }
							return model; // 返回这个数据
						});
					}
					this.items = action(xzqh); // 这个classificationGoodsList 就是我存数据的数组
				})
			},
			
			getdata(){
				
				let parmas = {
					type:this.query.type,
					regionId:this.xzqhValue,
					queryType:this.queryType,
					pageSize:this.pageSize,
					pageNo:this.pageNo
				}
				console.log("parmas",parmas)
				API.AppInfoList(parmas).then(res=>{
					console.log("res",res)
					console.log("res",this.pageNo)
					 if(this.pageNo == 1){
						 this.recordsList = res.data.result
					 }else{
						 let resdata = res.data.result.records
						 // this.recordsList.concat(res.data.result);
						 // if(this.recordsList.records){
							//  this.recordsList.records.push(res.data.result.records)
						 // }
						 resdata.forEach(item =>{
							 this.recordsList.records.push(item)
						 })
						 // console.log("res.data.result",res.data.result.records)
					 }
					
					 uni.stopPullDownRefresh();
					
				})
			},
			
			// 跳转详情页面
			clockgo(item){
				// 断网模拟id
				uni.navigateTo({
					url: `../selectsite/item?id=${item.id}&type=${this.query.type}&title=${item.title}&pollutionType=${item.pollutionType}`,
				});
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
				}
			},
			// 报警状态
			confirm2(val){
				console.log("val",val)
				if(this.query.type == 3){
					this.queryType = val.value[0].itemValue
				}else{
					this.queryType = val.value[0].id
				}
				this.tapy = ''
				this.getdata()
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
					if(this.tapy == 1){
						console.log("this.$refs.datapicker",this.$refs.datapicker)
						this.$refs.datapicker.show();
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container_index {
		.TabBar{
			padding-top: 145rpx;
		}
		.taps {
			background-color: #fff;
			border-top: 1rpx solid #c9c9c9;
			border-bottom: 1rpx solid #c9c9c9;
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
				justify-content: space-between;
				align-items: center;
				padding: 0 10%;
				.Alarm_type_lis{
					display: flex;
					justify-content: center;
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
	}
</style>