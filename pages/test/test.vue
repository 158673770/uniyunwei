<template>
	<view>
		<u-swipe-action>
			<view v-for="(item,index) in list" :key="index">

				<u-swipe-action-item :options="options1" :name="index" @click="bindClick($event,item.id)"
					ref="swipeActionRef" :index="item.id">
					<view class="swipe-action u-border-top u-border-bottom">
						<view class="swipe-action__content">
							<text class="swipe-action__content__text">{{item.name}}-----</text>
							<text v-if="item.status == 2">不合格</text>
						</view>
					</view>
				</u-swipe-action-item>

			</view>
		</u-swipe-action>
		
		<view class="" @click="getLonLat">
			点击获取地址
		</view>
		
		<view class="">
			{{address}}
			成功：{{addressText}}
			失败：{{errText}}
		</view>
	</view>
</template>

<script>
	// import AMap from "../../util/map.js"
	export default {
		data() {
			return {
				list: [{
						name: 111,
						id: 1,
						show: false,
						status: ''
					},
					{
						name: 222,
						id: 2,
						show: false,
						status: ''
					},
					{
						name: 333,
						id: 3,
						show: false,
						status: ''
					},
				],

				options1: [{
					text: '合格',
					style: {
						backgroundColor: '#3c9cff'
					}
				}, {
					text: '异常',
					style: {
						backgroundColor: '#f56c6c'
					}
				}],
				
				address:'',
				addressText:'',
				errText:''
			}
		},
		onLoad() {
			// this.getLonLat()
		},
		methods: {
			bindClick(e, id) {
				console.log('e', e, id);
				uni.showToast({
					title: e.name,
					icon: 'none'
				})
				console.log(this.$refs.swipeActionRef);
				this.$refs.swipeActionRef[e.name].status = 'close'
				// for (var i = 0; i < this.list.length; i++) {
				if (e.index == 0) {
					this.list[e.name].status = 1
				} else {
					this.list[e.name].status = 2
				}

				// }
			},

			getLonLat() {
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					isHighAccuracy: true, //高精度定位
					success: (res) => {
						this.addressText = JSON.stringify(res)
						// console.log('res地址',res);
						if (JSON.stringify(res.address) != '{}' ) {
							let addressObj = res.address 
							if (addressObj.poiName) {
								this.address = `${addressObj.province}${addressObj.city}${addressObj.district}${addressObj.street}${addressObj.poiName}`
							} else{
								this.address = `${addressObj.province}${addressObj.city}${addressObj.district}${addressObj.street}`
							}
						}
						
						
						
						
						
						// var point = new plus.maps.Point(res.longitude, res.latitude)
						// plus.maps.Map.reverseGeocode(
						// 	point, {}, (event) => {
						// 		var address = event.address; // 转换后的地理位置
						// 		var point = event.coord; // 转换后的坐标信息
						// 		var coordType = event.coordType; // 转换后的坐标系类型
						// 		// console.log(address, 'address');
						// 		// var reg = /.+?(省|市|自治区|自治州|县|区)/g;
						// 		var reg =
						// 			'(?<province>[^省]+省|.+自治区)(?<city>[^自治州]+自治州|[^市]+市|[^盟]+盟|[^地区]+地区|.+区划)(?<county>[^市]+市|[^县]+县|[^旗]+旗|.+区)?(?<town>[^区]+区|.+镇)?(?<village>.*)'
						// 		// console.log(address.match(reg));
						// 		let addressList = address.match(reg).toString().split(",");
						// 		// console.log(addressList)
						// 		// console.log(addressList[0]);
						// 		// console.log(addressList[1]);
						// 		// console.log(addressList[2]);
						// 		// console.log(addressList[3]);
						// 		// console.log(addressList[4]);
						// 		// console.log(addressList[addressList.length - 1]);
						// 		this.address = addressList[0]
						// 	}
						// )
						

					},
					fail: (err) => {
						this.errText = JSON.stringify(err)
					}


				})


			}



		}
	}
</script>

<style lang="scss">
	.u-page {
		padding: 0;
	}

	.u-demo-block__title {
		padding: 10px 0 2px 15px;
	}

	.swipe-action {
		&__content {
			padding: 25rpx 0;

			&__text {
				font-size: 15px;
				color: $u-main-color;
				padding-left: 30rpx;
			}
		}
	}
</style>
