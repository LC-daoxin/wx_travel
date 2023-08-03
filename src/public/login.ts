import { baseUrl } from '@/public/config'
const login = (): void => {
	uni.showLoading({
    title: '登录中...'
  })
  uni.login({
    provider: 'weixin', //使用微信登录
    success: res => {
      console.log('wx-login', res)
      if (res.code) {
        const data = {
          code: res.code
        }
        uni.request({
          url: `${baseUrl}/wxlogin`,
          method: 'POST',
          data,
          success: (res: any) => {
            console.log('登录成功信息', res.data)
            if (res.statusCode === 200 && res.data.msg === 'ok') {
              const { token, ...rest } = res.data.data
              // 存入本地
              uni.setStorageSync('userInfo', rest);
              if (token) {
                uni.setStorageSync('userToken', token);
              }
            }
						uni.hideLoading()
          },
					fail: (err: any) => {
						console.log('登录失败信息', err)
						uni.hideLoading()
					}
        })
      }
    },
    fail: err => {
      uni.hideLoading()
    }
  })
}
// 接口
const LoginApi = {
	// 获取用户信息
	login
};

export { LoginApi };
