<template>
  <view v-if="cycling.length > 0" class="ht-cycling">
    <!-- <view class="cycling-title">乐在骑中</view> -->
    <view class="cycling-box" :style="{ '--width': windowWidth + 'px' }">
      <view class="r-item" @click="handleDetail">
        <view class="r-item-img" :style="{ width: imgWidth() }">
          <u-image :radius="10" :showLoading="true" :src="cycling[0].itemValue" :width="imgWidth()" height="100px" mode="aspectFit"></u-image>
          <view v-show="cycling[1].itemValue" class="time">{{ cycling[1].itemValue }}</view>
        </view>
        <view class="r-item-content">
          <view class="title">{{ cycling[5].itemValue }}</view>
          <view class="ranking">
            <view class="item_rank" v-for="(item, i) in rankList.slice(0, 3)" :key="i">
              <view class="avatar">
                <view class="icon">
                  <u-image :showLoading="true" :src="`https://dtcx-1318775010.cos.ap-beijing.myqcloud.com/common/activity/w${i + 1}.png`" width="24px" height="24px"></u-image>
                </view>
                <u-image :showLoading="true" :src="item.avatar" width="24px" height="24px" shape="circle"></u-image>
                <view class="name" :style="{ color: item.coins == 0 ? '#dee1e7' : '#666', width: nameWidth() }">{{ item.nickName }}</view>
              </view>
              <view class="coins">
                <view class="text">{{ item.coins }}</view>
                <u-image :showLoading="true" src="/static/images/icons/htb.png" width="16px" height="16px"></u-image>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { RequestApi } from '@/public/request'
import { ref, reactive, onMounted } from 'vue'
import { onShow } from "@dcloudio/uni-app";
import { dictStore } from '@/store/modules/dict'
import { storeToRefs } from 'pinia'
const store = dictStore()
const { cycling } = storeToRefs(store)
const windowWidth = uni.getSystemInfoSync().windowWidth
const handleDetail = () => {
  uni.navigateTo({
    url: '/pages/activities/cycling'
  })
}
const rankList = reactive<any>([])
const hasActData = ref(false)

onMounted(() => {
  loadActData()
})
onShow(() => {
  if (hasActData.value) {
    getActInfo()
  }
})
// 加载数据
function loadActData() {
  if (hasActData.value) return
  for (let i = 0; i < 10; i++) {
    rankList.push({
      avatar: 'https://dtcx-1318775010.cos.ap-beijing.myqcloud.com/common/activity/avatar.png',
      nickName: '虚位以待',
      coins: 0
    })
  }
  getActInfo().then(res => {
    hasActData.value = true
  })
}
function getActInfo() {
  return new Promise((resolve, reject) => {
    // dayjs 转为时间戳
    // start 当天0点 end 当天24点
    let start = dayjs().startOf('day').valueOf()
    let end = dayjs().endOf('day').valueOf()
    let type = cycling.value[2].itemValue
    if (type == '2') {
      start = dayjs().startOf('week').add(1, 'day').valueOf()
      end = dayjs().endOf('week').add(1, 'day').valueOf()
    } else if (type == '3') {
      start = dayjs().startOf('month').valueOf()
      end = dayjs().endOf('month').valueOf()
    } else if (type == '4') {
      start = dayjs(cycling.value[3].itemValue).startOf('day').valueOf()
      end = dayjs(cycling.value[4].itemValue).endOf('day').valueOf()
    }
    RequestApi.getRankList({ start, end }).then((res: any) => {
      res.result.map((item, i) => {
        if (i < 3) {
          rankList[i].avatar = item.avatar
          rankList[i].coins = item.coins
          rankList[i].nickName = item.nickName
        }
        resolve(res)
      })
    })
  })
}
function imgWidth() {
  let width = ''
  if (windowWidth <= 375) {
    width = '150px'
  } else if (windowWidth <= 390) {
    width = '165px'
  } else {
    width = '185px'
  }
  return width
}
function nameWidth() {
  let width = ''
  if (windowWidth <= 375) {
    width = '75px'
  } else if (windowWidth <= 390) {
    width = '85px'
  } else {
    width = '95px'
  }
  return width
}
</script>

<style lang="scss" scoped>
.ht-cycling {
  margin: 10px;

  .cycling-title {
    margin-left: 5px;
    margin-bottom: 3px;
    font-size: 13px;
    font-weight: 500;
    color: #9699a1;
    position: relative;
    padding-left: 8px;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      width: 4px;
      height: 100%;
      background: #f7b335;
    }
  }

  .cycling-box {
    border-radius: 10px;
    overflow: hidden;
    .r-item {
      background: rgb(249, 250, 243);
      padding: 8px 10px;
      @include flex(row);
      justify-content: center;

      .r-item-img {
        height: 100px;
        margin-right: 8px;
        background: linear-gradient(160deg, rgb(232, 241, 227) 30%, rgb(228, 243, 251) 50%);;
        border-radius: 8px;
        position: relative;
        .time {
          position: absolute;
          bottom: 5px;
          right: 5px;
          font-size: 12px;
          color: #fff;
          border-radius: 3px;
          padding: 3px 5px;
          background: rgba(74, 71, 71, 0.5);
        }
      }

      .r-item-content {
        flex: 1;
        @include flex(column);
        // justify-content: space-between;
        .title {
          font-size: 13px;
          font-weight: 500;
          color: #19b33d;
          margin-bottom: 2px;
        }
        .ranking {
          .item_rank {
            @include flex(row);
            justify-content: space-between;
            align-items: center;
            margin-top: 3px;
            // 第一个
            &:first-child {
              margin-top: 0;
            }
            .avatar {
              @include flex(row);
              .icon {
                margin-right: 3px;
              }
            }
            .name {
              font-size: 12px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              display: flex;
              align-items: center;
              margin-left: 2px;
            }
            .coins {
              @include flex(row);
              align-items: center;
              .text {
                font-size: 12px;
                color: #9699a1;
                margin-right: 3px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
