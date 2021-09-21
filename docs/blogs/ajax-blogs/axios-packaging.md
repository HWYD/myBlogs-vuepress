---
theme: channing-cyan
---
#### 在学习和做项目的时候经常会碰到axios，之前做的项目一般都是配置好axios，所以自己一直有个大概印象，最近有个机会自己可以手动配置axios，顺便记录分享一下~
### axios封装的好处
axios封装的好处是统一处理，提高效率，便于维护。

你可以像下面一样这么使用axios请求接口

```js
axios.get('http://localhost:10086/user?ID=12345')
  .then(response => {
    //成功后的操作...
  })
  .catch(error => {
    //失败后的操作...
  });
```
但是当接口请求多起来，需求多起来的时候，在项目中每个需要接口请求的地方写一遍这样的代码，这样就会产生很多重复性的代码，降低我们的开发效率和提高维护成本。

### 封装思路
我们需要一次性集中配置axios，让配置适应我们项目的大部分场景。我们可以新建一个js文件，使用自定义配置新建一个 axios 实例，然后对实例进行基本配置，在请求前(请求体处理)，请求后(返回的结果处理)等这些阶段添加一些我们需要的处理，然后将其导出使用。
### 配置的优先顺序
配置会以一个优先顺序进行合并。这个顺序是：在 `lib/defaults.js` 找到的库的默认值，然后是实例的 `defaults` 属性，最后是请求的 `config` 参数。(这样有些特殊的场景我们也可以单独处理)
###### node_modules文件夹下axios库文件下的lib/defaults.js。
![1631849876(1).png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/268e3499aee149f3862a832d56791c9e~tplv-k3u1fbpfcp-watermark.image?)

###### 自定义实例默认值
```js
const instance = axios.create({
  baseURL: 'https://api.example.com'
});
```

###### 请求的config参数
```js
axios({   
method:'get',   
url:'http://bit.ly/2mTM3nY',   
responseType:'stream' }).then(function(response) {   response.data.pipe(fs.createWriteStream('ada_lovelace.jpg')) });
```
### axios实例配置
#### 1、定义一些常规的配置
- 设置BaseUrl
> baseUrl一般有分为生产、开发、测试等多个地址，我们可以弄一个config.js进行存放，如果是vue或react我们可以新建env等文件进行存放，下面的baseUrl是使用react的环境变量的。
- 设置timeout请求超时的时间
- 设置数据请求的格式Content-Type(有 application/x-www-form-urlencoded、multipart/form-data、application/json...)等等


```js
import axios from 'axios'

export const request = createAxiosInstance()

function createAxiosInstance () {
  const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    timeout: 5000,
    headers: {
      // 可定义统一的请求头部
      post: {
        'Content-Type': 'application/json'
      }
      ...
    }
  })
  return instance
}
```
#### 2、请求前加一些我们需要的操作，
- 比如需要在请求头里添加token
- 请求参数判空处理
> (下图的例子传了空的name和personId，这种会引起歧义，究竟是要获取参数值为空还是忽略这些参数呢，有一些后端会进行一些处理，但前端还是尽量避免~)

  ![1632053184(1).png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f27355fb00f46a0973773d8e9f7b081~tplv-k3u1fbpfcp-watermark.image?)
- 每次接口请求时开启loading动画效果等等

```js
  // 添加请求拦截器(在发送请求之前做些什么)
  instance.interceptors.request.use((config) => {
      //可添加开启loading效果的函数
      loading.open()  
      //token 存在就添加到请求头里
      token && (config.headers.Authorization = token)
     // 过滤请求参数中的 null undefined ''的函数
      cleanObject()
      return config
  })
```

#### 3、请求返回后，添加拦截操作，
- 处理成功返回的数据
比如后端返回的data数据可能嵌套了很多层，你可以直接返回你需要的data数据，这样业务代码就可以直接拿到最终的数据，而不用每次去解构之类的。
- 统一处理失败后的异常报错
接口请求有成功也有失败，如果你不想在每写一个接口请求的时候都需要去写一遍失败的逻辑代码，并且几乎都是重复的时候，那你可以在这里集中进行接口的统一的异常处理。如判断状态码或后端自定义的code，并把后端返回的错误提示显示出来。

```js
 // 添加响应拦截器(对响应数据做点什么)
  instance.interceptors.response.use((response) => {
   //可添加关闭loading效果的函数
      loading.close()  
      //解构出返回结果的数据
      const res = response.data
      //对自定义code码进行判断,将成功的数据返回出去
      const validateStatus = /^(2|3)\d{2}$/ //code为2或3开头的视作请求成功
      if (validateStatus.test(res.code)) {
        return res      //直接return出去我们需要的data
      }
      //判断失败的code码并作出提示等操作
      if (res.code === 401) {
        message.error(res.msg)
      } else {
        message.warning(res.msg)
      }
      return Promise.reject(res)
      },
      (error) => {
      loading.close() 
      if (error.response.status === 401) {
        message.error('token失效，请重新登录！')
        removeStorageToken()
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      } else {
        if (!window.navigator.onLine) {
          message.warning('网络异常，请检查网络是否正常连接')
        } else if (error.code === 'ECONNABORTED') {
          message.warning('请求超时')
        } else {
          message.warning('服务器异常，请联系管理员')
        }
      }
      return Promise.reject(error) // 将错误继续返回给到具体页面
    }
      )
```
上面有根据HTTP状态码和自定义code做的一些错误处理，这里进行了错误拦截后，页面进行业务接口调用的时候就不用再每次进行错误提示处理。当然要根据不同项目需求进行配置。
### 请求接口方法统一管理
一般我们会把所有的接口请求方法写在一起进行统一管理，后期更改的时候也方便查找维护。
![1632057564(1).png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e296f5976e9447aa66ec30c6ff7ab5c~tplv-k3u1fbpfcp-watermark.image?)

我们可以新建一个管理api请求的文件夹(如apiList)，里面放我们各种请求文件(这里按功能分)。如user.js就存放用户相关的请求，其他类推。然后页面就可以直接引用方法进行接口调用。

```js
import { request } from '../axios'

// 获取用户信息
export function getUserInfo (userId) {
  return request.get(`/sys/user/info/${userId}`)
}
```
在组件或页面直接调用方法就可以了~
### 最后放一下完整的示例！大家可以参考一下~
这个示例配置适用于vue或react,当然每个项目的配置都会有些不同，小伙伴要根据自己项目进行修改配置和扩充~

```js
import axios from 'axios'

export const request = createAxiosInstance()

function createAxiosInstance () {
  const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    timeout: 5000,
    headers: {
      // 可定义统一的请求头部
      post: {
        'Content-Type': 'application/json'
      }
      ...
    }
  })
   // 添加请求拦截器(在发送请求之前做些什么)
  instance.interceptors.request.use((config) => {
      //可添加开启loading效果的函数
      loading.open()  
      //token 存在就添加到请求头里
      token && (config.headers.Authorization = token)
     // 过滤请求参数中的 null undefined ''的函数
      cleanObject()
      return config
  })
  // 添加响应拦截器(对响应数据做点什么)
  instance.interceptors.response.use((response) => {
   //可添加关闭loading效果的函数
      loading.close()  
      //解构出返回结果的数据
      const res = response.data
      //对自定义code码进行判断,将成功的数据返回出去
      const validateStatus = /^(2|3)\d{2}$/ //code为2或3开头的视作请求成功
      if (validateStatus.test(res.code)) {
        return res
      }
      //判断失败的code码并作出提示等操作
      if (res.code === 401) {
        message.error(res.msg)
      } else {
        message.warning(res.msg)
      }
      return Promise.reject(res)
      },
      (error) => {
      loading.close()  //可添加关闭loading效果的函数
      if (error.response.status === 401) {
        message.error('token失效，请重新登录！')
        removeStorageToken()
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      } else {
        if (!window.navigator.onLine) {
          message.warning('网络异常，请检查网络是否正常连接')
        } else if (error.code === 'ECONNABORTED') {
          message.warning('请求超时')
        } else {
          message.warning('服务器异常，请联系管理员')
        }
      }
      return Promise.reject(error) // 将错误继续返回给到具体页面
    }
      )
  
  return instance
}
```


