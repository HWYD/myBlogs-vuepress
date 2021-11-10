---
theme: vuepress
---
## webpack是什么？
webpack是一个模块打包工具，和webpack相似的工具有：grunt、gulp、browserify
## 模块引入规范
- ES Moudule 模块引入方式

```js
import Header from './header.js'
```
- CommonJS 模块引入规范

```js
const Header = require('./header.js')
```
- CMD
- AMD
## 安装webpack
### 全局安装(不推荐，只能用一个版本号)
`npm install webpack webpack-cli -g`
- 使用：webpack index.js
### 项目内安装
`npm install webpack webpack-cli -- save-dev`
- 使用：npx webpack index.js
## 提升webpack打包速度
-   保持node版本尽量的新

-   webpack版本尽量的新

## webpack的配置文件
- webpack.config.js(默认文件名)

```js
 module.exports = {

      entry: './src/index.js', //从哪个文件开始打包

      output:{ //打包的文件放在哪里

      filename: 'bundle.js', //打包文件名

      path: path.resolve(_dirname, 'dist') //放在哪个文件夹下

     }

 }
```
-  没有webpack.config.js文件

```js
 使用webpack本身自带的默认配置
```  
-  其他命名的配置文件(如webpackset.js)

```js
 npx webpack -- config webpackset.js (跟默认文件名不同)
```
## 运行webpack打包命令
-  global

```js
webpack index.js
```
-  项目内

```js
npx webpack index.js
```
- 配置package.json中的scripts选项然后进行打包，如：

```js
npm run bundle -> webpack
```
## **loader**

>  用来识别处理非js文件,是一种打包方案

```js
   module:{

      rules: [{

      test: /\.jpg$/,

       use: { loader: "file-loader" }

      }]
   }
```
### file-loader做了哪些事情
#### 比如当发现引入了图片模块的时候，首先会把图片移动到dist目录下， 会改名字(可自定义)，返回图片的地址，理论上可以处理任何静态资源
#### 可以配置一些参数：options

```js
   rules:[
  {

      test:/\.jpg$/,

       use:{

      loader:'url-loader',

      options:{

       name:'[name]_[hash].[ext]', // name: ‘[name].[ext]’ // 占位符 老图片的名字，老图片的后缀

       outputPath:'images/',

       limit:'204800'

  }
  }
  }]

```
### url-loader
-  **会把图片转为base64文件放在js文件中**
- **好处：节省了图片的http请求**
- **坏处，使得js文件变大，使页面加载变慢**

```js
   module.exports = {

   mode: 'development',

   entry:{

   main : './src/index.js'

   },

  module:{

  rules:[{

   test: /\.(jpg|png|gif)$/,

   use:{

  loader : 'url-loader',

   options : {

   name: '[name]_[hash].ext',

  outputPath: 'images/',

  limit: 2048 //小于2048个字节的话使用url-loader变成base64的字符串，否则生成文件
   }
   }
  }]
  }
  }
```
### css资源打包的loader
- css-loader 和 style-loader
css-loader配合style-loader去处理打包
- css预处理器loader
使用css预处理器时需要安装对应的css预处理器loader，如sass需要安装node-sass 和 node-sass
- css添加厂商前缀的loader：postcss-loader

- css打包模块化：各个css文件互不影响，互不耦合和冲突
## **plugins**
> 可以在webpack 运行到某个时刻的时候，帮你做一些事情
- htmlWebpackPlugin
会在打包结束后，自动生成一个html文件，并把打包生成的js自动引入到这个html文件中
- clean-webpack-plugin
第三方插件，用于打包成功前清空dist文件夹

```js
   plugins: [new HtmlWebpackPlugin({

   template:'./index.html'

   }), new CleanWebpackPlugin(['dist']) ]
```
## **sourceMap**
它是一个映射关系，默认是被配置的，假如它知道dist目录下main.js文件96行出错了，实际上对应的是src目录下index.js文件中的第一行它会帮你提示当前其实是index.js中第一行代码出错了

- 最佳组合：可以知道源代码出错的地方，而不是打包后的代码哪里出错了

```js
   module.exports ={

   mode:'development',

   devtool:'cheap-module-eval-source-map',

   // devtool:'cheap-module-source-map', //线上的生产环境

   }

```
### eval:是最快的一种打包方式
## 监听代码改变自动打包三种方法
1. package.json添加命令

```js
   "scripts": {
   "bundle": "webpack --watch",
   },
```
2. 使用WebpackDevServer

```js
   module.exports ={
   devServer:{
   contentBase:'./dist',
   open:true,
   port:8081
  }}
```
3. 自己写一个类似WebpackDevServer的方法
## WebpackDevServer
> 监听代码改变自动打包并刷新，开启web服务器，可以进行ajax请求

```js
   module.exports ={
   devServer:{
   contentBase:'./dist',
   open:true,
   port:8081
  }}
```
## Hot Module Replacement 热模块更新

```js
//  webpack.config.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpack = require('webpack')
module.exports ={
mode:'development',
devtool:'cheap-module-eval-source-map',
entry: {
main:'./src/index.js',
    },
devServer:{
contentBase:'./dist',
open:true,
port:8081,
hot:true,
hotOnly:true
    },
module:{
rules:[
        {
test:/\.jpg$/,
use:{
loader:'url-loader',
options:{
name:'[name]_[hash].[ext]',
outputPath:'images/',
limit:'204800'
            }
          }
        },
    {
test:/\.(eot|ttf|svg)$/,
use:{
loader:'file-loader',
      }
    },
    {
test:/\.css$/,
use:['style-loader',
'css-loader',
'postcss-loader'
      ]
    },
    {
test:/\.scss$/,
use:['style-loader',
      {
loader:'css-loader',
options:{
importLoaders:2,
// modules:true
        }
      },
'sass-loader',
'postcss-loader'
      ]
    }
      ]
    },
plugins: [new HtmlWebpackPlugin({
template:'./index.html'
    }), new CleanWebpackPlugin(['dist']),
new webpack.HotModuleReplacementPlugin()
  ],
output: {
filename: '[name].js',
path: path.resolve(__dirname,'dist')
    }
}

```
模块化之间互不影响

```js
if(module.hot){
  module.hot.accept('./number',()=>{
  document.body.removeChild(document.getElementById('number'))
  number()
    })
  }
```
## 使用babel处理es6语法
> babel-loader、babel\core 将es6转为es5语法
@babel/preset-env
### @babel/polyfill
处理低版本浏览器没有的一些语法和特性，添加对象的方法，如promise之类的
根据业务代码按需添加特性方法，减少代码体积,需要添加配置项

```js
module:{
  rules:[
          {
  test:/\.js$/,
  exclude: /node_modules/,
  loader: "babel-loader",
  options: {
  presets: [['@babel/preset-env',
             { useBuiltIns : 'usage' }
          ]]
     } },]}
```
可以配置兼容到浏览器的哪个版本

```js
{
  test:/\.js$/,
  exclude: /node_modules/,
  loader: "babel-loader",
  options: {
  presets: [['@babel/preset-env',
             { 
  targets:{ 
  chrome : "67"
                 },
  useBuiltIns : 'usage' 
             }
          ]]
            }
          },
```
@babel/plugin-transform-runtime

```js
{
  test:/\.js$/,
  exclude: /node_modules/,
  loader: "babel-loader",
  options: {
  //业务代码配置
  //     presets: [['@babel/preset-env',
  //    { 
  //      targets:{ 
  //        chrome : "67"
  //        },
  //     useBuiltIns : 'usage' 
  //    }
  // ]]
  // 库代码配置
"plugins": [
  [
"@babel/plugin-transform-runtime",
    {
"corejs": 2,
"helpers": true,
"regenerator": true,
"useESModules": false
    }
  ]
]
  }
},
```
babel配置内容过多时候，使用.babelrc放options配置
## Tree Shaking
> 打包的时候去除没有引用的模块，只支持 ES Module 静态引入的方法，CommonJs是动态引入的

```js
// webpack.config.js
optimization:{                     // 生产模式下可以不写
  usedExports : true
    },
// package.json
"sideEffects": false,  
"sideEffects": ["*.css"]      //如果需要忽略哪些模块，让哪些模块不被Tree Shaking，用数组表示
```
## Development和Production模式的区分打包
- 可以分生产模式和开发模式两个js配置文件
- 避免重复代码，还可以分三个文件，一个共用的，一个生产模式，一个开发模式
  需要使用webpack-merge 进行合并
1. 开发环境
需要使用webpack-dev-server 方便我们进行开发
2. 生产环境
需要对sourcemap 进行精简，代码进行压缩
## webpack 和 code Splitting代码分割
代码分割，和webpack无关
webpack 中实现代码分割，两种方式
- 同步代码：只需要在webpack.common.js中做optimization 的配置

```js
optimization:{
  splitChunks:{
  chunks:all
      }
    },
```
- 异步代码(import)：异步代码，无需做任何配置，会自动进行代码分割 ，放置到新的文件中。
## 打包时不分割代码与分割代码
- 不分割
假设首次访问页面时，main.js  2mb
打包文件会很大，加载main.js(2mb)
当页面业务逻辑发生变化时，又要加载 2mb的内容
- 分割代码
main.js被拆分为  lodash.js(1mb)，main.js(1mb)
当页面业务逻辑发生变化时，只要加载main.js即可(1mb)
## css文件的代码分割

```js
output : {
  filename :  '[name].js',       //直接被引用走这里
  chunckFilename : '[name].chunk.js'         // 间接被引用走这里
}
```
mini-css-extract-plugin:
在生产环境配置
在开发环境不配置，因为暂时没有热更新功能，需要手动刷新，影响开发速度(缺陷)
## webpack与浏览器缓存
> 如果不是强制刷新，请求的文件名字相同将不会重新请求,需要给打包生成的文件进行哈希值命名

```js
output:{
  filename: '[name].[contenthash].js',
  chunkFilename: '[name].[contenthash].js',
      }
```
## shimming的作用(垫片)
>    修改webpack原有的一些行为，或者webpack原有不能实现的行为,代码兼容，打包过程兼容
   有些低版本浏览器可能没有promise这些方法，导致程序无法进行，借助babelprofill，这也叫shimming的作用

```js
const webpack = require('webpack')
        plugins: [
        new webpack.ProvidePlugin({
        $:'jquery'                         //帮一些古老的插件，如jq，当使用$这个符号时，自动帮忙import jquery插件
        _:'lodash'
          })
          ],
```