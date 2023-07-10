<template>
  <view v-if="goodsInfo" class="event">
    <scroll-view class="event-scroll" :scroll-top="data.scrollTop" ref="scrollViewRef" :enable-back-to-top="true"
      :style="{ 'height': `calc(100vh - 100rpx - ${data.safeBottom + 'px'})` }" scroll-y>
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
        <view class="title">{{ goodsInfo.name }}</view>
      </view>
      <view class="detail-content detail-box">
        <view class="title">
          <view class="icon">
            <u-image src="/static/images/activity/list.png" :width="16" :height="16"></u-image>
          </view>
          <view class="text">商品详情</view>
        </view>
        <view class="parse">
          <u-parse :content="marked(goodsInfo.content)"></u-parse>
        </view>
      </view>
      <view class="bottom"></view>
    </scroll-view>
    <view class="btn-box">
      <tui-form-button v-if="showExchangeBtn" height="65rpx" width="200rpx" borderColor="#fff" bold
        :disabled="!isExchange" background="linear-gradient(110deg, rgb(50 199 54), rgb(132 251 136))" radius="30px"
        @click="handleExchange">{{ btnText }}</tui-form-button>
      <tui-form-button v-else height="65rpx" width="400rpx" borderColor="#fff" size="28" background="#e85837"
        radius="30px" @click="toSignIn">元气币不足, 去获取<tui-icon name="arrowright" color="#fff"
          size="14"></tui-icon></tui-form-button>
    </view>
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
import { onShow, onLoad } from '@dcloudio/uni-app'
import marked from '@/components/uni/marked/index.js'
import { RequestApi } from '@/public/request'
import { userInfoStore } from '@/store/modules/user'
const userInfo = userInfoStore()
const data = reactive<any>({
  scrollTop: 0,
  curScrollTop: 0,
  safeBottom: 0,
  imageHeight: 0,
  currentNum: 0,
})
const goodsId = ref('')
const goodsInfo = ref<any>(null)
const imgList = ref<any>([])
const btnText = ref('兑换')
const showExchangeBtn = ref(true)
// 是否允许兑换
const isExchange = ref(true)
onShow(() => {
  getWindowInfo()
  data.imageHeight = 0
})
onLoad((option: any) => {
  goodsId.value = option.id
  getInfoDetail()
})
function getInfoDetail() {
  RequestApi.getGoodsDetail(goodsId.value).then((res: any) => {
    console.log('getGoodsDetail', res)
    imgList.value = res.data.imgUrl.map((item: any) => {
      return {
        image: item.url,
        title: item.name
      }
    })
    goodsInfo.value = res.data
    checkExchange()
  })
}
const getWindowInfo = () => {
  let info = uni.getWindowInfo();
  data.safeBottom = info.screenHeight - info.safeArea.bottom + 1
}
// 检查能否兑换
function checkExchange() {
  return new Promise((resolve, reject) => {
    if (goodsInfo.value.stock - goodsInfo.value.exchangeNum <= 0) { // 库存不足
      isExchange.value = false
      btnText.value = '已售罄'
      reject(false)
    }
    const userInfo = uni.getStorageSync('userInfo')
    if (userInfo.carbonCoin < goodsInfo.value.carbonPrice) { // 元气币不足
      isExchange.value = false
      showExchangeBtn.value = false
      reject(false)
    }
    resolve(true)
  })
}
// 去签到
function toSignIn() {
  uni.navigateTo({
    url: '/pages/index/signIn'
  })
}
function handleExchange() {
  uni.showModal({
    title: '提示',
    content: '是否兑换该商品?',
    showCancel: true,
    success: (res) => {
      if (res.confirm) {
        RequestApi.exchangeGoods({ goodsId: goodsId.value }).then((res: any) => {
          console.log('exchangeGoods', res)
          if (res.code == 0) {
            getInfoDetail()
            userInfo.updateUser() // 更新用户信息
            uni.showToast({
              title: '兑换成功',
              icon: 'none'
            })
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none'
            })
          }
        })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.event {
  background: rgb(245, 247, 253);
  height: 100%;

  .event-scroll {
    overflow: scroll;
  }

  .cover {
    background: #fff;
    height: auto;
    margin: 10px;
    padding: 5px;
    border-radius: 10px;
    position: relative;

    .indicator-num {
      background: #00000082;
      color: #fff;
      font-size: 12px;
      padding: 3px 8px;
      border-radius: 8px;
    }

    .title {
      padding: 10px 15px;
      height: 20px;
      line-height: 20px;
      font-size: 18px;
      font-weight: 600;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;

      &::before {
        content: '';
        position: absolute;
        left: 10px;
        width: 5px;
        height: 20px;
        background: #12dd66;
      }
    }
  }

  .detail-box {
    margin: 10px;
    background: #fff;
    border-radius: 10px;
    padding: 10px 18px;
    display: flex;

    .title {
      display: flex;
      align-items: center;
      height: 22px;
      line-height: 22px;

      .icon {
        margin-right: 5px;
        margin-bottom: 2px;
      }

      .text {
        font-size: 15px;
        font-size: 15px;
        font-weight: 500;
      }
    }
  }

  .detail-content {
    min-height: 70px;
    flex-direction: column;

    .parse {
      margin-top: 10px;
    }
  }

  .bottom {
    height: 20px;
  }

  .btn-box {
    background: #fff;
    border-top: 1px solid gainsboro;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100rpx;
  }
}
</style>
