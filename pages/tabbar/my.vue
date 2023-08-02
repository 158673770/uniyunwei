<template>
	<view class="my_container">
		<!-- <view :style="{height: statusHeight*2 +'rpx'}"></view>
		<view style="height: 20rpx;"></view> -->
		<view class="my_top">
			<view class="my_cantent">
				<view class="my_cantent_left">
					<image :src="userObj.avatar" mode="" v-if="userObj.avatar"></image>
					<image src="../../static/img/avatar.png" mode="" v-if="!userObj.avatar"></image>
				</view>
				<view class="my_cantent_right">
					<view>
						{{userObj.realname}}
					</view>
					<view>
						{{departName}}
					</view>
					<view>
						{{ userObj.phone}}
					</view>
				</view>
			</view>
			<!-- <view class="top_icon" v-if="userObj.avatar">
				<image :src="userObj.avatar" mode=""></image>
			</view>
			<view class="top_icon" v-if="!userObj.avatar">
				<image src="../../static/img/avatar.png" mode=""></image>
			</view>
			<view class="top_right">
				<view>
					<view class="name">{{userObj.realname}}</view>
					<image src="../../static/img/phoneIcon.png" mode=""></image>
					<view class="phone">{{userObj.phone}}</view>
				</view>
				<view>{{departName}}</view>
			</view> -->
		</view>
		<view class="my_items">
			<view @click="versionClick">
				<view>
					<image src="../../static/img/currentVersion.png" mode=""></image>
					<view>当前版本</view>
				</view>
				<view>
					<view>{{ version }}</view>
					<image src="../../static/img/arrowRight.png" mode=""></image>
				</view>
			</view>

			<view @click="openStorageModal">
				<view>
					<image src="../../static/img/clearH.png" mode=""></image>
					<view>清除缓存</view>
				</view>
				<view>
					<image src="../../static/img/arrowRight.png" mode=""></image>
				</view>
			</view>

			<!-- <view @click="testClick">
				<view>
					<image src="../../static/img/clearH.png" mode=""></image>
					<view>测试滑动单元格</view>
				</view>
				<image src="../../static/img/arrowRight.png" mode=""></image>
			</view> -->
		</view>

<!-- 发现新版本 -->
		<u-modal :show="updateShow" @cancel="cancel" @confirm="downLoadApk" :showCancelButton="true" title="发现新版本">
			<!-- <view class="slot-content"> -->
			<scroll-view v-show="!progressShow" style="height: 300rpx;" scroll-y="true">
				<view style="padding: 20rpx 30rpx;color: #666;margin-top: 20rpx;">{{ changeLog }}</view>
			</scroll-view>
			<view style="width: calc(100% - 40rpx);margin:50rpx 20rpx;">
				<u-line-progress activeColor="rgba(30, 104, 255, 1)" v-show="progressShow" :striped="true" :percentage="downloadProgress" :striped-active="true"></u-line-progress>
				
			</view>
			<!-- </view> -->
		</u-modal>


		<u-toast ref="uToast"></u-toast>
		<u-modal :show="modalObj.isLogin" :title="modalObj.title" :content='modalObj.content' @confirm="modalConfirm"
			showCancelButton @cancel="modalClose"></u-modal>

		<u-modal :show="modalObj.isClear" :title="modalObj.title" :content='modalObj.content'
			@confirm="modalClearConfirm" showCancelButton @cancel="modalClearClose"></u-modal>

		<view class="clear_btn" @click="clearClick">
			退出登录
		</view>

		<tabbar :current="3"></tabbar>
	</view>
</template>

<script>
	import tabbar from './tabbarComponent.vue'
	import {
		geteUserPersonalApi
	} from '../../api/loginApi.js'
	export default {
		components: {
			tabbar
		},
		data() {
			return {
				userObj: {},
				departName: '',
				modalObj: {
					isClear: false,
					isLogin: false,
					title: '提示',
					content: '您是否退出登录'
				},
				currentSize: '', //缓存大小
				statusHeight:50,
				version:'',
				versionsss:'',
				token: '',
				changeLog: '',
				progressShow:false,
				versionServer: '',
				downloadProgress: 0,
				updateShow: false,
				tempFilePath:'',
				downloadTask: '',
			}
		},
		onLoad() {
			this.getUserObj();
			
		},
		onShow() {
			
		},
		mounted() {
			
		},
		methods: {
			// 关闭弹窗
			modalClose() {
				this.modalObj.isLogin = false
			},
			// 退出登录
			clearClick() {
				this.modalObj.isLogin = true
			},
			// 确认清除缓存
			modalClearConfirm() {
				this.getStorageSize()
			},
			// 关闭缓存弹窗
			modalClearClose() {
				this.modalObj.isClear = false
			},
			//打开缓存弹窗
			openStorageModal() {
				//#ifdef APP-PLUS
				this.modalObj.isClear = true
				this.modalObj.content = '确认要清除缓存吗'
				//#endif
				
				// #ifdef H5
				this.$refs.uToast.show({
					type: 'success',
					message: `清除缓存成功`
				})
				// #endif
				
			},
			// 确认退出
			modalConfirm() {
				uni.clearStorage();
				uni.reLaunch({
					url: '/pages/login/login'
				})
			},
			// 获取用户数据
			async getUserObj() {
				let _this = this
				let userId = uni.getStorageSync('userId');
				let res = await geteUserPersonalApi(userId)
				if(res){
					this.userObj = res.data.result
					this.departName = this.userObj.departs[0].departName
				}
				console.log('res',res);
				plus.runtime.getProperty(plus.runtime.appid, function(wgtinfo) {
					console.log("wgtinfo",wgtinfo)
					_this.version = wgtinfo.version 
				})

			},
			cancel() {
				// this.downloadTask && this.downloadTask.abort()
				this.updateShow = false
			},
			// 获取本地应用资源版本号
			versionClick() {
				// this.updateShow = true
				
				
				var that = this;
				let platform = uni.getSystemInfoSync().platform;
				console.log(platform)
				if( platform == 'ios'){
					return;
				}
				// #ifdef APP-PLUS
				this.progressShow = false;
				this.downloadProgress = 0;
				plus.runtime.getProperty(plus.runtime.appid, function(wgtinfo) {
					//appid属性
					// var wgtStr = "appid:"+wgtinfo.appid;
					// //version属性
					// wgtStr += "<br/>version:"+wgtinfo.version;
					// //name属性
					// wgtStr += "<br/>name:"+wgtinfo.name;
					// //description属性
					// wgtStr += "<br/>description:"+wgtinfo.description;
					// //author属性
					// wgtStr += "<br/>author:"+wgtinfo.author;
					// //email属性
					// wgtStr += "<br/>email:"+wgtinfo.email;
					// //features 属性
					// wgtStr += "<br/>features:"+wgtinfo.features;
					// console.log( wgtStr );
					
					that.versionsss = wgtinfo.version.split('.');
					console.log(that.versionsss);
					// console.log(that.version)
					uni.request({
						url: 'http://171.34.197.243:7210/api/account/login',
						data: {
							username: 'admin',
							password: 'yshb@123'
						},
						success: function(res) {
							console.log(res);
							that.token = res.data.token;
							appList();
						},
						fail: function(err) {
							console.log(err);
						}
					});
					function appList() {
						console.log(that.token);
						uni.request({
							url: 'http://171.34.197.243:7210/api/apps',
							header: {
								Authorization: that.token
							},
							success: function(res) {
								// console.log(res);
								var appListArr = res.data;
								appListArr.forEach(item => {
									if (item.name == '运维管理系统' && item.packageName == 'uni.UNIFE9E200') {
										// console.log(item)
										that.versionServer = item.currentVersion.versionName.split('.');
										for (var j = 0; j < that.versionServer.length; j++) {
											that.versionServer[j] = Number(that.versionServer[j]);
											that.versionsss[j] = Number(that.versionsss[j]);
											that.currentVersionId = item.currentVersionId;
											that.name = item.currentVersion.downloadUrl;
											that.changeLog = item.currentVersion.changeLog;
										}
									}
								});
								// console.log(that.versionServer)
								// console.log(that.version)
								// that.updateShow = true
								// return;
								console.log(that.versionServer.length)
								for (var i = 0; i < that.versionServer.length; i++) {
									if (that.versionsss[i] < that.versionServer[i] && i == 0) {
										// downLoadApk(that.currentVersionId)
										console.log("that.currentVersionId1",that.currentVersionId)
										that.updateShow = true;
									} else if (that.versionsss[0] == that.versionServer[0] && that.versionsss[i] < that.versionServer[i] && i == 1) {
										console.log("that.currentVersionId2",that.currentVersionId)
										// downLoadApk(that.currentVersionId)
										that.updateShow = true;
									} else if (
										that.versionsss[0] == that.versionServer[0] &&
										that.versionsss[1] == that.versionServer[1] &&
										that.versionsss[i] < that.versionServer[i] &&
										i == 2
									) {
										console.log("that.currentVersionId3",that.currentVersionId)
										// downLoadApk(that.currentVersionId)
										that.updateShow = true;
									}
								}
								if(!that.updateShow){
									// request.$success("无需更新！");
									that.showToast('无需更新！', 'default');
								}
							},
							fail: function(err) {
								console.log(err);
							}
						});
					}
				});
				// #endif
				// //#ifdef APP-PLUS
				// plus.runtime.getProperty(plus.runtime.appid, (info) => {
				// 		console.log(JSON.stringify(info));
				// 	 // this.version = info.version;
				// 	 this.$refs.uToast.show({
				// 	 	type: 'default',
				// 	 	message: `当前版本${info.version}`
				// 	 })
				// })
				// //#endif
				// // #ifdef H5
				// this.$refs.uToast.show({
				// 	type: 'default',
				// 	message: `当前版本V1.0.1`
				// })
				// // #endif
				
			},
			downLoadApk() {
				// console.log("http://171.34.197.243:7210/api/appVersions/downloadApk/"+currentVersionId)
				var that = this;
				// console.log('用户点击确定')
				that.downloadTask = uni.downloadFile({
					url: 'http://171.34.197.243:7210/api/appVersions/downloadApk/' + that.currentVersionId,
					// header:{
					// 	Authorization:that.token
					// },
					success: function(res) {
						// console.log(res)
						// console.log(res.tempFilePath)
						if (res.statusCode == 200) {
							that.tempFilePath = res.tempFilePath;
						}
					}
				});
				that.downloadTask.onProgressUpdate(res => {
					that.progressShow = true;
					if (res.progress < 100) {
						// that.showLoadProgress = "下载进度:" + res.progress + "%";
						that.downloadProgress = res.progress;
						// if(res.progress%2 == 0){
						// 	that.downloadProgress = res.progress
						// }
					} else if (res.progress == 100) {
						// uni.hideLoading();
						that.updateShow = false;
						that.progressShow = false;
						setTimeout(() => {
							plus.runtime.openFile(that.tempFilePath);
						}, 400);
					}
					// console.log('下载进度' + res.progress);
					// console.log('已经下载的数据长度' + res.totalBytesWritten);
					// console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);
				});
			
				// plus.downloader.createDownload( "http://171.34.197.243:7210/api/appVersions/downloadApk/"+currentVersionId, {}, function ( d, status ) {
				// 	console.log(d)
				// 	console.log(status)
				// })
			},
			// 测试点击
			testClick() {
				uni.navigateTo({
					url: '../test/test',
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			// 获取本地缓存大小
			getStorageSize() {
				plus.cache.calculate((size) => {
					let sizeCache = parseInt(size);
					if (sizeCache == 0) {
						this.currentSize = "0B";
					} else if (sizeCache < 1024) {
						this.currentSize = sizeCache + "B";
					} else if (sizeCache < 1048576) {
						this.currentSize = (sizeCache / 1024).toFixed(2) + "KB";
					} else if (sizeCache < 1073741824) {
						this.currentSize = (sizeCache / 1048576).toFixed(2) + "MB";
					} else {
						this.currentSize = (sizeCache / 1073741824).toFixed(2) + "GB";
					}
					this.modalObj.isClear = false
					if (this.currentSize == "0B") {
						this.$refs.uToast.show({
							message: `清除缓存成功`
						})
					} else {
						this.clearStorageClick()
					}
				})
			},
			// 清理缓存
			clearStorageClick() {
				let that = this;
				let os = plus.os.name;
				if (os == 'Android') {
					let main = plus.android.runtimeMainActivity();
					let sdRoot = main.getCacheDir();
					let files = plus.android.invoke(sdRoot, "listFiles");
					let len = files.length;
					console.log(files, len)
					for (let i = 0; i < len; i++) {
						let filePath = '' + files[i]; // 没有找到合适的方法获取路径，这样写可以转成文件路径  
						plus.io.resolveLocalFileSystemURL(filePath, function(entry) {
							if (entry.isDirectory) {
								entry.removeRecursively(function(entry) { //递归删除其下的所有文件及子目录
									that.files = []
									// console.log('缓存大小',that.currentSize);
									that.$refs.uToast.show({
										message: `清除缓存${that.currentSize}`
									})

								}, function(e) {
									console.log(e.message)
								});
							} else {
								entry.remove();
							}
						}, function(e) {
							console.log('文件路径读取失败')
						});
					}
				} else { // ios  
					plus.cache.clear(function() {
						that.$refs.uToast.show({
							message: `清除缓存${that.currentSize}`
						})
					});
				}
			},






		}


	}
</script>

<style lang="scss" scoped>
	.my_container {
		width: 100%;
		.my_top {
			background: url('../../static/images/wd_bg.png') no-repeat;
			background-size: 100% 100%;
			height: 22vh;
			.my_cantent{
				display: flex;
				justify-content: space-between;
				padding: 70rpx 10% 0;
				align-items: center;
				.my_cantent_left{
					width: 200rpx;
					image{
						width: 150rpx;
						height: 150rpx;
						border-radius: 50%;
					}
				}
				.my_cantent_right{
					width: 60%;
					font-weight: bold;
					color: #fff;
					>view{
						font-size: 26rpx;
					}
				}
			}
			
		}

		.my_items {
			width: 100%;
			// height: calc(100vh - 100rpx - 240rpx - 15rpx);
			background-color: #fff;
			border-radius: 40rpx 40rpx 0 0;
			padding: 40rpx 5% 0;
			box-sizing: border-box;

			>view {
				width: 100%;
				height: 100rpx;
				// background-color: pink;
				display: flex;
				justify-content: space-between;
				align-items: center;

				>view:nth-child(1) {
					display: flex;
					align-items: center;
					image {
						width: 60rpx;
						height: 60rpx;
						margin-right: 30rpx;
					}

				}

				>view:nth-child(2) {
					// width: 50%;
					display: flex;
					justify-content: right;
					line-height: 60rpx;
					image{
						width: 60rpx;
						height: 60rpx;
					}
				}
			}
		}


		.clear_btn {
			position: fixed;
			bottom: 180rpx;
			left: 15%;
			width: 70%;
			height: 80rpx;
			border-radius: 40rpx;
			border: 1rpx solid #EE6B27;
			text-align: center;
			line-height: 80rpx;
			color: #EE6B27;
			font-size: 28rpx;

		}

	}
</style>
