<template>
  <view>
    <view class="img" v-for="item in detailImg" :key="item._id">
      <u-image :src="item.url" width="100%" mode="widthFix" height="auto"></u-image>
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
import { onShow } from '@dcloudio/uni-app';
import { ref, reactive } from 'vue'
import { RequestApi } from '@/public/request'
const detailImg = ref<any>([])
// 获取 uni.navigateTo 传递的参数
onShow(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1] as any;
  console.log('currentPage', currentPage)
  RequestApi.getBannerDetail(currentPage?.options.id).then((res: any) => {
    console.log('getBannerDetail', res.data.detailImg)
    const { code, data } = res
    if (code == 0) {
      detailImg.value = data.detailImg
    }
  })
})

</script>

<style lang="scss"></style>
