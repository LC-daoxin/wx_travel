<template>
  <view>
    <view class="userbox">
      <view class="user_header">
        <view class="head_box">
          <u-avatar class="head_img" :src="data.userInfo.avatarUrl" mode="circle" size="130"></u-avatar>
          <view class="info">
            <view class="head_name">{{ data.userInfo.nickName }}</view>
            <view class="departments">{{ data.userInfo.office || '暂无科室' }}</view>
          </view>
        </view>
        <image class="user_bg" src="/static/images/mine/user-bg.png"></image>
      </view>
      <view class="user_menu">
        <image class="arc" src="/static/images/mine/arc.png"></image>
        <view class="server_box">
          <tui-list-view>
            <tui-list-cell @click="naviTo('setting')" :arrow="true">
              <view class="tui-item-box">
                <tui-icon name="wealth-fill" :size="24" color="#ff7900"></tui-icon>
                <text class="tui-list-cell_name">我的钱包</text>
              </view>
            </tui-list-cell>
            <tui-list-cell @click="naviTo('setting')" :arrow="true">
              <view class="tui-item-box">
                <tui-icon name="service-fill" :size="24" color="#5677fc"></tui-icon>
                <view class="tui-list-cell_name">服务窗</view>
              </view>
            </tui-list-cell>
            <tui-list-cell @click="naviTo('setting')" :arrow="true">
              <view class="tui-item-box">
                <tui-icon name="explore-fill" :size="24" color="#19be6b"></tui-icon>
                <view class="tui-list-cell_name">发现</view>
                <view class="tui-ml-auto">
                  <tui-tag padding="10rpx 12rpx" margin="0 30rpx 0 0" size="24rpx" type="light-green"
                    shape="circle">探索发现</tui-tag>
                </view>
              </view>
            </tui-list-cell>
          </tui-list-view>
          <!-- <u-cell-group>
            <u-cell-item title="个人设置" @click="naviTo('setting')"><text slot="icon"
                class="iconfont icon-shezhi"></text></u-cell-item>
            <u-cell-item title="反馈意见" @click="naviTo('feedBack')"><text slot="icon"
                class="iconfont icon-shenpi"></text></u-cell-item>
          </u-cell-group> -->
        </view>
      </view>
    </view>
    <ht-tabbar :current="4" hump color="#777" selectedColor="#3c9cff" @click="tabbarSwitch"></ht-tabbar>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, getCurrentInstance } from 'vue'
const data = reactive<any>({
  userInfo: {}
})
const currentInstance = ref()
const naviTo = (page: string) => {
  switch (page) {
    case 'setting':
      // uni.navigateTo({
      //   url: '/pages/tabbar/mine/personalSettings/personalSettings'
      // });
      break;
    case 'feedBack':
      // uni.navigateTo({
      //   url: '/pages/tabbar/mine/feedBack/feedBack'
      // });
      break;
    case 'scheduling':
    // uni.navigateTo({
    //   url: '/pages/scheduling/scheduling'
    // });
  }
}
const getUserInfo = () => {
  uni.getStorage({
    key: 'userInfo',
    success: res => {
      Object.assign(data.userInfo, res.data)
    }
  })
}
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

<style lang="scss">
.userbox {
  .user_header {
    background: #5198ff;
    height: 287px;
    width: 100vw;
    position: relative;
    padding: 0 4%;

    .head_box {
      display: flex;
      align-items: center;
      padding: 4.5em 0 0 0.5em;
      color: #fff;

      .head_img {
        margin-right: 20px;
      }

      .head_name {
        font-size: 1.5em;
        font-weight: 500;
      }

      .departments {
        font-size: 1.1em;
      }
    }

    .user_bg {
      height: 100%;
      width: 100%;
      display: block;
      position: absolute;
      top: 0;
      left: 0;
    }

    img {
      width: 100%;
    }
  }

  .user_menu {
    margin-top: -87px;
    padding: 0 4%;
    position: relative;
    background-color: #f8f8f8;
    padding-bottom: 5px;

    .arc {
      width: 100%;
      height: 19px;
      position: absolute;
      top: -18px;
      left: 0;
    }

    .tui-item-box {
      width: 100%;
      display: flex;
      align-items: center;
    }

    .server_box {
      background-color: #fff;
      margin-bottom: 11px;
      border-radius: 5px;
      height: 100px;

      .iconfont {
        margin-right: 8px;
      }

      .u-cell-item {
        border: 1px solid #eee;
      }
    }
  }
}
</style>
