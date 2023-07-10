<template>
  <view class="user-info">
    <tui-list-view>
      <tui-list-cell :lineLeft="0" :hover="false">
        <button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="chooseAvatar">
          <view class="tui-item-box">
            <text class="tui-list-cell_name">头像</text>
            <view class="tui-ml-auto">
              <u-avatar class="avatar" :src="user.avatar.url" open-type></u-avatar>
            </view>
          </view>
        </button>
      </tui-list-cell>
      <tui-list-cell :hover="false">
        <view class="tui-item-box">
          <view class="tui-list-cell_name">昵称</view>
          <view class="tui-ml-auto">
            <input type="nickname" v-model.trim="data.nickName" maxlength="20" class="nickname" placeholder="填写昵称"
              @blur="handleNickname"/>
          </view>
        </view>
      </tui-list-cell>
    </tui-list-view>
    <view class="name-placeholder">昵称限制1-20个字</view>
  </view>
</template>
<script lang="ts">
import share from '@/public/share'
export default {
  mixins: [share]
}
</script>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getToken } from '@/public/request'
import { RequestApi } from '@/public/request'
import { userInfoStore } from '@/store/modules/user'
import { baseUrl } from '@/public/config'
import { storeToRefs } from 'pinia'
const store = userInfoStore()
const { user } = storeToRefs(store)
const data = reactive<any>({
  nickName: ''
})
onLoad(() => {
  data.nickName = user.value.nickName
})
// 选择微信头像
const chooseAvatar = (e) => {
  uni.uploadFile({
    url: `${baseUrl}/users/uploadAvatar`,
    filePath: e.detail.avatarUrl,
    name: 'file',
    header: {
      'Authorization': getToken()
    },
    // formData: {
    //   'userId': id
    // },
    success: function (res) {
      console.log('chooseAvatar', JSON.parse(res.data))
      const { code, data } = JSON.parse(res.data)
      if (code === 0 && data) {
        store.setUserAvatar(data.url)
      }
    }
  })
}
const handleNickname = (e) => {
  console.log('handleNickname', data.nickName, e.detail.value)
  if (data.nickName.length == 0) {
    uni.showToast({
      title: '昵称不能为空',
      icon: 'none'
    })
    data.nickName = user.value.nickName
    return
  }
  RequestApi.updateNickname({ nickName: data.nickName }).then((res: any) => {
    console.log('updateNickname', res)
    const { code, data } = res
    if (code == 0) {
      store.updateUser()
    }
  })
}
</script>
<style>
page {
  background-color: #fbfcfe;
}
</style>
<style lang="scss" scoped>
.user-info {
  .tui-item-box {
    width: 100%;
    display: flex;
    align-items: center;
    height: 40px;
    line-height: 40px;

    .tui-list-cell_name {
      font-size: 15px;
      font-weight: 500;
    }

    .tui-ml-auto {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-left: auto;
      text-align: left;
    }
  }
}

.avatar-wrapper {
  background: #fff;
  padding: 0;

  &::after {
    border: none;
  }
}

.nickname {
  text-align: right;
  // direction: rtl;
  width: 280px;
}

.name-placeholder {
  font-size: 12px;
  color: #999;
  margin-left: 15px;
  margin-top: 5px;
}
</style>
