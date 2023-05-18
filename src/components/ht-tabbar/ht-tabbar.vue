<template>
	<view class="tui-tabbar" ref="boxRef"
		:class="{ 'tui-tabbar-fixed': isFixed, 'tui-unlined': unlined, 'tui-backdrop__filter': backdropFilter }"
		:style="{ background: backgroundColor, zIndex: isFixed ? zIndex : 'auto' }">
		<block v-for="(item, index) in tabBar" :key="index">
			<view class="tui-tabbar-item" :class="{ 'tui-item-hump': item.hump }"
				:style="{ backgroundColor: item.hump && !backdropFilter ? backgroundColor : 'none' }"
				@tap="tabbarSwitch(index, item.hump, item.pagePath, item.verify, item)">
				<view class="tui-icon-box"
					:class="{ 'tui-tabbar-hump': item.hump, 'tui-tabbar-nohump': !item.hump, 'selected': item.selected && (index !== current || index == 2)}">
					<image :src="current == index ? item.selectedIconPath : item.iconPath"
						:class="[item.hump ? '' : 'tui-tabbar-icon']" v-if="!item.name"></image>
					<tui-icon :name="current === index ? item.activeName : item.name" :customPrefix="item.customPrefix || ''"
						:size="item.iconSize || iconSize" unit="rpx" :color="current == index ? selectedColor : color"
						v-else></tui-icon>
					<view :class="[item.isDot ? 'tui-badge-dot' : 'tui-badge']"
						:style="{ color: badgeColor, backgroundColor: badgeBgColor }" v-if="item.num">
						{{ item.isDot ? '' : item.num }}
					</view>
				</view>
				<view class="tui-text-scale" :class="{ 'tui-text-hump': item.hump }"
					:style="{ color: current == index ? selectedColor : color }">{{ item.text }}</view>
			</view>
		</block>
		<view :style="{ background: backgroundColor }" :class="{ 'tui-hump-box': hump }"
			v-if="hump && !unlined && !backdropFilter"></view>
	</view>
</template>

<script>
import { ref, onMounted, reactive } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
export default {
	name: 'htTabbar',
	setup (props, ctx) {
		const tabBar = reactive([
			{
				pagePath: '/pages/index/index',
				text: '首页',
				name: 'home',
				activeName: 'home-fill'
			},
			{
				pagePath: '/pages/activities/index',
				text: '活动',
				name: 'community',
				activeName: 'community-fill'
			},
			{
				pagePath: '',
				// text: 'scan',
				hump: true,
				iconPath: '/static/images/tabbar/release.png',
				selectedIconPath: '/static/images/tabbar/release.png'
			},
			{
				pagePath: '/pages/podcast/index',
				text: '播客',
				name: 'news',
				activeName: 'news-fill',
				customPrefix: 'ht-icon'
			},
			{
				pagePath: '/pages/mine/index',
				text: '我的',
				name: 'people',
				activeName: 'people-fill',
				// iconPath: '/static/images/tabbar/thor_gray.png',
				// selectedIconPath: '/static/images/tabbar/thor_active.png',
				// num: 2,
				// isDot: true,
				// verify: true
			}
		])
		onLoad(() => {
			console.log('htTabbar onLoad', tabBar[props.current])
		})
		onShow(() => {
			console.log('htTabbar onShow', tabBar[props.current])
		})
		const tabbarSwitch = (index, hump, pagePath, verify, item) => {
			ctx.emit("click", {
				index: index,
				hump: hump,
				pagePath: pagePath,
				verify: verify
			})
			item.selected = true
			setTimeout(() => {
				item.selected = false
			}, 600)
			// 中间加号不跳转 和 当前页点击不跳转
			if (index !== 2) {
				setTimeout(() => {
					uni.switchTab({
						url: pagePath
					})
				}, 300)
			}
		}
		return {
			tabbarSwitch,
			tabBar
		}
	},
	props: {
		//当前索引
		current: {
			type: Number,
			default: 0
		},
		//字体颜色
		color: {
			type: String,
			default: '#666'
		},
		//字体选中颜色
		selectedColor: {
			type: String,
			default: '#5677FC'
		},
		//背景颜色
		backgroundColor: {
			type: String,
			default: '#FFFFFF'
		},
		//是否需要中间凸起按钮
		hump: {
			type: Boolean,
			default: false
		},
		iconSize: {
			type: [Number, String],
			default: 52
		},
		//固定在底部
		isFixed: {
			type: Boolean,
			default: true
		},
		// tabBar: {
		// 	type: Array,
		// 	default () {
		// 		return [
		// 			{
		// 				pagePath: '/pages/index/index',
		// 				text: '首页',
		// 				name: 'home',
		// 				activeName: 'home-fill'
		// 			},
		// 			{
		// 				pagePath: '/pages/activities/index',
		// 				text: '活动',
		// 				name: 'community',
		// 				activeName: 'community-fill'
		// 			},
		// 			{
		// 				pagePath: '',
		// 				// text: 'extend',
		// 				hump: true,
		// 				iconPath: '/static/images/tabbar/release.png',
		// 				selectedIconPath: '/static/images/tabbar/release.png'
		// 			},
		// 			{
		// 				pagePath: '/pages/podcast/index',
		// 				text: '播客',
		// 				name: 'news',
		// 				activeName: 'news-fill',
		// 				customPrefix: 'ht-icon'
		// 			},
		// 			{
		// 				pagePath: '/pages/mine/index',
		// 				text: '我的',
		// 				name: 'people',
		// 				activeName: 'people-fill',
		// 				// iconPath: '/static/images/tabbar/thor_gray.png',
		// 				// selectedIconPath: '/static/images/tabbar/thor_active.png',
		// 				// num: 2,
		// 				// isDot: true,
		// 				// verify: true
		// 			}
		// 		]
		// 	}
		// },
		//角标字体颜色
		badgeColor: {
			type: String,
			default: '#fff'
		},
		//角标背景颜色
		badgeBgColor: {
			type: String,
			default: '#F74D54'
		},
		unlined: {
			type: Boolean,
			default: false
		},
		//是否开启高斯模糊效果[仅在支持的浏览器有效果]
		backdropFilter: {
			type: Boolean,
			default: false
		},
		//z-index
		zIndex: {
			type: [Number, String],
			default: 9999
		}
	}
};
</script>

<style scoped>
.tui-tabbar {
	width: 100%;
	height: 100rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	position: relative;
}

.tui-backdrop__filter {
	/* Safari for macOS & iOS */
	-webkit-backdrop-filter: blur(15px);
	/* Google Chrome */
	backdrop-filter: blur(15px);
}

.tui-tabbar-fixed {
	position: fixed;
	left: 0;
	bottom: 0;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
	box-sizing: content-box !important;
}

.tui-tabbar::before {
	content: ' ';
	width: 100%;
	border-top: 1px solid #b2b2b2;
	position: absolute;
	top: -1rpx;
	left: 0;
	transform: scaleY(0.5) translateZ(0);
	transform-origin: 0 0;
	display: block;
	z-index: 3;
}

.tui-tabbar-item {
	height: 100%;
	flex: 1;
	display: flex;
	text-align: center;
	align-items: center;
	flex-direction: column;
	justify-content: space-between;
	position: relative;
	padding: 10rpx 0;
	box-sizing: border-box;
	z-index: 5;
}

.tui-icon-box {
	position: relative;
}

.tui-item-hump {
	height: 98rpx;
}

.tui-tabbar-icon {
	width: 52rpx;
	height: 52rpx;
	display: block;
}

.tui-hump-box {
	width: 120rpx;
	height: 120rpx;
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	top: -50rpx;
	border-radius: 50%;
	z-index: 4;
}

.tui-hump-box::after {
	content: ' ';
	height: 200%;
	width: 200%;
	border: 1px solid #b2b2b2;
	position: absolute;
	top: 0;
	left: 0;
	transform: scale(0.5) translateZ(0);
	transform-origin: 0 0;
	border-radius: 120rpx;
	box-sizing: border-box;
	display: block;
}

.tui-unlined::after {
	height: 0 !important;
}

.tui-tabbar-nohump.selected {
	animation: 0.3s linear hvr-pop;
}

/* .tui-tabbar-nohump:active {
	animation: none;
} */

@keyframes hvr-pop {
	50% {
		transform: scale(1.2);
	}
}

.tui-tabbar-hump {
	width: 100rpx;
	height: 100rpx;
	position: absolute;
	left: 50%;
	-webkit-transform: translateX(-50%) rotate(0deg);
	transform: translateX(-50%) rotate(0deg);
	top: -40rpx;
	-webkit-transition: all 0.2s linear;
	transition: all 0.2s linear;
	border-radius: 50%;
	z-index: 5;
}

.tui-tabbar-hump.selected {
	animation: 0.6s ease-out rotate-center;
}

/* .tui-tabbar-hump:active {
	animation: none;
} */

.tui-tabbar-hump image {
	width: 100rpx;
	height: 100rpx;
	display: block;
}

@keyframes rotate-center {
	0% {
		-webkit-transform: translateX(-50%) rotate(0);
		transform: translateX(-50%) rotate(0);
	}

	100% {
		-webkit-transform: translateX(-50%) rotate(360deg);
		transform: translateX(-50%) rotate(360deg);
	}
}

.tui-hump-active {
	-webkit-transform: translateX(-50%) rotate(135deg);
	transform: translateX(-50%) rotate(135deg);
}

.tui-text-scale {
	font-weight: bold;
	transform: scale(0.8);
	font-size: 25rpx;
	line-height: 28rpx;
	transform-origin: center 100%;
}

.tui-text-hump {
	position: absolute;
	left: 50%;
	bottom: 10rpx;
	transform: scale(0.8) translateX(-50%);
	transform-origin: 0 100%;
}

.tui-badge {
	position: absolute;
	font-size: 24rpx;
	height: 32rpx;
	min-width: 20rpx;
	padding: 0 6rpx;
	border-radius: 40rpx;
	right: 0;
	top: -5rpx;
	transform: translateX(70%);
	display: flex;
	align-items: center;
	justify-content: center;
}

.tui-badge-dot {
	position: absolute;
	height: 16rpx;
	width: 16rpx;
	border-radius: 50%;
	right: -4rpx;
	top: -4rpx;
}
</style>
