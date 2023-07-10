// pinia
import { defineStore } from 'pinia';

export const dictStore = defineStore('dictInfo', {
	// 数据仓库
	state: () => ({
    restaurantType: [], // 商品分类
    goodsType: [], // 商品分类
    questionnaire: <any>{}, // 问卷 any
    signIn: <any>[], // 签到
    taskReward: <any>[], // 任务奖励
    news: <any>[], // 出行页新闻
    shareImg: <any>[], // 分享图片
    podcastType: <any>[], // 播客内容类型
    distanceToCoin: <any>[], // 距离转换元气币系数
	}),
	// 同步异步传值
	actions: {
		// 餐厅分类
		setRestaurantType(arr): void {
			this.restaurantType = arr;
		},
    // 商品分类
    setGoodsType(arr): void {
      this.goodsType = arr;
    },
    // 问卷
    setQuestionnaire(item): void {
      this.questionnaire = item as any;
    },
    // 签到
    setSignIn(arr): void {
      this.signIn = arr;
    },
    // 任务奖励
    setTaskReward(arr): void {
      this.taskReward = arr;
    },
    // 出行页新闻
    setNews(arr): void {
      this.news = arr;
    },
    // 分享图片
    setShareImg(arr: any): void {
      this.shareImg = arr;
    },
    // 播客内容类型
    setPodcastType(arr: any): void {
      this.podcastType = arr;
    },
    // 距离转换元气币系数
    setDistanceToCoin(arr: any): void {
      this.distanceToCoin = arr;
    },
	},
});
