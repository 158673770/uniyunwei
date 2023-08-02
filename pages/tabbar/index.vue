<template>
	<view>
		<!-- <view :style="{height: statusHeight*2 +'rpx',backgroundColor:'#2c8DF0'}"></view> -->
		<view class="container_index">
			<view class="index_top_tab">
				<view class="index_top_tab_list">
					<view class="index_top_tab_lis" @click="tabClick(0)">
						<view>{{ indexObj.stationCount }}</view>
						<view>管理站点</view>
					</view>
					<view class="index_top_tab_lis" @click="tabClick(1)">
						<view>{{ indexObj.unreadAlarmCount }}</view>
						<view>未读报警</view>
					</view>
					<view class="index_top_tab_lis" @click="tabClick(2)">
						<view>{{ indexObj.pendingProcessingAlarmCount }}</view>
						<view>未处理报警</view>
					</view>
				</view>
			</view>
			<view class="content">
				<view class="content_list">
					<view class="content_lis" v-for="(item,index) in indexList" :key="index" @click="gotuUrl(item)">
						<u-icon class="content_icon" :name="item.name" :size="36" color="#198ecc"></u-icon>
						<view class="content_text">
							{{ item.nameClass }}
						</view>
					</view>
				</view>
			</view>
		</view> 
		<tabbar :current="1"></tabbar>
	</view>
</template>

<script>
	import tabbar from './tabbarComponent.vue'
	import  *as API from '../../api/appApi.js'
	// import { getIndexListApi,getDataCountApi } from '../../api/indexApi.js'
	export default {
		components: {
			tabbar
		},
		data() {
			return {
				// 头部数据
				indexObj:{},
				// 点击数据
				indexList:[
					{
						name:'../../static/images/indexList1.png',
						nameClass:'站点打卡',
						url:'../clockingstation/index'
					},
					{
						name:'../../static/images/indexList2.png',
						nameClass:'台账上报',
						url:'../accountreporting/index'
					},
					{
						name:'../../static/images/indexList3.png',
						nameClass:'报警记录',
						url:'../alarmmanagement/index'
					},
					{
						name:'../../static/images/indexList4.png',
						nameClass:'污染源排口',
						url:'../sortord/index',
						lx:1
					},
					{
						name:'../../static/images/indexList5.png',
						nameClass:'水质检测点',
						url:'../sortord/index',
						lx:3
					},
					{
						name:'../../static/images/indexList6.png',
						nameClass:'污水站排口',
						url:'../sortord/index',
						lx:2
					},
					{
						name:'../../static/images/indexList7.png',
						nameClass:'城市管网',
						url:'../sortord/index',
						lx:4
					},
				]
			}
		},
		onLoad() {
			this.getIndexCount()
			// this.getIndexList()  //获取列表
		},
		mounted() {
			// this.getzd();
		},
		methods: {
			// async getzd(){
			// 	let res = await API.list2({code:'port_type'})
			// 	console.log("res",res)
			// },
			gotuUrl(item){
				if(item.url){
					if(item.lx){
						uni.navigateTo({
							url:`${item.url}?name=${item.nameClass}&type=${item.lx}`,
							animationType: 'pop-in',
							animationDuration: 200
						})
					}else{
						uni.navigateTo({
							url:`${item.url}`,
							animationType: 'pop-in',
							animationDuration: 200
						})
					}
				}
			},
			// 点切换栏
			tabClick(index){ 
				if(index == 0){
					uni.navigateTo({
						url: '../selectsite/index',
						animationType: 'pop-in',
						animationDuration: 200
					})
				}else if(index == 1){
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
				
			},
			// scroll_view触底
			scrollEnd(){
				// console.log('已触底');
			},
			indexDetail(id,navText,lastTime){
				uni.navigateTo({
					url: `../index/sitedetail?detailId=${id}&navText=${navText}&lastTime=${lastTime}`
				})
			},
			// 获取排口列表信息
			// async getIndexList(){
			// 	let res = await getIndexListApi()
			// 	if (res.data.code == 200) {
			// 		console.log(res);
			// 		this.indexObj = res.data.result
			// 		this.indexList = this.indexObj.total 
			// 		console.log("this.indexObj.total",this.indexObj.total )
			// 	}
			// },
			// 获取首页个数
			async getIndexCount(){
				let res = await API.home()
				// console.log("Res",res)
				if(res.data.code == 200){
					this.indexObj = res.data.result
					console.log("this.indexObj",this.indexObj )
				}
			}
			
			
			
			
			
			

		}


	}
</script>

<style lang="scss" scoped>
	.container_index{
		.index_top_tab{
			width: 100%;
			height: 30vh;
			background: url('../../static/images/kzt_banner.png') no-repeat;
			background-size: 100% 100%;
			position: relative;
			.index_top_tab_list{
				position: absolute;
				left: 0;
				right: 0;
				bottom:15%;
				margin: auto;
				display: flex;
				justify-content: space-between;
				padding: 0 5% 0;
				.index_top_tab_lis{
					font-weight: bold;
					font-size: 36rpx;
					color: #fff;
					text-align: center;
				}
			}
			
		}
		.content{
			.content_list{
				display: flex;
				justify-content: left;
				flex-wrap: wrap;
				padding: 150rpx 0 0;
				.content_lis{
					width: 33.33%;
					padding: 0 0 80rpx;
					display: flex;
					justify-content: center;
					flex-wrap: wrap;
					text-align: center;
					.content_text{
						width: 100%;
						font-size: 36rpx;
					}
				}
			}
			
		}
		// height: 340rpx;
		// background-color:#2c8DF0;
		// background: linear-gradient(180deg, #7B5CFF 0%, #9869F8 100%);
		// .index_text{
		// 	width: 90%;
		// 	height: 140rpx;
		// 	margin-left:5%;
		// 	display: flex;
		// 	justify-content: space-between;
		// 	align-items: center;
		// 	font-size: 48rpx;
		// 	font-weight: bold;
		// 	color: #fff;
		// 	border-bottom: 1rpx solid #fff;
		// }
		// .index_top_tab{
		// 	width: 95%;
		// 	height: 199rpx;
		// 	// margin-left: 2.5%;
		// 	margin: 0 auto;
		// 	display: flex;
		// 	justify-content: space-between;
		// 	>view{
		// 		width: 25%;
		// 		display: flex;
		// 		flex-direction: column;
		// 		justify-content: space-around;
		// 		align-items: center;
		// 		margin: 5% 0;
		// 		font-size: 36rpx;
		// 		>view:nth-child(1){
		// 			color: #fff;
		// 			display: flex;
		// 			align-items: center;
		// 			font-size:32rpx;
		// 			>image{
		// 				width: 28rpx;
		// 				height: 38rpx;
		// 				margin-right: 10rpx;
		// 			}
		// 		}
		// 		>view:nth-child(2){
		// 			color: #f5f5f5;
		// 		}
		// 	}
		// 	.tab_active{
		// 		font-weight: bold;
				
		// 		>view:nth-child(1){
		// 			font-size: 48rpx;
		// 		}
		// 		>view:nth-child(2){
		// 			font-size: 36rpx;
		// 			color: #FFF;
		// 		}
				
		// 	}
		// }
		
		
		// .index_core{
		// 	width: 100%;
		// 	height: calc(100vh - 100upx - 340rpx);
		// 	background-color: #f5f6fa;
		// 	position: relative;
			
		// 	.core_position_abs{
		// 		position: absolute;
		// 		width: 100%;
		// 		height: 100%;
		// 		overflow-y: auto;
		// .index_list{
		// 	width: 100%;
		// 	height: 100%;
			
			
			
		// }
		// 	}
		// }
		// .scroll_list{
		// 	width: 100%;
		// 	height: calc(100vh - 100upx - 340rpx);
		// 	background-color: #f5f6fa;
			
			
		// 	.list{
		// 		width: 90%;
		// 		height: 271rpx;
		// 		margin-left: 5%;
		// 		background-color: #FFF;
		// 		border-radius: 8rpx;
		// 		margin-top: 30rpx;
				
		// 		.list_top{
		// 			width: 100%;
		// 			height: 110rpx;
		// 			padding:0 3%;
		// 			box-sizing: border-box;
		// 			display: flex;
		// 			justify-content: space-between;
		// 			align-items: center;
		// 			.list_top_left{
		// 				display: flex;
		// 				align-items: center;
		// 				>image{
		// 					width: 50rpx;
		// 					height: 50rpx;
		// 					margin-right:20rpx;
		// 				}
		// 				view{
		// 					font-weight: bold;
		// 				}
		// 			}
		// 			.list_top_right{
		// 				display: flex;
		// 				align-items: center;
		// 				font-size: 28rpx;
		// 				image{
		// 					width: 32rpx;
		// 					height: 32rpx;
		// 					margin-right:10rpx;
		// 				}
		// 				>view:nth-child(1){
		// 					color: #666666;
		// 					margin-right: 20rpx;
		// 				}
		// 				.dayNum{
		// 					display: flex;
		// 					align-items: center;
		// 					color: #2c8df0;
							
		// 					text{
		// 						margin-top: 8rpx;
		// 					}
		// 				}
		// 			}
		// 		}
		// 		hr{
		// 			margin:0;
		// 			color: #dbdbdb;
		// 		}
				
		// 		.list_bottom{
		// 			width: 100%;
		// 			height:160rpx;
		// 			padding:3%;
		// 			box-sizing: border-box;
		// 			display: flex;
		// 			flex-direction: column;
		// 			justify-content: space-around;
		// 			font-size: 28rpx;
		// 			color: #666666;
		// 		}
		// 	}
		// }
		
		
		
		
		
	}
</style>
