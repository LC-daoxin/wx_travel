<script setup lang="ts">
import { onMounted } from 'vue'
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
// 位置
onLaunch(() => {
  console.log("App Launch");
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
onMounted(() => {
  uni.startLocationUpdate({
    success: (res) => {
      console.log('startLocationUpdate', res)
      uni.onLocationChange((lres) => {
        console.log('onLocationChange', lres)
      });
    },
    fail: (err) => {
      console.log('err', err)
    },
  });
})
</script>
<style>
@import './static/iconfont/iconfont.css';
</style>
