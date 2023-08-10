<template>
  <view class="ranking bg">
    <view class="tui-tabs__spacing tui-padding">
      <view class="tui-inner__box">
        <tui-tab :leftGap="40" :tabs="tabs" :current="data.currentTab" :size="30" bold color="#999" selectedColor="#07c160" sliderBgColor="#07c160"
          @change="change"></tui-tab>
      </view>
    </view>
    <view class="content">
      <view class="top">
        <view class="top-head" v-if="data.rankList.length >= 3">
          <view class="second one">
            <view class="border">
              <view class="icon">
                <u-image :showLoading="true"
                  src="https://dtcx-1318775010.cos.ap-beijing.myqcloud.com/common/activity/w2.png" width="32px"
                  height="32px"></u-image>
              </view>
              <u-image :showLoading="true" :src="data.rankList[1].avatar" width="58px" height="58px"
                shape="circle"></u-image>
            </view>
            <view class="name" :style="{ color: data.rankList[1].coins ? '#08bf20' : '#bfbfbf' }">{{ data.rankList[1].nickName }}</view>
            <view class="coins">
              <u-image :showLoading="true" src="/static/images/icons/htb.png" width="16px" height="16px"></u-image>
              {{ data.rankList[1].coins }}
            </view>
          </view>
          <view class="first one">
            <view class="border">
              <view class="icon">
                <u-image :showLoading="true"
                  src="https://dtcx-1318775010.cos.ap-beijing.myqcloud.com/common/activity/w1.png" width="32px"
                  height="32px"></u-image>
              </view>
              <u-image :showLoading="true" :src="data.rankList[0].avatar" width="60px" height="60px"
                shape="circle"></u-image>
            </view>
            <view class="name" :style="{ color: data.rankList[0].coins ? '#08bf20' : '#bfbfbf' }">{{ data.rankList[0].nickName }}</view>
            <view class="coins">
              <u-image :showLoading="true" src="/static/images/icons/htb.png" width="16px" height="16px"></u-image>
              {{ data.rankList[0].coins }}
            </view>
          </view>
          <view class="thirdly one">
            <view class="border">
              <view class="icon">
                <u-image :showLoading="true"
                  src="https://dtcx-1318775010.cos.ap-beijing.myqcloud.com/common/activity/w3.png" width="32px"
                  height="32px"></u-image>
              </view>
              <u-image :showLoading="true" :src="data.rankList[2].avatar" width="55px" height="55px"
                shape="circle"></u-image>
            </view>
            <view class="name" :style="{ color: data.rankList[2].coins ? '#08bf20' : '#bfbfbf' }">{{ data.rankList[2].nickName }}</view>
            <view class="coins">
              <u-image :showLoading="true" src="/static/images/icons/htb.png" width="16px" height="16px"></u-image>
              {{ data.rankList[2].coins }}
            </view>
          </view>
        </view>
      </view>
      <view class="podium"></view>
      <view class="others">
        <scroll-view class="others-scroll" :style="{ 'height': `calc(100vh - 320px - 115rpx)` }" :scroll-top="data.scrollTop" ref="scrollViewRef" :enable-back-to-top="true"
          scroll-y @scroll="listScroll">
          <view class="other-item" v-for="(item, i) in data.rankList.slice(3, 10)" :key="i">
            <view class="left">
              <view class="num">{{ i + 4 }}</view>
              <view class="avatar">
                <u-image :showLoading="true" :src="item.avatar" width="52px" height="52px" shape="circle"></u-image>
              </view>
              <view class="name" :style="{ color: item.coins ? '#1a1c27' : '#bfbfbf' }">
                {{ item.nickName }}
              </view>
            </view>
            <view class="coins">
              <u-image :showLoading="true" src="/static/images/icons/htb.png" width="16px" height="16px"></u-image>
              {{ item.coins }}
            </view>
          </view>
        </scroll-view>
      </view>
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
import dayjs from 'dayjs'
import { ref, reactive } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { RequestApi } from '@/public/request'
import { dictStore } from '@/store/modules/dict'
import { storeToRefs } from 'pinia'
const store = dictStore()
const { cycling } = storeToRefs(store)

const data = reactive<any>({
  currentTab: 0,
  rankList: [],
  scrollTop: 0,
  curScrollTop: 0,
  safeBottom: 0
})
let tabs = ['今日排行榜', '总排行榜']
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
  data.rankList = []
  for (let i = 0; i < 10; i++) {
    data.rankList.push({
      avatar: 'https://dtcx-1318775010.cos.ap-beijing.myqcloud.com/common/activity/avatar.png',
      nickName: '虚位以待',
      coins: 0
    })
  }
  getRank()
})
const getRank = () => {
  let start = dayjs().startOf('day').valueOf()
  let end = dayjs().endOf('day').valueOf()
  tabs[0] = cycling.value[6].itemValue
  tabs[1] = cycling.value[7].itemValue
  let type = cycling.value[2].itemValue
  console.log('data.currentTab', data.currentTab)
  if (data.currentTab == 0) {
    if (type == '2') {
      start = dayjs().startOf('week').add(1, 'day').valueOf()
      end = dayjs().endOf('week').add(1, 'day').valueOf()
    } else if (type == '3') {
      start = dayjs().startOf('month').valueOf()
      end = dayjs().endOf('month').valueOf()
    }
  } else {
    start = dayjs(cycling.value[3].itemValue).startOf('day').valueOf()
    end = dayjs(cycling.value[4].itemValue).endOf('day').valueOf()
  }
  RequestApi.getRankList({ start, end }).then((res: any) => {
    data.rankList = []
    for (let i = 0; i < 10; i++) {
      data.rankList.push({
        avatar: 'https://dtcx-1318775010.cos.ap-beijing.myqcloud.com/common/activity/avatar.png',
        nickName: '虚位以待',
        coins: 0
      })
    }
    res.result.map((item, i) => {
      data.rankList[i] = item
    })
  })
}
function change(e) {
  data.currentTab = e.index
  toTop()
  getRank()
}
const getWindowInfo = () => {
  let info = uni.getWindowInfo();
  data.safeBottom = info.screenHeight - info.safeArea.bottom + 1
}
const listScroll = (e) => {
  data.curScrollTop = e.detail.scrollTop;
}
</script>

<style lang="scss" scoped>
.ranking {
  background: #fff;
  height: 100%;

  &.bg {
    background: linear-gradient(180deg, #e4f3fb 30%, rgb(232, 241, 227) 50%);
  }

  .others-scroll {
    overflow: scroll;
  }

  .content {
    padding: 15px 10px;
    @include flex(column);
    align-items: center;

    .top {
      width: 100%;
      height: 120px;
      position: relative;
      @include flex(column);
      align-items: center;

      .top-head {
        width: 330px;
        height: 160px;
        @include flex(row);

        .one {
          width: 110px;
          @include flex(column);
          align-items: center;

          .name {
            margin-top: 3px;
            font-size: 13px;
            font-weight: 600;
            width: 110px;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .coins {
            @include flex(row);
            justify-content: center;
            margin-top: 2px;
            font-size: 12px;
            color: #fff;
            width: 48px;
            padding: 3px 5px;
            background: #a7afea;
            border-radius: 5px;

            ::v-deep .u-image {
              margin-right: 2px;
            }
          }
        }

        .border {
          border-radius: 50%;
          position: relative;

          .icon {
            position: absolute;
            top: -21px;
            left: -9px;
            z-index: 99;
          }
        }

        .first {
          .border {
            border: 4px solid #f7d20f;
          }
        }

        .second {
          margin-top: 20px;
          justify-content: center;

          .border {
            border: 4px solid #ded9d9;
          }
        }

        .thirdly {
          margin-top: 50px;
          justify-content: center;

          .border {
            border: 4px solid #d89144;
          }
        }
      }
    }

    .podium {
      width: 330px;
      height: 170px;
      background: url('https://dtcx-1318775010.cos.ap-beijing.myqcloud.com/common/activity/ranking2.png');
      background-repeat: no-repeat;
      background-size: 100%;
    }

    .others {
      width: 100%;
      border-radius: 20px;
      background-color: #fff;
      height: calc(100vh - 320px - 115rpx);

      .other-item {
        height: 80px;
        @include flex(row);
        justify-content: space-between;
        padding: 0 10px;
        border-bottom: 1px solid #eeeded;
        .left {
          @include flex(row);
          align-items: center;
        }
        .num {
          width: 40px;
          font-size: 22px;
          font-weight: 500;
          text-align: center;
          color: #636568;
        }

        .name {
          margin-left: 10px;
          width: 120px;
          font-size: 16px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .coins {
          @include flex(row);
          align-items: center;
          justify-content: center;
          width: 60px;
          font-size: 16px;
          ::v-deep .u-image {
            margin-right: 4px;
          }
        }
      }
    }
  }
}

.tui-inner__box {
  width: 100%;
  height: 80rpx;
  background-color: #fff;
  border-radius: 40rpx;
  overflow: hidden;
}

.tui-tabs__spacing {
  width: 100%;
  padding: 20rpx 40rpx 15rpx;
  box-sizing: border-box;
}</style>
