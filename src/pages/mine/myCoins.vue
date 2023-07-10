<template>
	<view class="container">
		<view class="header">
			<u-image class="icon" :showLoading="true" src="/static/images/icons/htb.png" width="24px" height="24px"></u-image>
			<view class="carbonCoin">
				<view class="text">元气币余额</view>
				<view class="num">{{ user.carbonCoin }}</view>
			</view>
			<view class="carbonCoin total">
				<view class="text">累积元气币</view>
				<view class="num">{{ total }}</view>
			</view>
		</view>
		<view class="block"></view>
		<view class="history-list">
			<view class="list-item" v-for="(item, index) in coinsList" :key="index">
				<view class="row">
					<view class="remark">
						<view class="text">{{item.remark}}</view>
						<view class="detail" v-if="item.way == 4">
							<tui-tag padding="8rpx 10rpx" size="24rpx" type="green" plain shape="circle">{{ item.extra.travelType == 'bicycling' ? '骑行' : '步行' }}</tui-tag>
							<view class="distance">{{ (item.extra.distance/ 1000).toFixed(2) }}公里</view>
						</view>
						<view class="detail" v-if="item.way == 1">
							<view class="goods">{{ item.extra.goodsName }}公里</view>
						</view>
						<view class="detail" v-if="item.way == 2">
							<view class="signin">第{{ item.extra.count }}天</view>
						</view>
					</view>
					<view class="coin">
						<view class="num" :class="{ 'reduce': item.type == 2 }">{{item.coinsNum}}</view>
						<u-image class="icon" :showLoading="true" src="/static/images/icons/htb.png" width="18px" height="18px"></u-image>
					</view>
				</view>
				<view class="row">
					<view class="time">{{ dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss') }}</view>
					<view class="tag">
						<tui-tag padding="8rpx 22rpx" size="26rpx" :type="item.type == 1 ? 'light-green' : 'light-orange'" shape="circle">{{ item.type == 1 ? '增加' : '减少' }}</tui-tag>
					</view>
				</view>
			</view>
		</view>
		<view class="none" v-show="coinsNum == 0">暂无元气币获取记录~</view>
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
import { RequestApi } from '@/public/request'
import { ref, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { userInfoStore } from '@/store/modules/user'
import { storeToRefs } from 'pinia'
const store = userInfoStore()
const { user } = storeToRefs(store)
const coinsNum = ref(0)
const total = ref(0)
let coinsList = ref<any>([])
onLoad(() => {
	RequestApi.getCoinsRecord().then((res: any) => {
		console.log('getExchangeRecord', res);
		const { code, result } = res;
		if (code === 0) {
			coinsNum.value = result.total || 0;
			coinsList.value = result.items || [];
			total.value = 0
			if (result.items.length > 0) {
				result.items.forEach((item: any) => {
					if (item.type == 1) {
						total.value += item.coinsNum
					}
				})
			}
		}
	})
})
</script>

<style>
page {
  background: #f5f7fd;
	overflow: hidden;
}
</style>
<style lang="scss" scoped>
.container {
	overflow: hidden;
	padding-bottom: env(safe-area-inset-bottom);
}

.header {
	width: 100%;
	padding: 0 30rpx;
	box-sizing: border-box;
	font-size: 24rpx;
	color: #999;
	height: 50px;
	line-height: 50px;
	background: #fff;
	display: flex;
	align-items: center;
	position: fixed;
	top: 0;
	z-index: 999;
	border-bottom: 1px solid #eee;
	background-color: #e1efff;
	.carbonCoin {
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-left: 10px;
		width: 120px;
		.text {
			color: #7e7e7e;
			font-size: 12px;
			height: 12px;
			line-height: 12px;
			margin-bottom: 2px;
		}
		.num {
			height: 20px;
			line-height: 20px;
			font-size: 20px;
			font-weight: 600;
			color: #0ebe43;
		}
	}
}
.block {
	width: 100%;
	padding: 0 30rpx;
	height: 50px;
}
.coupon-num {
	color: #5677fc;
}

.history-list {
	width: 100%;
	padding: 10px 10px;
	box-sizing: border-box;
	height: calc(100vh - 100px);
	overflow-y: auto;
}

.list-item {
	margin-top: 20rpx;
	border-radius: 10px;
	height: 50px;
	padding: 10px;
	background: #fff;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.row {
		height: 25px;
		line-height: 25px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.remark {
			display: flex;
			.text {
				color: #666565;
				font-size: 15px;
				height: 25px;
				line-height: 25px;
			}
			.detail {
				display: flex;
				align-items: center;
				justify-content: center;
				color: #999;
				font-size: 13px;
				margin-left: 10px;
				.distance {
					margin-left: 10px;
				}
				.goods {
					margin-left: 10px;
					width: 180px;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.signin {
					margin-left: 10px;
				}
			}
		}
		.coin {
			display: flex;
			align-items: center;
			width: 60px;
			justify-content: space-between;
			.icon {
				width: 20px;
			}
			.num {
				width: 40px;
				text-align: right;
				font-size: 16px;
				font-weight: 500;
				color: #2ea316;
			}
			.reduce {
				color: #e68e36;
			}
		}
		.time {
			font-size: 13px;
			color: #999;
		}
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
</style>
