import { baseUrl } from '@/public/config'
// 获取token// npm install --save js-base64
import { Base64 } from 'js-base64';
import { LoginApi } from '@/public/login'
function getToken(): string {
	const token = uni.getStorageSync('userToken') || '';
	const base64_token = Base64.encode(token + ':');
	return 'Basic ' + base64_token;
}
let times = 0
// 请求
// 请求数据
function request(
	url: string,
	method: 'GET' | 'POST',
	data: string | object | ArrayBuffer
) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: baseUrl + url,
			method,
			data,
			timeout: 5000, // 设置5秒的超时时间
			header: { Authorization: getToken() },
			success: (res: any) => {
				if (res.statusCode == 200) {
					resolve(res.data);
				} else if (res.statusCode == 401) {
					// 没有权限访问接口: 重新登录
					LoginApi.login();
					reject(res);
				} else if (res.statusCode == 400) {
					uni.showToast({
						title: '开发者某个字段或参数填写不对',
						icon: 'none',
						duration: 1000,
					});
					reject(res);
				} else if (res.statusCode == 500) {
					uni.showToast({
						title: '服务器发生未知错误' + res.statusCode + res,
						icon: 'none',
						duration: 1000,
					});
					reject(res);
				} else if (res.statusCode == 202) {
					uni.showToast({ title: res.data.msg, icon: 'none', duration: 1000 });
					reject(res);
				} else {
					uni.showToast({
						title: '服务器发生未知错误' + res.statusCode + res,
						icon: 'none',
						duration: 1000,
					});
					reject(res);
				}
			},
			fail: (err: any) => {
				console.log('request fail', err)
				if(err.errMsg.includes('timeout')){  // 判断是否是超时引起的错误
					if (times < 3) {
						times++
						request(url, method, data);
					} else {
						uni.showToast({
							title: '服务器忙, 请稍后访问',
							icon: 'none',
							duration: 4000,
						});
					}
				} else {
					uni.showToast({
						title: '服务器发生错误' + err,
						icon: 'none',
						duration: 1000,
					});
				}
				reject(err);
			},
		});
	});
}

// 接口
const RequestApi = {
	// 获取用户信息
	getUserInfo: () => request('/userInfo', 'GET', {}),
	// 签到
	signin: () => request('/users/signin', 'POST', {}),
	// 更新用户手机号
	updatePhone: (data) => request('/users/updatePhone', 'POST', data),
	// 更新用户昵称
	updateNickname: (data) => request('/users/updateNickname', 'POST', data),
	// 首页数据
	FrontPage: () => request('/frontpage', 'GET', {}),
	// 获取Banner详情
	getBannerDetail: (id: string) => request(`/banner/info/${id}`, 'GET', {}),
	// 获取活动详情
	getActivityDetail: (id: string) => request(`/activity/info/${id}`, 'GET', {}),
	// 获取活动报名人员列表
	getActivityApplyList: (id: string) => request(`/activity/applyList/${id}`, 'GET', {}),
	// 获取活动列表
	getActivityList: () => request('/activity/showlist', 'POST', {}),
	// 报名活动
	applyActivity: (data) => request('/activity/apply', 'POST', data),
	// 检查是否报名
	checkApply: (data) => request('/activity/check', 'POST', data),
	// 获取播客列表
	getPodcastList: () => request('/podcast/showlist', 'POST', {}),
	// 记录播客播放
	recordPlay: (data) => request('/podcast/play', 'POST', data),
	// 获取餐厅详情
	getRestaurantDetail: (id: string) => request(`/restaurant/info/${id}`, 'GET', {}),
	// 获取骑行排行榜
	getRankList: (data) => request('/travel/rankList', 'POST', data),
	// 新增出行记录
	addTravelRecord: (data) => request('/travel/add', 'POST', data),
	// 获取当前用户出行记录
	getTravelRecord: () => request('/travel/userRecordList', 'POST', {}),
	// 获取商品列表
	getGoodsList: () => request('/shop/showlist', 'POST', {}),
	// 获取商品详情
	getGoodsDetail: (id: string) => request(`/shop/info/${id}`, 'GET', {}),
	// 兑换商品
	exchangeGoods: (data) => request('/shop/exchange', 'POST', data),
	// 获取当前用户兑换记录
	getExchangeRecord: () => request('/exchange/userExchangeList', 'POST', {}),
	// 获取当前用户未核销的兑换数量
	isExchangeNum: () => request('/exchange/isExchangeNum', 'POST', {}),
	// 获取当前用户元气币记录
	getCoinsRecord: () => request('/coin/userRecordList', 'POST', {}),
	// 获取数据字典-Map页
	getDict: () => request('/dictionary/wxlist', 'GET', {}),
};

export { RequestApi, getToken };
