<template>
	<view class="container_index">
		<view class="TabBar">
			<u-navbar>
				<view slot="left">
					<u-icon name="arrow-left" @click="gotu"></u-icon>
				</view>
				<view slot="center">
					<view v-if="!searchShow" style="text-align: center;font-size: 36rpx;">
						某某站点
					</view>
				</view>
			</u-navbar>
		</view>
		<view class="container_title">
			<view class="container_title_lis">
				业主单位：
			</view>
			<view class="container_title_lis">
				运维人员：
			</view>
			<view class="container_title_lis">
				部门：
			</view>
		</view>
		<view class="container">
			<view class="container_cant">
				<u--form labelPosition="top" labelWidth="100" :model="model1" ref="uForm">
					<u-form-item
							label="台账类型"
							prop="userInfo.showtzlx"
							borderBottom
							@click="showtzlx = true"
							:required="true"
							ref="item1"
							v-if="query.dklx == '2'"
					>
						<u--input
								v-model="model1.userInfo.showtzlx"
								disabled
								disabledColor="#ffffff"
								placeholder="请选择台账类型"
								border="none"
						></u--input>
						<u-icon
								slot="right"
								name="arrow-right"
						></u-icon>
					</u-form-item>
					<u-form-item label="拍照" prop="userInfo.FileList" borderBottom ref="item1" :required="true">
						<u-icon name="photo" color="#2979ff" size="28" @click="takePhoto"></u-icon>
					</u-form-item>
					<view class="photo">
						<view class="photo_list">
							<view class="photo_lis" v-for="(imgpt,index) in model1.userInfo.FileList" :key="index">
								<image :src="imgpt.url"></image> 
							</view>
						</view>
					</view>
					<u-form-item label="备注"  prop="userInfo.beizhu" borderBottom ref="item1" :required="true">
						<!-- <u--input
								v-model="model1.userInfo.beizhu"
								placeholder="详细描述"
						></u--input> -->
						<u--textarea confirmType="done" v-model="model1.userInfo.beizhu" placeholder="详细描述" count autoHeight maxlength="300"></u--textarea>
						<!-- <u--textarea v-model="model1.userInfo.beizhu" placeholder="请输入内容" ></u--textarea> -->
					</u-form-item>
					<u-form-item prop="userInfo.zuobiao" borderBottom ref="item1">
						<u--input
								v-model="model1.userInfo.zuobiao"
								style="display: none;"
						></u--input>
						
						<view class="Coordinate">
							<view v-if="!active" class="CoordinateShow">
								打卡不在范围内请移至站点两公里内打卡
							</view>
							<view class="Coordinate_box" :class="{'Coordinate_box_active': active}" @click="CoorDinate">
								<view>
									<view class="text">
										
										{{ query.dklx == '1' ? '站点打卡' : '台账上传' }}
									</view>
									<view class="text_date">
										{{ model1.userInfo.currentTime }}
									</view>
								</view>
							</view>
							<view class="CoordinateAddress" v-if="query.dklx == '1'">
								{{CoordinateAddress}}<u-icon name="account-fill"></u-icon>
							</view>
						</view>
						<!-- <u--textarea v-model="model1.userInfo.beizhu" placeholder="请输入内容" ></u--textarea> -->
					</u-form-item>
					<!-- <u-button @click="submit">提交</u-button> -->
				</u--form> 
			</view>
			
			<!-- <image :src="imgpt.url" mode="" v-for="(imgpt,index) in model1.userInfo.FileList"></image> -->
		</view>
		<view class="footer">
			<view class="footer_list">
				<view class="footer_lis" @click="footerChange(1)">
					<!-- #2C8DF0 -->
					<u-icon name="checkmark-circle" size="36" :color="query.dklx == '1' ? '#2C8DF0' : ''"></u-icon>
					<view class="footer_lis_tit" :style="{'color':query.dklx == '1' ? '#2C8DF0' : ''}" >
						打卡
					</view>
				</view>
				<view class="footer_lis" @click="footerChange(2)" v-if="query.type != '水质监测'">
					<u-icon name="file-text" size="36" :color="query.dklx == '2' ? '#2C8DF0' : ''"></u-icon>
					<view class="footer_lis_tit" :style="{'color':query.dklx == '2' ? '#2C8DF0' : ''}">
						台账
					</view>
				</view>
			</view>
		</view>
		<u-action-sheet
				:show="showtzlx"
				:actions="actions"
				title="请选择台账类型"
				@close="showtzlx = false"
				@select="sexSelect"
		>
		</u-action-sheet>
		<u-popup 
			:show="SuccessFailureShow" 
			mode="center" 
			bgColor="#fff"
			@close="SuccessFailureShow = false" 
			@open="open" 
			:overlay="false"
			length="100%"
			 :customStyle="{width:100+'%',height:80+'%'}"
		 >
			<view class="Upload_Cantent">
				<view class="Upload_Cantent_tit">
					<view class="Upload_Cantent_tit_left">
						<view class="text">
							上传成功
						</view>
						<view class="text">
							上传时间
						</view>
					</view>
					<view class="Upload_Cantent_tit_right">
						<u-icon name="close" @click="SuccessFailureShow = false" size="30"></u-icon>
					</view>
				</view>
				<view class="Upload_Cantent_svg">
					<image src="../../static/images/u384.svg" mode=""></image>
				</view>
				<view class="Upload_Cantent_btn">
					<view class="text">
						查看台账记录
					</view>
					<view class="text">
						返回台账上传
					</view>
					<view class="text">
						重新上传
					</view>
				</view>
			</view>
		</u-popup>
		<!-- <image :src="imagePath" mode="aspectFit" style="display: none;" ></image> -->
		<!-- <canvas id="canvasId" :width="canvasWidth" :height="canvasHeight" style="display: none;"></canvas> -->
	</view>
</template>

<script>
	import * as API from '../../api/appApi.js'
	export default {
		data() {
			return {
				SuccessFailureShow:false,
				showtzlx:false,//台账类型显示隐藏
				searchShow: false,
				canvasWidth:'',
				canvasHeight:'',
				active:false,
				actions: [{
					name: '日常巡检',
					},{
					name: '故障维修',
					},{
					name: '校正及核查记录',
					},{
					name: '备件及耗材更换',
					},{
					name: '废液记录',
					},
				],
				// form数据
				model1: {
					userInfo: {
						showtzlx:'',//台账类型选项
						currentTime:'',//打卡时间
						beizhu:'',//备注
						FileList: [
						],//拍照
					},
				},
				// 地理位置
				CoordinateAddress:'',
				// 站点坐标
				SiteCoordinates:[28.72867,116.05362],
				canvas:'',
				query:'',
				dklx:''
			}
		},
		onReady(){
			// this.canvas = uni.createCanvasContext('canvasId', this);
			
		},
		onLoad(query) {
			console.log("query",query)
			this.query = query
			// this.dklx = query.dklx
		},
		// 下拉刷新
		onPullDownRefresh() {

		},
		onReachBottom() {
			
		},
		mounted() {
			this.startTimer();
			this.dingwei();
		},
		methods: {
			open(){
				console.log("弹出窗")
			},
			// 打卡站点成功失败
			CoorDinate(){
				console.log("111")
				// if(this.active){
					if(this.query.dklx == 1){
						console.log("打卡站点")
						this.SuccessFailureShow = true
					}else{
						console.log("台账上报")
						this.SuccessFailureShow = true
					}
				// }
			},
			sexSelect(e) {
				this.model1.userInfo.showtzlx = e.name
				// this.$refs.uForm.validateField('userInfo.sex')
			},
			// 打卡与台账切换
			footerChange(type){
				if(type == 1){
					this.query.dklx = type
				}else{
					this.query.dklx = type
				}
			},
			ApartFrom(latlon){
				console.log("latlon",latlon)
				const distance = this.calculateDistance(latlon.zdzb[0], latlon.zdzb[1], latlon.dqzb[0], latlon.dqzb[1]);
				if (distance < 2) {
				  console.log("两个坐标距离小于两公里");
				  this.active = true
				} else {
				  console.log("两个坐标距离大于或等于两公里");
				  this.active = false
				}
			},
			// 计算两个坐标点相距距离
			calculateDistance(lat1, lon1, lat2, lon2) {
			  const earthRadius = 6371; // 地球半径，单位为千米
			  // 将经纬度转换为弧度
			  const lat1Rad = this.toRadians(lat1);
			  const lon1Rad = this.toRadians(lon1);
			  const lat2Rad = this.toRadians(lat2);
			  const lon2Rad = this.toRadians(lon2);
			
			  // 使用Haversine公式计算两个坐标之间的距离
			  const deltaLat = lat2Rad - lat1Rad;
			  const deltaLon = lon2Rad - lon1Rad;
			  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
			    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
			    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
			  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			  const distance = earthRadius * c;
			
			  return distance;
			},
			// 计算弧度
			toRadians(degrees) {
			  return degrees * Math.PI / 180;
			},
			dingwei(){
			  let that = this;
			  uni.getLocation({
				type: "gcj02", //默认为 wgs84 返回 gps 坐标
				geocode:true,
				// isHighAccuracy: "true",
				// accuracy: "best", // 精度值为20m
				success: function (res) {
				  console.log("定位获取:", res);
				  if(res.address){
					  that.CoordinateAddress = `${res.address.city}${res.address.district}${res.address.street}${res.address.streetNum}${res.address.poiName}`
				  }
				  // this.SiteCoordinates
				  // 获取当前坐标与站点坐标进行计算
				  let zb = {
					  zdzb:that.SiteCoordinates,
					  dqzb:[res.latitude,res.longitude]
				  }
				  that.ApartFrom(zb);
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
			},
			startTimer() {
			  this.updateTime(); // 初始化时间
			  setInterval(() => {
				this.updateTime();
			  }, 1000); // 每秒钟更新一次时间
			},
			updateTime() {
			  const date = new Date();
			  const hours = this.formatTime(date.getHours());
			  const minutes = this.formatTime(date.getMinutes());
			  const seconds = this.formatTime(date.getSeconds());
			  this.model1.userInfo.currentTime = `${hours}:${minutes}:${seconds}`;
			},
			formatTime(time) {
			  return time < 10 ? `0${time}` : time; // 格式化为两位数
			},
			// 点击拍照
			takePhoto() {
				// 在按钮点击事件中调用拍照方法
				// _this = this
				plus.camera.getCamera().captureImage((path) => {
					// 将相对路径转换为完整的本地文件系统路径
					plus.io.resolveLocalFileSystemURL(path, (entry) => {
						const fullPath = entry.toLocalURL();
						console.log('完整路径：', fullPath);
						
						// console.log("this.model1.userInfo.FileList",this.model1.userInfo.FileList)
						// this.addWatermark(fullPath)
						this.getimg(fullPath)
					}, (error) => {
						console.log('解析路径失败：', error);
					});
				}, (error) => {
					console.log('拍照失败：', error);
				});
				// let _this = this
				// plus.camera.getCamera().captureImage((path) => {
				// 	// 在这里处理拍照成功后的逻辑
				// 	_this.addWatermark(path);
				//   }, (error) => {
				// 	console.log('拍照失败：' + error.message);
				//   });

			},
			getimg(path) {
				// 获取图片完整信息
				uni.getImageInfo({
					src: path,
					success: (res) => {
						// this.imagePath = res.path;
						console.log("res", res)
						this.model1.userInfo.FileList.push({
							url:res.path
						})
						// this.addWatermark(res.path, res.width, res.height);
					},
					fail: (error) => {
						console.log('获取图片信息失败：', error);
					}
				});
			},
			
			// addWatermark(path, width, height) {
				
			// 		// this.canvas = uni.createCanvasContext('canvas', this);
			// 	// console.log("path", path, 'width', width, 'height', height)
			// 	// this.canvasWidth = `${width}px`
			// 	// this.canvasHeight = `${height}px`
			// 	//  // // 设置画布高度和宽度
				 
			// 	const watermarkText = 'Watermark'; // 水印文本
			// 	const coordinate = 'Latitude: 40.7128, Longitude: -74.0060'; // 坐标地址
			// 	const title = 'Image Title'; // 标题信息
			// 	const timestamp = new Date().toLocaleString(); // 时间戳
			// 	this.canvas.drawImage(path, 0, 0, width, height);
			// 	// // console.log("ctx",ctx)
			// 	// // 绘制水印
			// 	this.canvas.setFontSize(12);
			// 	this.canvas.setFillStyle('rgba(255, 255, 255, 0.8)');
			// 	this.canvas.fillText(watermarkText,10, height - 10);
			// 	this.canvas.fillText(coordinate, 10, height - 25);
			// 	this.canvas.fillText(title, 10, height - 40);
			// 	this.canvas.fillText(timestamp, 10, height - 55);
			// 	// this.canvas.stroke(); 
			// 	// console.log("ctx",this.canvas)
				
				
			// 	// this.canvas.draw()
			// 	if(plus.os.name == "Android"){
			// 		this.canvas.draw(true, setTimeout(()=>{
			// 			// console.log(":111")
			// 			console.log("this.canvas",this.canvas)
			// 			// this.huizhi(this.canvas);
			// 			this.huizhi()
			// 		}, 1000))
			// 	}
			// 	// ctx.draw();
			// 	// ctx.draw(false, result => {
			// 	// 	console.log("绘制完成");
					
			// 	// // 	// this.huizhi(ctx); // 在回调函数中调用绘制完成后的操作
			// 	// });
			// },
			huizhi(ctx){
				
				// uni.canvasToTempFilePath({
				//   canvasId: 'canvasId',
				//   success: (res) => { 
				// 	// res.tempFilePath为导出的临时文件路径
				// 	console.log("res.tempFilePath",res.tempFilePath);
				// 	// this.model1.userInfo.FileList
				//   },
				//   fail: (err) => {
				// 	console.error(err);
				//   }
				// }, this); 
			},
			dataURLtoBlob(dataUrl) {
				const arr = dataUrl.split(',');
				const mime = arr[0].match(/:(.*?);/)[1];
				const bstr = atob(arr[1]);
				let n = bstr.length;
				const u8arr = new Uint8Array(n);
				while (n--) {
					u8arr[n] = bstr.charCodeAt(n);
				}
				return new Blob([u8arr], {
					type: mime
				});
			},
			afterRead(event) {
				console.log("event", event)
				// let fileListLen = this.model1.userInfo[`FileList${event.file[0].name}`].length
				// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
				// let lists = [].concat(event.file)
				// this.model1.userInfo.FileList.push(event.file.url)
				// let fileListLen = this[`FileList${event.name}`].length
				// lists.map((item) => {
				// 	this[`fileList${event.name}`].push({
				// 		...item,
				// 		status: 'uploading',
				// 		message: '上传中'
				// 	})
				// })
				// for (let i = 0; i < lists.length; i++) {
				// 	const result = await this.uploadFilePromise(lists[i].url)
				// 	let item = this[`fileList${event.name}`][fileListLen]
				// 	this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
				// 		status: 'success',
				// 		message: '',
				// 		url: result
				// 	}))
				// 	fileListLen++
				// }
			},
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			// 返回上一页
			gotu() {
				uni.navigateBack({
					delta: 1, //返回层数，2则上上页
				})
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
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container_index {
		// 头部
		.container_title {
			// padding-top: 145rpx;
			margin: 10rpx 0;
			padding: 145rpx 5rpx 0;
			.container_title_lis {
				padding: 15rpx;
			}
		}
		// 内容
		.container {
			padding: 15rpx 15rpx 200rpx;
			background-color: rgba(242, 242, 242, 1);

			.container_cant {
				border-radius: 15rpx;
				padding: 15rpx 30rpx;
				// height: 60vh;
				background-color: #fff;
				.photo_list{
					display: flex;
					justify-content: left;
					flex-wrap: wrap;
					.photo_lis{
						width: 19%;
						height: 160rpx;
						margin-right: 5rpx;
						margin-top: 5rpx;
						// padding: 0 5rpx;
						image{
							width: 100%;
							height: 100%;
						}
					}
					.photo_lis:nth-child(5n){
						margin-right: 0;
					}
				}
				.Coordinate{
					padding: 100rpx 0 0;
					width: 100%;
					.CoordinateShow{
						text-align: center;
						padding: 20rpx 0;
						color: red;
					}
					.Coordinate_box{
						width: 260rpx;
						height: 260rpx;
						border-radius: 50%;
						border: 1rpx solid #eee;
						display: flex;
						justify-content: center;
						flex-wrap: wrap;
						align-items: center;
						margin: 0 auto;
					}
					.Coordinate_box_active{
						border: 1rpx solid #3eabd5;
						animation: breathe 2s infinite;
						color: #3eabd5;
					}
					.CoordinateAddress{
						margin:25rpx;
						display: flex;
						justify-content: center;
						
					}
					// animation: breathe 2s infinite;
				}
			}
		}
		// 底部
		.footer{
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			background-color: #fff;
			.footer_list{
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 20rpx 0;
				border-top: 1rpx solid #c9c9c9;
				.footer_lis{
					text-align: center;
					font-size: 36rpx;
					display: flex;
					justify-content: center;
					flex-wrap: wrap;
					.footer_lis_tit{
						width: 100%;
					}
				}
			}
		}
		.Upload_Cantent{
			padding: 25rpx 3%;
			.Upload_Cantent_tit{
				display: flex;
				justify-content: space-between;
				.Upload_Cantent_tit_left{
					font-size:36rpx;
				}
				.Upload_Cantent_tit_left .text:last-child{
					font-size: 30rpx;
				}
			}
			.Upload_Cantent_svg{
				padding: 250rpx 0 100rpx;
				display: flex;
				justify-content: center;
				image{
					width: 100%;
				}
			}
			.Upload_Cantent_btn{
				text-align: center;
				font-size: 36rpx;
				.text{
					padding: 30rpx 0;
				}
			}
		}
		@keyframes breathe {
		  0% {
		    opacity: 0.7;
		    transform: scale(1);
		  }
		
		  50% {
		    opacity: 1;
		    transform: scale(1.1);
		  }
		
		  100% {
		    opacity: 0.7;
		    transform: scale(1);
		  }
		}
	}
</style>