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
    <u-scroll-list :indicator="false">
      <view class="trip-mode">
        <view v-for="(item, index) in tripArr" class="trip-item" :style="{ '--color': item.color || '#2b4bf2' }"
          :key="index">
          <tui-icon custom-prefix="iconfont" :name="item.icon" size="22" color="#2b4bf2"></tui-icon>
          <view class="trip-content">
            <view class="coin">{{ item.coins }} CC</view>
            <view class="co2">
              {{ item.co2 }} CO2
            </view>
          </view>
        </view>
      </view>
    </u-scroll-list>
  </view>
  <!-- 自定义的导航 -->
  <view class="map-box">
    <map id="myMap" :show-location="true" :enable-building="true" :enable-poi="true" :latitude="addressData.data.lat"
      :longitude="addressData.data.lng" :markers="markers" :include-points="markers" :polyline="data.polyline"
      :scale="data.scale" @markertap="markerTap" @tap="tapMap"></map>
  </view>
  <!-- 底部 -->
  <view class="map-Details">
    <view class="message">
      <view class="tui-rolling-news">
        <u-image src="/static/images/icons/broadcast.png" width="18px" height="18px"></u-image>
        <swiper vertical autoplay circular interval="4000" class="tui-swiper">
          <swiper-item v-for="(item, index) in data.newsList" :key="index" class="tui-swiper-item">
            <view class="tui-news-item" @tap='detail'>{{ item }}</view>
          </swiper-item>
        </swiper>
      </view>
    </view>
    <view class="setout">
      <view class="btn-box">
        <button plain="true" @click="comeBack">返回</button>
      </view>
      <view class="navigation-history">
        <view class="h-title">最近记录</view>
        <view class="h-body">
          <view class="left">
            <view class="photo">
              <u-image src="/static/images/map/r1.png" width="40px" height="40px"></u-image>
            </view>
            <view class="position" :style="{ '--width': windowWidth + 'px' }">
              <view class="start pl1">
                <tui-icon class="icon" name="gps" color="#3cb27c" bold size="12"></tui-icon>北京市朝阳区永安里中街甲25号
              </view>
              <view class="end pl1">
                <tui-icon class="icon" name="gps" color="#ff5722" bold size="12"></tui-icon>北京大学国际关系学院
              </view>
            </view>
          </view>
          <view class="info">
            <view class="distance">12.5<view class="units">公里</view>
            </view>
            <view class="co2">366<view class="units">CO2</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { onLoad } from "@dcloudio/uni-app"
interface MarkersData {
  id: number;
  latitude: number;
  longitude: number;
  iconPath: string;
  width: number;
  height: number;
}
// 到这去地图详情
interface Mapdetail {
  accuracy?: number; // 位置的精确度
  speed?: number; // 速度，浮点数，单位m/s
  longitude: number; // 经度，浮点数，范围为-180~180，负数表示西经
  latitude: number; // 纬度，浮点数，范围为-90~90，负数表示南纬
  [propName: string]: any
}
const windowWidth = uni.getSystemInfoSync().windowWidth
// 起止 位置标记
let markers = reactive<any>([])

// 取出胶囊按钮数据
let menu_top = ref<string>('')//胶囊按钮距离顶部的高度
let menu_height = ref<string>('')//胶囊按钮的高度
// 本地缓存的位置信心
let addressData = reactive({
  data: { address: '', lat: 0, lng: 0 } // lat: 39.909, lng: 116.39742
})
const startObj = reactive(<Mapdetail>{})
const endObj = reactive(<Mapdetail>{})
const tripType = ref('bicycling')
const tripArr = reactive<any>([])
const data = reactive<any>({
  scale: 16,
  polyline: [{
    points: [],
    color: "#18b566",
    width: 5,
    // dottedLine: true,
    arrowLine: true
  }],
  newsList: [
    '零碳交通 | 董振宁：以“1+2+N”模式助力全民低碳出行',
    '聚焦"更可持续""低碳""智慧" 2023世界交通运输大会六月在武汉启幕',
    '低碳生活无处不在 绿色出行就在身边 骑车、徒步受到市民广泛欢迎'
  ]
})
const mapCtx: any = uni.createMapContext('myMap')

onLoad(() => {
  // uni.onLocationChange(function (res) {
  //   console.log('onLocationChange 纬度：' + res.latitude);
  //   console.log('onLocationChange 经度：' + res.longitude);
  //   console.log('onLocationChange 精确度：' + res.accuracy);
  // })
  uni.getLocation({
    type: 'gcj02',
    altitude: true,
    isHighAccuracy: true,
    success: function (res) {
      console.log('res', res);
      console.log('当前位置的经度：' + res.longitude);
      console.log('当前位置的纬度：' + res.latitude);
      getAddressName(res.latitude, res.longitude, startObj)
      // uni.openLocation({
      //   latitude: res.latitude,
      //   longitude: res.longitude,
      //   success: function () {
      //     console.log('success');
      //   }
      // })
      startObj.longitude = res.longitude
      startObj.latitude = res.latitude
      startObj.speed = res.speed
      startObj.accuracy = res.accuracy
      startObj.destination = ''

      mapCtx.moveToLocation({
        latitude: res.latitude, // - 0.003, // 向上移动 300m
        longitude: res.longitude,
        success: (sres: any) => {
          addMarkers(res.latitude, res.longitude, 0)
        },
        fail: (err: any) => {
          console.log(err)
        }
      })
    }
  })
})
// 选择地点
const chooseAddress = (Obj, index) => {
  uni.chooseLocation({
    latitude: Obj.latitude,
    longitude: Obj.longitude,
    success: function (cres) {
      console.log('chooseLocation', cres)
      Obj.name = cres.name
      Obj.address = cres.address
      Obj.latitude = cres.latitude
      Obj.longitude = cres.longitude
      addMarkers(Obj.latitude, Obj.longitude, index)
      if (endObj.latitude && endObj.longitude) {
        tripType.value = 'bicycling'
        getMapLine(tripType.value)
      }
      // getAddressName(cres.latitude, cres.longitude, Obj)
    }
  })
}
// 通过经纬度 转换成 中文地址
const getAddressName = (latitude, longitude, Obj) => {
  uni.request({
    url: 'https://apis.map.qq.com/ws/geocoder/v1/',
    data: {
      key: 'UVHBZ-SWH3U-NDGVP-GHRPB-BFYQ7-72F27',
      location: latitude + ',' + longitude
    },
    success: (res) => {
      const { status, result, message } = res.data as any
      console.log(res.data);
      if (status == 0) {
        Obj.name = result.formatted_addresses.recommend
        Obj.address = result.address
        calculateCo2()
      } else {
        console.log(message)
      }
    }
  });
}
// 获取导航路线 驾车(油车)/步行/骑行/公交
const getMapLine = (type) => { // driving walking bicycling transit
  uni.request({
    url: `https://apis.map.qq.com/ws/direction/v1/${type}/`,
    data: {
      key: 'UVHBZ-SWH3U-NDGVP-GHRPB-BFYQ7-72F27',
      from: startObj.latitude + ',' + startObj.longitude,
      to: endObj.latitude + ',' + endObj.longitude,
    },
    success: (res) => {
      console.log('getDriving', res)
      const { status, result, message } = res.data as any
      if (status == 0) {
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
        data.polyline[0].points = pl
        // setTimeout(() => {
        //   mapCtx.getScale({
        //     success: (sres => {
        //       console.log('scale', sres)
        //       data.scale = sres.scale - 0.1
        //     })
        //   })
        // }, 500)
      } else {
        console.log(message)
      }
    }
  });
}
// 计算出 起止路线 不同交通模式的碳减排
const calculateCo2 = () => {
  let arr = [{
    type: 'walk',
    icon: 'icon-footprint',
    coins: 30,
    co2: 0,
    color: '#71a7a4'
  }, {
    type: 'bicycle',
    icon: 'icon-zihangche31',
    coins: 24,
    co2: 80,
    color: '#899bf6'
  }, {
    type: 'car',
    icon: 'icon-qiche',
    coins: 0,
    co2: 900,
    color: '#d26f85'
  }, {
    type: 'metro',
    icon: 'icon-ditie',
    coins: 10,
    co2: 300,
    color: '#d08e3d'
  }]
  tripArr.push(...arr)
}
function tapMap(EventHandle) {
  console.log('tapMap', EventHandle)
  // addMarkers(EventHandle.detail.latitude, EventHandle.detail.longitude)
}
function addMarkers(latitude, longitude, index) {
  markers[index] = {
    id: index,
    iconPath: '/static/other/dingwei.png',
    width: 40,
    height: 40,
    joinCluster: true, // 指定了该参数才会参与聚合
    label: {
      width: 40,
      height: 20,
      borderWidth: 0,
      borderRadius: 0,
      bgColor: '#ffffff00',
      content: index == 1 ? '终点' : '起点',
      textAlign: 'center',
      color: '#3a75f3'
    },
    latitude,
    longitude
  }
  mapCtx.addMarkers({
    markers: markers,
    clear: true,
    success(sres) {
      console.log('success', sres)
    },
    complete(res) {
      console.log('addMarkers', res)
    }
  })
}
// 点击地图标记点触发
function markerTap(event: any) {
  console.log('markerTap', event)
}
// 返回上一页
function comeBack() {
  uni.navigateBack({ delta: 1 })
}
const detail = (e) => {
  uni.showToast({
    title: '该功能正在完善中~',
    icon: 'none',
    duration: 2000
  })
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
      width: 90px;
      @include flex(row);
      align-items: center;
      justify-content: center;
      border-radius: 16px;
      padding: 4px 8px;
      background-color: #e4f3fb; // #e9ecf1;
      box-shadow: rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;
      margin-right: 15px;

      .trip-content {
        @include flex(column);
        justify-content: center;
        margin-left: 8px;

        .coin {
          color: #878b8c;
          font-size: 12px;
        }

        .co2 {
          font-weight: 700;
          color: var(--color);
          font-size: 13px;
        }
      }
    }
  }
}

.map-box {
  padding: 5px 0;

  #myMap {
    width: 100%;
    height: 55vh;
  }
}

/* 底部 */
.map-Details {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffff;
  border-radius: 30px;
  padding: 3px 5px;
  height: 30vh;
  background: linear-gradient(180deg, #b9dafd, #fefefe);

  .message {
    height: 32px;
  }

  .setout {
    margin: 2px 8px 0;
    border-radius: 15px;
    background: #fff;
    height: calc(30vh - 60px);
    @include flex(column);
    justify-content: space-between;

    .navigation-history {
      @include flex(column);
      margin: 10px 5px 5px;

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
            color: #3c81b2;
            .units {
              margin-left: 5px;
              display: inline-block;
              font-weight: 700;
            }
          }
          .co2 {
            height: 20px;
            line-height: 20px;
            color: #3cb27c;
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
</style>