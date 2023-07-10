// pinia
import { defineStore } from 'pinia';
import { RequestApi } from '@/public/request'
import { LoginApi } from '@/public/login'

interface Avatar {
  url: string; // COS头像地址
  name: string; // 头像名称
  localUrl: string; // 本地头像地址
}
interface UpdateRecord {
  phone: Number; // 手机号
  avatar: Number; // 头像
  nickName: Number; // 昵称
}
interface User {
  _id: string; // 用户id
  openid: string; // 用户openid
  session_key: string; // 用户session_key
  nickName: string; // 用户昵称
  avatar: Avatar; // 头像信息
  phone: string; // 手机号
  updateRecord: UpdateRecord; // 更新记录
  collectRecord: Array<Object>; // 收藏记录
  carbonCoin: number; // 元气币
  stepRecord: Array<Object>; // 步数记录
  activityRecord: Array<Object>; // 活动报名记录
  isQuestionnaire: boolean; // 是否填写问卷
  questionnaireRecord: Array<Object>; // 问卷填写记录
  signInfo: Object; // 签到信息
  greenCampus: Object; // 绿色校园信息
  address: Array<Object>; // 地址信息
  // 其他信息
  [key: string]: any;
}

export const userInfoStore = defineStore('userInfo', {
	// 数据仓库
	state: () => ({
		// 用户信息
		user: {
      _id: '', // 用户id
      nickName: '未登录', // 用户昵称
      avatar: {
        url: '', // COS头像地址
        name: '', // 头像名称
        localUrl: '', // 本地头像地址
      }, // 头像信息
      phone: '', // 手机号
      updateRecord: <UpdateRecord>{
        phone: 0, // 手机号
        avatar: 0, // 头像
        nickName: 0, // 昵称
      }
    } as User,
	}),
	// 同步异步传值
	actions: {
		// 设置用户信息
		setUser(info: User): void {
      console.log('store setUser', info)
			this.user = info;
		},
    // 设置用户头像
    setUserAvatar(avatar: string): void {
      this.user.avatar.url = avatar;
    },
    // 更新用户信息
    updateUser(): Promise<any> {
      return new Promise((resolve, reject) => {
        RequestApi.getUserInfo().then((res: any) => {
          if (res.msg === 'ok') {
            // 存入本地
            this.setUser(res.data);
            uni.setStorageSync('userInfo', res.data);
            resolve(res.data);
          }
        }).catch((err: any) => {
          LoginApi.login();
        })
      })
    }
	},
});
