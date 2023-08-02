<template>
	<view class="container_index">
		<view class="TabBar">
			<u-navbar>
				<view slot="left">
					<u-icon name="arrow-left" @click="gotu"></u-icon>
				</view>
				<view slot="center">
					<view v-if="!searchShow" style="text-align: center;font-size: 36rpx;">
						报警详情
					</view>
					<!-- <u-search v-if="searchShow" placeholder="请输入" v-model="keyword"></u-search> -->
				</view>
			</u-navbar>
		</view>
		<view class="AlarmDetails">
			<view class="AlarmDetails_cant" v-if="DataLis">
				<view class="AlarmDetails_tapy" :style="{'border-bottom':DataLis.handlePerson ? ' 1rpx solid #9e9e9e' : 'none'}">
					<view class="AlarmDetails_tit">
						<view class="AlarmDetails_tit_left"> 
							{{ DataLis.titleName }}
						</view>
						<view class="AlarmDetails_tit_right">
							<!-- 已读 -->
							{{ DataLis.readStatus == '1' ? '已读' : '未读' }}
						</view>
					</view>
					<view class="AlarmDetails_val" v-if="DataLis.name">
						<view class="AlarmDetails_val_left">
							{{ getType(query.type) }}
						</view>
						<view class="AlarmDetails_val_right">
							{{ DataLis.name }}
						</view>
					</view>
					<view class="AlarmDetails_val">
						<view class="AlarmDetails_val_left">
							报警类型
						</view>
						<view class="AlarmDetails_val_right">
							{{ DataLis.alarmType }}
						</view>
					</view>
					<view class="AlarmDetails_val">
						<view class="AlarmDetails_val_left">
							报警状态
						</view>
						<view class="AlarmDetails_val_right">
							{{ DataLis.status == '1' ? '已处理' : '未处理'  }}
						</view>
					</view>
					<view class="AlarmDetails_val">
						<view class="AlarmDetails_val_left">
							报警时间
						</view>
						<view class="AlarmDetails_val_right">
							{{ DataLis.createDate }}
						</view>
					</view>
					<view class="AlarmDetails_val">
						<view class="AlarmDetails_val_left">
							报警内容
						</view>
						<view class="AlarmDetails_val_right">
							{{ DataLis.content }}
						</view>
					</view>
				</view>
				<view class="AlarmDetails_tapy" v-if="DataLis.handlePerson" :key="index">
					<view class="AlarmDetails_val">
						<view class="AlarmDetails_val_left">
							处理人
						</view>
						<view class="AlarmDetails_val_right">
							{{ DataLis.handlePerson }}
						</view>
					</view>
					<view class="AlarmDetails_val">
						<view class="AlarmDetails_val_left">
							处理时间
						</view>
						<view class="AlarmDetails_val_right">
							{{ DataLis.handleDate }}
						</view>
					</view>
					<view class="AlarmDetails_val">
						<view class="AlarmDetails_val_left">
							上传附件
						</view>
						<view class="AlarmDetails_val_right_img">
							 <u-album :urls="DataLis.attList" keyName="uaPath" :key="index"></u-album>
						</view>
					</view>
					<view class="AlarmDetails_val">
						<view class="AlarmDetails_val_left">
							处理结果
						</view>
						<view class="AlarmDetails_val_right">
							{{ DataLis.handleResult }}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="footer">
			<u-button :style="{'width':DataLis.status == '1' ? '100%' : '28%'}" text="返回" @click="gotu"></u-button>
			<u-button style="width: 68%;margin: 0 0 0 5%;" type="primary" text="处理" @click="show = true" v-if="DataLis.status == '0'"></u-button>
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
		<u-notify ref="uNotify"></u-notify>
	</view>
</template>

<script>
	import  *as API from '../../api/appApi.js'
	import {baseApi} from '../../request/request.js'
	export default {
		data() {
			return {
				searchShow: false,
				keyword: '',
				query:'',
				show:false,
				beizhu:'',
				fileList:[],
				DataLis:{},
				index:0
			}
		},
		
		onLoad(query) {
			console.log("query",query)
			this.query = query
			// this.dklx = query.dklx
		},
		
		// 下拉刷新
		onPullDownRefresh(){
			
		},
		// 上拉加载
		onReachBottom(){
			console.log("上拉加载")
			
		},
		mounted() {
			this.getData();
			console.log("baseApi",baseApi)
		},
		methods: {
			getType(val){
				if(val == 1){
					return "所属企业"
				}else if (val == 3) {
					return "所属污水处理站"
				} else if (val == 2){
					return ""
				} else if (val == 4){
					return "所属单位"
				}
			},
			async getData(){
				let ydwd = await API.readrecordApp({recordId:this.query.id,type:this.query.type})
				console.log("ydwd",ydwd)
				let res = await API.AlarmDetails(this.query);
				if(res.data.code == 200){
					this.DataLis = res.data.result
					console.log("this.DataLis",this.DataLis)
				}
			},
			// 提交处理状态
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
						id: this.query.id, // 可以添加其他表单字段
						handleResult: this.beizhu,
						type:this.query.type,
						ids:idArray.splice(",")
					}
					API.handleAlarmAPP(formdata).then(res=>{
						if(res.data.code == 200){
							this.$refs.uNotify.show({
								top: 10,
								type: 'success',
								message: '处理成功',
								duration: 1000 * 3,
								fontSize: 20,
								safeAreaInsetTop:true
							})
							this.show = false
							this.getData();
							console.log('resresresres',res)
						}else{
							this.$refs.uNotify.show({
								top: 10,
								type: 'error',
								message: res.data.message,
								duration: 1000 * 3,
								fontSize: 20,
								safeAreaInsetTop:true
							})
						}
					})
				
					// formData.append('id', this.query.id)
					// formData.append('handleResult', this.beizhu)
					// formData.append('type', this.query.type)
					// // http://10.1.0.111:8999:ysyunwei/commonalarm/handleAlarmAPP
					// // console.log("this.fileList",this.fileList)
					// let res = await API.handleAlarmAPP(formData);
					// console.log("res",res)
				}
				// this.show = false
			},
			// 上传图片
			afterRead(event){
				console.log("event",event.file.url)
				let token =	uni.getStorageSync('token')
				let sc = ['',"ys_alarm_pollution",'ys_alarm_sewage','ys_alarm_station','ys_alarm_gwstation']
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
							id: this.query.id, // 可以添加其他表单字段
							tableName:sc[Number(this.query.type)]
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
			deletePic(event) {
				console.log("event",event)
				API.delUploadAttById({ids:event.file.id}).then(res=>{
					console.log("res",res)
					this.fileList.splice(event.index, 1)
				})
				// id
				// this.fileList.splice(event.index, 1)
			},
			// 返回上一页
			gotu(){
				uni.navigateBack({
					delta:1,//返回层数，2则上上页
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
		min-height: 100vh;
		background-color: rgba(242, 242, 242, 1);
		.TabBar{
			padding-top: 145rpx;
		}
		.AlarmDetails{
			padding: 145rpx 20rpx 20rpx;
			.AlarmDetails_cant{
				padding: 20rpx 40rpx;
				background-color: #fff;
				border-radius: 20rpx;
				.AlarmDetails_tapy{
					// padding-bottom: 20rpx;
					margin-bottom: 100rpx;
					padding: 20rpx 0;
					.AlarmDetails_tit{
						display: flex;
						justify-content: space-between;
						padding: 0 0 20rpx;
						.AlarmDetails_tit_left{
							font-size: 30rpx;
						}
						.AlarmDetails_tit_right{
							font-size: 26rpx;
						}
					}
					.AlarmDetails_val{
						display: flex;
						justify-content: space-between;
						// font-size: 20rpx;
						padding-bottom: 15rpx;
						flex-wrap: wrap;
						.AlarmDetails_val_right_img{
							width: 100%;
							padding: 15rpx 0;
						}
					}
					.AlarmDetails_val:last-child{
						.AlarmDetails_val_right{
							width: 70%;
							// height: 300rpx;
							word-wrap: break-word;
						}
					}
				}
				// .AlarmDetails_tapy:last-child{
				// }
			}
		}
		.footer{
			position: fixed;
			bottom: 35rpx;
			display: flex;
			justify-content: center;
			width: 90%;
			padding: 0 5%;
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