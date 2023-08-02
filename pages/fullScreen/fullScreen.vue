<template>
	<!-- <view class="AlarmDetails_cant">
		ASDASDASDASDSA
	</view> -->
	<view class="u-full-content">
		<view class="u-update-content">
			<u-modal :show="show" title="发现新版本" :showCancelButton="true" @cancel="cancel" @confirm="confirm">
				<view class="u-update-content" v-if="!progressShow">
					<rich-text :nodes="content"></rich-text>
				</view>
				<view style="width: calc(100% - 40rpx);margin:50rpx 20rpx;" v-else>
					<u-line-progress activeColor="rgba(30, 104, 255, 1)"  :striped="true" :percentage="downloadProgress" :striped-active="true"></u-line-progress>
				</view>
			</u-modal>
			<!-- <u-modal v-model="show" :async-close="true" :show-cancel-button="true" confirm-text="升级" title="发现新版本" @cancel="cancel" @confirm="confirm">
				<view class="u-update-content" v-if="!progressShow">
					<rich-text :nodes="content"></rich-text>
				</view>
				<view style="width: calc(100% - 40rpx);margin:50rpx 20rpx;" v-else>
					<u-line-progress active-color="rgba(30, 104, 255, 1)"  :striped="true" :percent="downloadProgress" :striped-active="true"></u-line-progress>
				</view>
			</u-modal> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				progressShow: false,
				currentVersionId: '',
				downloadProgress: 0,
				tempFilePath: '',
				content: `
					1. 修复badge组件的size参数无效问题<br>
					2. 新增Modal模态框组件<br>
					3. 新增压窗屏组件，可以在APP上以弹窗的形式遮盖导航栏和底部tabbar<br>
					4. 修复键盘组件在微信小程序上遮罩无效的问题
				`,
			}
		},
		onReady() {
			this.show = true;
		},
		onLoad(option) {
			console.log("option",option)
			this.content = option.changeLog ? option.changeLog : ''
			this.currentVersionId = option.currentVersionId ? option.currentVersionId : ''
		},
		methods: {
			cancel() {
				this.closeModal();
				this.downloadTask && this.downloadTask.abort()
			},
			confirm() {
				this.show = true;
				this.downLoadApk();
				// this.closeModal();
			},
			closeModal() {
				uni.navigateBack();
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
						console.log(res)
						console.log(res.tempFilePath)
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
			}
		}
	}
</script>

<style scoped lang="scss">
	// @import "../../uni_modules/uview-ui/libs/css/style.components.scss";
	
	// .u-full-content {
	// 	// background-color: #00C777;
	// }
	
	.u-update-content {
		font-size: 26rpx;
		// color: $u-content-color;
		line-height: 1.7;
		padding: 30rpx;
	}
</style>
