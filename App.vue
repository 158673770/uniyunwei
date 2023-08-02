<script>
	import {
		loginApi
	} from 'api/loginApi.js'
	export default {
		data: {
			versionInfo: '',
			version: '',
			token: '',
			changeLog: '',
			versionServer: '',
			showLoadProgress: '',
			updateShow: false,
			downloadProgress: 0,
			progressShow: false,
		},
		onLaunch: function() {
			
			// 静止横屏
			// plus.screen.lockOrientation("portrait-primary");
			// #ifdef APP
			Vue.prototype.statusHeight = 50; //导航栏时间高度
			Vue.prototype.screenHeight = 700; //屏幕高度
			Vue.prototype.screenWidth = 300; //屏幕宽度
			console.log(uni.getSystemInfo)
			uni.getSystemInfo({
				success: e => {
					console.log(e,1111)
					Vue.prototype.statusHeight = e.statusBarHeight; //导航栏时间高度
					Vue.prototype.screenHeight = e.screenHeight; //屏幕高度
					Vue.prototype.screenWidth = e.screenWidth; //屏幕宽度
					Vue.prototype.platform = e.platform; //运行环境   安卓，h5，微信小程序
				},
				fail:e=>{
					console.log(e,333)
				}
			});
			// #endif

			let ishave = uni.getStorageSync('isHave')
			let loginObj = {
				captcha: "",
				checkKey: "",
				password: "",
				username: ""
			}
			
			loginObj.username = uni.getStorageSync('username')
			loginObj.password = uni.getStorageSync('password')

			loginApi(loginObj).then((res) => {
				if (res.data.code == 200) {
					uni.setStorage({
						key: 'token',
						data: res.data.result.token
					})
					uni.setStorage({
						key: 'userId',
						data: res.data.result.userInfo.id
					})

					uni.redirectTo({
						url: "../tabbar/index"
					})
				}
			}).catch((err) => {
				console.log('登录失败')
			})
			plus.navigator.closeSplashscreen()//关闭程序启动界面
		},
		onShow() {
			// console.log('App Show')
			var that = this;
			const systemInfo = uni.getSystemInfoSync();
			console.log("systemInfo",systemInfo.platform)
			if (systemInfo.platform === 'android') {
				// #ifdef APP-PLUS
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
					that.version = wgtinfo.version.split('.');
					// console.log(that.version);
					// console.log(that.version)
					console.log("that.version",that.version)
					// 注释于22/11/9
					uni.request({
						url: 'http://171.34.197.243:7210/api/account/login',
						data: {
							username: 'admin',
							password: 'yshb@123'
						},
						success: function(res) {
							// console.log(res);
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
								// console.log("res.data",res);
								var appListArr = res.data;
								appListArr.forEach(item => {
									if (item.name == '运维管理系统' && item.packageName == 'uni.UNIFE9E200') {
										// console.log(item)
										that.versionServer = item.currentVersion.versionName.split('.');
										for (var j = 0; j < that.versionServer.length; j++) {
											that.versionServer[j] = Number(that.versionServer[j]);
											that.version[j] = Number(that.version[j]);
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
								// console.log(that.versionServer.length)
								for (var i = 0; i < that.versionServer.length; i++) {
									if (that.version[i] < that.versionServer[i] && i == 0) {
										console.log("that.currentVersionId1",that.currentVersionId)
										// downLoadApk(that.currentVersionId)
										that.navigateTo("../fullScreen/fullScreen?changeLog=" + that.changeLog + "&currentVersionId=" + that.currentVersionId);
									} else if (that.version[0] == that.versionServer[0] && that.version[i] < that.versionServer[i] && i == 1) {
										console.log("that.currentVersionId2",that.currentVersionId)
										// downLoadApk(that.currentVersionId)
										that.navigateTo("../fullScreen/fullScreen?changeLog=" + that.changeLog + "&currentVersionId=" + that.currentVersionId);
									} else if (
										that.version[0] == that.versionServer[0] &&
										that.version[1] == that.versionServer[1] &&
										that.version[i] < that.versionServer[i] &&
										i == 2
									) {
										// console.log("that.currentVersionId3","/pages/fullScreen/fullScreen?changeLog=" + that.changeLog + "&currentVersionId=" + that.currentVersionId)
										// downLoadApk(that.currentVersionId)
										that.navigateTo("../fullScreen/fullScreen?changeLog=" + that.changeLog + "&currentVersionId=" + that.currentVersionId);
									}
								}
								if(!that.updateShow){
									// request.$success("无需更新！");
									// that.showToast('无需更新！', 'default');
								}
							},
							fail: function(err) {
								console.log(err);
							}
						});
					}
				});
				// #endif
			  // console.log('这是安卓设备');
			} else {
			  // console.log('这不是安卓设备');
			}
			
		},
		methods:{
			navigateTo(Url){
				setTimeout(()=>{
					uni.navigateTo({
						url: Url,
						success: function(res) {
							console.log(res);
						},
						fail: function(res) {
							console.log(res);
						}
					});
				},1000)
				
			}
		},
		onHide: function() {
			// console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import "@/uni_modules/uview-ui/index.scss";
	@import "@/util/default.css";

	/*每个页面公共css */
	#app {
		margin: 0;
		padding: 0;
		list-style: none;
		min-height: 100%;
		background-color: #F6F6F6;
		font-size: 32rpx;
	}
</style>
