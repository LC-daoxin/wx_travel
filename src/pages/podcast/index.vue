<template>
  <view class="podcast">
    <scroll-view class="podcast-scroll" :scroll-top="data.scrollTop" ref="scrollViewRef" :enable-back-to-top="true"
      :style="{ 'height': `calc(100vh)` }" scroll-y @scroll="listScroll">
      <view class="banner">
        <view class="banner-title">
          <view class="logo">
            <u-image :radius="10" :showLoading="true"
              src="https://dtcx-1318775010.cos.ap-beijing.myqcloud.com/common/podcast/podcast-logo.jpg" width="70px"
              height="70px"></u-image>
          </view>
          <view class="title-box">
            <view class="title">大声谈</view>
            <view class="description">
              谈气候正义，谈青年机会，谈职业发展。大声谈，弹走碳碳碳！
            </view>
          </view>
        </view>
      </view>
      <view class="content">
        <view v-if="data.podcastList.length > 0" class="audio-item" v-for="item in data.podcastList" :key="item.id">
          <view class="cover"
            :style="{ 'backgroundImage': 'url(' + item.coverUrl[0].url + ')', '--bgsize': item.bgsize || 'contain' }">
            <view class="audio-tag">{{ podcastTypeText(item.podcastType) }}</view>
            <view v-if="!item.audioPlay" class="audio-play" @click="playAudio(item)">
              <u-image src="https://dtcx-1318775010.cos.ap-beijing.myqcloud.com/common/map/start2.png" width="15px"
                height="15px"></u-image>
            </view>
            <view v-else class="audio-play" @click="pauseAudio(item)">
              <u-image src="https://dtcx-1318775010.cos.ap-beijing.myqcloud.com/common/map/stop.png" width="15px"
                height="15px"></u-image>
            </view>
            <view class="audio-browse">
              <view class="num">{{ item.playNum }}</view>
              <tui-icon name="eye" color="#0000006a" :size="17"></tui-icon>
            </view>
          </view>
          <view class="title">
            {{ item.title }}
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
import { ref, reactive, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { RequestApi } from '@/public/request'
import { dictStore } from '@/store/modules/dict'
import { storeToRefs } from 'pinia'
const dict = dictStore()
const { podcastType } = storeToRefs(dict)
const data = reactive<any>({
  podcastList: [],
  scrollTop: 0,
  curScrollTop: 0,
  safeBottom: 0,
  bgAudioManager: null, // 背景音频管理器
  currentAudio: null // 当前播放的音频
})
// const audioContext = ref<any>(null); // 内部音频上下文
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
  let manager = uni.getBackgroundAudioManager()
  console.log('onShow manager', manager)
  RequestApi.getPodcastList().then((res: any) => {
    console.log('getPodcastList', res.result.items)
    data.podcastList = res.result.items
  })
})
onMounted(() => {
  data.bgAudioManager = uni.getBackgroundAudioManager()
})
const podcastTypeText = (type) => {
  let arr = [] as any
  podcastType.value.forEach((item: any) => {
    arr[item.itemKey] = item.itemValue
  })
  return arr[type]
}
const getWindowInfo = () => {
  let info = uni.getWindowInfo();
  data.safeBottom = info.screenHeight - info.safeArea.bottom + 1
}
const listScroll = (e) => {
  data.curScrollTop = e.detail.scrollTop;
}
function playAudio(item: any) {
  console.log('playAudio', item, data.bgAudioManager)
  if (!(data.currentAudio && data.currentAudio['_id'] === item['_id'])) {
    RequestApi.recordPlay({ id: item['_id'] }).then((res: any) => {
      item.playNum++
    })
  }
  data.currentAudio = item
  data.podcastList.map(item => item.audioPlay = false)
  // if (data.bgAudioManager) {
  //   data.bgAudioManager.stop()
  // }
  console.log('podcastList', data.podcastList)
  item.audioPlay = true
  data.bgAudioManager.title = item.title
  data.bgAudioManager.singer = item.anchorName + ' & ' + item.guest
  data.bgAudioManager.coverImgUrl = item.smallUrl[0].url || item.coverUrl[0].url
  data.bgAudioManager.src = item.audio[0].url
  data.bgAudioManager.play()
  data.bgAudioManager.onPlay(() => { // 播放音频
    console.log('开始播放');
    // data.podcastList.map(item => item.audioPlay = false)
  });
  data.bgAudioManager.onPause(() => { // 暂停音频
    console.log('暂停播放');
  });
  data.bgAudioManager.onStop(() => { // 停止音频
    console.log('停止播放');
  });
  // data.bgAudioManager.onTimeUpdate((res) => { // 监听背景音频播放进度更新事件、只有小程序在前台时会回调
  //   console.log('onTimeUpdate', res)
  // })
  data.bgAudioManager.onEnded((res) => { // 背景音频自然播放结束事件
    console.log('onEnded', res)
  })
  data.bgAudioManager.onError((res) => {
    uni.showToast({
      title: '音频错误:' + res.errCode + '&' + res.errMsg,
      icon: 'none',
      duration: 2000
    })
  })
}
function pauseAudio(item) {
  console.log('playAudio', item, data.bgAudioManager)
  data.podcastList.map(item => item.audioPlay = false)
  if (data.bgAudioManager) {
    data.bgAudioManager.pause(); // 暂停音频
  }
}

// 记录播放
// function recordPlay(id) {
//   console.log('recordPlay', id)
//   RequestApi.recordPlay(id).then((res: any) => {
//     console.log('recordPlay', res)
//   })
// }
</script>

<style lang="scss" scoped>
.podcast {
  background: rgb(245, 247, 253);
  height: 100%;

  .podcast-scroll {
    overflow: scroll;
  }

  .banner {
    width: 100%;
    height: 180px;
    background-image: url('https://dtcx-1318775010.cos.ap-beijing.myqcloud.com/common/podcast/podcast-bg2.jpeg');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;

    .banner-title {
      width: 80%;
      min-width: 300px;
      margin: 0 auto;
      padding: 20px 10px;
      // overflow: hidden;
      background: linear-gradient(to top, rgba(5, 11, 31, 0.4), rgba(5, 11, 31, 0.4));
      display: flex;
      align-items: center;
      justify-content: space-between;

      .logo {
        margin-right: 10px;
      }

      .title-box {
        color: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .title {
          height: 20px;
          line-height: 20px;
          margin-bottom: 10px;
          font-size: 20px;
          font-weight: 500;
        }

        .description {
          font-size: 12px;
        }
      }
    }
  }

  .content {
    padding: 15px 10px;

    .audio-item {
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
        }

        .audio-play {
          position: absolute;
          right: 0;
          bottom: 0;
          height: 40px;
          width: 40px;
          background-color: #42a5f6;
          border-color: #42a5f6;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .audio-browse {
          position: absolute;
          right: 3px;
          top: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 22px;
          line-height: 22px;
          background: #ffffff99;
          padding: 0 5px;
          border-radius: 15px;

          .num {
            font-size: 12px;
            margin-right: 5px;
            color: #00000076;
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
