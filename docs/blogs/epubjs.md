##### 一个简易的 epub 电子书籍阅读器代码，可以展示书籍和书籍翻页。

流程：

- 准备 epub 电子书籍

- 引入 epubjs 插件

```js
this.book = new Epub('电子书文件路径')
```

- 将电子书挂载 DOM 节点

```js
this.rendition = this.book.renderTo('bookRender', {
  width: window.innerWidth,
  height: window.innerHeight
})
```

- 翻页(调用 epubjs 插件方法)

```js
this.rendition.prev() //上一页
this.rendition.next() //下一页
```

```js
//完整代码
<template>
  <div class="ebook">
    <div class="read-wrapper">
      <div id="bookRender"></div>
      <div class="mask" >
        <div class="left" @click="prevPage"></div>
        <div class="center"></div>
        <div class="right" @click="nextPage"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Epub from 'epubjs'
const bookUrl = '山海经.epub'
export default {
  name: '',
  data(){
   return{
     book:'',
     rendition:''
   }
  },
  methods:{
    showEpub(){
    this.book = new Epub(bookUrl)
    this.rendition = this.book.renderTo('bookRender',{
      width:window.innerWidth,
      height:window.innerHeight
    })
    this.rendition.display()
    },
    prevPage(){
    this.rendition.prev()
    },
    nextPage(){
     this.rendition.next()
    }
  },
  mounted(){
    this.showEpub()
  }
};
</script>

<style scoped lang="scss" rel='stylesheet/scss'>
.ebook{
  position: relative;
  .read-wrapper{
   .mask{
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    width: 100%;
    height: 100%;
    z-index: 10;
    .left{
     flex: 0 0 20%;
    }
    .center{
      flex: 1;
    }
    .right{
      flex: 0 0 20%;
    }
   }
  }
}

</style>

```
