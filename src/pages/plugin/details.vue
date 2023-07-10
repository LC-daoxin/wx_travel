<template>
  <view>
    <web-view :webview-styles="data.webviewStyles" :src="data.url"></web-view>
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
const data = reactive<any>({
  webviewStyles: {
    progress: {
      color: '#FF3333'
    }
  },
  url: ''
})
// 获取 uni.navigateTo 传递的参数
onShow(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1] as any;
  data.url = currentPage?.options.url
})

</script>

<style lang="scss"></style>
