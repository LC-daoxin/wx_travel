<template>
  <u-sticky bgColor="#fff">
    <u-tabs lineWidth="30" :activeStyle="{
      color: '#303133',
      fontWeight: 'bold',
      transform: 'scale(1.05)'
    }" :list="tabList" @change="changeTabs"></u-tabs>
  </u-sticky>
  <view v-if="data.typeList && data.typeList.length > 0" class="waterfall">
    <tui-waterfall :listData="data.typeList">
      <template v-slot:left="{ list }">
        <view v-for="(entity, index) in list" :key="index" class="tui-product__item" @tap="handleToDetail(entity, index)">
          <tui-lazyload-img width="100%" height="370rpx" :src="entity.imgUrl && entity.imgUrl[0].url"
            :mode="entity.bgsize">
          </tui-lazyload-img>
          <view class="tui-product__content">
            <view class="tui-product__title">{{ entity.name || '' }}</view>
            <view>
              <view class="tui-product__price">
                <view class="price">
                  <text class="tui-sale__price">{{ entity.carbonPrice || '0.00' }} 元气币</text>
                  <text class="tui-factory__price">￥{{ entity.price || '0.00' }}</text>
                </view>
                <tui-form-button class="pay-btn" height="40rpx" width="100rpx" borderColor="#8dda65" :size="24" @click="handleToDetail(entity, index)"
                  background="#8dda65" radius="3px">兑换</tui-form-button>
              </view>

            </view>
          </view>
        </view>
      </template>
      <template v-slot:right="{ list }">
        <view v-for="(entity, index) in list" :key="index" class="tui-product__item" @tap="handleToDetail(entity, index)">
          <tui-lazyload-img width="100%" height="370rpx" :src="entity.imgUrl && entity.imgUrl[0].url"
            :mode="entity.bgsize"></tui-lazyload-img>
          <view class="tui-product__content">
            <view class="tui-product__title">{{ entity.name || '' }}</view>
            <view>
              <view class="tui-product__price">
                <view class="price">
                  <text class="tui-sale__price">{{ entity.carbonPrice || '0.00' }} 元气币</text>
                  <text class="tui-factory__price">￥{{ entity.price || '0.00' }}</text>
                </view>
                <tui-form-button class="pay-btn" height="40rpx" width="100rpx" borderColor="#8dda65" :size="24" @click="handleToDetail(entity, index)"
                  background="#8dda65" radius="3px">兑换</tui-form-button>
              </view>
            </view>
          </view>
        </view>
      </template>

    </tui-waterfall>
  </view>
  <view v-else class="empty">
    <u-empty mode="data" icon="http://cdn.uviewui.com/uview/empty/list.png" text="暂无该类型商品, 尽情期待"></u-empty>
  </view>
</template>
<script lang="ts">
import share from '@/public/share'
export default {
  mixins: [share]
}
</script>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { RequestApi } from '@/public/request'
import { onLoad } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { dictStore } from '@/store/modules/dict'
const store = dictStore()
const { goodsType } = storeToRefs(store)
const tabList = ref<any[]>([])
tabList.value = goodsType.value.map((item: any) => {
  return {
    name: item.itemValue,
    key: item.itemKey
  }
}) || []
const data = reactive<any>({
  tabKey: 1,
  listData: [],
  typeListData: [] // 分类后列表
})
onLoad(() => {
  RequestApi.getGoodsList().then((res: any) => {
    const { code, result } = res
    if (code == 0) {
      data.listData = result.items
      data.typeList = result.items.filter((item: any) => item.shopCategory == data.tabKey)
    }
  })
})
function changeTabs(item) {
  console.log(item)
  data.tabKey = item.key
  data.typeList = data.listData.filter((item: any) => item.shopCategory == data.tabKey)
}
function handleToDetail(entity, index) {
  uni.navigateTo({
    url: `/pages/shop/detail?id=${entity._id}`
  })
}
</script>

<style lang="scss" scoped>
.container {
  padding-bottom: 40rpx;
}

.waterfall {
  padding: 0 10px;
  box-sizing: border-box;
}

.tui-product__item {
  width: 100%;
  background-color: #f4fdf5;
  margin-bottom: 10rpx;
  box-sizing: border-box;
  border-radius: 16rpx;
  overflow: hidden;
}

.tui-product__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 20rpx;
}

.tui-product__title {
  color: #2e2e2e;
  font-weight: 500;
  font-size: 28rpx;
  height: 64rpx;
  line-height: 32rpx;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.tui-product__price {
  padding-top: 14rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .price {
    display: flex;
    align-items: center;
  }
}

.tui-sale__price {
  font-size: 26rpx;
  font-weight: 500;
  color: #f7b335;
}

.tui-factory__price {
  font-size: 20rpx;
  color: #a0a0a0;
  text-decoration: line-through;
  padding-left: 8rpx;
}

.pay-btn {
  display: inline-block;
}
</style>
