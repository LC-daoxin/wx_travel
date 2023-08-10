<template>
  <view v-if="actInfo" class="event">
    <scroll-view class="event-scroll" :scroll-top="data.scrollTop" ref="scrollViewRef" :enable-back-to-top="true"
      :style="{ 'height': `calc(100vh - 100rpx - ${data.safeBottom + 'px'})` }" scroll-y>
      <view class="cover">
        <image v-show="data.imageLoaded" :style="{ height: data.imageHeight + 'px' }" :src="actInfo.coverImgSrc[0].url"
          mode="widthFix" @load="onImageLoad">
        </image>
        <view class="title">{{ actInfo.name }}</view>
      </view>
      <view class="act-box act-info">
        <view class="time">
          <view class="iconimg">
            <u-image src="/static/images/activity/time.png" :width="22" :height="22"></u-image>
          </view>
          <view class="time-body">
            <view class="text">开始时间: {{ data.startTime }}</view>
            <view class="text">结束时间: {{ data.endTime }}</view>
          </view>

        </view>
        <view class="location">
          <view class="iconimg">
            <u-image src="/static/images/activity/location.png" :width="22" :height="22"></u-image>
          </view>
          <view class="text">{{ actInfo.location }}</view>
        </view>
      </view>
      <view v-if="actInfo.activity_type == 2" class="act-meeting act-box" @click="toMeeting(actInfo.onlineInfo)">
        <view class="logo">
          <u-image src="https://cdn.meeting.tencent.com/pro/Y2JmNmM1ODYtNGFmYS00MzNkLWFhNDItOWJkOGUzODc5M2Ri.svg"
            :width="105" :height="19"></u-image>
          <view class="prompt">点击直接跳转<tui-icon class="icon" name="link" color="#8cac96" size="12"></tui-icon></view>
        </view>
        <view class="meeting-info">
          <view class="meet-row">
            <view class="left">会议主题:</view>
            <view class="right">{{ actInfo.onlineInfo.theme }}</view>
          </view>
          <view class="meet-row">
            <view class="left">会议时间:</view>
            <view class="right">{{ actInfo.onlineInfo.time }}</view>
          </view>
          <view class="meet-row">
            <view class="left">会议号:</view>
            <view class="right">{{ actInfo.onlineInfo.meetingCode }}</view>
          </view>
          <view class="meet-row">
            <view class="left">会议密码:</view>
            <view class="right">{{ actInfo.onlineInfo.password }}</view>
          </view>
        </view>
      </view>
      <view class="act-participant act-box">
        <view class="title">
          <view class="icon">
            <u-image src="/static/images/activity/user.png" :width="16" :height="16"></u-image>
          </view>
          <view class="text">参与成员</view>
        </view>
        <view v-if="userList.length > 0" class="participant">
          <u-avatar-group :maxCount="10" :urls="userList" size="35" gap="0.2"></u-avatar-group>
        </view>
        <view v-else class="no-participant">
          <view class="icon">
            <u-image src="/static/images/activity/no.png" :width="20" :height="20"></u-image>
          </view>
          <view class="text">暂无参与成员...</view>
        </view>
      </view>
      <view class="act-content act-box">
        <view class="title">
          <view class="icon">
            <u-image src="/static/images/activity/list.png" :width="16" :height="16"></u-image>
          </view>
          <view class="text">活动详情</view>
        </view>
        <view class="parse">
          <u-parse :content="marked(actInfo.content)"></u-parse>
        </view>
      </view>
      <view class="bottom"></view>
    </scroll-view>
    <view class="btn-box">
      <tui-form-button v-if="!isApply && status !== 2 && isHasPhone" height="65rpx" width="200rpx" borderColor="#fff" bold
        background="linear-gradient(110deg, rgb(50 199 54), rgb(132 251 136))" radius="30px"
        @click="handleApply">立即报名</tui-form-button>
      <tui-form-button v-if="!isApply && status !== 2 && !isHasPhone" height="65rpx" width="200rpx" borderColor="#fff" bold
        background="linear-gradient(110deg, rgb(50 199 54), rgb(132 251 136))" radius="30px" open-type="getPhoneNumber"
        @getphonenumber="getPhoneNumber">立即报名</tui-form-button>
      <tui-form-button v-if="isApply && status !== 2" height="65rpx" width="200rpx" borderColor="#fff" bold disabled
        background="linear-gradient(110deg, rgb(50 199 54), rgb(132 251 136))" radius="30px">已报名</tui-form-button>
      <tui-form-button v-if="status == 2" height="65rpx" width="200rpx" borderColor="#fff" bold disabled
        background="linear-gradient(110deg, rgb(50 199 54), rgb(132 251 136))" radius="30px">已结束</tui-form-button>
    </view>
  </view>
</template>
<script setup lang="ts">
import { onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";
import { ref, reactive } from 'vue'
import { onShow, onLoad } from '@dcloudio/uni-app'
import marked from '@/components/uni/marked/index.js'
import dayjs from 'dayjs'
import { RequestApi } from '@/public/request'
import { userInfoStore } from '@/store/modules/user'
import { storeToRefs } from 'pinia'
const userInfo = userInfoStore()
const { user } = storeToRefs(userInfo)
const data = reactive<any>({
  scrollTop: 0,
  curScrollTop: 0,
  safeBottom: 0,
  imageLoaded: false,
  imageHeight: 0,
  startTime: '',
  endTime: '',
})
const actId = ref('')
const isApply = ref(false)
const actInfo = ref<any>(null)
const status = ref<any>(0)
const isHasPhone = ref(false)
const userList = ref<any>([])
const getPhoneNumber = (e) => {
  console.log('getPhoneNumber', e)
  if (e.errMsg == "getPhoneNumber:ok") {
    isHasPhone.value = true
    RequestApi.updatePhone({ code: e.code }).then((res: any) => {
      console.log('updatePhone', res)
      const { code, data } = res
      if (code == 0) {
        userInfo.updateUser().then(() => {
          apply()
        })
      }
    })
  }
  if (e.errMsg == "getPhoneNumber:fail user deny") {
    uni.showToast({
      title: '报名活动需授权手机号注册',
      icon: 'none',
      duration: 3000
    })
  }
}
onShow(() => {
  getWindowInfo()
  data.imageHeight = 0
  if (user.value.phone) {
    isHasPhone.value = true
  }
  user.value.updateRecord.phone == 0 && (isHasPhone.value = false)
})
onLoad((option: any) => {
  console.log('onLoad option', option)
  actId.value = option.activityId
  checkApply()
  getInfoDetail()
  getActivityApplyList()
})
// 获取活动详情
function getInfoDetail() {
  RequestApi.getActivityDetail(actId.value).then((res: any) => {
    console.log('getActivityDetail', res)
    let now = new Date().getTime();
    let start = new Date(res.data.time[0]).getTime();
    let end = new Date(res.data.time[1]).getTime();
    if (now < start) {
      status.value = 0 // 未开始
    } else if (now > start && now < end) {
      status.value = 1 // 进行中
    } else {
      status.value = 2 // 已结束
    }
    actInfo.value = res.data
    data.startTime = dayjs(res.data.time[0]).format('YYYY-MM-DD HH:mm')
    if (data.startTime.split(' ')[1] == '00:00') {
      data.startTime = data.startTime.split(' ')[0]
    }
    data.endTime = dayjs(res.data.time[1]).format('YYYY-MM-DD HH:mm')
    if (data.endTime.split(' ')[1] == '23:59') {
      data.endTime = data.endTime.split(' ')[0]
    }
    console.log('actInfo', actInfo.value)
  })
}
// 获取活动报名列表
function getActivityApplyList() {
  RequestApi.getActivityApplyList(actId.value).then((res: any) => {
    userList.value = res.data.items.map((item) => {
      return item.userAvatar
    })
    if (res.data.total > 10) {
      for (let i = 0; i < res.data.total - 10; i++) {
        userList.value.push('')
      }
    }
  })
}
const onImageLoad = (event) => {
  console.log('onImageLoad', event)
  data.imageHeight = 0
  data.imageLoaded = true
  const imageElement = event.target as HTMLImageElement
  setTimeout(() => {
    data.imageHeight = imageElement.height
  }, 50)
}
const toMeeting = (info) => {
  uni.openEmbeddedMiniProgram({
    appId: 'wx33fd6cdc62520063',
    path: `pages/sub-preMeeting/join-meeting/join-meeting?scene=m%3D${info.meetingCode}`,
    extraData: {
      userId: ''
    },
    success(res) {
      console.log('toMeeting', res)
      // 返回成功
    },
    fail(err) {
      console.log('fail', err)
    }
  })
}
const getWindowInfo = () => {
  let info = uni.getWindowInfo();
  data.safeBottom = info.screenHeight - info.safeArea.bottom + 1
}
// 检查是否报名
function checkApply() {
  const token = uni.getStorageSync('userToken')
  // 首次进入没有Token, 不请求
  if (!token) {
    return
  }
  RequestApi.checkApply({ activityId: actId.value }).then((res: any) => {
    console.log('checkApply', res)
    if (res.data) {
      isApply.value = res.data
    }
  })
}
// 分享朋友
onShareAppMessage((res) => {
  console.log("onShareAppMessage", res, actInfo.value);
  return {
    title: actInfo.value.name,
    path: '/pages/activities/eventdetails?activityId=' + actInfo.value._id
  };
});
// 分享朋友圈
onShareTimeline(() => {
  return {
    title: actInfo.value.name,
    path: '/pages/activities/eventdetails?activityId=' + actInfo.value._id
  }
})

async function handleApply() {
  const enter = uni.getStorageSync('enterOptions')
  if ([1154].includes(enter.scene)) {
    uni.showModal({
      title: '提示',
      content: '请点击右下角, 前往小程序报名!'
    })
    return
  }
  if (actInfo.value.coins < 0 && user.value.carbonCoin < Math.abs(actInfo.value.coins)) {
    uni.showModal({
      title: '提示',
      content: '碳币不足, 无法报名!'
    })
    return
  }
  uni.showModal({
    title: '提示',
    content: '是否报名该活动?',
    showCancel: true,
    success: (res) => {
      if (res.confirm) {
        apply()
      }
    }
  })
}
function apply() {
  RequestApi.applyActivity({ activityId: actId.value, coins: actInfo.value.coins, activityName: actInfo.value.name }).then((res: any) => {
    console.log('applyActivity', res)
    getActivityApplyList()
    isApply.value = true
    uni.showToast({
      title: '报名成功',
      icon: 'none',
      duration: 3000
    })
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

    image {
      border-radius: 8px;
      width: 100%;
      transition: height 0.8s;
    }

    .title {
      padding: 10px 15px 5px;
      line-height: 24px;
      font-size: 18px;
      font-weight: 600;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        left: 4px;
        width: 5px;
        height: calc(100% - 18px);
        background: #12dd66;
      }
    }
  }

  .act-box {
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

  .act-info {
    height: 70px;
    flex-direction: column;
    justify-content: space-between;

    .time {
      height: 36px;
      line-height: 36px;
      display: flex;
      align-items: center;
      font-size: 15px;
      font-weight: 500;


      .time-body {
        display: flex;
        flex-direction: column;

        .text {
          height: 18px;
          line-height: 18px;
        }
      }
    }

    .location {
      height: 26px;
      line-height: 26px;
      display: flex;
      align-items: center;
      font-size: 15px;
      font-weight: 500;
    }

    .iconimg {
      margin-right: 10px;
    }
  }

  .act-meeting {
    height: 100px;
    padding: 10px 20px 12px;
    flex-direction: column;
    justify-content: space-between;

    .logo {
      display: flex;
      justify-content: space-between;

      .prompt {
        margin-left: 10px;
        font-size: 13px;
        color: rgb(186, 183, 183);
        display: flex;

        .icon {
          margin-left: 5px;
        }
      }
    }

    .meeting-info {
      font-size: 14px;
      font-weight: 500;
      margin-top: 5px;

      .meet-row {
        display: flex;
        height: 20px;
        line-height: 20px;

        .left {
          width: 70px;
        }
      }
    }
  }

  .act-participant {
    height: 70px;
    flex-direction: column;

    .participant {
      margin-top: 10px;
    }

    .no-participant {
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;

      .icon {
        margin-right: 10px;
      }

      .text {
        font-size: 14px;
        color: gainsboro;
      }
    }
  }

  .act-content {
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
.phonenumber {
  height: 200px;
  padding: 20px;
  position: relative;
  .phone-close {
    position: absolute;
    right: 10px;
    top: 8px;
  }
  .friendadd {
    margin-right: 5px;
  }
  .phone-title {
    margin-bottom: 16px;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
  }
  .phone-btn {
    display: flex;
    align-items: center;
  }
  .phone-icon {
    display: inline-block;
    margin-right: 10px;
  }
}
</style>
