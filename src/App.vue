<script setup lang="ts">
import { onMounted } from 'vue'
import { onLaunch, onShow, onHide, onLoad } from "@dcloudio/uni-app";
import { userInfoStore } from '@/store/modules/user'
import { LoginApi } from '@/public/login'
const userInfo = userInfoStore()

onLaunch(async (opt) => {
  console.log("App Launch", opt);
  authorize()
});
onShow(async () => {
  const options = uni.getEnterOptionsSync()
  uni.setStorageSync('enterOptions', options)
  console.log("App Show", options);
  await checkForUpdate()
});
onHide(() => {
  console.log("App Hide");
});
onMounted(() => {
  console.log("App onMounted");
})
onLoad((opt) => {
  console.log("App onLoad", opt);
});
const authorize = () => {
  // 获取用户的当前设置
  uni.getSetting({
    success: res => {
      console.log('获取用户的当前设置', res.authSetting)
      // https://developers.weixin.qq.com/community/develop/doc/000ecabcb642185cfdfb78fe056c01?blockType=1  scope.userInfo 永远为true
      // scope.userLocation 位置授权
      uni.setStorageSync('authSetting', res.authSetting)
    }
  })
  const storageUserInfo = uni.getStorageSync('userInfo') as any;
  console.log('storageUserInfo', storageUserInfo)
  if (storageUserInfo) {
    uni.checkSession({
      success: () => {
        console.log('checkSession success')
        userInfo.updateUser()
      },
      fail: () => {
        console.log('checkSession fail')
        LoginApi.login()
      }
    })
  } else {
    LoginApi.login()
  }
}
// 版本检测更新
async function checkForUpdate() {
  const updateManager = uni.getUpdateManager();
  try {
    await new Promise((resolve, reject) => {
      updateManager.onCheckForUpdate((res) => {
        console.log('是否有新版本', res.hasUpdate);
        if (res.hasUpdate) {
          updateManager.onUpdateReady(async (res) => {
            let modalRes = await uni.showModal({
              title: '更新提示',
              content: '新版本已准备好，是否更新？',
            });
            if (modalRes.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            }
          });
        }
      });
      updateManager.onUpdateFailed(function (res) {
        reject('新的版本下载失败');
      });
    })

  } catch (e) {
    setTimeout(checkForUpdate, 30 * 1000);
  }
}


</script>
<style>
@import './static/iconfont/iconfont.css';
</style>
