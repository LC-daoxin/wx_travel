<template>
  <view class="ht-body">
    <pyh-nv :config="data.config">
      <template>
        <view class="u-nav-slot">
          <view class="u-nav-slot_left">
            <u-image :src="data.logoSrc" :width="80" :height="35"></u-image>
          </view>
          <view class="u-nav-slot_title">{{ data.config.title }}</view>
          <view class="u-nav-slot_right"></view>
        </view>
      </template>
    </pyh-nv>
    <!-- <u-navbar title="个人中心" :bgColor="data.bgColor" :placeholder="true">
      <template #left>
        <view class="u-nav-slot">
          <u-image :src="data.logoSrc" :width="80" :height="35"></u-image>
        </view>
      </template>
    </u-navbar> -->
    <view class="arcbackground">
      <u-swiper :list="data.swiperlist" previousMargin="30" nextMargin="30" circular :autoplay="true" radius="5"
        bgColor="#fff0" @change="change" @click="click"></u-swiper>
    </view>
    <view class="ht-entrance">
      <u-row justify="space-between" gutter="8">
        <u-col span="2">
          <view class="icon-layout">
            <view class="icon-img">
              <u-image :showLoading="true" :src="icon5" width="36px" height="36px" @click="click"></u-image>
            </view>
            <view class="icon-title">每日签到</view>
          </view>
        </u-col>
        <u-col span="2">
          <view class="icon-layout" @click="toPage('/pages/plugin/map')">
            <view class="icon-img">
              <u-image :showLoading="true" :src="icon1" width="36px" height="36px"></u-image>
            </view>
            <view class="icon-title">低碳出行</view>
          </view>
        </u-col>
        <u-col span="2">
          <view class="icon-layout">
            <view class="icon-img">
              <u-image :showLoading="true" :src="icon2" width="36px" height="36px" @click="click"></u-image>
            </view>
            <view class="icon-title">绿色校园</view>
          </view>
        </u-col>
        <u-col span="2">
          <view class="icon-layout" @click="openQuestionnaire">
            <u-image :showLoading="true" :src="icon3" width="36px" height="36px"></u-image>
            <view class="icon-title">低碳问卷</view>
          </view>
        </u-col>
        <u-col span="2">
          <view class="icon-layout">
            <u-image :showLoading="true" :src="icon4" width="36px" height="36px" @click="click"></u-image>
            <view class="icon-title">绿色餐厅</view>
          </view>
        </u-col>
      </u-row>
    </view>
    <restaurant />
    <ht-tabbar :current="data.current" hump color="#777" selectedColor="#3c9cff" @click="tabbarSwitch"></ht-tabbar>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, getCurrentInstance, toRefs } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import restaurant from './components/restaurant.vue'
const data = reactive<any>({
  config: {
    title: "益起低碳",
    type: 'slot',
    bgColor: 'linear-gradient(160deg, rgb(232, 241, 227) 30%, rgb(228, 243, 251) 50%)',
    back: {
      hide: true
    }
  },
  current: 0,
  backgroundColor: 'rgba(248,248,248,.7)',
  logoSrc: 'http://www.zerocarbonplus.com/img/logo_black.c634a75f.png',
  // 是否正在请求所有数据，防止onReachBottom多次触发
  getAllData: false,
  swiperlist: [
    'https://cdn.uviewui.com/uview/swiper/swiper1.png',
    'https://cdn.uviewui.com/uview/swiper/swiper2.png',
    'https://cdn.uviewui.com/uview/swiper/swiper3.png',
  ]
})
const icon1 = ref('/static/images/icons/bycicle.png')
const icon2 = ref('/static/images/icons/campus.png')
const icon3 = ref('/static/images/icons/questionnaire.png')
const icon4 = ref('/static/images/icons/restaurant.png')
const icon5 = ref('/static/images/icons/signin.png')

onLoad(() => {
  uni.onAppShow((res) => {
    console.log('onAppShow', res)
    // 判断是不是从 腾讯问卷 回来的 且回答完毕了~
    if (res.referrerInfo.appId == 'wxebadf544ddae62cb' && res.referrerInfo.extraData.status == 'answered') {
      uni.showToast({
        title: '恭喜您参与问卷调研~ 赠送低碳小礼品一份~',
        icon: 'none',
        duration: 2000
      })
    }
  })
})
onShow((res) => {
  //隐藏官方的tabBar
  uni.hideTabBar()
})

const currentInstance = ref()
const change = () => {
  console.log('change')
}
const click = () => {
  console.log('click')
}
const tabbarSwitch = (e: any) => {
  //获取登录状态，此处默认未登录
  let isLogin = false;
  currentInstance.value = getCurrentInstance()
  console.log(e)
  // if (e.verify && !isLogin) {
  //   uni.showToast({
  // 		title: '您还未登录，请先登录',
  // 		icon: 'none',
  // 		duration: 2000
  // 	})
  // } else {
  //   data.current = e.index;
  // }
}
const toPage = (path) => {
  uni.navigateTo({ url: path })
}
const openQuestionnaire = () => {
  uni.openEmbeddedMiniProgram({
    appId: 'wxebadf544ddae62cb',
    path: 'pages/survey/index?sid=9242377&hash=b6d7&navigateBackMiniProgram=true',
    extraData: {
      userId: '12345'
    },
    success(res) {
      console.log('openQuestionnaire', res)
      // 返回成功
    },
    fail(err) {
      console.log('fail', err)
    }
  })
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
  width: 100%;
  height: 130px;

  &:after {
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

.ht-entrance {
  margin: 10px 10px;
  padding: 10px;
  border-radius: 15px;
  background: linear-gradient(160deg, rgb(232, 241, 227) 30%, rgb(228, 243, 251) 50%);

  .icon-layout {
    height: 56px;
    width: 56px;
    border-radius: 8px;
    @include flex(column);
    justify-content: center;
    align-items: center;

    .icon-img {
      margin-bottom: 2px;
    }

    .icon-title {
      text-align: center;
      color: #606266;
      font-size: 12px
    }
  }
}
</style>
