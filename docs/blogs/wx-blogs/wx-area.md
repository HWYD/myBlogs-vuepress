---
theme: channing-cyan
---
### 前言
在开发地图功能界面的时候，我们有时需要在地图上面贴个性化地图图片，或者在某个地方上个性化图标的标注，第一次接触会查很多地图文档api，如使用高德地图、百度地图、腾讯地图、小程序地图就需要去看对应的相关文档，花费很多时间，本文分享实现的功能基于微信小程序自带的地图功能。希望能让你开发少一点时间。
### 使用小程序自带的地图
#### 小程序地图使用有三个重点(官方文档主要是这三个)
1. 小程序提供的map组件，传递参数就可以显示不同的地图效果
2. 小程序提供的地图相关的api： wx.createMapContext
3. 小程序的官方示例，有源码下载

![1.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1441ca4cce3e421a894fcd4c93d87370~tplv-k3u1fbpfcp-watermark.image?)

![2.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4fd5a5f236ad44c4845ae24621666789~tplv-k3u1fbpfcp-watermark.image?)

![示例.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27db3896792f431ea2583acf89d3814b~tplv-k3u1fbpfcp-watermark.image?)

#### 使用示例

##### 简单示例1(没有参数)

```js
//index.wxml
<map id="myMap" />

//index.css(样式)
#myMap{
  width: 100vw;
  height: 100vh;
}
```
小程序地图使用非常便捷
就写了一行代码，就可以显示出默认的地图，由于没有提供经纬度等参数，地图组件会默认定位到北京。

![3.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4862281926a4a9bbcab2f2aef5f9046~tplv-k3u1fbpfcp-watermark.image?)

##### 简单示例2(给定了广州塔的经纬度，显示卫星图，开启实时路况)

```js
<map id="myMap" 
longitude="113.32424842327879"
latitude="23.105562128174608" 
enable-traffic
enable-satellite
/>
```

![4.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc658c570d9545a09562e865921e3c1e~tplv-k3u1fbpfcp-watermark.image?)

### 常用方法推荐
##### 方法一：获取点击的经纬度

```js
//index.wxml
<map id="myMap" 
longitude="113.32424842327879"
latitude="23.105562128174608" 
enable-traffic
enable-satellite
bindtap="onTapMap"
/>

//index.js 获取点击的经纬度
  onTapMap(event) {
    const latitude = event.detail.latitude
    const longitude = event.detail.longitude
    console.log(longitude,latitude)
  },

```

##### 方法二：获取点击的标注点marker信息

```js
//index.wxml
<map id="myMap" 
longitude="113.32424842327879"
latitude="23.105562128174608" 
enable-traffic
enable-satellite
bindmarkertap="onTapMarker"
/>
//index.js 点击标注点时获取该标注id
 onTapMarker(event) {
    console.log(event.detail.markerId)
  },
```

### 个性化贴图、自定义图标标注点功能实现
#### 个性化贴图(api：   MapContext.addGroundOverlay)
微信小程序开发者工具看不到效果，需要开启真机调试

每贴一张图，需要给定这张图定点右上角和左下角这两个点的经纬度，有这两点就可以准确贴上一张图。
##### 贴一张图的情况：

```js
//index.js
//电子贴图右上角和左下角的点,变化只需修改这两点,这里我是通过上文获取点击经纬度获取的
const righttop = [23.105601636091126, 113.32561652492132]
const leftbottom = [23.104752168738766, 113.32324335487533]

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.mapCtx = wx.createMapContext('myMap')
     this.mapCtx.addGroundOverlay({
      id: 1,
      src: `图片地址`,  //支持网络图片、临时路径、代码包路径
      bounds: {
        //左下角,横纬竖经
        southwest: {
          longitude: leftbottom[1],
          latitude: leftbottom[0]
        },
        //右上角
        northeast: {
          longitude: righttop[1],
          latitude: righttop[0]
        }
      },
      success: (res) => {console.log('贴图成功')},
      fail: (err) => {
        console.log(err)
      }
    })
  },

```
效果图：可以看到，已经贴上去了，这里我随便示例了一张图

![7.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eaa40275e46641038cb98dc50ee995dc~tplv-k3u1fbpfcp-watermark.image?)

##### 多张贴图情况，这里演示四张四张从上往下的小图拼成一张大图
当一张大图由几张小图贴在一起的时候，可以先确定右上角和左下角这两个点的经纬度，然后去计算其他点的经纬度

```js
//index.js
//电子贴图右上角和左下角的点,变化只需修改这两点,这里我是通过上文获取点击经纬度获取的
//这部分是四张从上到下的小图拼成一张大图，所以其他点可以根据这两个点去计算，也不容易出错
const righttop = [23.105601636091126, 113.32561652492132]
const leftbottom = [23.104752168738766, 113.32324335487533]
//将地图分为上下4份,每份上下的距离
const eachSpace = (righttop[0] - leftbottom[0]) / 4
//定义贴图信息
const GroundOverlay = [
  {
    id: 1,
    src: `图片1地址`
    bounds: {
      //左下角,横纬竖经
      southwest: {
        longitude: leftbottom[1],
        latitude: leftbottom[0] + eachSpace * 3
      },
      //右上角
      northeast: {
        longitude: righttop[1],
        latitude: righttop[0]
      }
    }
  },
  {
    id: 2,
    src: `图片2地址`,
    bounds: {
      southwest: {
        longitude: leftbottom[1],
        latitude: leftbottom[0] + eachSpace * 2
      },
      northeast: {
        longitude: righttop[1],
        latitude: righttop[0] - eachSpace
      }
    }
  },
  {
    id: 3,
    src: `图片3地址`,
    bounds: {
      southwest: {
        longitude: leftbottom[1],
        latitude: leftbottom[0] + eachSpace
      },
      northeast: {
        longitude: righttop[1],
        latitude: righttop[0] - eachSpace * 2
      }
    }
  },
  {
    id: 4,
    src: `图片4地址`,
    bounds: {
      southwest: {
        longitude: leftbottom[1],
        latitude: leftbottom[0]
      },
      northeast: {
        longitude: righttop[1],
        latitude: righttop[0] - eachSpace * 3
      }
    }
  }
]
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.mapCtx = wx.createMapContext('myMap')
    for (let i = 0; i < GroundOverlay.length; i++) {
      this.mapCtx.addGroundOverlay({
        ...GroundOverlay[i]
      })
    }
  },
```
#### 动态添加自定义图片标记点marker
给地图添加标记点markers,可以通过给组件传递markers参数，markers是定义在data里的话，通过改变data里的markers的值就可以实现动态变化标记点

```js
// index.wxml
<map id="myMap" 
markers="{{markers}}"  
longitude="119.7622402155845"
latitude="31.316105488231152" 
enable-traffic
enable-satellite
bindmarkertap="onTapMarker"
/>

// index.js
// 主要通过设定iconPath这个属性来让标记点显示成我们想要的图标
const INIT_MARKER= [
    {
      id: 101,
      callout: {
        content: '标记点1',
        padding: 10,
        borderRadius: 6,
        display: 'ALWAYS',
        fontSize: 12,
        color: '#3875FF'
      },
      longitude: 119.75880851270135,
      latitude: 31.31061775104909,
      iconPath: '../../../assets/images/home/area/icon_energy@2x.png',
      width: '34px',
      height: '34px',
      rotate: 0,
      alpha: 1
    },
    {
      id: 102,
      callout: {
        content: '标记点2',
        padding: 10,
        borderRadius: 6,
        display: 'ALWAYS',
        fontSize: 12,
        color: '#3875FF'
      },
      longitude: 119.7644080016941,
      latitude: 31.319114527583075,
      iconPath: '../../../assets/images/home/area/icon_energy@2x.png',
      width: '34px',
      height: '34px',
      rotate: 0,
      alpha: 1
    }
  ]
Page({
  /**
   * 页面的初始数据
   */
  data: {
    markers: [...INIT_MARKER],
    },
  //设置标记点，因为markers是响应式变量，所以markers变化了，地图上的标记点也会变化，可以实现标注点的增删改
  setMarkers(addMarkers) {
    this.setData({
      markers: addMarkers
    })
    }，
  //点击标记点产生事件，可获取该标注id
  onTapMarker(event) {
    console.log(event.detail.markerId)
  },
   
})
    
```


### 可能会遇到的bug
##### 1、当贴图的单张图片大小大于300k(大概)时候，苹果手机正常显示，安卓手机显示不出来。
处理：分成多张小图拼在一起，这样每张图的大小就比较小，安卓手机也可以正常显示。
##### 2、使用自定义图片标记点时，如果使用MapContext.addMarkers这个api去创建的话，图标在苹果手机正常显示，安卓手机会显示非常大。
### 结束语
本文简单分享一下，希望对你有所帮助。更多详细的内容请看小程序文档，以及官方示例。