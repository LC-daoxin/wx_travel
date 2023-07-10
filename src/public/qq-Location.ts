// 腾讯地图使用
import QQMapWX from '@/public/qqmap-wx-jssdk.js';
var qqmapsdk: any;
// 实例化API核心类
qqmapsdk = new QQMapWX({
	key: 'UVHBZ-SWH3U-NDGVP-GHRPB-BFYQ7-72F27',
});

export function calculateDistance(start, end, mode = 'straight'): Promise<any> {
	return new Promise((resolve, reject) => {
		qqmapsdk.calculateDistance({
			mode: mode, // ‘driving’（驾车）、‘walking’（步行），默认：'walking’  'straight' 直线距离
			from: start,
      to: end,
			success: function(res) {
				if (res.status == 0) {
					resolve(res.result.elements)
				} else {
					console.log(res.status, res.message)
				}
			},
			fail: function(error) {
				console.error(error);
			}
    });
	});
}
