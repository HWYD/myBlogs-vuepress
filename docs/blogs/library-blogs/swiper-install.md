---
lastUpdated: false
---
### 安装的烦恼
swiper插件非常强大，可以帮助我们实现很多酷炫的效果。但是它现在的版本非常多，相信有很多的小伙伴，会像我一样照着文档进行安装导入后，却发现报错了，不是swiper找不到，就是css样式找不到，等诸如此类的问题，然后折腾了半天，然后还没装成功，笑死hhh。所以本文记录一下nuxt2使用swiper插件的过程(nuxt版本为2.14.5)。
### 简单说下swiper插件的版本
我们在安装过程中失败的最主要原因可能就是版本的问题，比如你看到文档版本跟你安装的版本不同，然后导致安装使用不成功。swiper3，swiper4,swiper5版本插件主要是vue-awesome-swiper，[这里是gitbub地址](https://github.com/surmon-china/vue-awesome-swiper)仓库名字也叫vue-awesome-swiper，但是这个也有不同版本，安装引入也不一样，这是坑之一。swiper6插件名字是swiper[这里是github地址](https://github.com/nolimits4web/swiper),仓库名也叫swiper。接下来我将复现一下我安装的swiper4版本和swiper5版本两种版本。

### nuxt安装使用swiper4插件
#### 步骤一：安装vue-awesome-swiper3.1.3

```js
   npm install vue-awesome-swiper@3.1.3
```
注：vue-awesome-swiper3.1.3虽然是3.多的版本，但是就是swiper4哈哈哈
#### 步骤二： 注册插件
在项目src目录同级创建plugins文件夹，然后新建一个js文件(名字可以自定义)，例如：plugins/swiper.js,里面写如下内容。

```js
import Vue from 'vue'
import VueAwesomeSwiper from 'vue-awesome-swiper/dist/ssr'
import 'swiper/dist/css/swiper.css'

Vue.use(VueAwesomeSwiper)
```
#### 步骤三：在nuxt.config.js文件中进行配置我们写的swiper.js


```js
module.exports = {
  plugins: ['~/plugins/swiper.js']
}
```
#### 步骤四：使用Swiper directive API(vue指令)使用
注：如果是一般的vue单页面项目的话，我们可以import导入swiper组件进行使用，但是在nuxt这个ssr项目中会报window is not defined 的问题，所以我们要用swiper提供的适用于ssr的指令在页面上去使用。

```js
<template>
  <div v-swiper:mySwiper="swiperOption">
    <div class="swiper-wrapper">
      <div class="swiper-slide" :key="banner" v-for="banner in banners">
        <img :src="banner">
      </div>
    </div>
    <div class="swiper-pagination"></div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        banners: [ '/1.jpg', '/2.jpg', '/3.jpg' ],
        swiperOption: {
          pagination: {
            el: '.swiper-pagination'
          },
          // ...
        }
      }
    },
    mounted() {
      console.log('Current Swiper instance object', this.mySwiper)
      this.mySwiper.slideTo(3, 1000, false)
    }
  }
</script>
```
成功的话页面就展示出来了~

### nuxt安装使用插件swiper5
#### 步骤一：安装vue-awesome-swiper4.1.1和swiper@5.4

```js
   npm install vue-awesome-swiper@4.1.4
   npm install swiper@5.4
```
注：这里需要需要多安装一个swiper，否则会报css样式文件找不到的错误,swiper5.4亲测可用,vue-awesome-swiper4.1.1的版本虽然是4.多，但确实是swiper5。
#### 步骤二： 注册插件
在项目src目录同级创建plugins文件夹，然后新建一个js文件(名字可以自定义)，例如：plugins/swiper.js,里面写如下内容。

```js
import Vue from 'vue'
import VueAwesomeSwiper from 'vue-awesome-swiper'  //可以看到与上面版本的引入路径不同
import 'swiper/css/swiper.css'   //可以看到与上面版本的引入路径不同

Vue.use(VueAwesomeSwiper)
```
#### 步骤三：在nuxt.config.js文件中进行配置我们写的swiper.js


```js
module.exports = {
  plugins: ['~/plugins/swiper.js']
}
```
#### 步骤四：使用Swiper directive API(vue指令)使用
注：如果是一般的vue单页面项目的话，我们可以import导入swiper组件进行使用，但是在nuxt这个ssr项目中会报window is not defined 的问题，所以我们要用swiper提供的适用于ssr的指令在页面上去使用。

```js
<template>
  <div v-swiper:mySwiper="swiperOption">
    <div class="swiper-wrapper">
      <div class="swiper-slide" :key="banner" v-for="banner in banners">
        <img :src="banner">
      </div>
    </div>
    <div class="swiper-pagination"></div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        banners: [ '/1.jpg', '/2.jpg', '/3.jpg' ],
        swiperOption: {
          pagination: {
            el: '.swiper-pagination'
          },
          // ...
        }
      }
    },
    mounted() {
      console.log('Current Swiper instance object', this.mySwiper)
      this.mySwiper.slideTo(3, 1000, false)
    }
  }
</script>
```
成功的话页面就展示出来了~


### 归纳总结
#### 问题分析
在安装swiper插件失败的过程中，我思考了我操作失败的可能原因：
1.  版本的问题  (安装版本与所看文档版本不同)
2.  配置的问题  (没有进行nuxt引入插件相关配置或错误配置)
3.  使用方法的问题  (nuxt中应该使用swiper提供的指令使用，而不是常用的import 组件的方式)
哈哈哈哈上面的坑都踩过，看了很多遍博客，还是无法成功安装，最后在官方文档找到了，所以认真的看对对应版本官方文档非常重要~。

#### 总结一下

上面的安装方法本人成功使用过，大家按照上面两个版本的安装方法的任意一种进行安装应该是可以正常成功的。如果不成功或者想安装其他更新的版本，建议查看github的文档说明，要重点对应版本的文档，不同版本的swiper的引入文件路径或者文件多少、方法有些许不同。

