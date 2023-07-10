<template>
  <view class="details">
    <scroll-view v-if="info" class="details-scroll" :scroll-top="data.scrollTop" ref="scrollViewRef"
      :enable-back-to-top="true" :style="{ 'height': `calc(100vh - ${data.safeBottom + 'px'})` }" scroll-y>
      <view class="cover">
        <u-swiper :list="imgList" circular :autoplay="false" radius="5" :height="300" indicator imgMode="aspectFill"
          indicatorStyle="right: 5px; bottom: 5px" bgColor="#e8f1e3" keyName="image"
          @change="e => data.currentNum = e.current">
          <template #indicator>
            <view class="indicator-num">
              <text class="indicator-num__text">{{ data.currentNum + 1 }} / {{ imgList.length }}</text>
            </view>
          </template>
        </u-swiper>
      </view>
      <view class="restaurant-info">
        <view class="title">{{ info.name }}</view>
        <view class="info">
          <view class="line">
            <view class="score">
              <u-rate v-model="info.score" :minCount="5" :size="12" activeColor="#f7b335" allowHalf readonly></u-rate>
              <view class="num">{{ info.score }}</view>
            </view>
            <!-- <view class="collect" @click="handleCollect">
              <tui-icon v-if="!isCollect" name="like" :size="22" color="#8e8c8b"></tui-icon>
              <tui-icon v-else name="like-fill" :size="22" color="#ff7900"></tui-icon>
            </view> -->
          </view>
          <view class="address">
            <u-image src="/static/images/activity/location.png" :width="19" :height="19"></u-image>
            <view class="text">{{ info.address }}</view>
          </view>
        </view>
        <view class="dishes">
          <swiper class="dishes-swiper" :indicator-dots="info.dish.length > 1 ? data.indicatorDots : false"
            :autoplay="data.autoplay" :interval="data.interval" :duration="data.duration">
            <swiper-item v-for="item in info.dish" :key="item.id">
              <view class="dish-item">
                <view class="r-item-img">
                  <u-image :radius="10" :showLoading="true" :src="item.dishUrl[0].url" width="100px"
                    height="70px"></u-image>
                </view>
                <view class="r-item-content">
                  <view class="name">{{ item.name }}</view>
                  <view class="desc">{{ item.description }}</view>
                  <view v-if="item.coinPrice" class="price">
                    <view class="price-num">{{ item.price }}元</view>
                    <view class="coin">元气币 {{ item.coinPrice }}</view>
                  </view>
                  <view v-else class="price noCoin">
                    <view class="price-num">{{ item.price }}元</view>
                  </view>
                </view>
              </view>
              <view v-if="item.isExchange" class="btn">
                <tui-form-button height="65rpx" width="200rpx" borderColor="#fff" bold
                  background="linear-gradient(110deg, rgb(50 199 54), rgb(132 251 136))" radius="30px"
                  @click="toShop(item)">前往兑换</tui-form-button>
              </view>
            </swiper-item>
          </swiper>
        </view>
      </view>
    </scroll-view>
  </view>
</template>
<script lang="ts">
import share from '@/public/share'
export default {
  mixins: [share]
}
</script>
<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { onShow, onLoad } from '@dcloudio/uni-app'
import { RequestApi } from '@/public/request'
const data = reactive<any>({
  scrollTop: 0,
  curScrollTop: 0,
  currentNum: 0,
  safeBottom: 0,
  background: ['color1', 'color2', 'color3'],
  indicatorDots: true,
  autoplay: false,
  interval: 2000,
  duration: 300
})
let restaurantId = ref('')
const info = ref<any>(null)
const isCollect = ref<Boolean>(false)
const imgList = ref<any>([])
onShow(() => {
  getWindowInfo()
})
const getWindowInfo = () => {
  let info = uni.getWindowInfo();
  data.safeBottom = info.screenHeight - info.safeArea.bottom + 1
}
onLoad((option: any) => {
  console.log('onLoad option', option)
  restaurantId.value = option.id
  RequestApi.getRestaurantDetail(restaurantId.value).then((res: any) => {
    console.log('getRestaurantDetail', res)
    info.value = res.data
    imgList.value = res.data.showUrl.map((item: any) => {
      return {
        image: item.url,
        title: item.name
      }
    })
  })
})
const handleCollect = () => {
  isCollect.value = !isCollect.value
  if (isCollect.value) {
    uni.showToast({
      title: '收藏成功',
      icon: 'none'
    })
  } else {
    uni.showToast({
      title: '取消收藏',
      icon: 'none'
    })
  }
}
const toShop = (item: any) => {
  console.log('toShop', item)
  uni.navigateTo({
    url: `/pages/shop/index?id=${item.id}`
  })
}
</script>
<style lang="scss">
page {
  background: rgb(245, 247, 253);
}
</style>
<style lang="scss" scoped>
.details {
  .details-scroll {
    overflow: scroll;
  }

  .cover {
    background: #fff;
    height: auto;
    margin: 10px;
    padding: 5px;
    border-radius: 10px;
  }

  .indicator-num {
    background: #00000082;
    color: #fff;
    font-size: 12px;
    padding: 3px 8px;
    border-radius: 8px;
  }

  .restaurant-info {
    margin: 10px;
    background: #fff;
    border-radius: 10px;
    padding: 10px 18px;
    display: flex;
    flex-direction: column;
    position: relative;

    .title {
      padding: 10px 15px;
      height: auto;
      line-height: 20px;
      font-size: 18px;
      font-weight: 600;
      // overflow: hidden;
      // white-space: nowrap;
      // text-overflow: ellipsis;

      &::before {
        content: '';
        position: absolute;
        left: 15px;
        width: 5px;
        height: 20px;
        background: #12dd66;
      }
    }

    .info {
      width: 100%;
      display: flex;
      flex-direction: column;

      .line {
        width: 100%;
        display: flex;
        justify-content: space-between;

        .score {
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          height: 24px;
          line-height: 24px;

          .text {
            font-size: 13px;
            margin: 0 5px;
          }

          .num {
            margin-left: 5px;
            font-size: 13px;
          }
        }

        .collect {
          width: 22px;
        }
      }


      .address {
        margin-top: 5px;
        display: flex;
        flex-direction: row;
        align-items: center;

        .text {
          margin-left: 5px;
          font-size: 13px;
        }
      }
    }

    .dishes {
      margin-top: 20px;

      .dish-item {
        background: rgb(243, 250, 247);
        border-radius: 10px;
        padding: 8px 10px 8px 18px;
        @include flex(row);
        justify-content: center;
        padding-bottom: 10px;

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

          .price {
            display: flex;
            align-items: center;

            .price-num {
              font-size: 14px;
              text-decoration: line-through
            }

            .coin {
              margin-left: 5px;
              font-weight: 800;
              color: #ff990a;
              font-size: 16px;
            }

            &.noCoin {
              .price-num {
                font-size: 16px;
                text-decoration: none;
              }
            }
          }
        }
      }

      .btn {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 5px;
      }
    }
  }
}</style>
