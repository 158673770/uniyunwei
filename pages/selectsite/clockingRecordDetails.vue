<template>
	<view class="container_index">
		<view class="TabBar">
			<u-navbar>
				<view slot="left">
					<u-icon name="arrow-left" @click="gotu"></u-icon>
				</view>
				<view slot="center">
					<view v-if="!searchShow" style="text-align: center;font-size: 36rpx;">
						{{ query.dklx == '1' ? "打卡记录" : '台账记录' }}详情
					</view>
				</view>
			</u-navbar>
		</view>
		<view class="cantent">
			<view class="cantent_val">
				{{ mclist[0] }}:{{ datainfo.portName }} {{ datainfo.contactName}}
			</view>
			<view class="cantent_val" v-if="mclist[1] != ''">
				{{ mclist[1] }}：{{ datainfo.name }} {{ datainfo.stationName}}
			</view>
			<view class="cantent_val">
				{{ mclist[2] }}：{{ datainfo.ledgerTypeName }} {{ query.dklx == 2 ? '' : datainfo.userName}}
			</view>
			<view class="cantent_val">
				{{ mclist[3] }}：{{ datainfo.escalationDate }} {{ datainfo.attendanceTime}}
			</view>
			<view class="cantent_val">
				{{ mclist[4] }}：<text v-if="query.dklx != 1">{{ datainfo.userName  }}</text> {{ datainfo.address}}
			</view>
			<view class="cantent_val">
				{{ mclist[5] }}：{{ datainfo.demo }} {{ datainfo.remark}}
			</view>
			<view class="cantent_val">
				{{ mclist[6] }}：
			</view>
			<view class="cantent_img">
				 <u-album v-if="query.dklx != 1" :urls="datainfo.attList" keyName="uaPath" :key="index"></u-album>
				 <u-album v-if="query.dklx == 1" :urls="datainfo.attList" keyName="uaPath" :key="index"></u-album>
				 
			</view>
		</view>
	</view>
</template>

<script>
	import  *as API from '../../api/appApi.js'
	export default {
		data() {
			return {
				searchShow: false,
				keyword: '',
				query:'',
				datainfo:{},
				dkmc:'',
				qymc:'',
				lxmc:'',
				mclist:[],
				index:0
			}
		},
		onLoad(query) {
			this.query = query
			console.log("this.query",this.query)
		},
		// 下拉刷新
		onPullDownRefresh(){
			
		},
		// 上拉加载
		onReachBottom(){
			console.log("上拉加载")
			
		},
		mounted() {
			this.nameInfo();
			this.getData();
		},
		methods: {
			nameInfo(){
				
				switch (this.query.dklx) {
				  case '1':
				    // 当expression等于value1时执行的代码块
					if(this.query.type == 1){
						this.mclist = ['打卡点名称','企业名称','打卡点人员','打卡时间','打卡地点','详细描述','拍摄照片']
					}else if(this.query.type == 2){
						this.mclist = ['打卡点名称','污水处理站名称','打卡点人员','打卡时间','打卡地点','详细描述','拍摄照片']
					}else if(this.query.type == 3){
						this.mclist = ['打卡点名称','','打卡点人员','打卡时间','打卡地点','详细描述','拍摄照片']
					}
				    break;
				  case '2':
				    // 当expression等于value2时执行的代码块
					if(this.query.type == 1){
						this.mclist = ['站点名称','企业名称','台账类型','上传时间','上传人员','详细描述','拍摄照片']
					}else if(this.query.type == 2){
						this.mclist = ['站点名称','污水处理厂','台账类型','上传时间','上传人员','详细描述','拍摄照片']
					}
					
					// this.dkmc = '站点名称'
					// this.qymc = '污水处理厂'
					// this.lxmc = '台账类型'
					
				    break;
				  // // 可以有更多的case语句
				  // default:
				  //   // 当expression不匹配任何case时执行的代码块
				  //   break;
				}

			},
			getData(){
				let parmas = {
					type:this.query.type,
					id:this.query.id
				}
				if(this.query.dklx == 1){
					API.ysAttendanceQueryById(parmas).then(res =>{
						console.log("res打卡",res)
						this.datainfo = res.data.result
						this.index++
					})
				}else if(this.query.dklx == 2){
					API.queryById(parmas).then(res =>{
						console.log("res台账",res)
						this.datainfo = res.data.result
						this.index++
					})
				}
				
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
		.cantent{
			margin: 20rpx 0;
			background-color: #fff;
			padding: 40rpx 5%;
			.cantent_val{
				padding-bottom: 15rpx;
			}
			.cantent_img{
				padding-bottom: 200rpx;
			}
		}
	}
</style>