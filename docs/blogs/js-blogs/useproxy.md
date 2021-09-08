#### Proxy 可以对目标对象的读取、函数调用等操作进行代理拦截，然后进行操作处理。它不直接操作对象，而是像代理模式，通过对象的代理对象进行操作，在进行这些操作时，可以添加一些需要的额外操作。主要有这几种情况：

1. 获取对象属性
2. 设置对象属性值
3. 遍历对象
4. 判断对象是否有对应属性
5. 删除对象属性
6. 函数调用，call 和 apply 的时候
7. new 命令

#### 基本用法

```js
let obj = { name: 'dylan' }
let myproxy = new Proxy(obj, {})
//两个参数，第一个是要代理的目标，如obj对象，第二个是一个对象，里面放需要进行的拦截操作，为空时表示不进行拦截操作
```

#### get(target, prop)

当对象属性被获取时进行拦截，
在 proxy 的第二个参数对象里面添加 get 方法来进行拦截操作(后面的方法也是)，参数 target 表示代理的对象，prop 表示传递的属性名(参数名可以自定义)

```js
let obj = {name : 'dylan'}
obj = new Proxy(obj,{ get(target,prop){
    console.log(target,prop)   //这里我们可以在对象被获取前写一些代码
    return target[prop]        // return的值就是对象属性被获取的值，没有return值会报undefined
} })
 例如: 执行console.log(obj.name)时，对象name属性就被获取，会执行proxy的get函数
 //代理数组例子
 let arr = [5,6,7]
 arr = new Proxy(arr,{
      get(target,prop){
        console.log(target,prop)
        return prop in target ? target[prop] : 'err'
      }
})
console.log(arr[2])
```

#### set(target, props, val)

当对象属性值被设置的时拦截，target 表示代理的对象，props 表示属性名，val 表示要设置的值。set 需要返回一个布尔值。

```js
let obj = { name: 'Dylan' }
obj = new Proxy(obj, {
  set(target, props, val) {
    console.log(target, props, val) //target是obj对象,props是传递进来的'name'属性，val是'newName'
    target[props] = val // 这里是对值的设置，如果设置成 target[props] = 'hhh',那么设置的也会是hhh
    return true
  }
})
obj.name = 'newName' // 对象属性值进行设置
console.log(obj.name) // 打印'newName'
```

#### has(target, prop)

判断对象是否有某个属性时进行的拦截操作。target、prop 分别表示代理的对象和传递的属性名。需要返回一个布尔值。

```js
let range = {
  start: 1,
  end: 5
}
range = new Proxy(range, {
  has(target, prop) {
    return prop >= target.start && prop <= target.end
  }
})
console.log(0 in range) // 0不在1和5之间，返回false
```

#### ownKeys(target)

当对象被遍历时进行的拦截操作。target 表示代理的对象，返回的是一个数组。当我们使用 Object.getOwnPropertyNames()、Object.getOwnPropertySymbol()、
Object.keys()、for...in 这些方法进行遍历时都会触发 ownKeys 方法。

```js
假如我们不想让对象的某个属性被遍历
let userinfo = {
  name: 'dylan',
  _password: '123' //我们不想让这个下划线开头的密码被遍历
}
userinfo = new Proxy(userinfo, {
  ownKeys(target) {
    return Object.keys(target).filter((key) => !key.startWith('_')) //过滤下划线开头的属性
  }
})
console.log(Object.keys(userinfo)) // 只输出['name']
```

#### deleteProperty(target, prop)

当删除对象的属性时进行的拦截操作。接收两个参数 target、prop,分别指代理的对象、要删除的属性。返回一个布尔值。

```js
假如我们不想让对象的带下划线开头的属性被删除
let obj = {
  name: 'dylan',
  _password: '123'
}
obj = new Proxy(obj, {
  deleteProperty(target, prop) {
    if (prop.startWith('_')) {
      throw new Error('不可删除')
    } else {
      delete target[prop]
      return true
    }
  }
})

try {
  delete obj._password
} catch (e) {
  console.log(e.message)
} //删除失败，会打印'不可删除'
```

#### apply(target, ctx, args)

用于拦截函数的调用、call 和 reply 操作。target 表示目标对象，ctx 表示目标对象上下文，args 表示目标对象的参数数组。

```js
function sub(a, b) {
  return a - b
}
sub = new Proxy(sub, {
  apply(target, ctx, args) {
    console.log('apply')
    return target(...args) * 2 //例如代理后把函数执行结果乘2
  }
})
console.log(sub(5, 2)) //打印6
```

#### construct(target, args)

用于拦截 new 命令。返回值必须为对象。

```js
class Exam {
  constructor(name) {
    this.name = name
  }
}
let ExamProxy = new Proxy(Exam, {
  construct(target, args, newTarget) {
    console.log('construct')
    return new target(...args)
  }
})
console.log(new ExamProxy('dylan'))
```

#### 综合例子

```js
let obj = {
   name:'dylan',
   age:18,
   _secret:'123'
}
obj = new Proxy(obj, {
   get(target, prop){ return target[prop] },
   set(target, prop, val){
        target[prop] = val
        return true
       },
   has(target,prop){ return prop in target },
   ownKeys(target){
        return Object.keys(target).filter(key => !key.startWith('_')) })
   },
   deleteProperty(target, prop){
        deleteProperty(target,prop){
      if(prop.startWith('_')){
        throw new Error('不可删除')
      }else{
        delete target[prop]
        return true
      }
   }
})
console.log(obj.name)       // 触发get
obj.age = 17                // 触发set
console.log('name' in obj)  //触发has
for(let key in obj) {...}   // 触发ownKeys
delete obj.age              // 触发deleteProperty
```
