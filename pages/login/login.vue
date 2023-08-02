<template>
	<view class="login">
		<view :style="{height: statusHeight*2 +'rpx'}"></view>
		<view class="logo">
			<view class="">
				<image src="../../static/img/appIcon.png" mode=""></image>
			</view>
			
		</view>


		<view class="title">
			<!-- 运维管理系统 -->
			<image src="../../static/img/appTitleIcon.png" mode=""></image>
		</view>


		<view class="login_core">
			<view>
				<image src="../../static/img/userIcon.png" mode=""></image>
				<view class="">账号</view>
			</view>
			<view>
				<u--input placeholder="请输入账号" border="bottom" v-model="loginObj.username" clearable maxlength="16">
				</u--input>
			</view>

			<view>
				<image src="../../static/img/passwordIcon.png" mode=""></image>
				<view class="">密码</view>
			</view>
			<view>
				<u--input placeholder="请输入密码" border="bottom" v-model="loginObj.password" password clearable
					maxlength="16">
				</u--input>
			</view>
		</view>




		<view class="login_btn" @click="login">登录</view>

		<view class="record_pas">
			<label @click="haveClick" >
				<radio :checked="isHave" style="transform:scale(0.7)" />
				<text>记住密码</text>
			</label>
		</view>

	</view>
</template>

<script>
	import {
		loginApi
	} from '../../api/loginApi.js'
	export default {
		data() {
			return {
				loginObj: {
					captcha: "",
					checkKey: "",
					password: "",
					username: ""
				},
				statusHeight:50,

				isHave: false
			}
		},
		onLoad() {
			this.getIsHave()
			this.getaddress()
		},
		methods: {
			getaddress(){
				let that = this
				uni.getLocation({
					type: "gcj02", //默认为 wgs84 返回 gps 坐标
					geocode:true,
					isHighAccuracy: "true",
					accuracy: "best", // 精度值为20m
					success: function (res) {
					  console.log("定位获取:", res);
					  uni.setStorage({
					  	key: 'latitudelongitude',
					  	data: `${res.latitude},${res.longitude}`
					  })
					  uni.setStorage({
					  	key: 'getTimeData',
					  	data: new Date().getTime()
					  })
					},
					fail(err) {
					  if (
						err.errMsg ===
						"getLocation:fail 频繁调用会增加电量损耗，可考虑使用 wx.onLocationChange 监听地理位置变化"
					  ) {
						uni.showToast({
						  title: "请勿频繁定位",
						  icon: "none",
						});
					  }
					  if (err.errMsg === "getLocation:fail auth deny") {
						// 未授权
						uni.showToast({
						  title: "无法定位，请重新获取位置信息",
						  icon: "none",
						});
						authDenyCb && authDenyCb();
						that.isLocated = false;
					  }
					  if (
						err.errMsg ===
						"getLocation:fail:ERROR_NOCELL&WIFI_LOCATIONSWITCHOFF"
					  ) {
						uni.showModal({
						  content: "请开启手机定位服务",
						  showCancel: false,
						});
					  }
					},
				});
				// uni.getLocation({
				// 	type: 'gcj02',
				// 	success:(res)=>{}
				// });
			},
			// 获取是否有缓存记住密码
			getIsHave(){
				let ishave = uni.getStorageSync('isHave')
				
				console.log('isHave',ishave);
				if (ishave) {
					this.loginObj.username = uni.getStorageSync('username')
					this.loginObj.password = uni.getStorageSync('password')
					this.isHave = true
				} else{
					uni.removeStorageSync('username');
					uni.removeStorageSync('password');
					this.isHave = false
				}
				
				
			},
			// 点击登录
			async login() {
				uni.showLoading({
					title: '登录中',
					mask:true
				});
				let res = await loginApi(this.loginObj)
				console.log(res);
				if (res.data.code == 200) {
					uni.setStorage({
						key: 'token',
						data: res.data.result.token
					})
					uni.setStorage({
						key: 'userId',
						data: res.data.result.userInfo.id
					})
					uni.setStorage({
						key: 'uName',
						data: res.data.result.userInfo.realname
					})
					
					let infoListFo = {
						realname:res.data.result.userInfo.realname,
						phone:res.data.result.userInfo.phone,
						id:res.data.result.userInfo.id,//
						departName:res.data.result.departs[0].departName,
						departId:res.data.result.userInfo.departIds,//
					}
					uni.setStorage({
						key: 'infoListFo',
						data: JSON.stringify(infoListFo)
					})
					if (this.isHave == true) {
						uni.setStorage({
							key: 'isHave',
							data: true
						})
					} else{
						uni.setStorage({
							key: 'isHave',
							data: false
						})
					}
					
					uni.setStorage({
						key: 'username',
						data: this.loginObj.username
					})
					uni.setStorage({
						key: 'password',
						data: this.loginObj.password
					})
					// uni.redirectTo({
					// 	url:'../tabbar/index'
					// })
					uni.hideLoading();
					
					
					uni.redirectTo({
						url: "../tabbar/index"
					})
				}else{
					uni.showToast({
						icon:"none",
						title:res.data.message,
						complete: () => {
							uni.hideLoading();
						}
					})
				}
			},
			// // 是否记住密码
			haveClick() {
				if (this.isHave) {
					this.isHave = false
				} else {
					this.isHave = true
				}
			}



		}
	}
</script>

<style lang="scss" scoped>
	.login {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;

		.logo {
			>view {
				width: 200rpx;
				height: 200rpx;
				// background-color: pink;
				margin-top: 100rpx;
				>image{
					width: 100%;
					height: 100%;
				}
			}
		}

		.title {
			margin-top: 30rpx;
			font-size: 60rpx;
			font-family: "BDZongYi-A001 FZZongYi-M05S	Arial-SemiCondensed, BDZongYi-A001 FZZongYi-M05S	Arial";
			image{
				width: 360rpx;
				height: 90rpx;
			}
		}

		.login_core {
			width: 90%;
			margin: 80rpx 5%;

			>view:nth-child(2n+1) {
				display: flex;
				align-items: center;
				font-weight: bold;

				>image {
					width: 48rpx;
					height: 48rpx;
					margin-right: 20rpx;
				}
			}

			>view:nth-child(2n) {
				.u-input {
					margin-top: 20rpx;
					padding: 10rpx 0 10rpx 50rpx !important;
					box-sizing: border-box;
				}
			}

			>view:nth-child(3) {
				margin-top: 40rpx;
			}

		}

		.login_btn {
			width: 90%;
			height: 88rpx;
			border-radius: 60rpx;
			background-color: #2c8DF0;
			color: #fff;
			font-weight: bold;
			text-align: center;
			line-height: 80rpx;
			margin-left: 5%;
			margin-top: 30rpx;
		}

		.record_pas {
			width: 90%;
			display: flex;
			justify-content: flex-start;
			margin-top: 30rpx;
			text{
				margin-left: 16rpx;
			}
		}


	}
</style>
