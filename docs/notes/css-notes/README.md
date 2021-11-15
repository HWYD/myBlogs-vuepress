---
highlight: an-old-hope
theme: vuepress
lastUpdated: false
---
### css盒模型

-   盒子的组成：content内容、padding内填充、border边框、margin外边距
-   背景色会平铺到非margin的区域

-   子元素设置margin-top，父元素也会有的传递的问题
    -   不用margin-top,使用padding代替

    -   父元素添加border边框,padding等可以使得现象消失

    -   bfc

-  margin上下重叠的现象，margin-top和margin-bottom会取较大值
    -   设置一种就可以了

    -   bfc解决

- 块级盒子与内联盒子
    -  块级盒子
        -   独占一行

        -   支持所有样式
     - 内联盒子
         -   盒子不会产生换行

         -   有些样式不支持，例如：width、height，margin，padding等

         -  不写宽度的时候，宽度由内容决定

         -   所占的内容不一定是矩形
     - 块级盒子主要做布局，内联盒子主要做修饰

- 标准盒模型和怪异盒模型
    -  标准盒模型： width指的是内容content的大小
    -  怪异盒模型： width指的是内容 content+padding+boder 三者的大小

    -   怪异盒模型的应用
        - 量取尺寸时不用再去计算一些值
        - 解决一些需要设置百分比和盒模型值
### float浮动
#### 清除浮动的方案
- clear属性
    - 上面的div设置了float:left;
    - 下面的div 设置 clear:left;或者clear:both; 就可以恢复正常
- bfc
- 使用空标签
- .clearfix::after{}    //类似空标签的方法

```js
 .clearfix::after{
      content : "" ;
      clear:both ;
      display:block ;
  }
```
#### 浮动特性注意点
-   只会影响后面元素

-   文本不会被浮动元素覆盖

-   具备内联盒子特性：宽度由内容决定

-   具备块级盒子特性：支持所有样式

-   浮动放不下，会自动换行
### 定位

-   static

-   relative

-   absolute

    -   脱离文档流，不占据空间


    -   具备内联盒子特性：宽度由内容决定


    -   具备块级盒子特性：支持所有样式


    -   相对于最近的非static祖先元素定位。如果都没有就以视口定位
    
-   fixed


-   sticky


    -   粘性定位可以被认为是相对定位和固定定位的混合。元素在跨越特定阈值前为相对定位，之 后为固定定位


### flex弹性盒子
- 弹性盒子是一种用于按行或按列布局元素的一维布局方法。元素可以膨胀以填充额外的空间，收缩以适应更小的空间
- flex容器
-   flex-direction


-   flex-wrap


-   justify-content


-   align-item


    -   stretch(默认)


    -   flex-start


    -   flex-end


    -   center


    -   baseline


-   flex-flow


-   align-content


    -   当不折行的情况下，align-content是不生效的，多行情况才会生效\


    -   stretch（默认）


    -   flex-start


    -   flex-end


    -   center


    -   space-around


    -   space-between


    -   space-evenly

### grid网格布局


 -   css网格是一个用于web的二维布局系统。利用网格，你可以把内容按照行与列的格式进行排版。

