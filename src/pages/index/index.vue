<template>
  <view class="ht-body">
    <pyh-nv :config="data.config">
      <template>
        <view class="u-nav-slot">
          <view class="u-nav-slot_left">
            <u-image :src="data.logoSrc" :width="30" :height="35"></u-image>
          </view>
          <view class="u-nav-slot_title">{{ data.config.title }}</view>
          <view class="u-nav-slot_right"></view>
        </view>
      </template>
    </pyh-nv>
    <view v-if="bannerImg.length > 0 && getAllData" class="arcbackground"
      :style="{ padding: bannerImg.length >= 3 ? '0px' : '0px 10px' }">
      <u-swiper :list="bannerImg" :previousMargin="bannerImg.length >= 3 ? 30 : 0"
        :nextMargin="bannerImg.length >= 3 ? 30 : 0" circular :autoplay="false" radius="5" bgColor="#fff0"
        @change="change" @click="handleBanner"></u-swiper>
    </view>
    <view v-else class="skeleton1">
      <u-skeleton :title="false" rows="1" rowsHeight="130" :rowsWidth="['100%']" loading></u-skeleton>
    </view>
    <iconbar v-if="getAllData" />
    <view v-else class="skeleton2">
      <u-skeleton :title="false" rows="1" rowsHeight="76" :rowsWidth="['100%']" loading></u-skeleton>
    </view>
    <restaurant v-if="getAllData" />
    <view v-else class="skeleton2">
      <u-skeleton :title="false" rows="1" rowsHeight="18" :rowsWidth="['15%']" loading></u-skeleton>
      <view style="height: 3px"></view>
      <u-skeleton :title="false" rows="1" rowsHeight="96" :rowsWidth="['100%']" loading></u-skeleton>
    </view>
    <activity v-if="getAllData"/>
    <view v-else class="skeleton2">
      <u-skeleton :title="false" rows="1" rowsHeight="18" :rowsWidth="['15%']" loading></u-skeleton>
      <view style="height: 3px"></view>
      <u-skeleton :title="false" rows="1" rowsHeight="100" :rowsWidth="['100%']" loading></u-skeleton>
    </view>
    <ht-tabbar :current="data.current" color="#777" selectedColor="#3c9cff" @click="tabbarSwitch"></ht-tabbar>
  </view>
</template>
<script lang="ts">
import share from '@/public/share'
export default {
  mixins: [share]
}
</script>
<script setup lang="ts">
import { ref, reactive, toRefs, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { RequestApi } from '@/public/request'
import restaurant from './components/restaurant.vue'
import iconbar from './components/iconbar.vue'
import activity from './components/activity.vue'
import { homeStore } from '@/store/modules/home'
import { storeToRefs } from 'pinia'
import { dictStore } from '@/store/modules/dict'
const dict = dictStore()
const store = homeStore()
const { banner } = storeToRefs(store)
const data = reactive<any>({
  config: {
    title: "元气碳",
    type: 'slot',
    bgColor: 'linear-gradient(160deg, rgb(232, 241, 227) 30%, rgb(228, 243, 251) 50%)',
    back: {
      hide: true
    }
  },
  current: 0,
  backgroundColor: 'rgba(248,248,248,.7)',
  logoSrc: 'https://dtcx-1318775010.cos.ap-beijing.myqcloud.com/icons/logo_small.png',
  // 是否已请求了所有数据，防止onReachBottom多次触发
  skeletonShow: true
})
const getAllData = ref(false)

onMounted(() => {
  loadMore()
  getDict()
  // 隐藏官方的tabBar
  uni.hideTabBar()
})
onShow(() => {
  if (getAllData.value) {
    getFrontPage()
  }
})
const bannerImg = computed(() => {
  return banner.value.map((item: any) => {
    return item.bannerUrl[0].url
  })
})
// 加载数据
function loadMore() {
  if (getAllData.value) return
  getFrontPage().then(res => {
    getAllData.value = true
    data.skeletonShow = false
  })
}
// 获取首页数据
function getFrontPage() {
  return new Promise((resolve, reject) => {
    RequestApi.FrontPage().then(res => {
      console.log('获取首页数据', res)
      const { code, data } = res as any
      if (code == 0) {
        store.setBanner(data.Banner)
        store.setActivity(data.Activity)
        store.setRestaurant(data.Restaurant)
      }
      resolve(res)
    })
  })
}
const change = () => {
  // console.log('change')
}
const handleBanner = (i) => {
  const banners = banner.value as any
  console.log('handleBanner', banners[i])
  if (banners[i].linkType == 1) {
    uni.navigateTo({ url: `/pages/plugin/details-img?id=${banners[i]._id}` });
  } else {
    let url = banners[i].linkUrl
    uni.navigateTo({ url: `/pages/plugin/details?url=${url}` });
  }
}
const getDict = () => {
  RequestApi.getDict().then((res: any) => {
    const { code, data } = res
    console.log('getDict', res)
    if (code == 0 && data.length > 0) {
      data.forEach((item: any) => {
        if (item.dictCode == 'restaurant-type') {
          dict.setRestaurantType(item.dictContent)
        } else if (item.dictCode == 'goods-type') {
          dict.setGoodsType(item.dictContent)
        } else if (item.dictCode == 'questionnaire') {
          let arr = item.dictContent.filter((item: any) => item.isEnable)
          if (arr.length > 0) {
            dict.setQuestionnaire(arr[0])
          }
        } else if (item.dictCode == 'sign-in') {
          dict.setSignIn(item.dictContent)
        } else if (item.dictCode == 'task-reward') {
          dict.setTaskReward(item.dictContent)
        } else if (item.dictCode == 'news') {
          dict.setNews(item.dictContent)
        } else if (item.dictCode == 'share-img') {
          dict.setShareImg(item.dictContent)
        } else if (item.dictCode == 'podcast-type') {
          dict.setPodcastType(item.dictContent)
        } else if (item.dictCode == 'distance-to-coin') {
          dict.setDistanceToCoin(item.dictContent)
        }
      })
      uni.setStorageSync('dict', data)
    }
  })
}
const tabbarSwitch = (e: any) => {
  console.log('tabbarSwitch', e)
}
</script>

<style lang="scss">
.ht-body {
  width: 100%;
  overflow-x: hidden;
}

.u-nav-slot {
  @include flex(row);
  align-items: center;
  height: 44px;
  position: relative;
  justify-content: center;

  &_left {
    width: 100px;
    .u-image {
      margin-left: 15px;
    }
  }

  &_title {
    flex: 1;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
  }

  &_right {
    min-width: 100px
  }
}

.arcbackground {
  position: relative;
  height: 130px;

  &::after {
    width: 120%;
    height: 130px;
    position: absolute;
    left: -10%;
    top: -20%;
    z-index: -1;
    content: '';
    border-radius: 0 0 50% 50%;
    background: #e4f3fb;
  }
}
.skeleton1 {
  padding: 5px 10px;
}
.skeleton2 {
  padding: 5px 10px 0;
}
</style>
