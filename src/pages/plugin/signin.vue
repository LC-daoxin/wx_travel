<template>
  <view>
    <uni-calendar :insert="true" :lunar="true" :start-date="'2019-3-2'" :end-date="'2019-5-20'" @change="change" />
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
const change = () => {
  
}
</script>

<style lang="scss"></style>
