<template>
  <view v-if="activitylist.length > 0" class="activity">
    <view class="activity-title">近期活动</view>
    <u-swiper :list="activitylist" circular :autoplay="false" radius="5" :height="100" indicator imgMode="aspectFill"
      indicatorStyle="right: 5px; bottom: 5px" bgColor="#e8f1e3" keyName="image" showTitle @change="e => data.currentNum = e.current" @click="handleActivity">
      <template #indicator>
        <view class="indicator-num">
          <text class="indicator-num__text">{{ data.currentNum + 1 }}/{{ activitylist.length }}</text>
        </view>
      </template>
    </u-swiper>
  </view>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { homeStore } from '@/store/modules/home'
import { storeToRefs } from 'pinia'
const store = homeStore()
const { activity } = storeToRefs(store)
const data = reactive<any>({
  currentNum: 0,
})
const activitylist = computed(() => {
  return activity.value.map((item: any) => {
    return {
      image: item.activityImgSrc[0].url,
      title: item.name
    }
  })
})
const handleActivity = (i) => {
  let id = activity.value[i]['_id']
  uni.navigateTo({ url: `/pages/activities/eventdetails?activityId=${id}` });
}
</script>

<style lang="scss" scoped>
.activity {
  margin: 10px;

  .activity-title {
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
  .indicator-num {
    background: #00000082;
    color: #fff;
    font-size: 12px;
    padding: 3px 8px;
    border-radius: 8px;
  }
}
</style>
