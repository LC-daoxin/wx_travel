<template>
  <view class="ht-entrance">
    <u-row justify="space-between" gutter="8">
      <u-col span="3">
        <view class="icon-layout" @click="toPage('/pages/index/signIn')">
          <view class="icon-img">
            <u-image :showLoading="true" :src="icon5" width="36px" height="36px"></u-image>
          </view>
          <view class="icon-title">每日签到</view>
        </view>
      </u-col>
      <u-col span="3">
        <view class="icon-layout" @click="toPage('/pages/plugin/map')">
          <view class="icon-img">
            <u-image :showLoading="true" :src="icon1" width="36px" height="36px"></u-image>
          </view>
          <view class="icon-title">低碳出行</view>
        </view>
      </u-col>
      <!-- <u-col span="2">
        <view class="icon-layout" @click="prompt">
          <view class="icon-img">
            <u-image :showLoading="true" :src="icon2" width="36px" height="36px"></u-image>
          </view>
          <view class="icon-title">绿色校园</view>
        </view>
      </u-col> -->
      <u-col span="3">
        <view class="icon-layout" @click="openQuestionnaire">
          <u-image :showLoading="true" :src="icon3" width="36px" height="36px"></u-image>
          <view class="icon-title">低碳问卷</view>
        </view>
      </u-col>
      <u-col span="3">
        <view class="icon-layout" @click="toPage('/pages/shop/index')">
          <u-image :showLoading="true" :src="icon4" width="36px" height="36px"></u-image>
          <view class="icon-title">元气商城</view>
        </view>
      </u-col>
    </u-row>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { dictStore } from '@/store/modules/dict'
import { storeToRefs } from 'pinia'
const store = dictStore()
const { questionnaire } = storeToRefs(store)
const icon1 = ref('/static/images/icons/bycicle.png')
const icon2 = ref('/static/images/icons/campus.png')
const icon3 = ref('/static/images/icons/questionnaire.png')
const icon4 = ref('/static/images/icons/shop.png')
const icon5 = ref('/static/images/icons/signin.png')

onLoad(() => {
  uni.onAppShow((res) => {
    console.log('onAppShow', res)
    // 判断是不是从 腾讯问卷 回来的 且回答完毕了~
    if (res.referrerInfo.appId == 'wxebadf544ddae62cb' && res.referrerInfo.extraData.status == 'answered') {
      uni.showToast({
        title: '感谢您参与问卷调研~',
        icon: 'success',
        duration: 2000
      })
    }
  })
})
const toPage = (path) => {
  uni.navigateTo({ url: path })
}
const openQuestionnaire = () => {
  // 获取 store 中的问卷调查的值
  if (questionnaire.value.itemKey && questionnaire.value.itemValue) {
    uni.openEmbeddedMiniProgram({
      appId: 'wxebadf544ddae62cb',
      path:  `pages/survey/index?sid=${questionnaire.value.itemKey}&hash=${questionnaire.value.itemValue}&navigateBackMiniProgram=true`,
      extraData: {
        from: 'uniapp'
      },
      success(res) {
        console.log('openQuestionnaire', res)
        // 返回成功
      },
      fail(err) {
        console.log('fail', err)
      }
    })
  } else {
    uni.showToast({
      title: '暂无问卷需要填写',
      icon: 'none',
      duration: 3000
    })
  }

}
const prompt = () => {
  uni.showToast({
    title: '开发中',
    icon: 'none',
    duration: 2000
  })
}
const click = () => {
  console.log('click')
}
</script>

<style lang="scss" scoped>
.ht-entrance {
  margin: 10px 10px;
  padding: 10px;
  border-radius: 15px;
  background: linear-gradient(160deg, rgb(232, 241, 227) 30%, rgb(228, 243, 251) 50%);

  .icon-layout {
    height: 56px;
    width: 100%;
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
