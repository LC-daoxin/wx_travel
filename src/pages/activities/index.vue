<template>
  <view class="activity" :class="{ bg: data.activityList.length > 0 }">
    <scroll-view class="activity-scroll" :scroll-top="data.scrollTop" ref="scrollViewRef" :enable-back-to-top="true"
      :style="{ 'height': `calc(100vh)` }" scroll-y @scroll="listScroll">
      <view class="content">
        <view v-if="data.activityList.length > 0" class="activity-item" v-for="item in data.activityList" :key="item._id" @click="toDetailPage(item['_id'])">
          <view class="cover"
            :style="{ 'backgroundImage': 'url(' + item.activityImgSrc[0].url + ')', '--bgsize': item.bgsize || 'contain' }">
            <view v-if="[0, 1].includes(item.status)" :class="['audio-tag', { online: item.activity_type == 2 }]">{{ activityTypeText(item.activity_type) }}</view>
            <view v-if="item.status == 2" class="audio-tag finish">已结束</view>
          </view>
          <view class="title">
            {{ item.name }}
          </view>
        </view>
        <view v-else class="skeleton">
          <view v-for="item in 4" :key="item" class="skeleton-item">
            <u-skeleton class="skeleton-img" :title="false" rows="1" rowsHeight="180" :rowsWidth="['100%']" loading></u-skeleton>
            <u-skeleton :title="false" rows="1" rowsHeight="25" :rowsWidth="['90%']" loading></u-skeleton>
          </view>
        </view>
      </view>
    </scroll-view>
    <tui-scroll-top :scrollTop="data.curScrollTop" @toTop="toTop" :bottom="360"></tui-scroll-top>
  </view>
  <!-- <view :style="{ 'paddingBottom': data.safeBottom + 'px', height: '100rpx' }"></view> -->
</template>

<script lang="ts">
import share from '@/public/share'
export default {
  mixins: [share]
}
</script>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { RequestApi } from '@/public/request'

const data = reactive<any>({
  activityList: [],
  scrollTop: 0,
  curScrollTop: 0,
  safeBottom: 0
})
const scrollViewRef = ref(null);

const toTop = () => {
  data.scrollTop = data.curScrollTop
  setTimeout(() => {
    data.scrollTop = 0
    data.curScrollTop = 0
  })
}
onShow(() => {
  getWindowInfo()
  RequestApi.getActivityList().then((res: any) => {
    data.activityList = res.result.items.map((item: any) => {
      let now = new Date().getTime();
      let start = new Date(item.time[0]).getTime();
      let end = new Date(item.time[1]).getTime();
      if (now < start) {
        item.status = 0 // 未开始
      } else if (now > start && now < end) {
        item.status = 1 // 进行中
      } else {
        item.status = 2 // 已结束
      }
      return item
    })
  })
})
const activityTypeText = (i) => {
  const s = {
    1: '线下活动',
    2: '线上活动'
  }
  return s[i]
}
const getWindowInfo = () => {
  let info = uni.getWindowInfo();
  data.safeBottom = info.screenHeight - info.safeArea.bottom + 1
}
const listScroll = (e) => {
  data.curScrollTop = e.detail.scrollTop;
}
const toDetailPage = (id) => {
  uni.navigateTo({ url: `/pages/activities/eventdetails?activityId=${id}` });
}
</script>

<style lang="scss" scoped>
.activity {
  background: #fff;
  height: 100%;
  &.bg {
    background: rgb(245, 247, 253);
  }

  .activity-scroll {
    overflow: scroll;
  }

  .content {
    padding: 15px 10px;

    .activity-item {
      border-radius: 10px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      background-color: #fff;
      margin-bottom: 10px;

      .cover {
        height: 160px;
        background-position: center center;
        background-size: var(--bgsize);
        background-repeat: no-repeat;
        position: relative;

        .audio-tag {
          background-color: #ffab00;
          border-color: #ffab00;
          box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 5px 8px 0px rgba(0, 0, 0, 0.14), 0px 1px 14px 0px rgba(0, 0, 0, 0.12);
          padding: 2px 5px;
          position: absolute;
          left: 10px;
          top: 10px;
          color: #fff;
          font-size: 12px;
          border-radius: 5px;
          &.online {
            background-color: #439ef4;
            border-color: #439ef4;
          }
          &.finish {
            background-color: #9d9d9e;
            border-color: #9d9d9e;
          }
        }
      }

      .title {
        background-color: #fff;
        padding: 2px 5px 0;
        font-size: 16px;
        line-height: 22px;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.84);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-top: 5px;
      }
    }
  }
}
.skeleton {
  .skeleton-item {
    margin-bottom: 10px;
    ::v-deep .u-skeleton:first-child {
      margin-bottom: 4px;
    }
  }
}
</style>
