<template>
  <view class="ht-investor">
    <view class="investor-title">支持机构</view>
    <view class="investor-box">
      <view class="item" v-for="item in list" :key="item.name" @click="handleDetail(item.url)">
        <view class="img">
          <u-image :radius="10" :showLoading="true" :src="item.img" width="130px" height="60px" mode="aspectFit"></u-image>
        </view>
        <!-- <view class="title">
          {{ item.name }}
        </view> -->
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
const list = reactive([
  {
    name: '能源基金会',
    img: 'https://dtcx-1318775010.cos.ap-beijing.myqcloud.com/common/investor/6.png',
    desc: '能源基金会的愿景是通过推进可持续能源促进中国和世界的繁荣发展和气候安全。我们的使命是通过推动能源转型和优化经济结构，促进中国和世界完成气候中和，达到世界领先标准的空气质量，落实人人享有用能权利，实现绿色经济增长。',
    url: 'https://www.efchina.org'
  },
  {
    name: '中华环保联合会',
    img: 'https://dtcx-1318775010.cos.ap-beijing.myqcloud.com/common/investor/7.png',
    desc: '中华环保联合会的宗旨是围绕实施可持续发展战略，围绕实现国家环境与发展的目标，围绕维护公众和社会环境权益，充分体现中华环保联合会“大中华、大环境、大联合”的组织优势，发挥政府与社会之间的桥梁和纽带作用，促进中国环境事业发展，推动全人类环境事业的进步。',
    url: 'http://www.acef.com.cn'
  },
])
const handleDetail = (url) => {
  // uni.navigateTo({ url: `/pages/plugin/details?url=${url}` });
}
</script>

<style lang="scss" scoped>
.ht-investor {
  margin: 10px;

  .investor-title {
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

  .investor-box {
    @include flex(row);
    justify-content: space-between;
    width: 100%;
    position: relative;
    .item {
      background: rgb(243, 250, 247);
      border-radius: 10px;
      padding: 10px;
      @include flex(column);
      justify-content: center;
      width: calc(50% - 24px);
      .img {
        background: #fff;
        border-radius: 6px;
        width: 100%;
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .title {
        font-size: 13px;
        font-weight: 500;
        color: #77797e;
        margin-top: 5px;
        text-align: center;
      }
    }
  }
}
</style>
