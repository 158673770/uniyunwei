<template>
	<view v-cloak>
		<view :style="{height: statusHeight*2 +'rpx'}"></view>
		<view class="site_nav">
			<u-navbar :title="navText" :autoBack="true"></u-navbar>
		</view>
		<view class="site_container">
			<view style="height: 88rpx;"></view>
			<view class="site_top">
				<view>
					<view class="top_first">
						<view class="top_view"></view>
						<view class="top_title">{{detailObj.companyName}}</view>
					</view>
				</view>
				<view>
					<view>责任人</view>
					<view>{{detailObj.legalPerson}}</view>
				</view>
				<view>
					<view>职位</view>
					<view>{{detailObj.position}}</view>
				</view>
				<view>
					<view>检查项</view>
					<view>{{xList.length}}项</view>
					<!-- <view>8项</view> -->
				</view>
				<view>
					<view>截止时间</view>
					<view>{{lastTime}}</view>
				</view>
				<view>
					<view>地址</view>
					<!-- @click="openMap" -->
					<view class="top_last" @click="openMap">
						<view>{{detailObj.address}}</view>
						<image src="../../static/img/locationIcon.png" mode=""></image>
					</view>
				</view>
			</view>
			<view style="width: 100%;height: 20rpx;background-color: #f5f5f5;"></view>
			<view class="site_bottom">
				<view>
					<view class="top_first">
						<view class="top_view"></view>
						<view class="top_title">运维项</view>
					</view>
				</view>
				
				
				<view v-for="(item,index) in detailObj.itemInfos" :key="index">
					<view class="site_zi">
						<view>{{index+1}}</view>
						<view>{{item.itemName}}</view>
					</view>
					<view></view>
				</view>
				<!-- <view>
					<view>站房内容全景</view>
					<view></view>
				</view>
				<view>
					<view>探头清洗拍摄</view>
					<view></view>
				</view>
				<view>
					<view>采水口</view>
					<view></view>
				</view>
				<view>
					<view>进水口</view>
					<view></view>
				</view> -->
			</view>
			
			<view class="start_btn" @click="startClick">开始运维</view>
			
		</view>
	</view>
</template>

<script>
	import { getIndexListDetailApi,getWeatherCityLonLatApi } from '../../api/indexApi.js'
	export default {
		components: {

		},
		data() {
			return {
				statusHeight:50,
				navText: '', //nav文本标题
				detailId: '',
				lastTime:'',//截止时间
				
				xList:[],//巡检项列表
				
				detailObj:{},
			}
		},
		onLoad(options) {
			this.navText = options.navText
			this.detailId = options.detailId
			this.lastTime = options.lastTime
			this.getSiteObj()
		},
		methods: {
			// 开始巡检
			startClick(){
				// console.log('点击按钮');
				uni.navigateTo({
					url:`./addsiterecord?detailId=${this.detailId}&navText=${this.navText}&lastTime=${this.lastTime}`
				})
			},
			// 获取详情
			async getSiteObj(){
				let res = await getIndexListDetailApi(this.detailId)
				if(res.data.code == 200){
					this.detailObj = res.data.result
					console.log(this.detailObj);
					// for (var i = 0; i < this.detailObj.itemInfos.length; i++) {
						this.xList = this.detailObj.itemInfos
					// }
					
				}
			},
			async openMap(){
				if (!this.detailObj.lon || !this.detailObj.lat) {
					let res = await getWeatherCityLonLatApi(this.detailObj.address)
					// console.log('res',res);
					if (res.data.info == 'OK') {
						let arr = res.data.geocodes[0].location.split(',')
						// console.log('arr',arr);
						uni.openLocation({
							latitude: parseFloat(arr[1]),
							longitude: parseFloat(arr[0]),
							name: this.detailObj.address,
							address: this.detailObj.address,
							success: function() {
								console.log('success');
							},
							fail: (err) => {
								console.log('打开失败', err);
							}
						});
					} else {
						uni.showToast({
							title: '暂无此地址',
							icon: 'none'
						})
					}
				} else {
					uni.openLocation({
						latitude: parseFloat(this.detailObj.lat) ,
						longitude: parseFloat(this.detailObj.lon) ,
						name: this.detailObj.address,
						address: this.detailObj.address,
						success: function() {
							console.log('success');
						},
						fail: (err) => {
							console.log('打开失败', err);
						}
					});
				}
				// uni.openLocation({
				// 	latitude: parseFloat(this.detailObj.lat) ,
				// 	longitude: parseFloat(this.detailObj.lon) ,
				// 	success: function () {
				// 		console.log('success');
				// 	},
				// 	fail: (err) => {
				// 		console.log('打开失败',err);
				// 	}
				// 	});
			},
			
			

		}


	}
</script>

<style lang="scss" scoped>
	.site_container {
		width: 100%;


		.site_top {
			background-color: #fff;
			>view {
				width: 100%;
				height: 80rpx;
				padding: 0 5%;
				box-sizing: border-box;
				
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 28rpx;

				.top_first {
					display: flex;
					.top_view {
						width: 10rpx;
						height: 42rpx;
						border-radius: 4rpx;
						background-color: #53bd99;
						margin-right: 20rpx;
					}
					.top_title {
						font-weight: bold;
					}
				}
				
				.top_last{
					display: flex;
					align-items: center;
					image{
						width: 32rpx;
						height: 36rpx;
						margin-left: 16rpx;
					}
				}
				>view:nth-child(2){
					color: #8c8c8c;
				}
			}
			
			
		}
		
		.site_bottom {
			background-color: #fff;
			>view {
				width: 100%;
				height: 80rpx;
				padding: 0 5%;
				box-sizing: border-box;
				
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 28rpx;
		
				.top_first {
					display: flex;
					.top_view {
						width: 10rpx;
						height: 42rpx;
						border-radius: 4rpx;
						background-color: #53bd99;
						margin-right: 20rpx;
					}
					.top_title {
						font-weight: bold;
					}
				}
				
				.top_last{
					display: flex;
					align-items: center;
					image{
						width: 32rpx;
						height: 32rpx;
						margin-left: 16rpx;
					}
				}
				>view:nth-child(2){
					color: #8c8c8c;
				}
			}
			
			.site_zi{
				display: flex;
				align-items: center;
				>view:nth-child(1){
					width: 36rpx;
					height: 36rpx;
					border-radius: 50%;
					background-color: #2c8DF0;
					color: #fff;
					text-align: center;
					line-height: 36rpx;
					font-size: 28rpx;
					margin-right: 16rpx;
				}
			}
			
		}
		
		.start_btn{
			position: fixed;
			bottom: 5%;
			left: 5%;
			width: 90%;
			height: 100rpx;
			background-color: #2c8DF0;
			text-align: center;
			line-height: 100rpx;
			color: #fff;
			border-radius: 56rpx;
		}
		
		
		
	}
</style>
