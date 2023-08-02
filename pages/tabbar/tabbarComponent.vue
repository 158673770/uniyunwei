<template>
    <view class="TabBar">
        <view class="tab" v-for="(item,index) in TabBarList" :key="index" @tap="navigatorTo(item.url)">
            <!-- 判断是否有点击，如果没有就不是激活样式，点击就是激活的样式 -->
            <image class="imgsize" :src="current-1 == index ? item.selectIcon : item.icon" mode="widthFix"></image>
            <!-- 设置一个状态值（type），判断加号是否展示 -->
            <!-- <image class="addimgsize" v-if="item.type == 1" src="../../../static/tabbar/rel.png" mode="widthFix"></image> -->
            <view :class="current-1 == index ? 'texts': 'text'">{{item.name}}</view>
        </view>
    </view>
</template>

<script>
    export default {
        props: {
            current: {
                type: Number,
                default: 1 //默认第一个页面tabbar激活
            }
        },
        data() {
            return {	
                TabBarList: [{
                		// type: 0,
                		icon: '../../static/tabbar/home.png',
                		selectIcon: '../../static/tabbar/homeActive.png',
                		name: '首页',
                		url: './index'
                	},
                	{
                		// type: 0,
                		icon: '../../static/tabbar/message.png',
                		selectIcon: '../../static/tabbar/messageActive.png',
                		name: '通知',
                		url: './message'
                	},
                	{
                		// type: 0,
                		icon: '../../static/tabbar/user.png',
                		selectIcon: '../../static/tabbar/userActive.png',
                		name: '我的',
                		url: './my'
                	},
                ],
				// urlLis:uni.getStorageSync('urlLis')
            }
        },
        methods: {
            navigatorTo(e) {
				uni.redirectTo({
				    url: e,
				});
				// if(e != this.urlLis){
				// 	uni.setStorage({
				// 		key: 'urlLis',
				// 		data: e
				// 	})
					
				// }
            }
			
			
			
        }
    }
</script>

<style scoped>
.TabBar {
    position: fixed;
    bottom: 0;
    height: 100upx;
    background-color: #fff;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.tab {
	width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.imgsize {
    width: 50upx;
    height: 50upx;
}
.addimgsize {
    width: 110upx;
    height: 110upx;
    margin-top: -60upx;
}
.text {
    font-size: 12px;
	color: #C8C9CB;
	margin-top: 6rpx;
}
.texts{
	font-size: 12px;
	color: #2C8DF0;
	margin-top: 6rpx;
}
</style>