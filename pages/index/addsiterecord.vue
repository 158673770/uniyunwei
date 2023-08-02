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



				<view class="upload_core" v-for="(item,index) in detailObj.itemInfos" :key="item.itemId">
					<!-- <view>{{item.itemName}}</view> -->
					<view class="radio_view">
						<view>{{item.itemName}}</view>
						<!-- <view class="radio_sel">
							<view :class="item.status == 1 ? 'radio_active_blue':'' " @click="swiperItemClick(1,item.itemId)">合格</view>
							<view :class="item.status == 2 ? 'radio_active_red':'' " @click="swiperItemClick(2,item.itemId)">异常</view>
						</view> -->
						<!-- <view class="radio_sel">
							<view :class="item.status == 1 ? 'radio_active_blue':'' ">合格</view>
							<view :class="item.status == 2 ? 'radio_active_red':'' ">异常</view>
						</view> -->
						<view  v-if="item.status == 2" class="error_status">·</view>
					</view>
					<view class="upload_swiper">
						<u-swipe-action>
							<u-swipe-action-item :options="item.optionsList" :name="index" @click="swiperItemClick($event,item.itemId)" ref="swipeActionRef">
								<view class="swipe-action">
									<view class="swipe-action__content">
									
										<view class="swiper_view">
											<view class="img_relative" v-for="(items,i) in item.imgList"
												:key="i">
												<image src="../../static/img/delPic.png" mode="" click="delImg"
													class="del_logo" @click="clickDelImg(i,items.uaId,item.itemId)"></image>
												<image :src="items.uaPath" mode="" class="pic" @click="previewImg(i,item.itemId)">
												</image>
											</view>
											<view class="img_del" @click="openActionSheet(true,item.itemId)" v-if="item.imgList.length < 8">
												<image src="../../static/img/uploadpic.png" mode=""></image>
											</view>
										</view>


									</view>
								</view>
							</u-swipe-action-item>
						</u-swipe-action>
					</view>
				</view>



				<!-- <view class="upload_core">
					<view>进水口</view>
					<view class="upload_swiper">
						<u-swipe-action>
							<u-swipe-action-item :options="swiperItemList">
								<view class="swipe-action">
									<view class="swipe-action__content">

										<view class="swiper_view">
											<view class="img_relative" v-for="(item,index) in list1" :key="index">
												<image src="../../static/img/delPic.png" mode="" click="delImg"
													class="del_logo"></image>
												<image :src="item.url" mode="" class="pic"></image>
											</view>
											<view class="img_del">
												<image src="../../static/img/uploadpic.png" mode=""></image>
											</view>
										</view>

									</view>
								</view>
							</u-swipe-action-item>
						</u-swipe-action>
					</view>
				</view> -->
				 <view class="top_textarea_title">
						<view>备注</view>
						<view></view>
				</view>
				<view class="content_textarea">
					<textarea name="" id="" placeholder="请详细描述变化信息" maxlength="500" v-model="remark"></textarea>
					<view class="pos_abs">{{remark.length}}/500</view>
				</view>
				
				<u-modal :show="modalObj.isshow" :title="modalObj.title" :content='modalObj.content' @confirm="modalConfirm"></u-modal>
				<view class="sub_add" @click="addRecord">提交</view>
				<view style="height: 30rpx;"></view>
			</view>
			<!--site_bottom-->

			<!-- 拍照功能选择框 -->
			<u-action-sheet cancelText="取消" :actions="actionSheetList" :show="isActionSheetShow"
				@close="openActionSheet(false)" round="true" @select="selectAction"></u-action-sheet>

		</view>
		
		<hpy-watermark ref="watermark" @waterMark="waterMark"></hpy-watermark>
		
		<u-modal :show="showModalObj.show" :title="showModalObj.title" :content='showModalObj.content' showCancelButton @cancel="showModalObj.show = false" @confirm="gpsConfirm"></u-modal>
	</view>
</template>

<script>
import {
		getIndexListDetailApi,
		delPhotoFileApi,
		getWeatherCityLonLatApi
	} from '../../api/indexApi.js'
	import { baseApi } from '../../request/request.js'
	export default {
		data() {
			return {
				statusHeight:50,
				navText: '', //nav文本标题
				detailId: '',
				modalObj:{
					isshow:false,
					title:"提示",
					content:"提交成功",
					index:1,//1成功  2失败 
				},
				
				xList:[],//巡检项列表
				isActionSheetShow: false, //是否显示拍照功能框
				
				// isSwiperShow:true,
				
				
				// statusList:[
				// 	{name:'合格',types:1},{name:'异常',types:0}
				// ],
				
				actionSheetList: [
					// {
					// 	name: "通过相机拍摄",
					// 	text: "xj"
					// }, //xj:相机
					// {
					// 	name: "通过相册",
					// 	text: "xc"
					// }, //xc:相册
					{
						name: "通过相机拍摄",
						text: "xjsy"
					}, //xjsy:相机水印
					// {
					// 	name: "相册添加水印",
					// 	text: 'xcsy'
					// } //xcsy:相册水印
				],
				picId: '', //上传图片时是那个任务点击

				// swiperItemList: [{
				// 	text: '合格',
				// 	style: {
				// 		backgroundColor: '#ACB3BF'
				// 	}
				// }, {
				// 	text: '异常',
				// 	style: {
				// 		backgroundColor: '#f56c6c'
				// 	}
				// }],

				// 详情对象
				detailObj: {},     //地址是detailObj.address  运维人员：detailObj.legalPerson
				remark:"",//备注
				
				waterAddress:'',
				
				showModalObj:{
					show:false,
					title:'提示',
					content:"您已拒绝应用获取位置,将会影响你上传图片时水印地址为空,如果不想图片地址水印为空,请在设置-应用-权限中同意定位授权"
				},
				
			}
		},
		onLoad(options) {
			this.navText = options.navText + '巡检'
			this.detailId = options.detailId
			this.lastTime = options.lastTime
			this.getSiteObj()
			
			// // 获取测试地址
			// this.getlocation()
			
		},
		methods: {
			// 获取详情
			async getSiteObj() {
				let res = await getIndexListDetailApi(this.detailId)
				if (res.data.code == 200) {
					this.detailObj = JSON.parse(JSON.stringify(res.data.result))  
					// console.log("后台返回数据",this.detailObj);
					// 赋值所有默认巡检项合格1  不合格0
					this.xList = this.detailObj.itemInfos
					
					this.detailObj.recordId = ''
					for (var i = 0; i < this.detailObj.itemInfos.length; i++) {
						this.detailObj.itemInfos[i].status = 1
						this.detailObj.itemInfos[i].imgList = []
						
						// 添加初始化异常
						this.detailObj.itemInfos[i].optionsList = [{text: `异常`,style: {backgroundColor: '#f56c6c'}}]
					}
					// console.log("初始化数据",this.detailObj);
					
				}
			},
			// 打开/关闭功能选择框
			openActionSheet(bool, itemId) {
				
				if (bool == true) {
					this.isActionSheetShow = true
					this.picId = itemId
				} else{
					this.isActionSheetShow = false
				}
				
				
				// this.getPicCahceUrl(index)
				
			},


			// 删除图片index图片索引，图片id,itemsId详情id
			async clickDelImg(index,tpid,itemsId) {
				// console.log('点击删除图片', index,itemsId);
				for (var i = 0; i < this.detailObj.itemInfos.length; i++) {
					if (itemsId == this.detailObj.itemInfos[i].itemId) {
						// this.detailObj.itemInfos[i].imgList.splice(index, 1)
						let res = await delPhotoFileApi([tpid])
						if (res.data.code == 200) {
							this.detailObj.itemInfos[i].imgList.splice(index, 1)
						} else{
							uni.showToast({
								icon:'none',
								title:'删除失败'
							})
						}
						// 强制更新数据
						this.$forceUpdate() 
					}
				}
				
				
				
				
				console.log(this.detailObj.itemInfos);
				
			},
			// 预览图片
			previewImg(index,itemsId) {
				// console.log('点击查看图片', index,itemsId);
				let preList = []
				for (var i = 0; i < this.detailObj.itemInfos.length; i++) {
					if (itemsId == this.detailObj.itemInfos[i].itemId) {
						preList = this.detailObj.itemInfos[i].imgList.map(item => item.uaPath)
					}
				}
			
				uni.previewImage({
					// 数组
					urls: preList,
					// 出现的index
					current: index
				})
			},
			// 选中列表的索引状态
			async selectAction(item) {
				// console.log('index', item.index);

				if (item.text == "xj") {
					let imgList = await this.selectImg(['camera'], 10, 1)
					console.log('imgListxj',imgList);
					for (var i = 0; i < imgList.length; i++) {
						let img = await this.uploadFilePromise(imgList[i],this.detailId,this.picId)
						// this.imglist.unshift(img)
						// console.log('img路径',img);
					}

				} else if (item.text == "xc") {
					// this.selectImg(['album'], 10, 8)
					let imgList = await this.selectImg(['album'], 10, 8)
					console.log('imgListxc',imgList);
					for (var i = 0; i < imgList.length; i++) {
						let img = await this.uploadFilePromise(imgList[i],this.detailId,this.picId)
						// this.imglist.unshift(img)
						// console.log('img路径',img);
					}
				}else if(item.text == 'xjsy'){   //相机水印
					let imgList = await this.selectImg(['camera'], 10, 1)
					for (var i = 0; i < imgList.length; i++) {
						this.addImages(imgList)
						// let img = await this.uploadFilePromise(imgList[i],this.detailId,this.picId)
						// this.imglist.unshift(img)
						// console.log('img路径',img);
					}
				}
			},
			// //点击单行
			// itemClick(data){
			//     console.log('点击',data)
			// },
			// //删除
			// del(data){
			//     console.log('删除',data)
			  
			// },
			// //编辑
			// edit(data){
			//     console.log('编辑',data)
			    
			// },
			
			
			
			
			// 点击滑动单元格  id是detailObj的id
			swiperItemClick(item,id){
				// console.log('item',item,id);
				for (var i = 0; i < this.detailObj.itemInfos.length; i++) {
					if (id == this.detailObj.itemInfos[i].itemId) {
						if (this.detailObj.itemInfos[i].status == 1) {
							this.detailObj.itemInfos[i].status = 2
							this.detailObj.itemInfos[i].optionsList = [{text: '取消',style: {backgroundColor: '#ACB3BF'}}]
							this.$refs.swipeActionRef[item.name].status = 'close'
							// 强制更新数据
							this.$forceUpdate() 
						} else{
							this.detailObj.itemInfos[i].status = 1
							this.detailObj.itemInfos[i].optionsList = [{text: '异常',style: {backgroundColor: '#f56c6c'}}]
							this.$refs.swipeActionRef[item.name].status = 'close'
							// 强制更新数据
							this.$forceUpdate() 
						}
						
						// if (item.index == 0) {
						// 	// 合格
						// 	this.detailObj.itemInfos[i].status = 1
						// 	this.$refs.swipeActionRef[item.name].status = 'close'
						// 	// 强制更新数据
						// 	this.$forceUpdate() 
						// } else{
						// 	// 异常
						// 	this.detailObj.itemInfos[i].status = 2
						// 	this.$refs.swipeActionRef[item.name].status = 'close'
						// 	// 强制更新数据
						// 	this.$forceUpdate() 
						// }
					}
				}
				// 按钮点击切换效果
				// for (var i = 0; i < this.detailObj.itemInfos.length; i++) {
				// 	if (id == this.detailObj.itemInfos[i].itemId) {
				// 		if (item == 2) {
				// 			// 异常
				// 			this.detailObj.itemInfos[i].status = 2
				// 			// 强制更新数据
				// 			this.$forceUpdate() 
				// 		} else{
				// 			// 合格
				// 			this.detailObj.itemInfos[i].status = 1
				// 			// 强制更新数据
				// 			this.$forceUpdate() 
				// 		}
				// 	}
				// }
				
				// console.log(this.detailObj);
				
				
			},
			// 增加记录
			addRecord() {
				let list = []
				for (var i = 0; i < this.detailObj.itemInfos.length; i++) {
					list = list.concat(this.detailObj.itemInfos[i].imgList)
				}
				console.log('list',list);
				if (list.length > 0) {
					this.modalObj.isshow = true
				} else{
					this.modalObj.isshow = true
					this.modalObj.content = "请先上传图片后在进行提交"
					this.modalObj.index = 2
				}
			},
			// 确认提交成功/失败
			modalConfirm(){
				if(this.modalObj.index == 1){
					uni.redirectTo({
						url:'/pages/tabbar/message'
					})
					this.modalObj.isshow = false
				}else{
					this.modalObj.isshow = false
				}
			},



			// 选择图片
			// 选择图片// 调用选择控制相机/相册功能,水印功能
			/*
			 *type:sourType类型选择
			 * filesize：文件大小
			 * countnum:图片数量
			 */
			selectImg(type, filesize, countnum) {
				return new Promise((resolve, reject) => {
					uni.chooseImage({
						count: countnum | 1,
						sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						// sourceType: ['camera'],sourceType: ['album'], //从相册选择
						sourceType: type,
						success: res => {
							// console.log(res, 1)
							// uni.showLoading({
							// 	title: '上传中...',
							// 	mask: true
							// });
							let Mnum = 1024 * 1024 * filesize
							let tempfileslist = res.tempFiles
							// console.log(Mnum,tempfileslist[0].size)
							for (var i = 0; i < tempfileslist.length; i++) {
								if (tempfileslist[i].size > Mnum) {
									uni.showToast({
										icon: 'none',
										title: `您的第${i+1}张图片超过${filesize}M,请重新上传`
									})
								}
							}
							resolve(res.tempFilePaths)
							// resolve(res)
						},
						fail: (err) => {
							// reject(err)
							if ("chooseImage:fail cancel" == err.errMsg) {
								uni.showToast({
									icon: 'none',
									title: '取消了选择'
								});
							} else {
								// #ifdef MP
								uni.getSetting({
									success: (res) => {
										let authStatus = res.authSetting['scope.album'];
										if (!authStatus) {
											uni.showModal({
												title: '授权失败',
												content: '系统上传需要从您的相册获取图片，请在设置界面打开相关权限',
												success: (res) => {
													if (res.confirm) {
														uni.openSetting();
													}
												}
											})
										}
									}
								})
								// #endif
							}
						}
					});
				})
			},

			// 上传图片
			/**
			 * url:blob地址
			 * detailId:详情id
			 * itemsId:巡检项id
			 * */
			uploadFilePromise(url, detailId, itemsId) {
				console.log(url,detailId,itemsId);
				// return new Promise((resolve, reject) => {
					for (var i = 0; i < this.detailObj.itemInfos.length; i++) {
						if (itemsId == this.detailObj.itemInfos[i].itemId && this.detailObj.recordId) {
							// console.log(this.detailObj.itemInfos[i], '选择有status');
							
							uni.uploadFile({
								url:`${baseApi}/ysyunwei/InspectionRecord/addInspectionRecordApp2`, // 仅为示例，非真实的接口地址
								filePath: url,
								name: 'file',
								formData: {
									portId:detailId,
									// files: [url],
									itemId:[itemsId],
									recordId:this.detailObj.recordId,
									status:[this.detailObj.itemInfos[i].status],
									remark:this.remark
								},
								header: {
									"X-Access-Token": uni.getStorageSync('token'),
								},
								success: (res) => {
									// console.log(JSON.parse(res.data).code);
									if (JSON.parse(res.data).code == 200) {
										// let obj = {
										// 	name:new Date().getTime(),
										// 	uri:url
										// }
										for (var i = 0; i < this.detailObj.itemInfos.length; i++) {
											if (itemsId == this.detailObj.itemInfos[i].itemId) {
												
												console.log(JSON.parse(res.data).result.attList);
												this.detailObj.itemInfos[i].imgList = JSON.parse(res.data).result.attList
												// this.detailObj.itemInfos[i].imgList.unshift(obj)
												// 强制更新数据
												this.$forceUpdate() 
											}
										}
									} else{
										uni.showToast({
											icon:'none',
											title:"添加失败"
										})
									}
									console.log(this.detailObj.itemInfos,111);
									// resolve(res)
								},
								fail: (err) => {
									// reject(err)
								}
							})
						}else if(itemsId == this.detailObj.itemInfos[i].itemId){
							uni.uploadFile({
								url: `${baseApi}/ysyunwei/InspectionRecord/addInspectionRecordApp2`, // 仅为示例，非真实的接口地址
								filePath: url,
								name: 'file',
								formData: {
									portId:detailId,
									// files: [url],
									itemId:[itemsId],
									recordId:'',
									status:[this.detailObj.itemInfos[i].status],
									remark:this.remark
								},
								header: {
									"X-Access-Token": uni.getStorageSync('token'),
								},
								success: (res) => {
									// console.log(JSON.parse(res.data).code);
									if (JSON.parse(res.data).code == 200) {
										this.detailObj.recordId = JSON.parse(res.data).result.recordId
										
										for (var i = 0; i < this.detailObj.itemInfos.length; i++) {
											if (itemsId == this.detailObj.itemInfos[i].itemId) {
												this.detailObj.itemInfos[i].imgList = JSON.parse(res.data).result.attList
												this.$forceUpdate() 
											}
										}
									} else{
										uni.showToast({
											icon:'none',
											title:"添加失败"
										})
									}
									// console.log(this.detailObj.itemInfos,2222);
									// resolve(res)
								},
								fail: (err) => {
									// reject(err)
								}
							})
						}
					}
					
					
				// })
			},
			
			// 图片添加水印-----------
			// 添加图片
			async addImages(filePaths) {
				if (filePaths) {
					
					// await this.getlocation()
					// let address = '南昌市高新区'
					let addsy= await this.getlocation()
					
					let realName = uni.getStorageSync('uName') 
					// console.log('address',addsy);
					var fillTexts = [`运维人员：${realName}`, `地址：${addsy}`];
					fillTexts.push("时间：" + this.getNowTime());
					// 添加水印
					
					setTimeout(() => {
						this.$refs.watermark.addWaterMark({
							filePaths,
							fillTexts
						});
					})
				}
			},
			/**
			 * 水印添加回调，在H5平台下，filePath 为 base64
			 */
			waterMark(filePath) {
				// console.log('水印路径',filePath);
				this.uploadFilePromise(filePath,this.detailId,this.picId)
				
				// this.imageList.push(filePath);
			},
			/**
			 * 获取当前时间
			 */
			getNowTime() {
				var date = new Date(),
					year = date.getFullYear(),
					month = date.getMonth() + 1,
					day = date.getDate(),
					hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
					minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
					second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
				month >= 1 && month <= 9 ? (month = "0" + month) : "";
				day >= 0 && day <= 9 ? (day = "0" + day) : "";
				return (year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second);
			},
			
			
			// 获取当前位置经纬度
			getlocation() {
				return new Promise((reslove,reject)=>{
					uni.getLocation({
						type: 'gcj02',
						geocode: true,
						isHighAccuracy: true, //高精度定位
						success: (res) => {
							if (JSON.stringify(res.address) != '{}' ) {
								let addressObj = res.address 
								let addressText = ''
								if (addressObj.poiName) {
									addressText = `${addressObj.province}${addressObj.city}${addressObj.district}${addressObj.street}${addressObj.poiName}`
									reslove(addressText)
								} else{
									addressText = `${addressObj.province}${addressObj.city}${addressObj.district}${addressObj.street}`
									reslove(addressText)
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
							// 		// console.log('转换的地址为',addressList);
							// 		// let addressText = `${addressList[1]}${addressList[2]}${addressList[3]}${addressList[4]} `
							// 		let addressText = addressList[0]
									
							// 		// alert(`${addressText}start`)
							// 		// this.waterAddress = addressList[0]
							// 		reslove(addressText)
									
							// 		// this.adressAll = address
							// 		// this.adressshowtext = addressList[3] + addressList[addressList.length - 1]
							// 	}
							// )
							
						},
						fail: (err) => {
							console.log('定位失败',err);
							if (err.code == 1) {
								uni.showToast({
									title:"请打开定位服务功能",
									icon:'none'
								})
							}else if(err.code == 22){
								this.showModalObj.show = true
							}else{
								reject(err)
							}
							
						}
					
					
					})
				})
				
			},
			// 打开地图导航
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
			// 取消弹窗
			gpsConfirm(){
				this.showModalObj.show = false
			}
	



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
				padding: 5%;
				box-sizing: border-box;
				border-bottom: 1rpx solid #f5f5f5;
				font-size: 28rpx;
				
				.radio_view{
					width: 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;
					
					.radio_sel{
						width: 150rpx;
						height: 40rpx;
						display: flex;
						justify-content: space-between;
						background-color: #f5f5f5;
						>view{
							width: 50%;
							height: 100%;
							text-align: center;
							line-height: 40rpx;
						}
						.radio_active_blue{
							background-color: #2c8DF0;
							color: #fff;
						}
						.radio_active_red{
							background-color: #ff0000;
							color: #fff;
						}
					}
					
					.error_status{
						font-size: 50rpx;
						color: #ff0000;
						font-weight: bold;
						// line-height: 100rpx;
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
						.img_relative {
							width: 150rpx;
							height: 150rpx;
							margin-bottom: 20rpx;
							position: relative;

							.del_logo {
								width: 32rpx;
								height: 32rpx;
								position: absolute;
								top: 0;
								right: 0;
								z-index: 99;
							}

							.pic {
								width: 100%;
								height: 100%;
								border-radius: 8rpx;
							}
						}

						.img_relative:not(:nth-child(4n)) {
							margin-right: 20rpx;
						}

						.img_relative:nth-child(n + 5) {
							margin-bottom: 0;
						}

						.img_del {
							width: 150rpx;
							height: 150rpx;

							image {
								width: 100%;
								height: 100%;
							}
						}

						// >image{
						// 	width: 150rpx;
						// 	height: 150rpx;
						// 	margin-bottom: 20rpx;
						// }
						// >image:not(:nth-child(4n)){
						//  margin-right: 20rpx;	
						// }
						// >image:nth-child(n + 5){
						// 	margin-bottom: 0;
						// }

					}
				}
			}
			
			.top_textarea_title{
				margin-top: 30rpx;
				margin-bottom: 30rpx;
				width:90%;
				margin-left: 5%;
				display: flex;
				justify-content: space-between;
			}
			
			.content_textarea{
				width: 90%;
				height: 300rpx;
				border: 1rpx solid #ABB1BD;
				border-radius: 8rpx;
				margin-left: 5%;
				position: relative;
				margin-bottom: 200rpx;
				
				textarea{
					width: 100%;
					height: 100%;
					padding: 3% 3% 6%;
					box-sizing: border-box;
				}
				
				.pos_abs{
					position: absolute;
					bottom: 3%;
					right: 3%;
					font-size: 28rpx;
					color: #8c8c8c;
				}
				
			}
			
			

			.sub_add {
				position: fixed;
				bottom: 5%;
				left: 5%;
				z-index: 99;
				// margin-left: 5%;
				width: 90%;
				height: 100rpx;
				background-color: #2c8DF0;
				text-align: center;
				line-height: 100rpx;
				color: #fff;
				border-radius: 56rpx;
				margin-top: 40rpx;
			}
			




		}





	}
</style>
