
### useContext Hook是什么？
是我们在用React编写函数组件时，当一个组件向它的后代组件(子组件以及更往下的组件)传值时，后代组件可以通过 useContext 这个方法去接受传过来的值。

### 使用 useContext Hook
useContext是在后代组件中用来接收值的，整个流程环境如下：

- 首先需要借助 createContext 去创建一个 context 对象，父级组件和他的后代组件共用的这个context对象。
- 父组件利用这个context对象去提供值，也就是传值出去。
- 后代组件调用 useContext 函数，并把 context 对象作为函数参数，函数的返回值也就是父组件传过来的值。(在这里才用到 useContext Hook)

#### 案例演示
组件层级：App组件 -> First组件 -> Second组件
实现效果：App组件传值， 后代组件(无论是 First 还是 Second )都可以收到
父组件
- 使用 createContext() 创建了一个 名为 TestContext 的对象
- 用 createContext() 创建的对象中的 Provider 去包裹子组件， 也就是<TestContext.Provider></TestContext.Provider> 包裹子组件，用 value 传递值count1


```js
import { useState,createContext } from 'react'
import First from './components/LearnContext/First'
export const TestContext = createContext()

function App() {
  const [count1, setCount1] = useState(1)
  return (
    <div>
      App
      <TestContext.Provider value={count1}>
        <First />
      </TestContext.Provider>
      <button onClick={() => {setCount1(2)}}>
        改变count1的值为2
      </button>
    </div>
  )
}

export default App


export default App

```
子组件First
- 需要引入 createContext() 创建的对象，也就是父级组件的 TestContext
- 使用useContext函数，把 TestContext 当作函数传进去，就可以获取到父级组件传过来的值

```js
import { useContext } from 'react'
import { TestContext } from '../../App'
import Second from "./Second"


function First() {
  const testData = useContext(TestContext)
  return (
    <div>
      First中接收count1的值:{testData}
      <Second />
    </div>
  )
}

export default First
```
子级以下组件，如组件 Second
- 使用步骤和First组件一样，可以说后代组件的使用步骤一样

```js
import { useContext } from 'react'
import { TestContext} from '../../App'

function Second() {
  const testData = useContext(TestContext)
  return (
    <div>
      Second中接受count1的值:{testData}
    </div>
  )
}

export default Second
```
效果图：

后代组件都能接受到值

![1650985758(1).png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf2566110fa946419e5b993ede85be86~tplv-k3u1fbpfcp-watermark.image?)
点击按钮后，coun1的值变为了2

![1650985836(1).png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8cd01d199c45486098aad37ca7d4cb43~tplv-k3u1fbpfcp-watermark.image?)
### 结束语
本文是个人的学习总结，如果对你有所帮助我很开心，如果有错误或建议欢迎指出！

[react官网：https://zh-hans.reactjs.org/docs/hooks-effect.html](https://zh-hans.reactjs.org/docs/hooks-effect.html)