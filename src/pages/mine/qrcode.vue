<template>
	<view class="container">
		<view class="header">
			<view>您共有 </view>
			<view class="coupon-num">{{ couponNum }}</view>
			<view>张可使用的兑换券</view>
		</view>

		<view class="coupon-list">
			<view class="coupon-item" v-for="(item, index) in couponList" :key="index">
				<view v-if="item.isExchange" class="exchanged">已兑换</view>
				<view class="coupon">
					<image v-if="item.isExchange" src="/static/images/mine/img_fuwuquan_gray_3x.png" class="coupon-img"></image>
					<image v-else src="/static/images/mine/img_fuwuquan_blue_3x.png" class="coupon-img"></image>
					<view class="left-tit-box">
						<view class="tit">{{ item.name }}</view>
						<view class="term">期限：{{ item.invalidTime }}</view>
					</view>
					<view class="right-detail" @tap="spread(index, item.isExchange)">
						<text class="detail-txt">查看详情</text>
						<image src="/static/images/mine/icon_next_3x" class="arrow" :class="{ 'tui-rotate_90': item.spread }"></image>
					</view>
				</view>
				<view class="hidden-box" v-show="item.spread">
					<view class="code-tit">验证码</view>
					<view class="code-num" :class="{ 'isExchange': item.isExchange }">{{ item.code }}</view>
					<view v-if="item.isExchange" class="exchange-text">已兑换</view>
					<view class="qrcode-box">
						<view class="qrcode">
							<canvas :class="{ 'my-canvas': !item.spread }" :style="{ width: qrcode_w + 'px', height: qrcode_w + 'px' }"
								:canvas-id="'couponQrcode' + index" :id="'couponQrcode' + index"></canvas>
						</view>
					</view>
					<view class="list-item">
						<view class="item-tit">券有效期</view>
						<view v-if="item.validityType == 1" class="item-con">长期有效</view>
						<view v-if="item.validityType == 2" class="item-con">{{ item.invalidTime }} 前</view>
						<view v-if="item.validityType == 3" class="item-con">{{ item.sendTime }} 至 <br> {{ item.invalidTime }}</view>
					</view>
					<view class="list-item">
						<view class="item-tit">适用商家</view>
						<view class="item-con">{{ item.suitStore }}</view>
					</view>

					<view class="explain">使用说明</view>
					<view class="explain-text" v-for="(items, index) in item.useDescribe" :key="items">{{ items }}</view>
				</view>
			</view>
		</view>
		<view class="none" v-show="couponNum == 0">暂无可用兑换券~</view>
	</view>
</template>
<script lang="ts">
import share from '@/public/share'
export default {
  mixins: [share]
}
</script>
<script setup lang="ts">
import dayjs from 'dayjs'
import qrCode from '@/public/weapp-qrcode.js';
import { RequestApi } from '@/public/request'
import { ref, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
const couponNum = ref(0)
let couponList = ref<any>([])
const qrcode_w = uni.upx2px(240)
onLoad(() => {
	RequestApi.getExchangeRecord().then((res: any) => {
		console.log('getExchangeRecord', res);
		const { code, result } = res;
		if (code === 0) {
			couponList.value = result.items.map(item => {
				const validityType = item.goodsInfo.validityType;
				let invalidTime = ''
				let sendTime = ''
				if (validityType == 1) {
					invalidTime = '长期有效'
				} else if (validityType == 2) {
					invalidTime = dayjs(new Date(item.createdAt).getTime() + item.goodsInfo.validityTime * 24 * 60 * 60 * 1000).format('YYYY-MM-DD HH:mm:ss');
					sendTime = dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss');
				} else if (validityType == 3) {
					sendTime = dayjs(item.goodsInfo.validityTimeArr[0]).format('YYYY-MM-DD HH:mm:ss');
					invalidTime = dayjs(item.goodsInfo.validityTimeArr[1]).format('YYYY-MM-DD HH:mm:ss');
				}
				if (!item.isExchange) {
					couponNum.value++;
				}
				return {
					name: item.goodsInfo.name,
					code: item.exchangeCode,
					invalidTime,
					validityType,
					spread: false, // true 展开 false 收起
					sendTime,
					suitStore: item.goodsInfo.business,
					useDescribe: ['1、只可在指定商家内使用', '2、解释权归寰碳科技所有'],
					isExchange: item.isExchange
				};
			});
		}
	})
})
function spread(index, status) {
	let list: any = couponList.value;
	couponList.value.forEach((item, i) => {
		if (i != index) {
			item.spread = false;
		}
	});
	if (!list[index].spread) {
		couponQrCode(list[index].code, 'couponQrcode' + index, status);
	}
	list[index].spread = !list[index].spread;
	couponList.value = list;
}
// 二维码生成工具
function couponQrCode(text, canvasId, status) {
	new qrCode(canvasId, {
		text: text,
		width: qrcode_w,
		height: qrcode_w,
		colorDark: status ? '#d4cccc' : '#333333',
		colorLight: '#FFFFFF',
		correctLevel: qrCode.CorrectLevel.H
	});
}
</script>

<style>
page {
	background: #f5f7fd;
}
</style>
<style lang="scss" scoped>
/* #ifdef MP-ALIPAY */
.my-canvas {
	position: fixed;
	left: -200px;
	top: 0;
}

/* #endif */

.container {
	padding-bottom: env(safe-area-inset-bottom);
}

.header {
	width: 100%;
	padding: 0 30rpx;
	box-sizing: border-box;
	font-size: 24rpx;
	color: #999;
	height: 54rpx;
	line-height: 54rpx;
	background: #fff;
	display: flex;
	align-items: center;
	position: fixed;
	top: 0;
	z-index: 9999;
	background-color: #d1e9fc;
}

.coupon-num {
	color: #5677fc;
	font-size: 15px;
	font-weight: 800;
	margin: 0 3px;
}

.coupon-list {
	width: 100%;
	padding: 54rpx 50rpx;
	box-sizing: border-box;
}

.coupon-item {
	margin-top: 20rpx;
	width: 100%;
	box-shadow: 0 8rpx 10rpx -8rpx #eaeef1;
	border-radius: 2rpx;
	position: relative;
	.exchanged {
		position: absolute;
		left: 8px;
		top: 5px;
		font-size: 13px;
		color: #f49f28;
		z-index: 10000;
	}
}

.coupon {
	height: 160rpx;
	position: relative;
	display: flex;
	align-items: center;
}

.coupon-img {
	width: 100%;
	height: 160rpx;
	position: absolute;
	left: 0;
	top: 0;
	z-index: 0;
}

.left-tit-box {
	width: 414rpx;
	padding-left: 75rpx;
	box-sizing: border-box;
	z-index: 10;
}

.tit {
	width: 290rpx;
	font-size: 30rpx;
	color: #333;
	line-height: 42rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}

.term {
	width: 228rpx;
	font-size: 24rpx;
	color: #999;
	line-height: 24rpx;
	padding-top: 7rpx;
	white-space: nowrap;
}

.right-detail {
	width: 236rpx;
	text-align: center;
	height: 160rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 10;
}

.detail-txt {
	font-size: 24rpx;
	color: #fff;
	padding-right: 12rpx;
}



.arrow {
	width: 16rpx;
	height: 24rpx;
	transition: all 0.15s ease;
}

.spread {
	width: 24rpx;
	height: 16rpx;
}

.qrcode {
	width: 260rpx;
	height: 260rpx;
	margin: 45rpx auto 43rpx auto;
}

.hidden-box {
	padding: 35rpx 40rpx 27rpx 40rpx;
	box-sizing: border-box;
	color: #333;
	border-top: 1rpx solid #eaeef1;
	background: #fff;

	.code-tit {
		font-size: 28rpx;
		line-height: 28rpx;
	}

	.code-num {
		display: inline-block;
		font-size: 30rpx;
		line-height: 30rpx;
		padding-top: 23rpx;
		font-weight: bold;
		width: 120px;
	}
	.exchange-text {
		display: inline-block;
		font-size: 16px;
		font-weight: 800;
		width: 50px;
	}

	.isExchange {
		color: rgb(173, 169, 169);
		text-decoration: line-through;
	}
	.qrcode-box {
		width: 100%;
		border-bottom: 1rpx dashed #eaeef1;
		margin-bottom: 6rpx;
	}

	.list-item {
		height: 90rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
	}

	.list-item::after {
		left: 0;
	}

	.item-tit {
		color: #666;
		width: 70px;
	}

	.item-con {
		flex: 1;
		color: #333;
	}

	.explain {
		font-size: 28rpx;
		line-height: 28rpx;
		color: #666;
		padding: 33rpx 0 25rpx 0;
	}

	.explain-text {
		font-size: 28rpx;
		line-height: 41rpx;
		color: #333;
	}
}


.none {
	width: 100%;
	position: fixed;
	text-align: center;
	font-size: 30rpx;
	color: #ccc;
	top: 49%;
}

.tui-rotate_90 {
	transform: rotate(90deg);
}
</style>
