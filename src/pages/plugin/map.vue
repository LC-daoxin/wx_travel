<template>
  <!-- 当前位置 => 目的地 -->
  <view class="search">
    <view class="search-box">
      <view class="start-location" @click="chooseAddress(startObj, 0)">
        <tui-icon class="icon" name="gps" color="#3cb27c" bold size="14"></tui-icon>
        <text class="address">{{ startObj.name || startObj.address }}</text>
      </view>
      <view class="destination" @click="chooseAddress(endObj, 1)">
        <tui-icon name="gps" color="#f87e54" bold size="14"></tui-icon>
        <text class="address">{{ endObj.name || endObj.address || '请输入您的目的地' }}</text>
      </view>
    </view>
    <u-scroll-list v-if="endObj.latitude" :indicator="false">
      <view class="trip-mode">
        <view v-for="(item, index) in travelArr" :class="['trip-item', { 'selected': item.type == travelType }]"
          @click="chooseTravelType(item)" :style="{ '--color': item.color || '#2b4bf2' }" :key="index">
          <tui-icon custom-prefix="iconfont" :name="item.icon" size="22" color="#2b4bf2"></tui-icon>
          <view class="trip-content" >
            <view class="coin">{{ calculateCoins(travel[item.type].distance, item.type) }} CC</view>
            <view class="co2">
              {{ (travel[item.type].distance / 1000).toFixed(2) }} KM
            </view>
          </view>
        </view>
      </view>
    </u-scroll-list>
  </view>
  <!-- 自定义的导航 -->
  <view class="map-box">
    <map id="myMap" :style="{ height: endObj.latitude ? 'calc(100vh - 362px)' : 'calc(100vh - 302px)' }"
      :show-location="true" :enable-building="true" :enable-poi="true" :latitude="addressData.data.lat"
      :longitude="addressData.data.lng" :markers="markers" :include-points="markers" :polyline="data.polyline"
      :scale="data.scale" @markertap="markerTap" @tap="tapMap"></map>
  </view>
  <!-- 底部 -->
  <view class="map-Details">
    <view class="message">
      <view v-if="data.newsList.length > 0" class="tui-rolling-news">
        <u-image src="/static/images/icons/broadcast.png" width="18px" height="18px"></u-image>
        <swiper vertical autoplay circular interval="4000" class="tui-swiper">
          <swiper-item v-for="(item, index) in data.newsList" :key="index" class="tui-swiper-item">
            <view class="tui-news-item" @tap='detail'>{{ item }}</view>
          </swiper-item>
        </swiper>
      </view>
    </view>
    <view class="setout">
      <view v-if="!endObj.latitude" class="btn-info">
        <view class="travel-info">
          <view class="distance block">
            <view class="title">累积出行距离</view>
            <view class="total-distance num">{{ travelRecord.distance }}<view class="km">公里</view>
            </view>
          </view>
          <view class="coins block">
            <view class="title">出行获得总元气币</view>
            <view class="total-coins num">{{ travelRecord.carbonCoin }}<view class="cc">CC</view>
            </view>
          </view>
        </view>
        <tui-form-button background="#72adf7" borderColor="#72adf7" class="select-end" type="primary" width="110px"
          height="36px" :size="28" radius="15px" @click="chooseAddress(endObj, 1)">
          <tui-icon class="select-icon" color="#fff" margin="10" :size="14" name="search-2"></tui-icon>选择目的地
        </tui-form-button>
      </view>
      <view v-else class="btn-start">
        <view class="time">
          <view class="title">时间</view>
          <view class="timer">{{ clock.clock1 }}:{{ clock.clock2 }}:{{ clock.clock3 }}</view>
        </view>
        <view class="btn-content">
          <tui-form-button v-if="!data.startRecord" background="#72adf7" borderColor="#72adf7" class="record-btn"
            type="primary" width="60px" height="60px" radius="50%" :size="26" bold @click="startTravel">
            出发记录
          </tui-form-button>
          <view v-if="data.startRecord" :class="['btn-item-box stop-btn btn-b', { 'touch': data.touchstate }]"
            :style="{ '--progress': data.progress + '%' }">
            <tui-form-button background="#ff5722" borderColor="#ff5722" type="primary" width="60px" height="60px"
              radius="50%" @touchstart="touchStop" @touchend="touchEndStop">
              <u-image src="/static/images/map/stop.png" width="25px" height="25px"></u-image>
            </tui-form-button>
            <view class="label">长按结束</view>
          </view>
        </view>

        <view :class="['right']"></view>
      </view>
      <view class="navigation-history">
        <view class="h-title">最近记录</view>
        <view v-if="travelRecord.record.length > 0" class="h-body">
          <view class="left">
            <view class="photo">
              <u-image src="https://dtcx-1318775010.cos.ap-beijing.myqcloud.com/common/map/r1.png" width="40px"
                height="40px"></u-image>
            </view>
            <view class="position" :style="{ '--width': windowWidth + 'px' }">
              <view class="start pl1">
                <tui-icon class="icon" name="gps" color="#3cb27c" bold size="12"></tui-icon>{{
                  travelRecord.record[0].startPlace.name || travelRecord.record[0].startPlace.address }}
              </view>
              <view class="end pl1">
                <tui-icon class="icon" name="gps" color="#ff5722" bold size="12"></tui-icon>{{
                  travelRecord.record[0].errorDistance <= 100 ? (travelRecord.record[0].endPlace.name ||
                    travelRecord.record[0].endPlace.address) : (travelRecord.record[0].actEnd.name ||
                      travelRecord.record[0].actEnd.address) }} </view>
              </view>
            </view>
            <view class="info">
              <view class="distance">{{ (travelRecord.record[0].distance / 1000).toFixed(2) }}<view class="units">公里
                </view>
              </view>
              <view class="co2">{{ calculateCoins(travelRecord.record[0].distance, travelRecord.record[0].travelType) }}
                <view class="units">CC</view>
              </view>
            </view>
          </view>
          <view v-else class="no-participant">
            <view class="icon">
              <u-image src="/static/images/activity/no.png" :width="20" :height="20"></u-image>
            </view>
            <view class="text">暂无记录</view>
          </view>
        </view>
      </view>
    </view>
    <tui-modal :show="showModal" @cancel="resetPage" width="320px" :padding="0" :custom="true">
      <view class="tui-modal-custom">
        <u-image :src="modalImgUrl" :width="320" :radius="12" :height="507" mode="aspectFit"></u-image>
        <view class="modelBtn">
          <tui-form-button class="save" height="30px" width="90px" borderColor="#fff" size="24"
            background="linear-gradient(110deg, #51b4ef, #9ccdff)" radius="30px"
            @click="savePoster">保存海报</tui-form-button>
          <tui-form-button height="30px" width="90px" borderColor="#fff" size="24"
            background="linear-gradient(110deg, #51b4ef, #9ccdff)" radius="30px" open-type="share">分享给朋友</tui-form-button>
        </view>
      </view>
    </tui-modal>
    <tui-poster :width="560" :height="890" ref="posterRef" @ready="ready"></tui-poster>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs } from 'vue'
import { onShow, onShareAppMessage } from "@dcloudio/uni-app"
import { RequestApi } from '@/public/request'
import { calculateDistance } from '@/public/qq-Location'
import { baseUrl } from '@/public/config'
import { dictStore } from '@/store/modules/dict'
import { storeToRefs } from 'pinia'
const dict = dictStore()
const { news, distanceToCoin } = storeToRefs(dict)
// 到这去地图详情
interface Mapdetail {
  accuracy?: number; // 位置的精确度
  speed?: number; // 速度，浮点数，单位m/s
  longitude: number; // 经度，浮点数，范围为-180~180，负数表示西经
  latitude: number; // 纬度，浮点数，范围为-90~90，负数表示南纬
  address?: String; // 地址信息
  [propName: string]: any
}
const windowWidth = uni.getSystemInfoSync().windowWidth
// 起止 位置标记
let markers = reactive<any>([])

// 本地缓存的位置信心
let addressData = reactive({
  data: { address: '', lat: 0, lng: 0 } // lat: 39.909, lng: 116.39742
})
const startObj = reactive(<Mapdetail>{})
const endObj = reactive(<Mapdetail>{})
type Trip = 'walking' | 'bicycling' | 'driving' // | 'transit'
const travelType = ref<Trip>('walking')
const travelArr = reactive<any>([])
const travel = reactive<any>({
  walking: {
    distance: 0, // 距离 m
    duration: 0 // 分钟
  },
  bicycling: {
    distance: 0,
    duration: 0
  },
  driving: {
    distance: 0,
    duration: 0
  }
})
const travelRecord = reactive<any>({
  // 总距离
  distance: 0,
  // 总元气币
  carbonCoin: 0,
  // 记录
  record: []
})
interface ClockObj {
  timer: any,
  clock1: string | number,
  clock2: string | number,
  clock3: string | number,
  hour: number,
  minute: number,
  second: number
}
interface RecentRecord {
  startTime: Date | String,
  endTime: Date | String,
  startPlace: Mapdetail,
  endPlace: Mapdetail
}
const clock = reactive<ClockObj>({
  timer: null,
  clock1: '00',
  clock2: '00',
  clock3: '00',
  hour: 0,
  minute: 0,
  second: 0
})
const data = reactive<any>({
  startRecord: false, // 开始记录
  touchstate: false, // 停止按钮 是否长按状态
  touchTimer: null,
  progressTimer: null,
  timeOut: 0,
  progress: 0,
  scale: 16,
  travelResultArr: [
    {
      type: 'walking',
      icon: 'icon-footprint',
      coins: 0,
      color: '#71a7a4'
    }, {
      type: 'bicycling',
      icon: 'icon-zihangche31',
      coins: 0,
      color: '#899bf6'
    }, {
      type: 'driving',
      icon: 'icon-qiche',
      coins: 0,
      color: '#d26f85'
    }
    // {
    //   type: 'transit',
    //   icon: 'icon-ditie',
    //   coins: 0,
    //   co2: 0,
    //   color: '#d08e3d'
    // }
  ],
  polyline: [{
    points: [],
    color: "#18b566",
    width: 5,
    // dottedLine: true,
    arrowLine: true
  }],
  newsList: [],
  coors: {
    'walking': '',
    'bicycling': '',
    'driving': ''
  }
})
let mapCtx: any = uni.createMapContext('myMap')
onShow(() => {
  const checkResult = checkUserLocation()
  if (!checkResult) {
    uni.switchTab({
      url: '/pages/index/index'
    })
    return false
  }
  getTravelList()
  showMapinit()
  setNewsList()
})
function showMapinit() {
  const currentTravel = uni.getStorageSync('currentTravel')
  if (currentTravel && currentTravel.condition == 1) {
    // 判断 进行中的行程时间 与 当前时间差 是否大于12小时
    const time = new Date().getTime() - currentTravel.startTime
    if (time > 12 * 60 * 60 * 1000) {
      uni.removeStorageSync('currentTravel')
      uni.showToast({
        title: '上次行程时间已超过12小时, 请重新开始行程',
        icon: 'none',
        duration: 4000
      })
      initMap()
    } else {
      uni.showToast({
        title: '继续行程ing',
        icon: 'none',
        duration: 1000
      })
      // 继续上次行程
      startObj.latitude = currentTravel.startPlace.latitude
      startObj.longitude = currentTravel.startPlace.longitude
      startObj.address = currentTravel.startPlace.address
      startObj.name = currentTravel.startPlace.name
      endObj.latitude = currentTravel.endPlace.latitude
      endObj.longitude = currentTravel.endPlace.longitude
      endObj.address = currentTravel.endPlace.address
      endObj.name = currentTravel.endPlace.name
      travelType.value = currentTravel.travelType
      // time 转换为 时分秒
      const hour = Math.floor(time / (60 * 60 * 1000))
      const minute = Math.floor((time - hour * 60 * 60 * 1000) / (60 * 1000))
      const second = Math.floor((time - hour * 60 * 60 * 1000 - minute * 60 * 1000) / 1000)
      clock.hour = hour
      clock.minute = minute
      clock.second = second
      clock.clock1 = hour < 10 ? '0' + hour : hour
      clock.clock2 = minute < 10 ? '0' + minute : minute
      clock.clock3 = second < 10 ? '0' + second : second
      data.startRecord = true
      data.timeOut = 0
      startHandler() // 继续计时
      mapCtx.moveToLocation({
        latitude: startObj.latitude,
        longitude: startObj.longitude,
        success: (sres: any) => {
          travelArr.length = 0
          travelArr.push(...data.travelResultArr)
          addMarkers(startObj.latitude, startObj.longitude, 0)
          addMarkers(endObj.latitude, endObj.longitude, 1)
          getMapLine('walking')
          getMapLine('bicycling')
          getMapLine('driving')
        },
        fail: (err: any) => {
          console.log(err)
        }
      })
    }
  } else {
    initMap()
  }
}
// 判断是否授权地理位置
function checkUserLocation() {
  return new Promise((resolve, reject) => {
    uni.getSetting({
      success(res) {
        console.log(res)
        // 判断是否存在 scope.userLocation 属性
        if (res.authSetting.hasOwnProperty('scope.userLocation')) {
          // 判断是否授权
          if (res.authSetting['scope.userLocation']) {
            resolve(true)
          } else {
            openUserLocation().then((res: any) => {
              resolve(res)
            })
          }
        } else {
          resolve(true)
        }
      },
      fail(err) {
        resolve(false)
      }
    })
  })
}
// 提示用户开启地理位置
function openUserLocation() {
  return new Promise((resolve, reject) => {
    uni.showModal({
      title: '提示',
      content: '您未开启地理定位无法使用低碳出行功能，是否立即开启？',
      showCancel: true,
      success: (res) => {
        console.log('showModal', res)
        if (res.confirm) {
          uni.openSetting({
            success(v) {
              console.log('openSetting success', v)
              resolve(true)
            },
            fail(err) {
              console.log('openSetting fail', err)
            }
          });
        }
        if (res.cancel) {
          // 跳转回首页
          uni.switchTab({
            url: '/pages/index/index'
          })
        }
      }
    })
  })
}

// 进入后获取当前位置 初始化Map
function initMap(isReset?: boolean) {
  if (isReset) {
    mapCtx = uni.createMapContext('myMap')
  }
  uni.getLocation({
    type: 'gcj02',
    altitude: true,
    isHighAccuracy: true,
    success: function (res) {
      console.log('当前位置的经度：' + res.longitude);
      console.log('当前位置的纬度：' + res.latitude);
      getAddressName(res.latitude, res.longitude, startObj)
      startObj.longitude = res.longitude
      startObj.latitude = res.latitude
      startObj.speed = res.speed
      startObj.accuracy = res.accuracy
      startObj.destination = ''
      mapCtx.moveToLocation({
        latitude: res.latitude,
        longitude: res.longitude,
        success: (sres: any) => {
          addMarkers(res.latitude, res.longitude, 0)
        },
        fail: (err: any) => {
          console.log(err)
        }
      })
    },
    fail: function (err) {
      console.log(err)
      if (err.errMsg == 'getLocation:fail auth deny') {
        openUserLocation()
      }
    }
  })
}
// 获取当前用户出行历史记录
function getTravelList() {
  RequestApi.getTravelRecord().then((res: any) => {
    console.log(res)
    const { code, result: { items } } = res
    if (code == 0) {
      travelRecord.record = items
      if (items.length > 0) {
        // 遍历items 累加distance
        let distance = 0
        let carbonCoin = 0
        items.forEach((item: any) => {
          distance += item.distance
          carbonCoin += calculateCoins(item.distance, item.travelType)
        })
        travelRecord.distance = (distance / 1000).toFixed(1)
        travelRecord.carbonCoin = carbonCoin
      }
    }
  })
}

// 获取当前位置
function getCurLocation() {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: 'gcj02',
      altitude: true,
      isHighAccuracy: true,
      success: function (res) {
        console.log('获取当前位置', res);
        resolve({
          longitude: res.longitude,
          latitude: res.latitude
        })
      }
    })
  })
}
// 选择地点
const chooseAddress = (Obj, index) => { // index 0 起点  1 终点
  if (data.startRecord) {
    uni.showToast({
      title: '正在记录中，无法修改',
      icon: 'none',
      duration: 2000
    })
    return
  }
  uni.chooseLocation({
    latitude: Obj.latitude,
    longitude: Obj.longitude,
    success: async function (cres) {
      console.log('选择地点', cres)
      Obj.name = cres.name
      Obj.address = cres.address
      Obj.latitude = cres.latitude
      Obj.longitude = cres.longitude
      // 判断起点 和 终点 坐标是否是相同坐标 进行拦截
      if (startObj.latitude == endObj.latitude && startObj.longitude == endObj.longitude) {
        uni.showToast({
          title: '起点与终点不能相同',
          icon: 'none',
          duration: 2000
        })
        Obj.name = ''
        Obj.address = ''
        Obj.latitude = 0
        Obj.longitude = 0
        return
      }
      if (endObj.latitude && endObj.longitude) {
        let seEes = await getStartEndDistance()
        if (seEes[0].distance < 200) {
          uni.showToast({
            title: '起点与终点距离不能小于200米',
            icon: 'none',
            duration: 2000
          })
          endObj.name = ''
          endObj.address = ''
          endObj.latitude = 0
          endObj.longitude = 0
          return
        }
        getMapLine('walking')
        getMapLine('bicycling')
        getMapLine('driving')
      }
      addMarkers(Obj.latitude, Obj.longitude, index)
    }
  })
}
// 选择出行方式
const chooseTravelType = (item) => {
  if (data.startRecord) {
    uni.showToast({
      title: '正在记录中，无法修改',
      icon: 'none',
      duration: 2000
    })
    return
  }
  travelType.value = item.type
  data.polyline[0].color = travel[item.type].color
  data.polyline[0].points = travel[item.type].points
}
// 通过经纬度 转换成 中文地址
const getAddressName = (latitude, longitude, Obj) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/',
      data: {
        key: 'UVHBZ-SWH3U-NDGVP-GHRPB-BFYQ7-72F27',
        location: latitude + ',' + longitude
      },
      success: (res) => {
        const { status, result, message } = res.data as any
        console.log('getAddressName', res.data);
        if (status == 0) {
          if (Obj) {
            Obj.name = result.formatted_addresses.recommend
            Obj.address = result.address
            travelArr.length = 0
            travelArr.push(...data.travelResultArr)
          }
          resolve(result)
        } else {
          reject(message)
          console.log(message)
        }
      }
    });
  })
}
// 获取导航路线 步行/骑行/驾车(油车)/公交
const getMapLine = (type: Trip, draw: boolean = true) => { // walking bicycling driving transit
  return new Promise((resolve, reject) => {
    let params = {
      key: 'UVHBZ-SWH3U-NDGVP-GHRPB-BFYQ7-72F27',
      from: startObj.latitude + ',' + startObj.longitude,
      to: endObj.latitude + ',' + endObj.longitude,
    }
    uni.request({
      url: `https://apis.map.qq.com/ws/direction/v1/${type}/`,
      data: params,
      success: (res) => {
        console.log('导航路线 getDriving', res)
        const { status, result, message } = res.data as any
        if (status == 0) {
          // 绘制路线
          let coors = result.routes[0].polyline
          let pl: any = []
          //坐标解压（返回的点串坐标，通过前向差分进行压缩）
          var kr = 1000000;
          for (var i = 2; i < coors.length; i++) {
            coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
          }
          //将解压后的坐标放入点串数组pl中
          for (var i = 0; i < coors.length; i += 2) {
            pl.push({
              latitude: coors[i],
              longitude: coors[i + 1]
            })
          }
          let color: String
          data.coors[type] = getCoorsString(coors);
          switch (type) {
            case 'walking': color = '#18b566'; break;
            case 'bicycling': color = '#41b7e5'; break;
            case 'driving': color = '#ff9800'; break;
          }
          if (travelType.value == type) {
            data.polyline[0].color = color
            data.polyline[0].points = pl
          }
          // 记录距离 及 对应的元气币
          travel[type].color = color
          travel[type].points = pl
          travel[type].distance = result.routes[0].distance
          travel[type].duration = result.routes[0].duration
          resolve(result)
        } else {
          uni.showToast({
            title: `报错' + ${status}: ${message}`,
            icon: 'none',
            duration: 2000
          })
          console.log(params, status, message)
        }
      }
    });
  })
}
// 精简坐标点
function getCoorsString(coors) {
  let len = coors.length
  let num = 2
  if (len < 200) {
    num = 2
  } else if (len >= 200 && len <= 800) {
    num = 4
  } else {
    num = 4 + Math.floor(len / 100)
  }
  console.log('coors', len, num, Math.floor(len / num))
  const result = coors.reduce((acc, cur, index, arr) => {
    if (index % num === 0) {
      const lat = arr[index]
      const lng = arr[index + 1]
      const str = `${lat},${lng}`
      if (index === 0) {
        return str
      } else {
        return `${acc}|${str}`
      }
    } else {
      return acc
    }
  }, '')
  return result
}
// 计算出 不同交通模式的碳减排 碳积分
const calculateCoins = (distance: number, type: string) => {
  let km = distance / 1000
  let coins: number = 0
  try {
    switch (type) {
      case 'walking': coins = Math.round(km * Number(distanceToCoin.value[0].itemValue)); break;
      case 'bicycling': coins = Math.round(km * Number(distanceToCoin.value[1].itemValue)); break;
      case 'driving': coins = 0; break;
    }
  } catch (error) {
    console.log('distanceToCoin Error', error)
  }
  return Math.floor(coins)
}
// 点击地图触发
function tapMap(EventHandle) {
  console.log('tapMap', EventHandle)
  // addMarkers(EventHandle.detail.latitude, EventHandle.detail.longitude)
}
// 添加地图标识 起始点
function addMarkers(latitude, longitude, index) {
  markers[index] = {
    id: index + 1,
    iconPath: index == 1 ? '/static/images/map/end.png' : '/static/images/map/start.png',
    width: 40,
    height: 40,
    joinCluster: true, // 指定了该参数才会参与聚合
    label: {
      width: 40,
      height: 20,
      borderWidth: 0,
      borderRadius: 0,
      bgColor: '#ffffff00',
      // content: index == 1 ? '终点' : '起点',
      textAlign: 'center',
      color: '#3a75f3'
    },
    latitude,
    longitude
  }
  console.log('markers', markers)
  mapCtx.addMarkers({
    markers: markers,
    clear: true,
    success(sres) {
      console.log('success', sres)
    }
  })
}
// 点击地图标记点触发
function markerTap(event: any) {
  console.log('markerTap', event)
}
// 开始导航出发
function startTravel() {
  if (travelType.value == 'driving') {
    uni.showToast({
      title: '汽车出行仅作对比参考, 不支持记录',
      icon: 'none',
      duration: 3000
    })
    return
  }
  uni.showToast({
      title: '开始记录',
      icon: 'none',
      duration: 1500
    })
  data.startRecord = true
  startHandler()
  uni.setStorage({
    key: 'currentTravel', // 最近一次导航 进行中
    data: {
      condition: 1, // 1: 导航ing 2: 导航结束
      travelType: travelType.value,
      startTime: new Date().getTime(),
      endTime: null,
      startPlace: startObj, // 导航选择的起点
      endPlace: endObj, // 导航选择的终点
      actEnd: null
    },
    success: function () {
      console.log('travelRecord success');
    }
  });
}
// 长按停止按钮
function touchStop(e) {
  data.touchstate = true
  // 阻止它的默认事件
  e.preventDefault()
  data.touchTimer = setTimeout(function () {
    data.timeOut = 1
  }, 1000)
  data.progressTimer = setInterval(() => {
    data.progress = data.progress + 4
    if (data.progress >= 100) {
      data.progress = 0
      touchEndStop()
    }
  }, 40)
}
// 松开停止按钮
async function touchEndStop() {
  clearTimeout(data.touchTimer)
  clearTimeout(data.progressTimer)
  if (data.timeOut == 0) { // 未达到1秒长按
  } else {
    data.timeOut = 0 // 长按完毕
    clearInterval(clock.timer)
    data.startRecord = false
    // 计算当前开始时间到结束时间是否小于一分钟
    let currentTravel = uni.getStorageSync('currentTravel')
    let startTime = currentTravel.startTime
    let endTime = new Date().getTime()
    let time = endTime - startTime
    if (time < 60000) { // 60000
      uni.showToast({
        title: '行程时间太短(小于1分钟)，不支持记录',
        icon: 'none',
        duration: 5000
      })
      resetTravelData()
      return
    }
    let startEndRes = await getStartCurEndDistance()
    if (startEndRes[0].distance < 100) { // 距离开始位置小于100米
      uni.showToast({
        title: '行程距离太短(小于100米)，不支持记录',
        icon: 'none',
        duration: 5000
      })
      resetTravelData()
      return
    }

    // 修改currentTravel当前行程状态为结束
    currentTravel.condition = 2
    uni.setStorageSync('currentTravel', currentTravel)

    let cRes = await getCalculateDistance()
    let isCurEnd = false
    let curEnd: any
    if (cRes[0].distance > 50) { // 误差大于50米
      isCurEnd = true
      console.log('实际结束位置 距离 导航结束位置 误差大于50米')
      curEnd = {
        latitude: cRes[0].to.lat,
        longitude: cRes[0].to.lng
      }
      // 测试代码
      // curEnd.latitude += 0.001 // 上线时删除
      getStaticMap(curEnd) // 根据实际结束位置 获取静态地图
    } else {
      getStaticMap({}) // 获取静态地图
    }

    getCurLocation().then(async (cur: any) => {

      const curResult: any = await getAddressName(cur.latitude, cur.longitude, null)
      cur.name = curResult.formatted_addresses.recommend
      cur.address = curResult.address
      let curLine: any
      if (isCurEnd) {
        curLine = await getCurTravel(travelType.value, curEnd)
      }
      let params = {
        startTime: currentTravel.startTime,
        endTime: new Date().getTime(),
        startPlace: currentTravel.startPlace, // 导航选择的起点 / 默认为实际出发 actStart
        endPlace: currentTravel.endPlace, // 导航选择的终点
        actStart: currentTravel.startPlace, // 实际出发位置
        actEnd: cur, // 实际结束位置
        distance: isCurEnd ? curLine.distance : travel[travelType.value].distance, // 导航计算距离
        coins: isCurEnd ? calculateCoins(curLine.distance, travelType.value) : calculateCoins(travel[travelType.value].distance, travelType.value), // 元气币
        travelType: travelType.value, // 交通模式 'walking' | 'bicycling' | 'driving'
        errorDistance: cRes[0].distance, // 误差距离
      }
      RequestApi.addTravelRecord(params).then((res) => {
        console.log('addTravelRecord', res)
        const { code, data } = res as any
        if (code == 0) {
          getTravelList()
        }
      })
    })

  }
  data.progress = 0
  data.touchstate = false
}
function detail(e) {
  console.log(e)
}
// 计算导航结束位置 到 实际结束位置的直线距离
async function getCalculateDistance() {
  const start = { // 导航结束位置
    latitude: endObj.latitude,
    longitude: endObj.longitude
  }
  const Location: any = await getCurLocation()
  const end = [{ // 实际结束位置
    latitude: Location.latitude,
    longitude: Location.longitude,
  }]
  const res = await calculateDistance(start, end)
  console.log('getCalculateDistance', res)
  return res
}
// 计算开始地点和 实际结束地点 直线距离
async function getStartCurEndDistance() {
  const start = { // 导航开始位置
    latitude: startObj.latitude,
    longitude: startObj.longitude
  }
  const Location: any = await getCurLocation()
  const end = [{ // 实际结束位置
    latitude: Location.latitude,
    longitude: Location.longitude,
  }]
  const res = await calculateDistance(start, end)
  console.log('getStartCurEndDistance', res)
  return res
}
// 计算开始地点和 导航结束地点直线距离
async function getStartEndDistance() {
  const start = { // 导航开始位置
    latitude: startObj.latitude,
    longitude: startObj.longitude
  }
  const end = [{ // 导航结束位置
    latitude: endObj.latitude,
    longitude: endObj.longitude,
  }]
  const res = await calculateDistance(start, end)
  console.log('getStartEndDistance', res)
  return res
}
// 跳转重置
function resetPage() {
  uni.removeStorageSync('currentTravel')
  uni.redirectTo({
    url: '/pages/plugin/map' // 要重新初始化的页面路径
  });
}

// 重置出行页面数据 及 结束的出行
function resetTravelData() {
  uni.removeStorageSync('currentTravel')
  endObj.longitude = 0
  endObj.latitude = 0
  endObj.name = ''
  endObj.address = ''
  clock.timer = null
  clock.clock1 = '00'
  clock.clock2 = '00'
  clock.clock3 = '00'
  clock.hour = 0
  clock.minute = 0
  clock.second = 0
  data.startRecord = false // 记录结束
  // 重置地图
  // mapCtx.removeMarkers({ // 无效
  //   markerIds: [1, 2],
  //   success: function (res) {
  //     console.log('removeMarkers success', res)
  //   },
  //   fail: function (res) {
  //     console.log('removeMarkers fail', res)
  //   }
  // })
  // 用增加替换  移除 markers
  mapCtx.addMarkers({
    markers: [],
    clear: true
  })
  // 移除 path
  data.polyline[0].points = []
  initMap(true)
}
// 开始计时
function startHandler() {
  const { clock1, clock2, clock3, second, minute, hour } = toRefs(clock)
  clock.timer = setInterval(() => {
    if (clock3.value === 59 || clock3.value === '59') {
      clock3.value = '00';
      second.value = 0;
      if (clock2.value === 59 || clock2.value === '59') {
        clock2.value = '00';
        minute.value = 0;
        if (hour.value + 1 <= 9) {
          hour.value++
          clock1.value = '0' + hour.value
        } else {
          hour.value++
          clock1.value = hour.value
        }
      } else {
        if (minute.value + 1 <= 9) {
          minute.value++
          clock2.value = '0' + minute.value
        } else {
          minute.value++
          clock2.value = minute.value
        }
      }
    } else {
      if (second.value + 1 <= 9) {
        second.value++
        clock3.value = '0' + second.value
      } else {
        second.value++
        clock3.value = second.value
      }
    }
  }, 1000)
}
const init = ref(false)
const posterRef = ref<any>(null)
let mapPosterUrl = ref('')
const mapPosterData = reactive<any>([{
  type: 'rect',
  style: {
    left: 0,
    top: 0,
    width: 560,
    height: 890,
    backgroundColor: '#ecffed'
  }
}, {
  type: 'image', // 地图静态图
  src: '',
  imgType: 2, // 1: 本地图片 2: 网络图片 3: base64图片
  style: {
    left: 10,
    top: 10,
    width: 540,
    height: 540
  }
}, {
  type: 'image', // 起点
  src: 'https://dtcx-1318775010.cos.ap-beijing.myqcloud.com/common/map/start.png',
  imgType: 2, // 1: 本地图片 2: 网络图片 3: base64图片
  style: {
    left: 20,
    top: 580,
    width: 40,
    height: 40
  }
}, {
  type: 'text', // 起点地址
  text: '',
  style: {
    left: 80,
    top: 607,
    fontSize: 22,
    color: '#343434',
    width: 450,
    rows: 1,
    lineHeight: 22
  }
}, {
  type: 'image', // 终点
  src: 'https://dtcx-1318775010.cos.ap-beijing.myqcloud.com/common/map/end.png',
  imgType: 2, // 1: 本地图片 2: 网络图片 3: base64图片
  style: {
    left: 20,
    top: 630,
    width: 40,
    height: 40
  }
}, {
  type: 'text', // 终点地址
  text: '',
  style: {
    left: 80,
    top: 656,
    fontSize: 22,
    color: '#343434',
    width: 450,
    rows: 1,
    lineHeight: 22
  }
}, {
  type: 'image', // 出行方式
  src: 'https://dtcx-1318775010.cos.ap-beijing.myqcloud.com/common/map/end.png',
  imgType: 2, // 1: 本地图片 2: 网络图片 3: base64图片
  style: {
    left: 20,
    top: 630,
    width: 40,
    height: 40
  }
}, {
  type: 'text',
  text: '用时: ',
  style: {
    left: 30,
    top: 705,
    fontSize: 26,
    color: '#343434'
  }
}, {
  type: 'text',
  text: '全程: ',
  style: {
    left: 300,
    top: 705,
    fontSize: 26,
    color: '#343434'
  }
}, {
  type: 'text',
  text: '获得元气币: ',
  style: {
    left: 30,
    top: 745,
    fontSize: 26,
    color: '#fcaa3e'
  }
}, {
  type: 'image',
  src: 'https://dtcx-1318775010.cos.ap-beijing.myqcloud.com/icons/logo_small.png',
  imgType: 2, // 1: 本地图片 2: 网络图片 3: base64图片
  style: {
    left: 30,
    top: 770,
    width: 45,
    height: 52
  }
}, {
  type: 'text',
  text: '元气碳',
  style: {
    left: 80,
    top: 810,
    fontSize: 29,
    color: '#4bec79'
  }
}, {
  type: 'text',
  text: '长按识别右侧二维码·立即体验',
  style: {
    left: 30,
    top: 855,
    fontSize: 18,
    color: '#333333'
  }
}, {
  type: 'image',
  src: 'https://dtcx-1318775010.cos.ap-beijing.myqcloud.com/common/QRcode.png',
  imgType: 2,
  style: {
    left: 384,
    top: 745,
    width: 130,
    height: 130
  }
}])
function ready() {
  console.log('ready')
  //组件初始化完成
  init.value = true
}
//调用方法绘制海报
function mapPoster() {
  console.log(1, init.value, posterRef)
  if (!init.value || !posterRef) {
    return false
  }
  try {
    posterRef.value.draw(mapPosterData, (filePath) => {
      //绘制图片路径
      console.log(filePath)
      mapPosterUrl.value = filePath;
      modalImgUrl.value = filePath;
      showModal.value = true
      // uni.previewImage({
      //   urls: [filePath]
      // });
      uni.hideLoading()
    })
  } catch (e) {
    uni.showToast({
      title: '本次出行已记录, 但海报绘制失败',
      icon: 'none',
      duration: 2000
    })
    setTimeout(() => {
      resetTravelData()
    }, 2000)
  }
}
const showModal = ref(false)
const modalImgUrl = ref('')
function hideModel() {
  resetTravelData()
  mapPosterData[7].text = '用时: '
  mapPosterData[8].text = '全程: '
  mapPosterData[9].text = '获得元气币: '
  showModal.value = false
}
// 获取地图静态图
async function getStaticMap(curEnd) {
  uni.showLoading({
    title: '海报绘制中...'
  })
  let start = `icon:https://dtcx-1318775010.cos.ap-beijing.myqcloud.com/common/map/startm.png|${startObj.latitude},${startObj.longitude}`
  let end = `icon:https://dtcx-1318775010.cos.ap-beijing.myqcloud.com/common/map/endm.png|${curEnd.latitude || endObj.latitude},${curEnd.longitude || endObj.longitude}`
  let path = `color:0x008000|weight:10|${data.coors[travelType.value]}`
  let curLine: any
  if (curEnd.latitude) {
    curLine = await getCurTravel(travelType.value, curEnd)
    path = `color:0x008000|weight:10|${curLine.coors}`
  }
  uni.request({
    url: `${baseUrl}/common/uploadMap`,
    method: 'POST',
    data: {
      size: '500*500',
      scale: 1, // 开启会导致参数错误 偶现
      format: 'png',
      key: 'UVHBZ-SWH3U-NDGVP-GHRPB-BFYQ7-72F27',
      start,
      end,
      path
    },
    success: async (res: any) => {
      console.log('upload', res, curEnd)
      if (curEnd.latitude) { // 实际终点静态图
        console.log('实际终点静态图')
        const result: any = await getAddressName(curEnd.latitude, curEnd.longitude, null) // result.formatted_addresses.recommend
        mapPosterData[1].src = res.data.data
        mapPosterData[3].text = startObj.name || startObj.address
        mapPosterData[5].text = result.formatted_addresses.recommend || result.address
        const { second, minute, hour } = toRefs(clock)
        mapPosterData[7].text += `${hour.value > 0 ? hour.value + '小时' : ''} ${minute.value > 0 ? minute.value + '分钟' : ''} ${second.value > 0 ? second.value + '秒' : ''}`
        mapPosterData[8].text += (curLine.distance / 1000).toFixed(2) + ' km'
        mapPosterData[8].style.color = travel[travelType.value].color
        mapPosterData[9].text += calculateCoins(curLine.distance, travelType.value) + ' cc'
        console.log('mapPosterData 实际', mapPosterData)
        mapPoster()
      } else {
        mapPosterData[1].src = res.data.data
        mapPosterData[3].text = startObj.name || startObj.address
        mapPosterData[5].text = endObj.name || endObj.address
        const { second, minute, hour } = toRefs(clock)
        mapPosterData[7].text += `${hour.value > 0 ? hour.value + '小时' : ''} ${minute.value > 0 ? minute.value + '分钟' : ''} ${second.value > 0 ? second.value + '秒' : ''}`
        mapPosterData[8].text += (travel[travelType.value].distance / 1000).toFixed(2) + ' km'
        mapPosterData[8].style.color = travel[travelType.value].color
        mapPosterData[9].text += calculateCoins(travel[travelType.value].distance, travelType.value) + ' cc'
        console.log('mapPosterData 导航', mapPosterData)
        mapPoster()
      }
    },
    fail: (err) => {
      uni.hideLoading()
      uni.showToast({
        title: err.errMsg,
        icon: 'none',
        duration: 2000
      })
      setTimeout(() => {
        hideModel()
      }, 2000)
      console.log('uploadMap', err)
    }
  })
}
// 获取实际出行 距离/时间
function getCurTravel(type: Trip, curEnd) {
  return new Promise((resolve, reject) => {
    let params = {
      key: 'UVHBZ-SWH3U-NDGVP-GHRPB-BFYQ7-72F27',
      from: startObj.latitude + ',' + startObj.longitude,
      to: curEnd.latitude + ',' + curEnd.longitude,
    }
    uni.request({
      url: `https://apis.map.qq.com/ws/direction/v1/${type}/`,
      data: params,
      success: (res) => {
        console.log('实际出行 距离/时间', res)
        const { status, result, message } = res.data as any
        if (status == 0) {
          // 绘制路线
          let coors = result.routes[0].polyline
          let pl: any = []
          //坐标解压（返回的点串坐标，通过前向差分进行压缩）
          var kr = 1000000;
          for (var i = 2; i < coors.length; i++) {
            coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
          }
          //将解压后的坐标放入点串数组pl中
          for (var i = 0; i < coors.length; i += 2) {
            pl.push({
              latitude: coors[i],
              longitude: coors[i + 1]
            })
          }
          result.routes[0].coors = getCoorsString(coors);
          resolve(result.routes[0]) // distance duration
        } else {
          console.log(params, status, message)
        }
      }
    });
  })
}
// 保存海报
function savePoster() {
  uni.authorize({
    scope: 'scope.writePhotosAlbum',
    success() {
      console.log('授权成功', mapPosterUrl.value)
      uni.saveImageToPhotosAlbum({
        filePath: mapPosterUrl.value,
        success: (res) => {
          console.log('图片已保存到相册')
          resetPage()
        },
        fail: (res) => {
          resetPage()
          console.log('fail', res)
        }
      })
    },
    fail() {
      uni.showModal({
        title: '提示',
        content: '您还没有开启相册权限，是否立即开启？',
        showCancel: true,
        success: (res) => {
          if (res.confirm) {
            uni.openSetting({
              success(res) { console.log(res) },
              fail(err) { console.log(err) }
            });
          }
        }
      })
    }
  })
}
// 定义 onShareAppMessage
onShareAppMessage((res) => {
  console.log("onShareAppMessage", res);
  return {
    title: '我在使用“元气碳”小程序，快来一起用吧！',
    path: '/pages/index/index',
    imageUrl: mapPosterUrl.value
  };
});
// 配置 news
function setNewsList() {
  data.newsList = []
  if (news.value && news.value.length > 0) {
    news.value.forEach((item: any) => {
      data.newsList.push(item.itemValue)
    })
  } else {
    data.newsList.push('暂无新闻')
  }
}
</script>

<style lang="scss" scoped>
.search {
  width: 100%;
  min-height: 100px;

  ::v-deep .u-scroll-list {
    padding-bottom: 0 !important;
  }

  &-box {
    @include flex(column);
    justify-content: center;
    margin: 10px;
    border-radius: 15px;
    border: 1px solid #e9ecf1;
    box-shadow: rgba(50, 50, 93, 0.15) 0px 4px 6px -2px, rgba(0, 0, 0, 0.1) 0px 3px 6px -3px;
    background: #fff;
    padding: 15px;

    .start-location {
      @include flex(row);
      font-size: 12px;
      color: #3cb27c;
      padding: 0 10px;
      margin-bottom: 8px;

      .address {
        margin-left: 10px;
      }
    }

    .destination {
      @include flex(row);
      align-items: center;
      background: #f6f7fb;
      border-radius: 10px;
      height: 40px;
      padding: 0 10px;

      .address {
        margin-left: 10px;
        font-size: 15px;
        font-weight: 500;
      }
    }
  }

  .trip-mode {
    padding: 0 10px 5px;
    @include flex(row);
    justify-content: center;

    .trip-item {
      box-sizing: border-box;
      width: 112px;
      height: 40px;
      @include flex(row);
      align-items: center;
      justify-content: center;
      border-radius: 16px;
      padding: 4px 6px;
      background-color: #e4f3fb; // #e9ecf1;
      box-shadow: rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;
      margin-right: 15px;

      &.selected {
        border: 2px solid #58a8fe;
      }

      .trip-content {
        @include flex(column);
        justify-content: center;
        margin-left: 8px;

        .coin {
          height: 16px;
          color: #fcaa3e;
          font-size: 14px;
          font-weight: 500;
        }

        .co2 {
          font-weight: 700;
          color: var(--color);
          font-size: 13px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
}

.map-box {
  padding: 5px 0;

  #myMap {
    width: 100%;
  }
}

/* 底部 */
.map-Details {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffff;
  border-radius: 20px;
  padding: 3px 5px;
  height: 205px;
  background: linear-gradient(180deg, #b9dafd, #fefefe);

  .message {
    height: 32px;
  }

  .setout {
    margin: 2px 8px 0;
    border-radius: 15px;
    background: #fff;
    height: 155px;
    @include flex(column);
    justify-content: space-between;

    .btn-info {
      height: 46px;
      padding: 8px 10px 8px 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px dotted gainsboro;
      margin-bottom: 10px;

      .travel-info {
        width: calc(100% - 100px);
        @include flex(row);

        .block {
          @include flex(column);
          width: 108px;

          .title {
            font-size: 12px;
            height: 16px;
            line-height: 16px;
            color: rgb(168, 166, 166);
          }

          .num {
            height: 26px;
            line-height: 26px;
            font-size: 24px;
            font-weight: 600;
          }
        }

        .distance {
          .total-distance {
            color: #64b7f8;

            .km {
              margin-left: 2px;
              font-size: 12px;
              display: inline-block;
            }
          }
        }

        .coins {
          .total-coins {
            color: #fcaa3e;

            .cc {
              margin-left: 2px;
              font-size: 12px;
              display: inline-block;
            }
          }
        }
      }

      .select-icon {
        margin-right: 5px
      }
    }

    .btn-start {
      margin-top: 7px;
      height: 62px;
      @include flex(row);
      justify-content: space-around;
      align-items: center;

      .time {
        width: 100px;
        padding-left: 10px;
        @include flex(column);

        .title {
          font-size: 12px;
          height: 16px;
          line-height: 16px;
          color: rgb(168, 166, 166);
        }

        .timer {
          height: 26px;
          line-height: 26px;
          font-size: 26px;
          font-weight: 600;
        }
      }

      .btn-content {
        @include flex(row);
        align-items: center;
        justify-content: center;
        width: 80px;

        .btn-item-box {
          position: relative;

          .label {
            position: absolute;
            width: 24px;
            bottom: -16px;
            left: calc(50% - 12px);
            font-size: 12px;
            color: rgb(157, 153, 153);
          }

          &.btn-b {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 70px;
            height: 70px;
            border-radius: 50%;
          }

          &.stop-btn {
            &.touch {
              background: conic-gradient(#FFCDB2 0, #FFCDB2 var(--progress),
                  #fff var(--progress), #fff);
            }

            .label {
              position: absolute;
              width: 48px;
              bottom: -19px;
              left: calc(50% - 24px);
              font-size: 12px;
              color: rgb(157, 153, 153);
            }
          }
        }
      }

      .right {
        width: 100px;
        padding-right: 10px;
      }
    }

    .navigation-history {
      @include flex(column);
      margin: 0 5px 5px;

      .h-title {
        margin-left: 5px;
        height: 20px;
        font-size: 13px;
        padding-left: 8px;
        position: relative;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 2px;
          width: 4px;
          height: 14px;
          background: #f7b335;
        }
      }

      .no-participant {
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(180deg, #f1f8f3, #f0f9fa);
        padding: 8px;
        border-radius: 12px;

        .icon {
          margin-right: 10px;
        }

        .text {
          font-size: 14px;
          color: gainsboro;
        }
      }

      .h-body {
        @include flex(row);
        justify-content: space-between;
        padding: 8px;
        border-radius: 12px;
        background: linear-gradient(180deg, #f1f8f3, #f0f9fa);

        .left {
          @include flex(row);

          .photo {
            width: 40px;
            height: 40px;
            margin-right: 10px
          }

          .position {
            @include flex(column);
            justify-content: center;
            font-size: 12px;

            .pl1 {
              height: 20px;
              line-height: 20px;
              max-width: calc(var(--width) - 162px);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;

              .icon {
                margin-right: 4px;
              }
            }
          }
        }

        .info {
          font-size: 13px;
          width: 60px;
          font-weight: 500;

          .distance {
            height: 20px;
            line-height: 20px;
            color: #58a8fe;

            .units {
              margin-left: 5px;
              display: inline-block;
              font-weight: 700;
            }
          }

          .co2 {
            height: 20px;
            line-height: 20px;
            color: #fcaa3e;

            .units {
              margin-left: 5px;
              display: inline-block;
              font-weight: 700;
            }
          }
        }
      }
    }
  }
}

.tui-rolling-news {
  width: 100%;
  padding: 12rpx 30rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;

  .tui-swiper {
    margin-left: 5px;
    height: 26px;
    flex: 1;

    .tui-swiper-item {
      display: flex;
      align-items: center;

      .tui-news-item {
        color: #335886;
        font-weight: 400;
        font-size: 12px;
        line-height: 28rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}

.tui-modal-custom {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 560px;

  .modelBtn {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;

    .save {
      margin-right: 20px;
    }
  }
}
</style>