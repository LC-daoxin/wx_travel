<template>
  <view>
    活动
    <ht-tabbar :current="1" hump color="#777"
      selectedColor="#3c9cff" @click="tabbarSwitch"></ht-tabbar>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, getCurrentInstance } from 'vue'
const data = reactive<any>({})
const currentInstance = ref()
const tabbarSwitch = (e: any) => {
  //获取登录状态，此处默认未登录
  let isLogin = false;
  currentInstance.value = getCurrentInstance()
  console.log(e, currentInstance)
  if (e.verify && !isLogin) {
    uni.showToast({
			title: '您还未登录，请先登录',
			icon: 'none',
			duration: 2000
		})
  } else {
    data.current = e.index;
  }
}
</script>

<style lang="scss"></style>
