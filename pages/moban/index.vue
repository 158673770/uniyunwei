<template>
	<view class="container_index">
		<view class="TabBar">
			<u-navbar>
				<view slot="left">
					<u-icon name="arrow-left" @click="gotu"></u-icon>
				</view>
				<view slot="center">
					<view v-if="!searchShow" style="text-align: center;font-size: 36rpx;">
						管理站点
					</view>
					<u--input placeholder="请输入内容" v-model="keyword" clearable v-if="searchShow" shape="circle"
						@change="searchchange" @blur="searchShow = false"></u--input>
					<!-- <u-search v-if="searchShow" placeholder="请输入" v-model="keyword"></u-search> -->
				</view>
				<view slot="right">
					<u-icon name="search" size="36" @click="searchIf"></u-icon>
				</view>
			</u-navbar>
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
			}
		},
		onLoad() {
		},
		// 下拉刷新
		onPullDownRefresh(){
			
		},
		// 上拉加载
		onReachBottom(){
			console.log("上拉加载")
			
		},
		mounted() {
		},
		methods: {
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
		
	}
</style>