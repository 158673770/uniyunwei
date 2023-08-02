<template>
	<view class="container_index">
		<view class="TabBar">
			<u-navbar>
				<view slot="left">
					<u-icon name="arrow-left" @click="gotu"></u-icon>
				</view>
				<view slot="center">
					<view v-if="!searchShow" style="text-align: center;font-size: 36rpx;">
						{{ query.title }}
					</view>
				</view>
			</u-navbar>
		</view>
		<view class="container_title">
			<view class="container_title_lis">
				{{ getquery() }}：{{ query.content != 'null' ? query.content : '暂无' }}
			</view>
			<view class="container_title_lis">
				运维人员：{{itemLis.realname}}
			</view>
			<view class="container_title_lis">
				部门：{{itemLis.departName}}
			</view>
		</view>
		<view class="container">
			<view class="container_cant">
				<u--form labelPosition="top" labelWidth="100" :rules="rules" :model="model1" ref="uForm">
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
						{{ model1.userInfo.FileList.length }}/10
					</u-form-item>
					<view class="photo">
						<view class="photo_list">
							<view class="photo_lis" v-for="(imgpt,index) in model1.userInfo.FileList" :key="index" @click="phopoFd(imgpt)">
								<view @click.stop>
									<u-icon name="close" class="photo_icon" @click="deletePhoto(imgpt,index)" color="#fff"></u-icon>
								</view>
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
						
						<view class="Coordinate" v-if="query.dklx == '1'">
							<view v-if="!active && query.dklx == '1'" class="CoordinateShow">
								打卡不在范围内请移至站点两公里内打卡
							</view>
							<view class="Coordinate_box" :class="{'Coordinate_box_active': active && query.dklx == '1'}" @click="clockIn">
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
						<view class="Coordinate" v-if="query.dklx == '2'">
							<view class="Coordinate_box Coordinate_box_active" @click="clockIn">
								<view>
									<view class="text">
										台账上传
									</view>
									<view class="text_date">
										{{ model1.userInfo.currentTime }}
									</view>
								</view>
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
					<u-icon name="checkmark-circle" size="46" :color="query.dklx == '1' ? '#2C8DF0' : ''"></u-icon>
					<view class="footer_lis_tit" :style="{'color':query.dklx == '1' ? '#2C8DF0' : ''}" >
						打卡
					</view>
				</view>
				<view class="footer_lis" @click="footerChange(2)" v-if="query.type != 3">
					<u-icon name="file-text" size="46" :color="query.dklx == '2' ? '#2C8DF0' : ''"></u-icon>
					<view class="footer_lis_tit" :style="{'color':query.dklx == '2' ? '#2C8DF0' : ''}">
						台账
					</view>
				</view>
			</view>
		</view>
		<u-popup :show="show" @close="show = false" 
		mode="center" 
		bgColor="transparent"
		:customStyle="{width:100+'%'}"
		>
			<view class="pop_img">
				<image :src="showImage"></image> 
			</view>
		</u-popup>
		<!-- <u-action-sheet
				:show="showtzlx"
				:actions="actions"
				:key="index"
				keyName="itemText"
				title="请选择台账类型"
				@close="showtzlx = false"
				@select="sexSelect"
		>
		</u-action-sheet> -->
		
		<u-picker 
			title="请选择台账类型" 
			:show="showtzlx" 
			:key="index"
			@close="showtzlx = false"
			closeOnClickOverlay
			@cancel="showtzlx = false"
			:columns="actions"
			keyName="itemText"
			@confirm="sexSelect"
		>
		</u-picker>
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
						<view class="text" v-if="SuccessAndFailure == '1' ">
							{{ query.dklx == 1 ? '打卡成功' : '台账上传成功' }}
						</view>
						<view class="text" v-if="SuccessAndFailure == '0' ">
							{{ query.dklx == 1 ? '打卡失败' : '台账上传失败' }}
						</view>
						<view class="text" v-if="query.dklx == 1 && SuccessAndFailure == '1' ">
							{{ query.dklx == 1 ? '打卡时间' : '上传时间' }}:{{ dksj }}
						</view v-if="query.dklx == 1 && SuccessAndFailure == '1' ">
						<view class="text" v-if="query.dklx == 1">
							打卡地点:{{ CoordinateAddress }}
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
					<view class="text" v-if="query.dklx == 1 && SuccessAndFailure == '1'" @click="SearchResult">
						查看打卡记录
					</view>
					<view class="text" v-if="query.dklx == 1 && SuccessAndFailure == '0'" @click="SuccessFailureShow = false">
						重新打卡
					</view>
					<view class="text" v-if="query.dklx != 1 && SuccessAndFailure == '1'" @click="SearchResult">
						查看台账记录
					</view>
					<view class="text" v-if="query.dklx != 1" @click="SuccessFailureShow = false">
						返回台账上传
					</view>
					<view class="text" v-if="query.dklx != 1 && SuccessAndFailure == '0'" @click="SuccessFailureShow = false">
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
	import {baseApi} from '../../request/request.js'
	export default {
		data() {
			return {
				ansj:true,
				SuccessFailureShow:false,
				SuccessAndFailure:'',
				showImage:'',
				show:false,
				showtzlx:false,//台账类型显示隐藏
				searchShow: false,
				canvasWidth:'',
				canvasHeight:'',
				active:false,
				actions: [
					[]
				],
				// form数据
				model1: {
					userInfo: {
						showtzlx:'',//台账类型选项
						showtzlxid:'',//台账类型id
						currentTime:'',//打卡时间
						beizhu:'',//备注
						FileList: [
							
						],//拍照
					},
				},
				rules: {
					'userInfo.beizhu': [
						{
							required: true,
							message: '请输入备注',
							trigger: ['blur', 'change']
						}
					],
					'userInfo.FileList': [
						{
							type: 'array',
							min: 1,
							required: true,
							message: '请上传照片',
							trigger: ['blur', 'change']
						}
					],
					'userInfo.showtzlx':[
						{
							required: true,
							message: '请选择台账类型',
							trigger: ['blur', 'change']
						}
					]
				},
				// 地理位置
				CoordinateAddress:'',
				// 站点坐标
				SiteCoordinates:[28.72867,116.05362],
				canvas:'',
				query:'',
				dklx:'',
				itemLis:{},
				lat:'',
				lon:'',
				tzid:'',
				dksj:'',
				index:0
			}
		},
		onReady(){
			// this.canvas = uni.createCanvasContext('canvasId', this);
			
		},
		onLoad(query) {
			console.log("query",query)
			this.query = query
			this.SiteCoordinates = [query.lat,query.lon];
			
			this.getDate();
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
			// 跳转打卡详情
			SearchResult(){
				uni.navigateTo({
					url: `../selectsite/clockingRecordDetails?id=${this.tzid}&dklx=${this.query.dklx}&type=${this.query.type}`,
				});
			},
			// 弹窗打开
			open(){
				
			},
			 clockIn(){
				 if(this.ansj){
					 this.ansj = false
					 // 获取当前时间
					 let now = new Date();
					 // 获取年份
					 let year = now.getFullYear();
					 // 获取月份（注意月份从0开始，所以要加1）
					 let month = now.getMonth() + 1;
					 // 获取日期
					 let date = now.getDate();
					 // 获取小时
					 let hours = now.getHours();
					 // 获取分钟
					 let minutes = now.getMinutes();
					 // 获取秒数
					 let seconds = now.getSeconds();
					 this.dksj = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`
					 // 获取附件id
					 let idArray = this.model1.userInfo.FileList.map(item => item.id);
					 if(this.active && this.query.dklx == 1){
					 	if(this.query.dklx == 1){
					 		let datafom = {
					 			userId: this.itemLis.id,//用户id
					 			departId:this.itemLis.departId,//departId
					 			attendanceTime:	`${year}-${month}-${date} ${hours}:${minutes}:${seconds}`,//打卡时间
					 			lon: this.lon,//经度
					 			lat:this.lat,//纬度
					 			address:this.CoordinateAddress,//地址
					 			contactId:this.query.id,//关联业务id
					 			type:this.query.type,//业务类型
					 			remark:this.model1.userInfo.beizhu,//备注
					 			stationName:this.query.title,//站点名称
					 			userName:this.itemLis.realname,//用户名称
					 			attIdList:idArray,//附件id集合
					 		}
					 		this.$refs.uForm.validate().then(async res => {
					 		 let result = await API.YsAttendanceAdd(datafom);
					 		 console.log("result",result)
					 		 if(result.data.code == 200){
					 			 this.tzid = result.data.result
					 			 this.model1.userInfo.beizhu = ''
					 			 this.model1.userInfo.FileList = [];
					 			 // 显示台账打卡成功与失败
					 			 this.SuccessAndFailure = '1'
					 			 this.SuccessFailureShow = true
								 // 重复提交的问题
								 this.ansj = true
					 		 }else{
								 // 重复提交的问题
								 this.ansj = true
					 			 // 显示台账打卡成功与失败
					 			 this.SuccessAndFailure = '0'
					 			 this.SuccessFailureShow = true
					 		 }
					 			// YsAttendanceAdd
					 			// uni.$u.toast('校验通过')
					 		}).catch(errors => {
								// 重复提交的问题
								this.ansj = true
					 			// uni.$u.toast('校验失败')
					 		})
					 	}
					 }else{
					 	if(this.query.dklx == 2){
					 		let dataform2 = {
					 			contactId:this.query.id,//排口id
					 			demo:this.model1.userInfo.beizhu,//说明
					 			escalationDate:this.dksj,//上报时间
					 			ledgerType:this.model1.userInfo.showtzlxid,//台账类型
					 			type:this.query.type,//业务类型
					 			uaIds:idArray.join(','),//附件id集合
					 		}
					 		this.$refs.uForm.validate().then(async res => {
					 			let resu = await API.YsLedgerAdd(dataform2);
					 			if(resu.data.code == 200){
					 				this.tzid = resu.data.result.ledgerId
					 				this.model1.userInfo.beizhu = ''
					 				this.model1.userInfo.FileList = [];
					 				 // 显示台账打卡成功与失败
					 				this.SuccessAndFailure = '1'
					 				this.SuccessFailureShow = true
									// 重复提交的问题
									this.ansj = true
					 			}else{
					 				 // 显示台账打卡成功与失败
					 				this.SuccessAndFailure = '0'
					 				this.SuccessFailureShow = true
									// 重复提交的问题
									this.ansj = true
					 			}
					 			console.log("resu",resu)
					 			// uni.$u.toast('校验通过')
					 		}).catch(errors => {
								// 重复提交的问题
								this.ansj = true
					 			uni.$u.toast('请填写必填信息')
					 		})
					 		console.log("dataform2",dataform2)
					 		// if(this.model1.userInfo.showtzlx)
					 	}else{
							// 重复提交的问题
							this.ansj = true
					 		uni.$u.toast('请在范围内打卡')
					 	}
					 }
				 }else{
					 uni.$u.toast('提交中请勿重复提交')
				 }
				
				// this.query.dklx 1打卡2台账
				// console.log("datafom",datafom)
				
			},
			getquery(){
				if(this.query.type == 1){
					return "污染源企业"
				}else if(this.query.type == 2){
					return "污水处理站"
				}else if(this.query.type == 3){
					return "业主单位"
				}
			},
			deletePhoto(item,index){
				console.log("item",item)
				// this.model1.userInfo.FileList.splice(index, 1)
				API.delUploadAttById({ids:item.id}).then(res=>{
					console.log("res",res)
					this.model1.userInfo.FileList.splice(index, 1)
				})
			},
			// 点击放大图片
			phopoFd(item){
				console.log("item",item)
				this.show = true
				this.showImage = item.url
			},
			getDate(){
				API.list2({code:'ledger_type'}).then(res =>{
					console.log("resresresres",res)
					this.index++
					this.actions[0] = res.data.result
					console.log("this.actions",this.actions)
				})
				// delUploadAttById删除附件
				// API.queryStationInfo({id:this.query.id,type:this.query.type}).then(res =>{
				// 	console.log("ressss",res)
				// })
			},
			sexSelect(e) {
				console.log("e",e)
				
				this.model1.userInfo.showtzlx = e.value[0].itemText
				this.model1.userInfo.showtzlxid = e.value[0].itemValue
				this.showtzlx = false
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
			  let uernainfo =  uni.getStorageSync('infoListFo')
			  console.log("uernainfo",uernainfo)
			  if(uernainfo != ''){
				  this.itemLis = JSON.parse(uernainfo)
			  }
			  let that = this;
			  uni.getLocation({
				type: "gcj02", //默认为 wgs84 返回 gps 坐标
				geocode:true,
				isHighAccuracy: "true",
				accuracy: "best", // 精度值为20m
				success: function (res) {
				  console.log("定位获取:", res);
				  if(res.address){
					  that.CoordinateAddress = `${res.address.city}${res.address.district}${res.address.street}${res.address.streetNum}${res.address.poiName}`
				  }
				  that.lat = res.latitude
				  that.lon = res.longitude
				  console.log("this.lat",this.lat,'this.lon',this.lon)
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
				if(this.model1.userInfo.FileList.length < 10){
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
				}else{
					uni.$u.toast('上传照片限制10张')
				}
				// let _this = this
				// plus.camera.getCamera().captureImage((path) => {
				// 	// 在这里处理拍照成功后的逻辑
				// 	_this.addWatermark(path);
				//   }, (error) => {
				// 	console.log('拍照失败：' + error.message);
				//   });

			},
			getimg(path) {
				let token =	uni.getStorageSync('token')
				// 获取图片完整信息
				uni.getImageInfo({
					src: path,
					success: (resluts) => {
						// this.imagePath = res.path;
						console.log("res", resluts)
						// this.model1.userInfo.FileList.push({
						// 	url:res.path
						// })
						uni.uploadFile({
						  url: `${baseApi}/ysyunwei/file/add`, // 替换为实际的 POST 请求接口地址
						  header: {
						  	// 'Content-Type':'application/json',
						  	"X-Access-Token": token,
						  },
						  filePath: resluts.path,
						  name: 'files',
						  formData: {
							id: this.query.id, // 可以添加其他表单字段
							tableName: this.query.dklx == 1 ? 'ys_attendance' :'ys_ledger',
						  },
						  success: (res) => {
							 let result = JSON.parse(res.data)
							console.log("reslut",result)
							this.model1.userInfo.FileList.push({
								url:resluts.path,
								id:result.result
							})
							console.log("this.model1.userInfo.FileList",this.model1.userInfo.FileList)
							// 上传成功的处理逻辑
							console.log("res",res)
						  },
						  fail: (err) => {
							// 上传失败的处理逻辑
						  }
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
		.pop_img{
			width: 80%;
			height: 50vh;
			display: flex;
			justify-content: center;
			align-items: center;
			margin: 0 auto;
			image{
				width: 100%;
				// height: 100%;
			}
		}
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
						width: 32%;
						height: 160rpx;
						margin-right: 5rpx;
						margin-top: 5rpx;
						position: relative;
						.photo_icon{
							position: absolute;
							right: 0;
							top: 0;
							z-index: 90;
						}
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
				border-top: 1rpx solid #c9c9c9;
				
				.footer_lis{
					text-align: center;
					font-size: 46rpx;
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