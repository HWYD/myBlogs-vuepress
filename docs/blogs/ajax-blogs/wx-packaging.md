---
theme: channing-cyan
---
### 前言
在开发微信小程序的时候，难免需要调用一些接口，微信官方提供的请求接口的方法：wx.request，方法简单容易上手的，不过当接口多了，每个都去直接调用wx.request会写很多重复性的代码，造成代码冗余也不好看。
### wx.request的使用例子
```js
wx.request({
  method: 'GET', 
  url: 'http://localhost:3000/api1', //仅为示例，并非真实的接口地址
  data: {
    x: '',
    y: ''
  },
  header: {
    'content-type': 'application/json'， // 默认值
    'Authorization': wx.getStorageSync('token') || ''
  },
  success (res) {
    if(res.data.code === 200){
      console.log(res.data.data)  //这是我们想要的数据
    }
    if(res.data.code !== 200){
      ...
    }
  }
})
```
如果每次请求都写一遍的话，那么会写很多次重复的代码，如：
- 重复拼接url路径
- 如果需要携带token，每次都得写一遍
- 重复判断接口的请求的成功与失败，重复解构data值，重复进行一些报错提示等等
### 简单的封装一下方法

#### 第一步
- 新建一个request.js文件，然后定义一个wxRequest函数对wx.request进行封装
- 在使用wx.request我们一般需要url、接口请求参数data、请求的方法：get，post等、还有请求头的变化，是否需要loading效果之类的，这些我们作为方法的参数，然后给一些默认值，
- 为了调用这个方法可以进行链式调用，我们用promise包裹一下。

```js
 const wxRequest = (url,data={},method="GET",header={}) =>{
  return new Promise((resolve,reject) =>{
  })
}

module.exports = wxRequest

```
#### 第二步
- 使用wx.request，使用函数接收的参数

```js
const baseUrl  = 'https://localhost:8080'  //模拟的baseUrl

const wxRequest = (url, data = {}, method = 'GET', header = {}) => {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: ''
    })
    wx.request({
      //将函数的参数传进来，使用es6语法简写
      url: `${baseUrl}${url}`,
      method,
      data,
      header: {
        //请求头是否需要携带token之类的
        Authorization: wx.getStorageSync('token') || '', 
        ...header
      },
      success: (res) => {
       // 接口调用成功的回调函数
      },
      fail: (err) => {
       // 接口调用失败的回调函数
      }
    })
  })
}

module.exports = wxRequest

```
#### 第三步
接着我们处理一下结果，这里根据自定义状态码判断成功返回解构的数据，错误统一进行报错提示处理

```js
const  baseUrl  = 'http://localhost:8080'

const wxRequest = (url, data = {}, method = 'GET', header = {}) => {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: ''
    })
    wx.request({
      url: `${baseUrl}${url}`,
      method,
      data,
      header: {
        Authorization: wx.getStorageSync('token') || '',
        ...header
      },
      success: (res) => {
        wx.hideLoading()
        const { code,data,msg } = res.data
        if (code === 200) {
          resolve(data)   //根据情况返回出我们想要的那一层数据
        } else if (resData.code === 4001) {
          //常见错误处理，如自定义code为4001的时候token失效，
          wx.showToast({
            title: 'token失效',
            icon: 'none',
            duration: 2000
          })
          reject(msg||'token失效')
        }
        else {
          //其他的错误情况
          wx.showToast({
            title: msg,
            icon: 'none',
            duration: 2000
          })
           reject(msg||'error')
        }
      },
      fail: (err) => {
        wx.hideLoading()
        console.log(err, 'err')
      }
    })
  })
}

module.exports = wxRequest
```
### 页面调用

```js
const wxRequest = require('../../../utils/request')  //引入
//根据情况传递参数，不需要可省略
  wxRequest(`/api`).then((res) => {
     console.log(res)
    })
```
### 结束语
这里只是简单展示一下，大家有更好的封装思路可以分享给我，也可以根据情况进行更复杂的封装。