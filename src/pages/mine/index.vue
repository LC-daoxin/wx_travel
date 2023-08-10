<template>
  <view>
    <view class="userbox">
      <view class="user_header">
        <view class="head_box" @click="toUserInfoPage">
          <u-avatar class="head_img" size="60" :src="user.avatar.url"></u-avatar>
          <view class="info">
            <view class="head_name">{{ user.nickName }}</view>
            <view class="phone">{{ hidePhone(user.phone) }}</view>
          </view>
        </view>
        <image class="user_bg" src="/static/images/mine/user-bg.png"></image>
      </view>
      <view class="user_menu">
        <view class="server_box">
          <tui-list-view unlined="all">
            <tui-list-cell @click="naviTo('coins')" :arrow="true">
              <view class="tui-item-box">
                <tui-icon name="wallet" :size="24" color="#ff7900"></tui-icon>
                <text class="tui-list-cell_name" style="margin-left: 3px;">元气币</text>
                <view class="tui-ml-auto">
                  <u-image :showLoading="true" src="/static/images/icons/htb.png" width="18px" height="18px"></u-image>
                  <view class="ht-coins">{{ user.carbonCoin }}</view>
                </view>
              </view>
            </tui-list-cell>
            <tui-list-cell unlined @click="naviTo('qrcode')" :arrow="true">
              <view class="tui-item-box">
                <tui-icon name="coupon" style="margin-left: -4px;" :size="24" color="#ff7900"></tui-icon>
                <view class="tui-list-cell_name">兑换券</view>
                <view class="tui-ml-auto">
                  <view class="tui-badge-box">
                    <tui-badge v-if="exchangeNum > 0" type="warning">{{ exchangeNum }}</tui-badge>
                  </view>
                </view>
              </view>
            </tui-list-cell>
            <!-- <tui-list-cell @click="naviTo('setting')" :arrow="true">
              <view class="tui-item-box">
                <tui-icon name="service-fill" :size="24" color="#5677fc"></tui-icon>
                <view class="tui-list-cell_name">服务窗</view>
              </view>
            </tui-list-cell>
            <tui-list-cell unlined @click="naviTo('setting')" :arrow="true">
              <view class="tui-item-box">
                <tui-icon name="explore-fill" :size="24" color="#19be6b"></tui-icon>
                <view class="tui-list-cell_name">发现</view>
                <view class="tui-ml-auto">
                  <tui-tag padding="10rpx 12rpx" margin="0 30rpx 0 0" size="24rpx" type="light-green"
                    shape="circle">探索发现</tui-tag>
                </view>
              </view>
            </tui-list-cell> -->
          </tui-list-view>
        </view>
      </view>
      <view class="official-box">
        <official-account class="official"></official-account>
      </view>
      <view class="footer">
        <view class="content text">Copyright © 2021-2023 Zero Carbon Plus Technology</view>
        <view class="version text">版本: 1.2.0</view>
      </view>
    </view>
  </view>
  <tui-bottom-popup :zIndex="1002" :maskZIndex="1001" :height="200" :show="popupShow" @close="closePopup">
    <view class="phonenumber">
      <tui-icon class="phone-close" name="shut" :size="20" @click="closePopup"></tui-icon>
      <view class="phone-title"><tui-icon class="friendadd" name="friendadd" color="green" :size="18"></tui-icon>加入低碳出行, 成为伙伴一起助力碳中和~</view>
      <tui-form-button background="#c3a769" class="phone-btn" type="primary" height="36px" :size="28"
        radius="15px" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
        <tui-icon class="phone-icon" color="#fff" margin="10" :size="14" name="voipphone"></tui-icon>一键授权手机号码
      </tui-form-button>
    </view>
  </tui-bottom-popup>
</template>
<script lang="ts">
import share from '@/public/share'
export default {
  mixins: [share]
}
</script>
<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { userInfoStore } from '@/store/modules/user'
import { RequestApi } from '@/public/request'
import { storeToRefs } from 'pinia'
const store = userInfoStore()
const { user } = storeToRefs(store)
const exchangeNum = ref(0)
onShow(() => {
  RequestApi.isExchangeNum().then((res: any) => {
    const { code, result } = res
    if (code == 0) {
      exchangeNum.value = result.total
    }
  })
  store.updateUser().then((res: any) => {
    if (!user.value.phone) {
      popupShow.value = true
    }
  })
  console.log('user', user.value)
})
const popupShow = ref(false)
const naviTo = (page: string) => {
  switch (page) {
    case 'coins':
      uni.navigateTo({
        url: '/pages/mine/myCoins'
      });
      break;
    case 'qrcode':
      uni.navigateTo({
        url: '/pages/mine/qrcode'
      });
      break;
  }
}
const getPhoneNumber = (e) => {
  console.log('getPhoneNumber', e)
  if (e.errMsg == "getPhoneNumber:ok") {
    popupShow.value = false
    RequestApi.updatePhone({ code: e.code }).then((res: any) => {
      console.log('updatePhone', res)
      const { code, data } = res
      if (code == 0) {
        store.updateUser()
        // 
      }
    })
  }
}
const closePopup = () => {
  popupShow.value = false
}
const toUserInfoPage = () => {
  uni.navigateTo({
    url: '/pages/mine/userinfo'
  })
}
const hidePhone = (phone: string) => {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}
</script>

<style lang="scss">
.userbox {
  overflow-x: hidden;
  height: 100vh;
  background-color: #f5f6f9;

  .user_header {
    position: relative;
    width: 100%;
    height: 240px;
    overflow: hidden;
    z-index: 99;
    border: none;

    &:after {
      width: 160%;
      height: 240px;
      position: absolute;
      /*设置水平居中*/
      left: -30%;
      top: 0;
      z-index: -1;
      content: '';
      border-radius: 0 0 50% 50%;
      background: linear-gradient(160deg, #5c9bfa, rgb(181, 226, 250) 50%);
    }

    .head_box {
      display: flex;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: flex-start;
      color: #fff;
      padding: 0 8vw;
      z-index: 1000;
      .head_img {
        margin-right: 20px;
      }

      .head_name {
        font-size: 1.1em;
        margin-left: 12px;
        font-weight: 500;
      }
      .phone {
        font-size: 0.8em;
        margin-left: 12px;
      }
    }

    .user_bg {
      height: 100%;
      width: 100%;
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
    }

    img {
      width: 100%;
    }
  }

  .user_menu {
    margin-top: 15px;
    padding: 0 4%;
    position: relative;
    padding-bottom: 5px;
    background-color: #f5f6f9;

    .arc {
      width: 100%;
      height: 19px;
      position: absolute;
      top: -18px;
      left: 0;
    }

    .server_box {
      background-color: #fff;
      margin-bottom: 11px;
      padding: 10px;
      border-radius: 8px;
      height: 100%;

      .tui-item-box {
        width: 100%;
        display: flex;
        align-items: center;

        tui-icon {
          margin-right: 10px;
        }

        .ht-coins {
          display: inline-block;
          font-size: 14px;
          font-weight: 600;
          margin: 0 30rpx 0 0;
          margin-left: 3px;
        }

        .tui-ml-auto {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-left: auto;
          text-align: left;

          .tui-badge-box {
            margin: 0 30rpx 0 0;
          }
        }
      }
    }
  }

  .official-box {
    padding: 0 4%;

    .official {
      height: 150rpx;
    }
  }


}

.phonenumber {
  height: 200px;
  padding: 20px;
  position: relative;
  .phone-close {
    position: absolute;
    right: 10px;
    top: 8px;
  }
  .friendadd {
    margin-right: 5px;
  }
  .phone-title {
    margin-bottom: 16px;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
  }
  .phone-btn {
    display: flex;
    align-items: center;
  }
  .phone-icon {
    display: inline-block;
    margin-right: 10px;
  }
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // padding-bottom: calc(50px + env(safe-area-inset-bottom));
  .text {
    font-size: 24rpx;
    color: #A7A7A7;
    line-height: 1;
    text-align: center;
    &:first-child {
      margin-bottom: 5px;
    }
  }
}
</style>
