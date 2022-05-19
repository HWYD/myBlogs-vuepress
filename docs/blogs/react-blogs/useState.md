
### useState Hook是什么？
是可以让我们在使用React编写函数组件时，拥有响应式变量state，并且可以修改state。

### 使用 useState Hook
核心是useState这个函数，利用这个去创建一个响应式变量和一个可修改这个响应式变量的函数。

我们先看下方的一个例子，使用useState定义了一个响应式变量name，还有改变name的方法setName.当我们点击按钮时，名字就会由小明变为小红
```js
import { useState } from 'react'

function App() {
  const [name, setName] = useState('小明')
  return (
    <>
      <div>名字：{name}</div>
      <button onClick={() => { setName('小红') }} >
        改变名字
      </button>
    </>
  )
}

export default App
```

#### 为什么是以这种形式 const [name, setName] = useState('小明') 定义的？
useState是一个函数，调用这个函数会返回一个数组，返回的这个数组包含了什么呢？这个数组有两个值，第一个值是响应式变量state，第二值是可以改变这个state的函数。所以这里是使用到了数组解构赋值的写法，useState返回的值的名字是可以自己定义的，如你要写成 const [name1, changeName1] = useState('小明') 也是可以的。

如下面的例子，不使用数组解构赋值的话，代码看起来就不那么简洁了。
```js
import { useState } from 'react'

function App() {
  const nameVal = useState('小明')
  const name = nameVal[0]
  const setName = nameVal[1]

  return (
    <>
      <div>名字：{name}</div>
      <button
        onClick={() => {
          setName('小红')
        }}
      >
        修改名字
      </button>
    </>
  )
}

export default App

```

注：useState可传参或不传，参数为响应式变量的初始值。

#### 定义多个state

```js
import { useState } from 'react'

function App() {
  const [name, setName] = useState('小明')
  const [age, setAge] = useState(18)
  return (
    <>
      <div>名字：{name}</div>
      <div>年龄：{age}</div>
      <button  onClick={() => { setName('小红') }} >
        修改名字
      </button>
      <button onClick={() => { setAge(age+1) }} >
        修改年龄+1
      </button>
    </>
  )
}

export default App
```

#### 相关联的变量我们也可以定义在一个同对象变量state里

```js
import { useState } from 'react'

function App() {
  const [info, setInfo] = useState({
    name: '小丁',
    age: 10,
    address: '地球'
  })

  return (
    <>
      <div>名字：{info.name}</div>
      <div>年龄：{info.age}</div>
      <div>地址：{info.address}</div>
      <button
        onClick={() => {
          setInfo({
            ...info,
            age: info.age + 1
          })
        }}
      >
        修改年龄+1
      </button>
    </>
  )
}

export default App

```
这个例子把相关的信息都放在 info 这个state变量里，这样我们使用了一个useState声明了三个属性，而不用去声明多个useState,这样子代码比较整洁。还有一个细节，我们这里只修改一个属性age，那么我们可以使用解构赋值简化写法，而不用把一个个属性列出来。

注：useState Hook更新 state 变量总是*替换*它而不是合并它。

### 与 Class组件 对比
   #### 需要在构造函数中定义 state 响应式变量,并通过 this.setState 这个方法去修改state。
   
```js
import React from 'react'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { name: '小明',age:18 }   //在给构造函数里定义state,值为对象或null
  }
  changeName = (name) => {
    this.setState({ name })        //通过 this.setState修改state,修改是会进行合并的
  }

  render() {
    return (
      <div>
        name:{this.state.name}
        <button onClick={() => { this.changeName('小红') }} >
          修改名字
        </button>
      </div>
    )
  }
}

export default App

```
#### 通过this.setState 修改 state 时用到上一次的 state 值
这个时候可以向setState这个函数传入一个参数函数，这个参数函数又可以接收两个参数，分别是上一次的state和props。通过这两个参数就可以根据上一次的state进行新的更改，最后要返回一个你想设置的state对象出来。

```js
import React from 'react'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      age: 18
    }
  }

  changeAge = () => {
    this.setState(function (state, props) {   //传入一个函数，可以获取到上一次的state,并返回一个对象
      return {
        age: ++state.age
      }
    })
  }

  render() {
    return (
      <div>
        count:{this.state.age}
        <button
          onClick={() => {
            this.changeAge()
          }}
        >
          修改年龄
        </button>
      </div>
    )
  }
}

export default App

```

### 与 Vue 对比
   #### 选项式api
   Vue选项式api是有专门的data选项让我们去定义响应式变量的，我们要修改这个值的话是直接重新赋值就可以，不像React Hook 需要借助 useState 返回的方法去修改。
```js
<template>
  <div>
    <div id="app">名字：{{ username }}</div>
    <button @click="setName">点击改名字</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '小明'
    }
  },
  methods: {
    setName() {
      this.username = '小红'
    }
  }
}
</script>

```
   
   #### 组合式api
   定义响应式变量我们需要借助 ref 或 reactive，我们要修改这个值的话也是直接重新赋值就可以。
   
```js
<template>
 <template>
  <div>ref名字： {{ useName }}</div>
  <button @click="setUserName">点我改变ref名字</button>
  <div>reactive名字： {{ info.name }}</div>
  <button @click="setInfoName">点我改变reactive名字</button>
</template>

<script setup>
import { ref, reactive } from 'vue'

const useName = ref('小明')
function setUserName() {
  useName.value = '小红'
}

const info = reactive({
  name: '小白',
  age: 18
})
function setInfoName() {
  info.name = '大白'
}
</script>

</script>

```
### 结束语
本文是个人的学习总结，如果对你有所帮助我很开心，如果有错误或建议欢迎指出！

[react官网：https://zh-hans.reactjs.org/docs/hooks-effect.html](https://zh-hans.reactjs.org/docs/hooks-effect.html)
   