
### useEffect Hook是什么？
是可以让我们在用React编写函数组件时，在组件的每次渲染时，可以选择是否去执行一些函数操作或事件监听，这些事件监听也可以选择在后续更新渲染或组件销毁阶段去移除。从而可以实现组件的初次渲染、更新渲染、监听某些变量值否变化、销毁等这些时机来做一些事情。


### 使用 useEffect Hook
核心是useEffect这个函数，通过传递不同的参数来达到不同的实现效果。

有两个参数，第一个参数是函数，我们称之为effect(effect函数里还可返回一个函数)，第二个参数是一个包含state或props变量的数组(可不传也可为空数组)。


```js
     useEffect(() => {
      //effect函数，在这里可以获取最新的state，props
      return function () {
      //effect函数里返回的函数，在这里可以获取上一次的state，props
      }
     }, [...])
```

#### 组件每次渲染都会执行useEffect，但是它的第一个参数函数effect是否执行是根据第二个参数的，流程如下
- 初次渲染时，第一个参数函数，我们称之为effect，它会执行一次，然后返回一个函数，也可不返回
- 更新渲染时，判断第二个参数数组，是否发生过变化，变化了，先执行上一次effect中返回的函数，然后再执行新的effect；如果没有变化，那什么也不做
- 组件销毁时：执行上一次effect中返回的函数


#### 根据这个特性，下面我们依次使用useEffect Hook来实现五种效果(注意写法)

##### 效果1：实现生命周期的 初次渲染 效果 ( React class 组件中的 componentDidMount效果)
我们创建了一个名为LearnEffect的组件进行演示，通过改变state来引起页面重新渲染,然后看看运行结果。

```js
import { useState, useEffect } from 'react'

function LearnEffect() {

  const [count,setCount] = useState(0)
  
  //第二个参数传一个空数组
  useEffect(()=>{
    console.log('执行')
  },[])

  return (
    <>
      <div>{count}</div>
      <button onClick={ ()=>{setCount(count+1)} }>点击加一</button>
    </>
  )
}

export default LearnEffect
```
在app.jsx中进行引入

```js
import LearnEffect from './components/LearnEffect'

function App() {

  return (
    <LearnEffect/>
  )
}

export default App

```
效果：点击按钮改变count的值，页面会重新渲染，但是useEffect里的方法只执行一次，在最初的渲染时执行的！



![初次渲染.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ea10adbd0ae45b49522ed177bc2be27~tplv-k3u1fbpfcp-watermark.image?)
##### 效果2：实现每次渲染都触发函数，在最初的渲染和后续的渲染都会触发

```js
import { useState, useEffect } from 'react'

function LearnEffect() {

  const [count,setCount] = useState(0)
  
  //不传第二个参数
  useEffect(()=>{
    console.log('执行')
  })

  return (
    <>
      <div>{count}</div>
      <button onClick={ ()=>{setCount(count+1)} }>点击加一</button>
    </>
  )
}

export default LearnEffect
```
效果：每次点击按钮改变count的值，页面会重新渲染，useEffect里的方法每次都会执行！


![每次渲染.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/436f9a42b58c4e35a76d4d6380369554~tplv-k3u1fbpfcp-watermark.image?)
##### 效果3：实现根据特定的state或props发生变化了才执行函数，其他state或props变化不执行函数

```js
 import { useState, useEffect } from 'react'

function LearnEffect() {

  const [count1,setCount1] = useState(0)
  const [count2,setCount2] = useState(0)
  
  //第二个参数数组包含要监听的变量
  useEffect(()=>{
    console.log('执行')
  },[count1])

  return (
    <>
      <div>count1的值: {count1}</div>
      <div>count2的值: {count2}</div>
      <button onClick={ ()=>{setCount1(count1+1)} }>点击count1加一</button>
      <button onClick={ ()=>{setCount2(count2+1)} }>点击count2加一</button>
    </>
  )
}

export default LearnEffect
```
效果：改变count1的值，useEffect里的方法每次都会执行！改变count2的值，useEffect里的方法不会执行！


![特定的值1.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/903b027a5f1a42859ea65c0587cdae65~tplv-k3u1fbpfcp-watermark.image?)

![特点的值2.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f589cd18aac4d3e89cc62ebf8399e8f~tplv-k3u1fbpfcp-watermark.image?)
##### 效果4：实现初次渲染执行一些事件监听，并在组件销毁的时候进行事件移除
例如我们在初次渲染时，设置了一个定时器，我们想在组件销毁的同时清除掉定时器。那我们可以在useEffect的第一个参数函数里面再返回一个函数，里面执行清除定时器的操作。

注:为了模拟组件销毁，使用了路由跳转，从一个路由组件跳转到另一个路由组件，原来的路由组件会进行销毁(路由版本：react-router-dom": "5.2.0")。

为了演示，在app.jsx配置了两个路由，一个路径为'/effect',一个路径为'/other'

```js
import LearnEffect from './components/LearnEffect'
import Other from './components/LearnEffect/Other'
import { HashRouter,Route } from 'react-router-dom'

function App() {
  return (
    <HashRouter>
       <Route path="/home"><LearnEffect/></Route>     
       <Route path="/other"><Other/></Route> 
    </HashRouter>
    
  )
}

export default App
```
路由组件LearnEffect

```js
import {  useEffect } from 'react'
import { Link } from 'react-router-dom'

function LearnEffect() {
  
  //在传进入的effect函数返回清除函数
  useEffect(()=>{
   const timer = setInterval(() => {
      console.log('执行')
    }, 1000);
    return function () {
      clearInterval(timer)
    }
  },[])

  return (
    <>
    <div>effect路由</div>
      <Link to="/other" ><button>跳转到other路由</button></Link>
    </>
  )
}

export default LearnEffect
```
路由组件Other

```js
function Other() {
  return (
    <div>其他路由组件</div>
  )
}
export default Other
```
1. 我们先访问effect路由页面，页面初次渲染后，在useEffect设置的定时器就会被触发，每隔一秒就会执行一次，
2. 点击 跳转到other路由 这个按钮，跳转到另一个路由时
3. 原有的组件执行销毁，在销毁之前会执行我们之前返回的清除定时器的函数，所以跳转后，定时器也停止执行了。
如下图，在effect路由下，定时器会一直运行。
![组件销毁清除1.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd6b30e7d3154232a7764824b9b2244a~tplv-k3u1fbpfcp-watermark.image?)
如下图，在跳转到other路由下，定时器会停止。

![组件销毁清除2.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ccf1901755044188e22eebbbdb9f876~tplv-k3u1fbpfcp-watermark.image?)
##### 效果5：实现在组件更新渲染的过程中对新的事件进行监听绑定，对旧的事件进行解绑

```js
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function LearnEffect() {
  const [count1, setCount1] = useState(0)
  const [count2, setCount2] = useState(0)

  useEffect(() => {
    console.log('可以监听绑定操作，新的count1值是',count1)
    return function () {
      console.log('可以销毁操作，上一次count1的值是',count1)
    }
  }, [count1])

  return (
    <>
      <div>count1的值: {count1}</div>
      <div>count2的值: {count2}</div>
      <button
        onClick={() => {
          setCount1(count1 + 1)
        }}
      >
        点击count1加一
      </button>
      <button
        onClick={() => {
          setCount2(count2 + 1)
        }}
      >
        点击count2加一
      </button>
      <Link to="/other">
        <button>跳转到other路由</button>
      </Link>
    </>
  )
}

export default LearnEffect

```

![1650551289(1).png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e09e4c4ff4c14344a0f07d3c818bb717~tplv-k3u1fbpfcp-watermark.image?)


![组件更新清除2.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c40d1cdd151416584f74d1a7285f4dd~tplv-k3u1fbpfcp-watermark.image?)

可以看到我们改变count1,引起页面渲染时，会触发useEffect的函数，可以获取新的状态，和上一次的状态，从而实现一些场景，当state或pros中某些值发生变动时，进行一些事件的更新绑定与解绑。

### 与 React class 组件 对比
基础环境准备：进行了路由配置：配置了路径为'/LearnEffect'和'/other'两个路由来演示组件销毁

app.jsx

```js
import LearnEffect from './components/LearnEffect'
import Other from './components/LearnEffect/Other'
import { HashRouter,Route } from 'react-router-dom'

function App() {
  return (
    <HashRouter>
       <Route path="/LearnEffect"><LearnEffect/></Route>     
       <Route path="/other"><Other/></Route> 
    </HashRouter>
  )
}

export default App
```
Other组件(路由路径'/other'对应的组件)

```js

import React from 'react'

class Other extends React.Component {
  render(){
    return (
      <div>其他路由组件</div>
    )
  }
}

export default Other
```
LearnEffect组件(重点内容，路由路径'/LearnEffect'对应的组件)

```js
import  React  from 'react'
import { Link } from 'react-router-dom'

class LearnEffect extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      count1 :0,
      count2:0
    }
  }
  //加一的方法
  addOne(target){
   this.setState(state => {
     return {
       [target]: state[target] +1
     }
   })
  }

  render() {
    return (
      <>
      <div>count1的值: {this.state.count1}</div>
      <div>count2的值: {this.state.count2}</div>
      <button onClick={()=>{this.addOne('count1')}} >
        点击count1加一
      </button>
      <button  onClick={()=>{this.addOne('count2')}} >
        点击count2加一
      </button>
      <Link to="/other">
        <button>跳转到other路由</button>
      </Link>
    </>
    )
  }
}

export default LearnEffect
```
##### 实现效果1
使用 componentDidMount 生命周期钩子


```js
import  React  from 'react'
import { Link } from 'react-router-dom'

class LearnEffect extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      count1 :0,
      count2:0
    }
  }
  //加一的方法
  addOne(target){
   this.setState(state => {
     return {
       [target]: state[target] +1
     }
   })
  }
  
  componentDidMount() {
    console.log('初次渲染')
  }

  render() {
    return (
      <>
      <div>count1的值: {this.state.count1}</div>
      <div>count2的值: {this.state.count2}</div>
      <button onClick={()=>{this.addOne('count1')}} >
        点击count1加一
      </button>
      <button  onClick={()=>{this.addOne('count2')}} >
        点击count2加一
      </button>
      <Link to="/other">
        <button>跳转到other路由</button>
      </Link>
    </>
    )  
  }
}

export default LearnEffect

```
![1650696563(1).png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/970e091fef604a69adfa5514fb88e29d~tplv-k3u1fbpfcp-watermark.image?)

##### 实现效果2
使用 componentDidMount + componentDidUpdate 生命周期钩子

```js
import  React  from 'react'
import { Link } from 'react-router-dom'

class LearnEffect extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      count1 :0,
      count2:0
    }
  }
  //加一的方法
  addOne(target){
   this.setState(state => {
     return { [target]: state[target] +1 }
   })
  }
  
  componentDidMount() {
    console.log('初次渲染')
  }
  componentDidUpdate(){
    console.log('更新渲染')
  }

  render() {
    return (
      <>
      <div>count1的值: {this.state.count1}</div>
      <div>count2的值: {this.state.count2}</div>
      <button onClick={()=>{this.addOne('count1')}} >
        点击count1加一
      </button>
      <button  onClick={()=>{this.addOne('count2')}} >
        点击count2加一
      </button>
      <Link to="/other">
        <button>跳转到other路由</button>
      </Link>
    </>
    )
  }
}

export default LearnEffect

```

![1650697003(1).png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/062f9a93dd87420db6c056e68e6db9c8~tplv-k3u1fbpfcp-watermark.image?)
##### 实现效果3
使用 componentDidUpdate 生命周期钩子，根据上一次props、state跟最新的props、state进行判断处理

```js
import  React  from 'react'
import { Link } from 'react-router-dom'

class LearnEffect extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      count1 :0,
      count2:0
    }
    this.timer = null
  }
  //加一的方法
  addOne(target){
   this.setState(state => {
     return { [target]: state[target] +1 }
   })
  }
  
  componentDidUpdate(prevProps, prevState) {
    //判断某个值是否变化了
    if (prevState.count1 !== this.state.count1) {
      console.log('count1发生变化了,可执行操作')
    }
  }

  render() {
    return (
      <>
      <div>count1的值: {this.state.count1}</div>
      <div>count2的值: {this.state.count2}</div>
      <button onClick={()=>{this.addOne('count1')}} >
        点击count1加一
      </button>
      <button  onClick={()=>{this.addOne('count2')}} >
        点击count2加一
      </button>
      <Link to="/other">
        <button>跳转到other路由</button>
      </Link>
    </>
    )
  }
}

export default LearnEffect

```
改变count1 的值会触发执行
![1650705083(1).png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d10e6a3aaafa4957b9b888aac6eae73a~tplv-k3u1fbpfcp-watermark.image?)

改变count3 的值不会
![1650705108(1).png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29cd74ddf22648f692cb1c6716e16b09~tplv-k3u1fbpfcp-watermark.image?)
##### 实现效果4
使用 componentDidMount + componentWillUnmount 生命周期钩子

```js
import  React  from 'react'
import { Link } from 'react-router-dom'

class LearnEffect extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      count1 :0,
      count2:0
    }
    this.timer = null
  }
  //加一的方法
  addOne(target){
   this.setState(state => {
     return { [target]: state[target] +1 }
   })
  }
  
  componentDidMount() {
    console.log('初次渲染')
    this.timer = setInterval(() => {
      console.log('定时器执行')
    }, 1000)
  }
  componentWillUnmount(){
    console.log('组件销毁')
    clearInterval(this.timer)
  }

  render() {
    return (
      <>
      <div>count1的值: {this.state.count1}</div>
      <div>count2的值: {this.state.count2}</div>
      <button onClick={()=>{this.addOne('count1')}} >
        点击count1加一
      </button>
      <button  onClick={()=>{this.addOne('count2')}} >
        点击count2加一
      </button>
      <Link to="/other">
        <button>跳转到other路由</button>
      </Link>
    </>
    ) 
  }
}

export default LearnEffect

```

定时器运行
![1650697834(1).png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c66c928022448e3aa375b9de9ad04f2~tplv-k3u1fbpfcp-watermark.image?)
组件销毁前定时器被清除了，跳转到other路由

![1650697904(1).png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/59ebb0f7903647eb83d8f6b62dde14ab~tplv-k3u1fbpfcp-watermark.image?)
##### 实现效果5
使用 componentDidUpdate 生命周期钩子，根据上一次props、state跟最新的props、state进行判断处理

```js
import  React  from 'react'
import { Link } from 'react-router-dom'

class LearnEffect extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      count1 :0,
      count2:0
    }
    this.timer = null
  }
  //加一的方法
  addOne(target){
   this.setState(state => {
     return { [target]: state[target] +1 }
   })
  }
  
  componentDidUpdate(prevProps, prevState) {
    //判断某个值是否变化了
    if (prevState.count1 !== this.state.count1) {
      console.log('新的count1的值',this.state.count1)
      console.log('上一次的count1的值',prevState.count1)
    }
  }

  render() {
    return (
      <>
      <div>count1的值: {this.state.count1}</div>
      <div>count2的值: {this.state.count2}</div>
      <button onClick={()=>{this.addOne('count1')}} >
        点击count1加一
      </button>
      <button  onClick={()=>{this.addOne('count2')}} >
        点击count2加一
      </button>
      <Link to="/other">
        <button>跳转到other路由</button>
      </Link>
    </>
    ) 
  }
}

export default LearnEffect

```

可以拿到变量发生变化的新旧值，就可以对旧值所绑定的事件清除，对新值进行新事件绑定

![1650704814(1).png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6cb0bddfc9bd4271a8ae15fbded0c891~tplv-k3u1fbpfcp-watermark.image?)

### 与 Vue 对比
在Vue中也有生命周期钩子函数和watch方法去实现上面 React Hook 中 useEffect Hook的五种效果。

#### 选项式api

基础环境准备：进行了路由配置：配置了路径为'/LearnEffect'和'/other'两个路由来演示组件销毁

```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import LearnEffect from '../views/learn-effect'
import Other from '../views/other'

Vue.use(VueRouter)
const routes = [
  {
    path: '/LearnEffect',
    name: 'LearnEffect',
    component: LearnEffect
  },
  {
    path: '/other',
    name: 'Other',
    component: Other
  }
]

const router = new VueRouter({
  routes
})

export default router

```
App 组件作为路由挂载入口
```js
<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
```
Other组件(路由路径'/other'对应的组件)

```js
<template>
  <div>other的路由组件</div>
</template>
```
LearnEffect组件(重点内容，路由路径'/LearnEffect'对应的组件)

```js
<template>
  <div>
    <div>learneffect的路由组件</div>
    <div>count1:{{ count1 }}</div>
    <div>count2:{{ count2 }}</div>
    <button @click="count1 += 1">点击count1 +1</button>
    <button @click="count2 += 1">点击count2 +1</button>
    <button @click="$router.push('/other')">点击跳转到other路由</button>
  </div>
</template>

<script>
export default {
  name: 'LearnEffect',
  data() {
    return {
      count1: 0,
      count2: 0
    }
  }
}
</script>

```

![vue2-初始配置.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1999c21fde48404eb75fe49415fcc75b~tplv-k3u1fbpfcp-watermark.image?)
##### 实现效果1
使用 mounted 选项

```js
<template>
  <div>
    <div>learneffect的路由组件</div>
    <div>count1:{{ count1 }}</div>
    <div>count2:{{ count2 }}</div>
    <button @click="count1 += 1">点击count1 +1</button>
    <button @click="count2 += 1">点击count2 +1</button>
    <button @click="$router.push('/other')">点击跳转到other路由</button>
  </div>
</template>

<script>
export default {
  name: 'LearnEffect',
  data() {
    return {
      count1: 0,
      count2: 0
    }
  },
  //初次渲染
  mounted() {
    console.log('初次渲染 - mounted')
  }
}
</script>
```

![1650603722(1).png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/865cdc02ad9b42df8e5f7602ecd89b47~tplv-k3u1fbpfcp-watermark.image?)
##### 实现效果2
使用 mounted 选项 + updated 选项

```js
<template>
  <div>
    <div>learneffect的路由组件</div>
    <div>count1:{{ count1 }}</div>
    <div>count2:{{ count2 }}</div>
    <button @click="count1 += 1">点击count1 +1</button>
    <button @click="count2 += 1">点击count2 +1</button>
    <button @click="count3 += 1">点击count3 +1</button>
    <button @click="$router.push('/other')">点击跳转到other路由</button>
  </div>
</template>

<script>
export default {
  name: 'LearnEffect',
  data() {
    return {
      count1: 0,
      count2: 0,
      count3: 0
    }
  },
  //初次渲染
  mounted() {
    console.log('初次渲染 - mounted')
  },
  //更新渲染，修改页面使用到data会引起更新渲染，修改页面没有用到的不会引起更新渲染
  updated() {
    console.log('updated')
  }
}
</script>

```
注：修改count3的值不会引起更新渲染，因为不会引起页面内容的变化
![1650606052(1).png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f9e85a0352845609d9b417b185365a8~tplv-k3u1fbpfcp-watermark.image?)

##### 实现效果3
使用 watch 选项

```js
<template>
  <div>
    <div>learneffect的路由组件</div>
    <div>count1:{{ count1 }}</div>
    <div>count2:{{ count2 }}</div>
    <button @click="count1 += 1">点击count1 +1</button>
    <button @click="count2 += 1">点击count2 +1</button>
    <button @click="count3 += 1">点击count3 +1</button>
    <button @click="$router.push('/other')">点击跳转到other路由</button>
  </div>
</template>

<script>
export default {
  name: 'LearnEffect',
  data() {
    return {
      count1: 0,
      count2: 0,
      count3: 0
    }
  },
  // //监听某个data发生变化执行操作
  watch: {
    count1() {
      console.log('count1 - watch')
    }
  }
}
</script>

```
使用watch监听count1,改变count1 的值会触发 watch函数
![vue2-wacth1.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/195e406367c941a9831cbe93302d34e4~tplv-k3u1fbpfcp-watermark.image?)
改变其他的值并不会触发 watch函数，如改变 count2 的值

![vue2-watch2.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ef98b0a85d734f1894637a86c4e2e85b~tplv-k3u1fbpfcp-watermark.image?)
##### 实现效果4
使用mounted选项 + beforeDestroy选项

```js
<template>
  <div>
    <div>learneffect的路由组件</div>
    <div>count1:{{ count1 }}</div>
    <div>count2:{{ count2 }}</div>
    <button @click="count1 += 1">点击count1 +1</button>
    <button @click="count2 += 1">点击count2 +1</button>
    <button @click="count3 += 1">点击count3 +1</button>
    <button @click="$router.push('/other')">点击跳转到other路由</button>
  </div>
</template>

<script>
let timer //定时器变量
export default {
  name: 'LearnEffect',
  data() {
    return {
      count1: 0,
      count2: 0,
      count3: 0
    }
  },
  //初次渲染
  mounted() {
    console.log('初次渲染 - mounted')
    timer = setInterval(() => {
      console.log('定时器执行')
    }, 1000)
  },
  //组件销毁前，可执行清除操作
  beforeDestroy() {
    console.log('组件销毁')
    clearInterval(timer)
  }
}
</script>
```
定时器运行
![vue2-事件解绑1.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c25401ff42844b21b1a1e595cf9c096d~tplv-k3u1fbpfcp-watermark.image?)
组件销毁前定时器被清除了，跳转到other路由

![vue2-事件解绑2.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/81a676b4963c4024b9c90c27f0f5e1b3~tplv-k3u1fbpfcp-watermark.image?)

##### 实现效果5
利用watch选项

```js
<template>
  <div>
    <div>learneffect的路由组件</div>
    <div>count1:{{ count1 }}</div>
    <div>count2:{{ count2 }}</div>
    <button @click="count1 += 1">点击count1 +1</button>
    <button @click="count2 += 1">点击count2 +1</button>
    <button @click="count3 += 1">点击count3 +1</button>
    <button @click="$router.push('/other')">点击跳转到other路由</button>
  </div>
</template>

<script>
export default {
  name: 'LearnEffect',
  data() {
    return {
      count1: 0,
      count2: 0,
      count3: 0
    }
  },
  watch: {
    count1(newCount1, oldCount1) {
      console.log('新的count1的值', newCount1) //可对新的值进行新的事件绑定
      console.log('上一次的count1的值', oldCount1) //可对旧的值进行之前的事件清除
    }
  }
}
</script>

```
通过watch可以拿到变量发生变化的新旧值，就可以对旧值所绑定的事件清除，对新值进行新事件绑定
![vue2-效果5.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29b548a9947d47c186c271e1b02cc05c~tplv-k3u1fbpfcp-watermark.image?)
#### 组合式api
基础环境准备：进行了路由配置：配置了路径为'/LearnEffect'和'/other'两个路由来演示组件销毁

```js
import { createRouter, createWebHashHistory } from 'vue-router'
import LearnEffect from '../views/learn-effect'

const routes = [
  {
    path: '/LearnEffect',
    name: 'LearnEffect',
    component: LearnEffect
  },
  {
    path: '/other',
    name: 'Other',
    component: () => import('../views/other')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

```
App 组件作为路由挂载入口

```js
<template>
  <router-view></router-view>
</template>
```
Other组件(路由路径'/other'对应的组件)

```js
<template>
  <div>other的路由组件</div>
</template>
```
LearnEffect组件(重点内容，路由路径'/LearnEffect'对应的组件)

```js
<template>
  <div>
    <div>learneffect的路由组件</div>
    <div>count1:{{ count1 }}</div>
    <div>count2:{{ count2 }}</div>
    <button @click="count1 += 1">点击count1 +1</button>
    <button @click="count2 += 1">点击count2 +1</button>
    <button @click="$router.push('/other')">点击跳转到other路由</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count1 = ref(0)
const count2 = ref(0)
</script>
```

![1650640554(1).png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9eaa89b76cd5480dadd2f27cb0959a39~tplv-k3u1fbpfcp-watermark.image?)
##### 实现效果1
使用 onMounted 生命周期钩子

```js
<template>
  <div>
    <div>learneffect的路由组件</div>
    <div>count1:{{ count1 }}</div>
    <div>count2:{{ count2 }}</div>
    <button @click="count1 += 1">点击count1 +1</button>
    <button @click="count2 += 1">点击count2 +1</button>
    <button @click="$router.push('/other')">点击跳转到other路由</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const count1 = ref(0)
const count2 = ref(0)

onMounted(() => {
  console.log('初次渲染 - onMounted')
})
</script>
```

![1650641282(1).png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e706d8413fc74fa5bd82c3eddfe6e612~tplv-k3u1fbpfcp-watermark.image?)
##### 实现效果2
使用 onMounted + onUpdated 生命周期钩子

```js
<template>
  <div>
    <div>learneffect的路由组件</div>
    <div>count1:{{ count1 }}</div>
    <div>count2:{{ count2 }}</div>
    <button @click="count1 += 1">点击count1 +1</button>
    <button @click="count2 += 1">点击count2 +1</button>
    <button @click="$router.push('/other')">点击跳转到other路由</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUpdated } from 'vue'

const count1 = ref(0)
const count2 = ref(0)

onMounted(() => {
  console.log('初次渲染 - onMounted')
})

onUpdated(function () {
  console.log('更新渲染 - updated')
})
</script>

```

![1650641716(1).png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b18fea04ddfd45288287cd4e2bbfa9c7~tplv-k3u1fbpfcp-watermark.image?)

##### 实现效果3
使用 watch

```js
<template>
  <div>
    <div>learneffect的路由组件</div>
    <div>count1:{{ count1 }}</div>
    <div>count2:{{ count2 }}</div>
    <button @click="count1 += 1">点击count1 +1</button>
    <button @click="count2 += 1">点击count2 +1</button>
    <button @click="$router.push('/other')">点击跳转到other路由</button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const count1 = ref(0)
const count2 = ref(0)

watch(count1, () => {
  console.log('count1 - watch')
})
</script>

```
使用watch监听count1,改变count1 的值会触发 watch函数
![1650642460(1).png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de52e35557a445daa11466e39c8f5474~tplv-k3u1fbpfcp-watermark.image?)
##### 实现效果4
使用 onMounted + onBeforeUnmount 生命周期钩子

```js
<template>
  <div>
    <div>learneffect的路由组件</div>
    <div>count1:{{ count1 }}</div>
    <div>count2:{{ count2 }}</div>
    <button @click="count1 += 1">点击count1 +1</button>
    <button @click="count2 += 1">点击count2 +1</button>
    <button @click="$router.push('/other')">点击跳转到other路由</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const count1 = ref(0)
const count2 = ref(0)

let timer
onMounted(() => {
  console.log('初次渲染 - onMounted')
  timer = setInterval(() => {
    console.log('定时器执行')
  }, 1000)
})
//组件销毁前，可执行清除操作
onBeforeUnmount(() => {
  console.log('组件销毁')
  clearInterval(timer)
})
</script>
```
定时器运行

![1650643184(1).png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/300a3b8ebd3b4b488f049eecb58b7656~tplv-k3u1fbpfcp-watermark.image?)

组件销毁前定时器被清除了，跳转到other路由

![1650643258(1).png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00ad37beceab489e95db3cf22d6087c9~tplv-k3u1fbpfcp-watermark.image?)
##### 实现效果5
使用watch

```js
<template>
  <div>
    <div>learneffect的路由组件</div>
    <div>count1:{{ count1 }}</div>
    <div>count2:{{ count2 }}</div>
    <button @click="count1 += 1">点击count1 +1</button>
    <button @click="count2 += 1">点击count2 +1</button>
    <button @click="$router.push('/other')">点击跳转到other路由</button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const count1 = ref(0)
const count2 = ref(0)

watch(count1, (newCount1, oldCount1) => {
  console.log('新的count1的值', newCount1) //可对新的值进行新的事件绑定
  console.log('上一次的count1的值', oldCount1) //可对旧的值进行之前的事件清除
})
</script>

```
通过watch可以拿到变量发生变化的新旧值，就可以对旧值所绑定的事件清除，对新值进行新事件绑定
![1650643467(1).png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a3df9d2c2217473b9937c12bbdc9a0a2~tplv-k3u1fbpfcp-watermark.image?)



### 结束语
可以看出 useEffect Hook的设计很巧妙，包含了很多功能，需要我们去学习与实践。

本文是个人的学习总结，如果对你有所帮助我很开心，如果有错误或建议欢迎指出！

[react官网：https://zh-hans.reactjs.org/docs/hooks-effect.html](https://zh-hans.reactjs.org/docs/hooks-effect.html)
