// pinia
import { defineStore } from 'pinia';

interface Activity {
  _id: string;
  name: string; // 活动名称
  activityImgSrc: Array<any>; // 活动封面图
  bgsize: string; // 活动封面图 背景CSS
  coverImgSrc: Array<any>; // 活动详情置顶图
  location: String; // 活动地点
  time: Array<String>; // 活动时间
  userList: Array<Object>; // 报名用户列表
  activity_type: Number; // 1 线下 2 线上
  onlineInfo: Object; // 线上会议信息
  content: String; // 活动详情
  delFlag: Number; // 0 未删除 1 已删除
  // 其他信息
  [key: string]: any;
}
export const homeStore = defineStore('homeInfo', {
	// 数据仓库
	state: () => ({
    banner: [],
    activity: [] as Array<Activity>,
    activityShow: [] as Array<Activity>,
    restaurant: [] as Array<any>,
	}),
	// 同步异步传值
	actions: {
		setBanner(banner): void {
			this.banner = banner;
		},
    setActivity(activity): void {
      this.activity = activity;
    },
    setActivityShow(activity): void {
      this.activityShow = activity;
    },
    setRestaurant(restaurant): void {
      this.restaurant = restaurant;
    }
	},
});
