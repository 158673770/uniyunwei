<template>
	<view class="container_index">
		<view class="TabBar">
			<u-navbar>
				<view slot="left">
					<u-icon name="arrow-left" @click="gotu"></u-icon>
				</view>
				<view slot="center">
					<view v-if="!searchShow" style="text-align: center;font-size: 36rpx;">
						{{ query.tapy == 1 ? "未读报警记录" : '未处理报警记录'}}
					</view>
				</view>
			</u-navbar>
		</view>
		<view class="scroll_cant">
			<!-- unreadalert -->
			<u-empty
				mode="list"
				icon="../../static/images/custom-empty-image.png"
				v-if="getInfo.length == 0"
			>
			</u-empty>
			<uni-swiper-dot class="uni-swiper-dot-box" :info="getInfo" @clickItem="clickItem" :current="current" :mode="mode" field="content" :dots-styles="dotsStyles">
				<swiper class="swiper-box" @change="change" :current="swiperDotIndex">
					<swiper-item v-for="(item, index) in getInfo" :key="index">
						<view class="cantent">
							<view class="cantent_tit">
								<view class="cantent_tit_val">
									{{ item.titleName }}
								</view>
								<view class="cantent_zt" v-if="query.tapy != '1'">
									已读
								</view>
							</view>
							<view class="cantent_val">
								<view class="cantent_val_tit">
									报警类型：
								</view>
								<view class="cantent_val_cant">
									{{ item.alarmName }}
								</view>
							</view>
							<view class="cantent_val">
								<view class="cantent_val_tit">
									报警状态：
								</view>
								<view class="cantent_val_cant">
									{{ item.status == 0 ? '待处理' : '已处理'}}
								</view>
							</view>
							<view class="cantent_val">
								<view class="cantent_val_tit">
									报警时间：
								</view>
								<view class="cantent_val_cant">
									{{ item.createDate }}
								</view>
							</view>
							<view class="cantent_foter">
								<view class="cantent_foter_tit">
									报警内容：
								</view>
								<view class="cantent_foter_val">
									{{ item.content }}
								</view>
							</view>
							<view class="cantent_btm" v-if="item.status == 0">
								<u-button class="custom-style" type="primary" text="处理" size="small" @click="clickShow(item)"></u-button>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</uni-swiper-dot>
			
		</view>
		<u-popup :show="show" mode="bottom" :overlay="false"  @close="show = false">
			<view class="popup_cant">
				<view class="popup_cant_top">
					<view class="popup_cant_tit">
						报警处理
					</view>
					<view class="popup_cant_icon">
						<u-icon name="close" @click="show = false"></u-icon>
					</view>
				</view>
				<view class="popup_cant_val">
					<view class="popup_cant_textarea">
						<u--textarea confirmType="done" v-model="beizhu" placeholder="请输入内容" count autoHeight maxlength="300" height="250rpx"></u--textarea>
					</view>
					<view class="popup_cant_upload">
						<u-upload
							:fileList="fileList"
							@afterRead="afterRead"
							@delete="deletePic"
							:maxCount="10"
							:previewFullImage="true"
						></u-upload>
						
					</view>
					<view class="form_btn">
						<u-button style="width: 28%;" text="取消" @click="show=false"></u-button>
						<u-button style="width: 68%;margin: 0 0 0 5%;" type="primary" text="处理" @click="submitClick"></u-button>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import  *as API from '../../api/appApi.js'
	import {baseApi} from '../../request/request.js'
	export default {
		data() {
			return {
				fileList:[],
				show:false,
				beizhu:'',
				searchShow: false,
				keyword: '',
				swiperDotIndex:0,
				info: [{
					content: '内容 A'
				}, {
					content: '内容 B'
				}, {
					content: '内容 C'
				}, {
					content: '内容 B'
				}],
				current: 0,
				mode:'dot',
				dotsStyles:{
					backgroundColor: 'rgba(83, 200, 249,0.3)',
					border: '1px rgba(83, 200, 249,0.3) solid',
					color: '#fff',
					selectedBackgroundColor: 'rgba(83, 200, 249,0.9)',
					selectedBorder: '1px rgba(83, 200, 249,0.9) solid',
					bottom:0,
					width:20,
					
				},
				query:'',
				getInfo:[],
				types:''
			}
		},
		onLoad(query) {
			this.query = query
		},
		// 下拉刷新
		onPullDownRefresh(){
			
		},
		// 上拉加载
		onReachBottom(){
			console.log("上拉加载")
			
		},
		mounted() {
			this.getData()
		},
		methods: {
			clickShow(val){
				this.types = val
				console.log("this.types",this.types)
				this.show = true
			},
			deletePic(event) {
				console.log("event",event)
				API.delUploadAttById({ids:event.file.id}).then(res=>{
					console.log("res",res)
					this.fileList.splice(event.index, 1)
				})
				// id
				// this.fileList.splice(event.index, 1)
			},
			// 上传图片
			afterRead(event){
				console.log("event",event.file.url)
				let token =	uni.getStorageSync('token')
				uni.getImageInfo({
					src: event.file.url,
					success: (resluts) => {
						console.log("res", resluts)
						uni.uploadFile({
						  url: `${baseApi}/ysyunwei/file/add`, // 替换为实际的 POST 请求接口地址
						  header: {
						  	// 'Content-Type':'application/json',
						  	"X-Access-Token": token,
						  },
						  filePath: resluts.path,
						  name: 'files',
						  formData: {
							id: this.types.id, // 可以添加其他表单字段
						  },
						  success: (res) => {
							 let result = JSON.parse(res.data)
							console.log("reslut",result)
							// this.model1.userInfo.FileList.push({
							// 	url:resluts.path,
							// 	id:result.result
							// })
							this.fileList.push({
								url:resluts.path,
								id:result.result
							})
							// console.log("this.model1.userInfo.FileList",this.model1.userInfo.FileList)
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
			async submitClick(){
				// this.query
				// beizhu
				// fileList
				console.log("this.beizhu",this.beizhu)
				if(this.beizhu == ''){
					 this.$refs.uNotify.show({
						top: 10,
						type: 'error',
						message: '请填写备注',
						duration: 1000 * 3,
						fontSize: 20,
						safeAreaInsetTop:true
					})
				}else if(this.fileList.length == 0){
					this.$refs.uNotify.show({
						top: 10,
						type: 'error',
						message: '请上传附件',
						duration: 1000 * 3,
						fontSize: 20,
						safeAreaInsetTop:true
					})
				}else{
					let idArray = this.fileList.map(item => item.id);
					
					let formdata ={
						id: this.types.id, // 可以添加其他表单字段
						handleResult: this.beizhu,
						type:this.types.type,
						ids:idArray.splice(",")
					}
					API.handleAlarmAPP(formdata).then(res=>{
						console.log('resresresres',res)
						uni.showToast({
							title: res.data.result,
							duration: 500
						});
						this.show = false
						this.getData()
					})
				}
			},
			getData(){
				if(this.query.tapy == 1){
					API.queryUnreadAlarm().then(result =>{
						console.log("result",result)
						this.getInfo = result.data.result.list
						// 假设你有一个名为 array 的数组
						if (this.getInfo.length >= 10) {
						  this.getInfo = this.getInfo.slice(0, 10);
						  // console.log(firstTenElements);
						}
						if(this.getInfo[0]){
							if(this.getInfo[0].readStatus == 0){
								API.readrecordApp({recordId:this.getInfo[0].id,type:this.getInfo[0].type}).then(res =>{
									console.log("res已读",res)
								})
							}
						}
					})
				}else{
					API.queryPendingProcessingAlarm().then(result =>{
						console.log("result",result)
						this.getInfo = result.data.result.list
						if (this.getInfo.length >= 10) {
						  this.getInfo = this.getInfo.slice(0, 10);
						  // console.log(firstTenElements);
						}
						if(this.getInfo[0]){
							if(this.getInfo[0].readStatus == 0){
								API.readrecordApp({recordId:this.getInfo[0].id,type:this.getInfo[0].type}).then(res =>{
									console.log("res已读",res)
								})
							}
						}
					})
				}
				
			},
			// 返回上一页
			gotu(){
				uni.navigateBack({
					delta:1,//返回层数，2则上上页
				})
			},
			change(e) {
				// console.log("eee",e)
				this.current = e.detail.current
				
				console.log("this.getInfo[this.current].readStatus",this.getInfo[this.current].readStatus)
				if(this.getInfo[this.current].readStatus == 0){
					API.readrecordApp({recordId:this.getInfo[this.current].id,type:this.getInfo[this.current].type}).then(res =>{
						console.log("res已读",res)
					})
				}
				
				// console.log("this.current",this.current)
			},
			// 点击轮播
			clickItem(e) {
				console.log("点击轮播",e)
				this.swiperDotIndex = e
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
		min-height: 100vh;
		background-color: rgba(242, 242, 242, 1);
		.TabBar{
			padding-top: 145rpx;
		}
		.swiper-box{
			height: 60vh;
		}
		.cantent{
			margin: 20rpx 25rpx;
			border-radius: 25rpx;
			background-color: #fff;
			padding: 40rpx 5%;
			.cantent_tit{
				display: flex;
				justify-content: space-between;
				padding-bottom: 35rpx;
			}
			.cantent_foter{
				display: flex;
				justify-content: left;
				padding-bottom: 235rpx;
				.cantent_foter_tit{
					width: 25%;
				}
				.cantent_foter_val{
					width: 70%;
				}
			}
			.cantent_btm{
				padding-top: 50rpx;
				display: flex;
				justify-content: right;
				border-top: 1rpx solid #c9c9c9;
				.custom-style{
					width: 30%;
					margin-right: 0;
				}
			}
			.cantent_val{
				display: flex;
				justify-content: space-between;
				padding-bottom: 35rpx;
			}
			.cantent_img{
				padding-bottom: 200rpx;
			}
		}
		
		.popup_cant{
			padding:25rpx;
			.popup_cant_top{
				display: flex;
				justify-content: space-between;
				border-bottom: 1rpx solid #eee;
				padding-bottom: 15rpx;
			}
			.popup_cant_val{
				padding: 20rpx 0;
				// .popup_cant_textarea{
				// 	height: 250rpx;
				// }
				.popup_cant_upload{
					padding: 15rpx 0;
				}
			}
			.form_btn{
				display: flex;
				justify-content: center; 
			}
		}
	}
</style>