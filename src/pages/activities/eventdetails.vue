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
            <view class="text">开始时间: {{ new Date(actInfo.time[0]).toLocaleString() }}</view>
            <view class="text">结束时间: {{ new Date(actInfo.time[1]).toLocaleString() }}</view>
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
        <view v-if="actInfo.userList.length > 0" class="participant">
          <u-avatar-group :maxCount="10" :urls="actInfo.userList" size="35" gap="0.2"></u-avatar-group>
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
      <tui-form-button v-if="!isApply && status !== 2" height="65rpx" width="200rpx" borderColor="#fff" bold
        background="linear-gradient(110deg, rgb(50 199 54), rgb(132 251 136))" radius="30px"
        @click="handleApply">立即报名</tui-form-button>
      <tui-form-button v-if="isApply && status !== 2" height="65rpx" width="200rpx" borderColor="#fff" bold disabled
        background="linear-gradient(110deg, rgb(50 199 54), rgb(132 251 136))" radius="30px">已报名</tui-form-button>
      <tui-form-button v-if="status == 2" height="65rpx" width="200rpx" borderColor="#fff" bold disabled
        background="linear-gradient(110deg, rgb(50 199 54), rgb(132 251 136))" radius="30px">已结束</tui-form-button>
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
import { storeToRefs } from 'pinia'
const userInfo = userInfoStore()
const { user } = storeToRefs(userInfo)
const data = reactive<any>({
  scrollTop: 0,
  curScrollTop: 0,
  safeBottom: 0,
  imageLoaded: false,
  imageHeight: 0
})
const actId = ref('')
const isApply = ref(false)
const actInfo = ref<any>(null)
const status = ref<any>(0)
onShow(() => {
  getWindowInfo()
  data.imageHeight = 0
})
onLoad((option: any) => {
  console.log('onLoad option', option)
  actId.value = option.activityId
  checkApply()
  getInfoDetail()
})
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
    if (res.data.userList.length > 0) {
      res.data.userList = res.data.userList.map((item) => {
        return item.avatar.url
      })
    }
    actInfo.value = res.data
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
function checkApply() {
  RequestApi.checkApply({ activityId: actId.value }).then((res: any) => {
    console.log('checkApply', res)
    if (res.data) {
      isApply.value = res.data
    }
  })
}
// 检查是否注册
function checkUserInfo() {
  console.log('checkUserInfo', user.value)
  return new Promise((resolve, reject) => {
    if (user.value.updateRecord.phone == 0 || user.value.updateRecord.avatar == 0) {
      uni.showModal({
        title: '提示',
        content: '请先完成注册及头像更新, 才能报名活动',
        showCancel: true,
        success: (res) => {
          if (res.confirm) {
            uni.navigateTo({
              url: '/pages/index/signIn'
            })
          }
        }
      })
      reject()
    } else {
      resolve(true)
    }
  })
}

function handleApply() {
  checkUserInfo().then(() => {
    uni.showModal({
      title: '提示',
      content: '是否报名该活动?',
      showCancel: true,
      success: (res) => {
        if (res.confirm) {
          RequestApi.applyActivity({ activityId: actId.value }).then((res: any) => {
            console.log('applyActivity', res)
            getInfoDetail()
            isApply.value = true
            uni.showToast({
              title: '报名成功',
              icon: 'none'
            })
          })
        }
      }
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
</style>
