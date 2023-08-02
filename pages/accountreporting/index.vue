<template>
	<view class="container_index">
		<view class="TabBar">
			<u-navbar>
				<view slot="left">
					<u-icon name="arrow-left" @click="gotu"></u-icon>
				</view>
				<view slot="center">
					<view v-if="!searchShow" style="text-align: center;font-size: 36rpx;">
						选择站点
					</view>
					<u--input placeholder="请输入内容" v-model="keyword" clearable v-if="searchShow" shape="circle"
						@input="searchchange" clearable @clear="keyword = ''"></u--input>
					<!-- <u-search v-if="searchShow" placeholder="请输入" v-model="keyword"></u-search> -->
				</view>
				<view slot="right">
					<u-icon name="search" size="36" @click="searchIf"></u-icon>
				</view>
			</u-navbar>
		</view>
		<view class="taps">
			<u-tabs :list="Tabs" @click="clickTabs"></u-tabs>
		</view>
		<view class="taps_List">
			<u-empty
				mode="list"
				icon="../../static/images/custom-empty-image.png"
				v-if="dataList.length == 0"
			>
			</u-empty>
			<view class="taps_Lis" v-for="(item,index) in dataList" :key="index" @click="tapsChange(item)">
				<view class="taps_Lis_img">
					<image :src="item.attList.length > 0 ? item.attList[0].uaPath : '../../static/images/tx.png' "  mode=""></image>
				</view>
				<view class="taps_Lis_title">
					<view class="taps_Lis_title_top">
						{{ item.title}}
					</view>
					<view class="taps_Lis_title_top">
						{{ item.content }}
					</view>
				</view>
				<view class="taps_Lis_jl">
					{{ item.jlindex }}km
				</view>
			</view>
		</view>

		<!-- 管理站点 -->
	</view>
</template>

<script>
	import  *as API from '../../api/appApi.js'
	export default {
		data() {
			return {
				dataList: [], // 数据列表
				searchShow: false,
				keyword: '',
				Tabs: [{
					name: '全部',
					tapy: 0
				}, {
					name: '污染源',
					tapy:1
				}, {
					name: '污水处理',
					tapy:2
				}],
				tabType:0,
				CoordinateAddress:[],//当前位置
				debounceTimer: null,
				// cantList:[]
			}
		},
		onLoad() {
			uni.startPullDownRefresh();
		},
		// 下拉刷新
		onPullDownRefresh(){
			console.log('refresh');
			this.initDataList()
			
		},
		onReachBottom(){
			console.log("上拉加载")
			
			// uni.showNavigationBarLoading();
		},
		
		mounted() {
			// 获取滚动视图容器的高度
			// const query = uni.createSelectorQuery().in(this);
			// query.select('.scroll-view').boundingClientRect((res) => {
			// 	console.log("res",res)
			//   this.scrollViewHeight = res.height;
			// }).exec();
			
			// this.dingwei();
			// this.initDataList();
		},
		methods: {
			// 计算弧度
			toRadians(degrees) {
			  return degrees * Math.PI / 180;
			},
			// 计算两个坐标点相距距离
			calculateDistance(lat2, lon2) {
			  const earthRadius = 6371; // 地球半径，单位为千米
			  // 将经纬度转换为弧度   
			  const lat1Rad = this.toRadians(this.CoordinateAddress[0]);
			  const lon1Rad = this.toRadians(this.CoordinateAddress[1]);
			  const lat2Rad = this.toRadians(lat2);
			  const lon2Rad = this.toRadians(lon2);
			  // console.log("lat1Rad",lat1Rad,"lon1Rad",lon1Rad,"lat2Rad",lat2Rad,"lon2Rad",lon2Rad)
			  // 使用Haversine公式计算两个坐标之间的距离
			  const deltaLat = lat2Rad - lat1Rad;
			  const deltaLon = lon2Rad - lon1Rad;
			  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
				Math.cos(lat1Rad) * Math.cos(lat2Rad) *
				Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
			  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			  let distance = earthRadius * c;
			  let num = distance.toFixed(2);
			  // console.log('distance',num)
			  return num;
			},
			gotu(){
				uni.navigateBack({
					delta:1,//返回层数，2则上上页
				})
			}, 
			tapsChange(val){
				console.log("val",val)
				uni.navigateTo({					url: `../clockingstation/item?id=${val.id}&type=${val.type}&dklx=2&lon=${val.lon}&lat=${val.lat}&title=${val.title}&content=${val.content}`,				});
				// uni.navigateTo({
				// 	url: `../clockingstation/item?id=${val.id}&type=${val.type}&dklx=1&lon=${val.lon}&lat=${val.lat}&title=${val.title}&content=${val.content}`,
				// });
			},
			// 初始化数据列表
			async initDataList() {
				
					// uni.setStorage({
					// 	key: 'latitudelongitude',
					// 	data:''
					// })
				  // 发起网络请求或其他操作获取初始数据列表
				  // 将获取的数据赋值给dataList数组
				  let latitudelongitude = uni.getStorageSync('latitudelongitude')
				  let getTimeData = uni.getStorageSync('getTimeData')
				  let anotherTime = new Date().getTime(); 
				  let timeDifference = anotherTime - getTimeData
				  console.log("timeDifference",timeDifference)
				  var isTimeDifferenceGreaterThanOneMinute = timeDifference > (60 * 1000);
				  console.log("latitudelongitude",latitudelongitude)
				  console.log("isTimeDifferenceGreaterThanOneMinute",isTimeDifferenceGreaterThanOneMinute)
				  let latlon = latitudelongitude.split(',')
				  // console.log("latitudelongitude",uni.getStorageSync('latitudelongitude'))
				  let res = await API.DevOpsList({type:this.tabType,findKey:this.keyword});
				  if(res.data.code == 200){
					  // console.log("res",res)
					  let that = this;
					  let datelistBox = res.data.result
					  that.dataList = datelistBox.filter(item => item.type !== 4);
					  that.dataList = that.dataList.filter(item => item.type !== 3);
					  // 本地地址
					  that.CoordinateAddress[0] =latitudelongitude.split(',')[0]
					  that.CoordinateAddress[1] = latitudelongitude.split(',')[1]
					  console.log("that.CoordinateAddress",that.CoordinateAddress)
					  that.dataList.forEach((item,index)=>{
					  	item.jlindex = that.calculateDistance(item.lat,item.lon)
					  })
					  that.dataList.sort((a, b) => {
						const dateA = a.jlindex;
						const dateB = b.jlindex;
						return dateA - dateB;
					  });
					   uni.stopPullDownRefresh();
					  // console.log("uni.getLocation",uni.getLocation())
					  // if(latitudelongitude != '' && latlon[0] != 'undefined' && !timeDifference){
						 //  console.log("111")
						  
						 
					  // }else{
						 //  console.log("222")
						 //  uni.getLocation({
							// type: "gcj02", //默认为 wgs84 返回 gps 坐标
							// geocode:true,
							// isHighAccuracy: "true",
							// accuracy: "best", // 精度值为20m
							// success: function (reslut) {
							//   uni.setStorage({
							// 		key: 'latitudelongitude',
							// 		data: `${res.latitude},${res.longitude}`
							//   })
							//   uni.setStorage({
							//   	key: 'getTimeData',
							//   	data: new Date().getTime()
							//   })
							  
							//   let datelistBox = res.data.result
							//   that.dataList = datelistBox.filter(item => item.type !== 4);
							//   that.dataList = that.dataList.filter(item => item.type !== 3);
							  
							//   console.log("this.dataList",that.dataList)
							//   console.log("定位获取:", reslut);
							//   that.CoordinateAddress[0] = reslut.latitude
							//   that.CoordinateAddress[1] = reslut.longitude
							//   console.log("that.CoordinateAddress",that.CoordinateAddress)
							  
							//   that.dataList.forEach((item,index)=>{
							// 	  item.jlindex = that.calculateDistance(item.lat,item.lon)
							//   })
							//   that.dataList.sort((a, b) => {
							// 	const dateA = a.jlindex;
							// 	const dateB = b.jlindex;
							// 	return dateA - dateB;
							//   });
							//    uni.stopPullDownRefresh();
							// },
							// fail(err) {
							//   if (
							// 	err.errMsg ===
							// 	"getLocation:fail 频繁调用会增加电量损耗，可考虑使用 wx.onLocationChange 监听地理位置变化"
							//   ) {
							// 	uni.showToast({
							// 	  title: "请勿频繁定位",
							// 	  icon: "none",
							// 	});
							//   }
							//   if (err.errMsg === "getLocation:fail auth deny") {
							// 	// 未授权
							// 	uni.showToast({
							// 	  title: "无法定位，请重新获取位置信息",
							// 	  icon: "none",
							// 	});
							// 	authDenyCb && authDenyCb();
							// 	that.isLocated = false;
							//   }
							//   if (
							// 	err.errMsg ===
							// 	"getLocation:fail:ERROR_NOCELL&WIFI_LOCATIONSWITCHOFF"
							//   ) {
							// 	uni.showModal({
							// 	  content: "请开启手机定位服务",
							// 	  showCancel: false,
							// 	});
							//   }
							// },
						 //  });
					  // }
				  }
			},
			// 切換不同类型站点数据
			clickTabs(val) {
				console.log("val", val)
				this.tabType = val.tapy
				this.initDataList()
			},
			// 头部放大镜事件
			searchIf() {
				if (this.searchShow) {
					this.searchShow = false
				} else {
					this.searchShow = true
				}
			},
			// 搜索框事件
			searchchange(val) {
				console.log("change", val)
				clearTimeout(this.debounceTimer);
				 this.debounceTimer = setTimeout(() => {
					this.initDataList();
				 },1000); // 设置防抖的时间间隔，单位为毫秒
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container_index {
		// .my-body{
		// 	box-sizing: border-box;
		// 	min-height: 100vh;
		// 	background-color: rgba(242, 242, 242, 1);
			
		// }
		.taps {
			padding-top: 145rpx;
			background-color: #fff;
		}
		.taps_List {
			padding: 25rpx;
			// height: 86vh;
			background-color: rgba(242, 242, 242, 1);
			.taps_Lis {
				border: 1px solid rgb(214, 215, 217);
				background-color: #fff;
				display: flex;
				justify-content: left;
				padding: 25rpx;
				margin-bottom: 10rpx;
				border-radius: 10rpx;
				position: relative;
				.taps_Lis_img {
					width: 25%;
		
					image {
						width: 142rpx;
						height: 142rpx;
					}
				}
		
				.taps_Lis_title {
					width: 60%;
					.taps_Lis_title_top{
						margin-bottom: 5rpx;
					}
				}
		
				.taps_Lis_jl {
					position: absolute;
					right: 3%;
					top: 15rpx;
					// width: 15%;
				}
			}
		}
		
	}
</style>