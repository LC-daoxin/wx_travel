<template>
  <view class="signin">
    <view class="week">
      <view class="prompt" v-if="countNum < 3">再连续打卡 {{ 3 - countNum }} 天, 可得 3倍元气币</view>
      <view class="prompt" v-if="3 <= countNum && countNum < 7">再连续打卡 {{ 7 - countNum }} 天, 可得 5倍元气币</view>
      <view class="record">已累计打卡 {{ countNum }} 天</view>
      <view class="signin-box">
        <view class="signin-item" v-for="item in signinList" :key="item.day">
          <view class="top">
            <view v-if="[3, 7].includes(item.day)" class="award">{{ item.award }}倍</view>
          </view>
          <view v-if="!item.isSignIn" class="score circle">+{{ item.score }}</view>
          <view v-else class="complete circle"><tui-icon name="check" color="#fff" size="20" bold></tui-icon></view>
          <view class="day">{{ textday(item) }}</view>
        </view>
      </view>
    </view>
    <view class="task">
      <view class="title">
        <view class="icon">
          <u-image src="/static/images/activity/task.png" :width="16" :height="16"></u-image>
        </view>
        <view class="text">限定任务</view>
      </view>
      <view class="task-item" v-for="item in taskList" :key="item.id">
        <view class="icon">
          <u-image :src="item.iconSrc" :width="20" :height="20"></u-image>
        </view>
        <view class="content">
          <view class="name">{{ item.taskName }}</view>
          <view class="score"><u-image :showLoading="true" src="/static/images/icons/htb.png" width="18px"
              height="18px"></u-image>{{ item.score }}</view>
        </view>
        <view class="btn">
          <tui-form-button v-if="item.id == 1" height="50rpx" width="65px" :disabled="item.isComplete > 0"
            borderColor="#fff" size="24" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber"
            background="linear-gradient(110deg, #51b4ef, #9ccdff)" radius="30px">{{ item.isComplete == 0 ? '去完成' : '已完成'
            }}</tui-form-button>
          <tui-form-button v-if="item.id == 2" height="50rpx" width="65px" :disabled="item.isComplete > 0"
            borderColor="#fff" size="24" @click="toUserInfoPage" background="linear-gradient(110deg, #51b4ef, #9ccdff)"
            radius="30px">{{ item.isComplete == 0 ? '去完成' : '已完成' }}</tui-form-button>
          <tui-form-button v-if="item.id == 3" height="50rpx" width="65px" :disabled="item.isComplete > 0"
            borderColor="#fff" size="24" @click="toUserInfoPage" background="linear-gradient(110deg, #51b4ef, #9ccdff)"
            radius="30px">{{ item.isComplete == 0 ? '去完成' : '已完成' }}</tui-form-button>
        </view>
      </view>
    </view>
    <view class="task">
      <view class="title">
        <view class="icon">
          <u-image src="/static/images/activity/task.png" :width="16" :height="16"></u-image>
        </view>
        <view class="text">每日任务</view>
      </view>
      <view class="task-item" v-for="item in everydayList" :key="item.id">
        <view class="icon">
          <u-image :src="item.iconSrc" :width="20" :height="20"></u-image>
        </view>
        <view class="content">
          <view class="name">{{ item.taskName }}</view>
          <view class="score">
            <u-image :showLoading="true" src="/static/images/icons/htb.png" width="18px" height="18px"></u-image>{{
              item.score }}
            <view v-if="item.id == 1" class="travel-num">今日低碳出行 {{ travelNum }} 次</view>
          </view>
        </view>
        <view class="btn">
          <tui-form-button v-if="item.id == 1" height="50rpx" width="65px" borderColor="#fff" size="24"
            :disabled="item.isComplete" @click="toTravelPage" background="linear-gradient(110deg, #51b4ef, #9ccdff)"
            radius="30px">{{ item.isComplete == 0 ? '去完成' : '已完成' }}</tui-form-button>
        </view>
      </view>
    </view>
  </view>
  <view :style="{ 'paddingBottom': data.safeBottom + 'px', height: '100rpx' }"></view>
</template>
<script lang="ts">
import share from '@/public/share'
export default {
  mixins: [share]
}
</script>
<script setup lang="ts">
import dayjs from 'dayjs'
import { ref, reactive } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { RequestApi } from '@/public/request'
import { userInfoStore } from '@/store/modules/user'
import { dictStore } from '@/store/modules/dict'
import { storeToRefs } from 'pinia'
const store = userInfoStore()
const dict = dictStore()
const { user } = storeToRefs(store)
const { signIn, taskReward } = storeToRefs(dict)
const signinList = reactive<any>([])
signIn.value.forEach((item, index) => {
  let award = 1
  if (index == 2) {
    award = 3
  } else if (index == 6) {
    award = 5
  }
  signinList.push({
    day: index + 1,
    score: item.itemValue,
    isSignIn: false,
    award: award
  })
})
const countNum = ref(0)
const travelNum = ref(0)
const taskList = reactive<any>([
  {
    id: 1,
    taskName: '注册成为元气碳的小伙伴',
    iconSrc: '/static/images/activity/register.png',
    score: 0,
    isComplete: true  // 是否完成
  }, {
    id: 2,
    taskName: '完善用户头像设置',
    iconSrc: '/static/images/activity/head.png',
    score: 0,
    isComplete: true  // 是否完成
  }, {
    id: 3,
    taskName: '完善昵称的设置',
    iconSrc: '/static/images/activity/name-card.png',
    score: 0,
    isComplete: true  // 是否完成
  }
])
const everydayList = reactive<any>([
  {
    id: 1,
    taskName: '低碳出行(骑行)',
    iconSrc: '/static/images/activity/travel.png',
    score: 0,
    isComplete: false  // 是否完成
  }
])
const data = reactive<any>({
  safeBottom: 0
})

onShow(() => {
  console.log('onShow')
  store.updateUser().then((res: any) => {
    taskList[0].isComplete = user.value.updateRecord.phone
    taskList[1].isComplete = user.value.updateRecord.avatar
    taskList[2].isComplete = user.value.updateRecord.nickName
  })
  signin()
  setTaskReward()
  isFirstTravel()
})
// 设置任务奖励
const setTaskReward = () => {
  taskReward.value.forEach((item) => {
    if (item.itemKey == 'phone') {
      taskList[0].score = item.itemValue
    } else if (item.itemKey == 'avatar') {
      taskList[1].score = item.itemValue
    } else if (item.itemKey == 'nickname') {
      taskList[2].score = item.itemValue
    } else if (item.itemKey == 'travel') {
      everydayList[0].score = item.itemValue
    }
  })
}

// 每日签到
const signin = () => {
  RequestApi.signin().then((res: any) => {
    console.log('signin', res)
    const { code, data, msg } = res
    if (code == 0) {
      const { isSignIn, count } = data
      countNum.value = count
      signinList.forEach((item: any, index: number) => {
        if (index <= count - 1) {
          signinList[index].isSignIn = true
        } else {
          signinList[index].isSignIn = false
        }
      })
      if (isSignIn) {
        uni.showToast({
          title: msg,
          icon: 'success'
        });
      }
    }
  })
}
const textday = (item) => {
  if (item.isSignIn) {
    return '已打卡'
  } else {
    return item.day + '天'
  }
}
const getPhoneNumber = (e) => {
  console.log('getPhoneNumber', e)
  if (e.errMsg == "getPhoneNumber:ok") {
    RequestApi.updatePhone({ code: e.code }).then((res: any) => {
      console.log('updatePhone', res)
      const { code, data } = res
      if (code == 0) {
        store.updateUser().then((res: any) => {
          taskList[0].isComplete = user.value.updateRecord.phone
        })
        uni.showToast({
          title: '注册成功!',
          icon: 'success'
        });
      }
    })
  }
}
const isFirstTravel = () => {
  RequestApi.getTravelRecord().then((res: any) => {
    console.log('getTravelRecord', res)
    const { code, result } = res
    if (code == 0) {
      if (result.items.length > 0) {
        const today = dayjs().format('YYYY/MM/DD')
        result.items.forEach((item) => {
          let startTime = dayjs(Number(item.startTime)).format('YYYY/MM/DD')
          console.log('startTime', today , startTime)
          if (today == startTime) {
            travelNum.value += 1
          }
        })
        // everydayList[0].isComplete = travelNum.value
      } else {
        everydayList[0].isComplete = 0
      }
    }
  })
}
const toTravelPage = (e) => {
  uni.navigateTo({
    url: '/pages/plugin/map'
  })
}
const toUserInfoPage = (e) => {
  uni.navigateTo({
    url: '/pages/mine/userinfo'
  })
}
</script>
<style>
page {
  background: #f5f7fd;
}
</style>
<style lang="scss" scoped>
.signin {
  padding: 10px 0;

  .week {
    background: #fff;
    margin: 0 10px;
    height: 120px;
    border-radius: 10px;
    padding: 10px;

    .prompt {
      height: 20px;
      line-height: 20px;
      font-size: 15px;
      font-weight: 500;
    }

    .record {
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      color: #b4b1b1;
    }

    .signin-box {
      display: flex;
      justify-content: space-between;

      .signin-item {
        width: 14%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .top {
          height: 20px;

          .award {
            width: 40px;
            height: 15px;
            line-height: 15px;
            border-radius: 12px;
            background: #e2cd0f;
            font-size: 12px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
          }
        }

        .circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .score {
          background: #ffeed4;
          font-size: 14px;
          font-weight: 900;
          color: #12ae10;
        }

        .complete {
          background: #71dbf2;
        }

        .day {
          margin-top: 3px;
          height: 14px;
          line-height: 14px;
          font-size: 12px;
          color: #b4b1b1;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }

  .task {
    background: #fff;
    margin: 10px;
    min-height: 70px;
    height: auto;
    border-radius: 10px;
    padding: 10px;

    .title {
      display: flex;
      align-items: center;
      height: 22px;
      line-height: 22px;
      margin-bottom: 10px;

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

    .task-item {
      background: #f8f8f8;
      border-radius: 10px;
      padding: 5px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      margin-bottom: 10px;

      .icon {
        width: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .content {
        flex: 1;
        display: flex;
        flex-direction: column;

        .name {
          padding-left: 3px;
          height: 20px;
          line-height: 20px;
          font-size: 13px;
          font-weight: 500;
          color: #4267ab;
        }

        .score {
          height: 20px;
          line-height: 20px;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          color: #1a7f27;

          .travel-num {
            height: 20px;
            line-height: 20px;
            font-size: 12px;
            font-weight: 300;
            padding-left: 10px;
            color: rgb(144, 143, 143);
          }
        }
      }

      .btn {
        width: 70px;
        display: flex;
        flex-direction: row-reverse;
      }
    }
  }
}
</style>
