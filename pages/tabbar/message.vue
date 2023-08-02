<template>
	<view class="container_index">
		<view class="TabBar">
			<u-navbar>
				 <view slot="left"></view>
				 <view slot="center">
					 <view v-if="!searchShow" style="text-align: center;font-size: 36rpx;">
						 消息
					 </view>
					 <u--input
					     placeholder="请输入内容"
					     v-model="keyword"
						 v-if="searchShow"
						 shape="circle"
					     @input="searchchange"
						 @clear="handleClear"
						 clearable
					 ></u--input>
					 <!-- <u-search v-if="searchShow" placeholder="请输入" v-model="keyword"></u-search> -->
				 </view>
				 <view slot="right">
					 <u-icon name="search" size="36" @click="searchIf"></u-icon>
				 </view>
			</u-navbar>
		</view>
		<view class="cantent">
			<view class="cantent_list">
				<u-empty
					mode="list"
					icon="../../static/images/custom-empty-image.png"
					v-if="cantList.length == 0"
				>
				</u-empty>
				<view class="cantent_lis" v-for="(item,index) in cantList" :key="index">
					<!-- {{ item["标题"] }} -->
					<u-cell icon="chat" :title='item.title'>
						<text slot="value">
							{{ item.time }}
						</text>
					</u-cell>
					<view class="cantent_lis_cant">
						{{ item.content }} 
					</view>
					<view class="cantent_lis_details" @click='getRout(item)' v-if="item.type <= 4">
						点击查看详情
						<u-icon name="rewind-right"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<tabbar :current="2"></tabbar>
	</view>
</template>

<script>
	import tabbar from './tabbarComponent.vue'
	import  *as API from '../../api/appApi.js'
	export default {
		components: {
			tabbar
		},
		data() {
			return {
				searchShow:false,
				debounceTimer: null,
				throttleTimer: null,
				keyword:'',
				cantList:[],
				pageNo:1,
				pageSize:10,
				
			}
		},
		onLoad() {
			this.getData()
		},
		// 下拉刷新
		onPullDownRefresh(){
			this.pageNo=1
			this.getData();
		},
		onReachBottom(){
			this.pageNo++
			this.getData();
		},
		methods: {
			
			searchIf(){
				if(this.searchShow){
					this.searchShow = false
				}else{
					this.searchShow = true
				}
			},
			getRout(item){
				console.log("item",item)
				// 
				uni.navigateTo({
					url: `../alarmmanagement/item?id=${item.contactId}&type=${item.type}`,
				})
				// if(item.type,item.id)
			},
			searchchange(val){
				console.log("change",val)
				this.qry = this.keyword
				console.log("this.qry",this.qry)
				this.pageNo =1;
				 clearTimeout(this.debounceTimer);
				  this.debounceTimer = setTimeout(() => {
					this.getData();
				  },1000); // 设置防抖的时间间隔，单位为毫秒
				 //  // 节流
				 //  if (!this.throttleTimer) {
					// this.throttleTimer = setTimeout(() => {
					//   this.getData();
					//   this.throttleTimer = null;
					// }, 500); // 设置节流的时间间隔，单位为毫秒
				 //  }
			},
			handleClear(){
				console.log("111")
				this.keyword = '';
			},
			async getData(){
				let parms = {
					qry:this.qry,
					pageNo:this.pageNo,
					pageSize:this.pageSize
				}
				let res = await API.inform(parms);
				console.log("res",res)
				if(res.data.code == 200){
					// this.cantList = res.data.result
					// console.log("this.cantList",this.cantList)
					if(this.pageNo == 1){
						this.cantList = res.data.result.records
					}else{
						 let resdata = res.data.result.records
						 if(resdata.length > 0){
							 resdata.forEach(item =>{
								 this.cantList.push(item)
							 })
						 }
						 
					}
					uni.stopPullDownRefresh();
				}
			}
		}


	}
</script>

<style lang="scss" scoped>
	.container_index {
		background-color: rgba(242, 242, 242, 1);
		// min-height: 90vh;
		.TabBar{
			margin-top: 145rpx;
		}
		.cantent{
			padding-bottom: 85rpx;
			.cantent_list{
				padding: 50rpx 3%;
				.cantent_lis{
					padding: 20rpx;
					margin-bottom: 25rpx;
					border-radius: 10rpx;
					background-color: #fff;
					.cantent_lis_cant{
						padding: 10rpx 0;
						font-size: 26rpx;
					}
					.cantent_lis_details{
						padding: 10rpx 0;
						border-top: 1px solid rgb(214, 215, 217);
						display: flex;
						justify-content: left;
					}
				}
			}
		}
	}
</style>
