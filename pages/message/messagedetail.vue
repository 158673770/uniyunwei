<template>
	<view>
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
						<view class="top_title">{{mesDetailObj.baseInfo.companyName}}</view>
					</view>
					<view class="top_error" v-if="mesDetailObj.baseInfo.status == 0">
						<image src="../../static/img/mesErrorFill.png" mode=""></image>
						<view>异常</view>
					</view>
				</view>
				<view>
					<view>所属企业</view>
					<view>{{mesDetailObj.baseInfo.companyName}}</view>
				</view>
				<view class="adress_text">
					<view>地址</view>
					<view class="top_last">
						<view>{{mesDetailObj.baseInfo.address}}</view>
						<image src="../../static/img/locationIcon.png" mode=""></image>
					</view>
				</view>
				<view>
					<view>截止时间</view>
					<view>{{mesDetailObj.baseInfo.lastTime}}</view>
				</view>
				<view>
					<view>运维人员</view>
					<view>{{mesDetailObj.baseInfo.legalPerson}}</view>
				</view>

				<view>
					<view>运维时间</view>
					<view>{{mesDetailObj.operation.operationTime}}</view>
				</view>
				<view>
					<view>运维项</view>
					<view>{{mesDetailObj.operationDetail.length}}</view>
				</view>
				<view>
					<view>异常</view>
					<view>{{errorStatusList.length}}</view>
				</view>



			</view>
			<view style="width: 100%;height: 20rpx;background-color: #f5f5f5;"></view>
			<view class="site_bottom">
				<view>
					<view class="top_first">
						<view class="top_view"></view>
						<view class="top_title">巡检项</view>
					</view>
				</view>
				
				
				
				<view class="upload_core" v-for="(item,index) in mesDetailObj.operationDetail" :key="item.id">
					<view>
						<view>{{item.itemName}}</view>
						<view v-if="item.status != 1">
							<image src="../../static/img/mesErrorFill.png" mode=""></image>
							<view>异常</view>
						</view>
					</view>
					<view class="upload_swiper">
						<view class="swiper_view">
							<image :src="items.uaPath" mode="" v-for="(items,i) in item.attList" :key="items.uaId" @click="previewPic(item.attList,i)"></image>
						</view>
					</view>
				</view>

				

				<!-- <view class="upload_core">
					<view>
						<view>采水口 </view>
						<view v-if="isError == true">
							<image src="../../static/img/mesErrorFill.png" mode=""></image>
							<view>异常</view>
						</view>
					</view>
					<view class="upload_swiper">
						<view class="swiper_view">
							<image :src="item.url" mode="" v-for="(item,index) in listOne" :key="index">
							</image>
						</view>
					</view>
				</view> -->
				<view class="remark_view" >
					{{mesDetailObj.operation.remark}}
					
				</view>
				
				
				<view style="height: 30rpx;"></view>
			</view>
			<!--site_bottom-->


		</view>
	</view>
</template>

<script>
	import {
		getMessageListDetailApi
	} from '../../api/messageApi.js'

	export default {
		data() {
			return {
				statusHeight:50,
				navText: '', //nav文本标题
				detailId: '',
				recordId: '', //巡检id
				
				
				mesDetailObj:{
					baseInfo:{},
					operation:{},
					operationDetail:[]
				},//详情数据
				errorStatusList:[],//巡检项异常列表

			}
		},
		onLoad(options) {
			this.navText = options.navText + '巡检'
			this.detailId = options.detailId
			this.recordId = options.recordId
			
			this.getMessageObj()
		},
		methods: {
			// 获取详情信息
			async getMessageObj(){
				let obj = {
					portId:this.detailId,
					recordId:this.recordId
				}
				let res = await getMessageListDetailApi(obj)
				console.log('res详情',res);
				this.mesDetailObj = res.data.result
				this.errorStatusList = this.mesDetailObj.operationDetail.filter(item=>item.status == 0)
			},
			// 查看图片
			previewPic(list,index){
				let picList = list.map(item => item.uaPath)
				uni.previewImage({
					urls:picList,
					current:index
				})
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

				.top_error {
					display: flex;
					align-items: center;

					image {
						width: 32rpx;
						height: 32rpx;
						margin-right: 10rpx;
					}

					view {
						color: #ee6b27;
					}
				}



				.top_last {
					display: flex;
					align-items: center;

					image {
						width: 32rpx;
						height: 36rpx;
						margin-left: 16rpx;
					}
				}

				>view:nth-child(2) {
					color: #8c8c8c;
				}
			}
		}

		.site_bottom {
			background-color: #fff;

			>view:nth-child(1) {
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

			}

			.upload_core {
				width: 100%;
				// height: 200rpx;
				// background-color: #53bd99;
				padding: 5% 5% 1%;
				box-sizing: border-box;
				border-bottom: 1rpx solid #f5f5f5;
				font-size: 28rpx;

				>view:nth-child(1) {
					display: flex;
					justify-content: space-between;

					>view:nth-child(2) {
						display: flex;
						align-items: center;
						color: #ee6b27;

						image {
							width: 32rpx;
							height: 32rpx;
							margin-right: 10rpx;
						}
					}
				}


				.upload_swiper {
					width: 100%;
					// height: 150rpx;
					margin: 20rpx 0;


					.swiper_view {
						width: 100%;
						// height: 150rpx;
						display: flex;
						flex-wrap: wrap;
						// justify-content: space-between;

						>image {
							width: 150rpx;
							height: 150rpx;
							margin-bottom: 20rpx;
							border-radius: 10rpx;
						}

						>image:not(:nth-child(4n)) {
							margin-right: 20rpx;
						}

						>image:nth-child(n + 5) {
							margin-bottom: 0;
						}

					}
				}
			}
				
			.remark_view{
				width: 90%;
				margin: 30rpx 5%;
				line-height: 40rpx;
				font-size: 28rpx;
				color: #333333;
			}






		}





	}
</style>
