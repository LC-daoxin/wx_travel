<template>
  <view class="ht-restaurant">
    <view class="restaurant-title">低碳餐厅</view>
    <view v-if="restaurant[0]" class="restaurant-box" :style="{ '--width': windowWidth + 'px' }">
      <view class="r-item" @click="handleDetail(restaurant[0]['_id'])">
        <view class="r-item-img">
          <u-image :radius="10" :showLoading="true" :src="restaurant[0].coverUrl[0].url" width="100px" height="70px"></u-image>
        </view>
        <view class="r-item-content">
          <view class="name">{{ restaurant[0].name }}</view>
          <view class="desc">{{ restaurant[0].address }}</view>
          <view class="rate">
            <view class="star">
              <u-rate v-model="restaurant[0].score" :minCount="5" :size="12" activeColor="#f7b335" allowHalf readonly></u-rate>
            </view>
            <text class="number">{{ restaurant[0].score }}</text>
          </view>
        </view>
        <view class="r-item-more">
          <tui-icon name="arrowright" color="#8cac96"></tui-icon>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { homeStore } from '@/store/modules/home'
import { storeToRefs } from 'pinia'
const store = homeStore()
const { restaurant } = storeToRefs(store)
const windowWidth = uni.getSystemInfoSync().windowWidth
const handleDetail = (id) => {
  uni.navigateTo({
    url: '/pages/restaurant/details?id=' + id,
  })
}
</script>

<style lang="scss" scoped>
.ht-restaurant {
  margin: 10px;

  .restaurant-title {
    margin-left: 5px;
    margin-bottom: 3px;
    font-size: 13px;
    font-weight: 500;
    color: #9699a1;
    position: relative;
    padding-left: 8px;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      width: 4px;
      height: 100%;
      background: #f7b335;
    }
  }

  .restaurant-box {
    .r-item {
      background: rgb(243, 250, 247);
      border-radius: 10px;
      padding: 8px 10px 8px 18px;
      @include flex(row);
      justify-content: center;

      .r-item-img {
        width: 100px;
        margin-right: 8px;
      }

      .r-item-content {
        flex: 1;
        @include flex(column);
        justify-content: space-between;

        .name {
          max-width: calc(var(--width) - 180px);
          padding-left: 4px;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .desc {
          padding-left: 4px;
          color: rgb(196, 195, 195);
          line-height: 13px;
          font-size: 12px;
        }

        .rate {
          .star {
            display: inline-block;
            width: 80px;
          }

          .number {
            display: inline-block;
            font-size: 12px;
            color: rgb(138, 132, 132);
            margin-left: 10px;
          }
        }
      }

      .r-item-more {
        width: 32px;
        @include flex(column);
        justify-content: center;
      }
    }
  }
}
</style>
