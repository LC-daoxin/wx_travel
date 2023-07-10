
// import { onShareAppMessage } from "@dcloudio/uni-app";
import { dictStore } from '@/store/modules/dict'
import { storeToRefs } from 'pinia'
const dict = dictStore()
const { shareImg } = storeToRefs(dict)


export default {
  // 分享朋友
  onShareAppMessage(res) {
    console.log("share.ts", res);
    return {
      title: shareImg[0].itemName || '我在使用“元气碳”小程序，快来一起用吧！',
      path: '/pages/index/index',
      imageUrl: shareImg[0].itemValue || 'https://dtcx-1318775010.cos.ap-beijing.myqcloud.com/common/logo.png'
    }
  },
  // 分享朋友圈
  onShareTimeline(res) {
    console.log("share.ts", res);
    return {
      title: '元气碳, 绿色出行~',
      path: '/pages/index/index',
    }
  }
};