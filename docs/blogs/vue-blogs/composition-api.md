### 选项式api的缺点和组合式api解决了什么
  
  在vue2中我们经常使用选项式api这么写代码,这种是通过使用 (`data`、`computed`、`methods`、`watch`) 组件选项来组织逻辑，在vue3版本也可以用，甚至选项式api可以和组合式api混合用(但不推荐)
  
```js
//选项式api
<script>
    export default {
      name: 'App',
      computed: { ... },
      watch: { ... },
      data () {
        return { ... }
      },
      mounted () { ... },
      methods: { ... }
    }
</script>
```
个人挺喜欢使用选项式api的，但是在文件里逻辑代码特别多特别复杂的时候，文件内容会很长，我们修改东西的时候就比较麻烦，可能会’反复跳跃‘，因为他们是分割开来的，我们可能一会跳到data选项修改个数据，一会跳到methods选项修改个方法。这个我有体会到的，在修改一个之前没接触的项目的时候那种翻上翻下查看代码的感觉确实有点烦躁。


Composition API的出现就是为了解决这种情况的出现，vue2选项式api所做的事情都可以用组合式api去实现，目的把同一个逻辑的相关代码集合在一起,让单个逻辑点的代码更容易查找，从而项目更容易维护。
### 使用位置之 setup
所有Composition API相关代码都可以写在setup函数里面，例如定义 data变量，方法，生命周期，使用计算属性computed, 侦听器watch, 生命周期函数，vuex等等。
```js
<script>
export default {
  name: 'App',
  setup () {
   console.log('这里是setup,我已经使用了组合式api咯！')
   ...
  }
}
</script>
```

### setup 中的this
之前我们习惯与使用this去获取data里的值或者调用方法等，但是`在setup使用this是无法操作的`。因为setup 在生命周期beforeCreate和created之间执行，调用发生在 data property、computed property 或 methods 被解析之前，此时组件实例未实例化成功，所以data,methods等东西无法在 setup 中使用this被获取。

### setup函数的参数
setup(props,context)函数有两个参数，`props`：组件接受的参数，`context`是一个对象，包含
`attrs`, `slots`, `emit`, `expose`这些属性。
- `attrs`：Attribute (非响应式对象，等同于 $attrs)
- `slots`：插槽 (非响应式对象，等同于 $slots)
- `emit`： 触发事件 (方法，等同于 $emit)，主要用来向父组件通信传参
- `expose`：暴露公共 property (函数)


```js
   setup(props,context) {         //完整写法
      console.log(props.title)   //获取传递过来的title属性
      ... 
  } 
  setup(props) {...}            //只用props
  setup(props, { attrs, slots, emit, expose }) {...} //context参数解构
  props不能用es6解构,会消除 prop 的响应性，解构需要借助 toRefs 或 toRef。
```

### 定义响应式data变量
在选项式写法中，我们是在data中定义我们想要的响应式变量，在组合式api的setup中我们需要借助ref,reactive等来使变量响应式。
####  借助ref函数定义data变量
注：在 setup 中使用ref,reactive需要导入,其他的类似computed,watch或生命周期等都需要导入。
定义的响应式变量需要return出去。
```js
<script> 
import { ref } from 'vue'
export default { 
    setup () { 
    const num1 = ref(0) //定义number类型，初始值为0
    const str1 = ref('')
    const boolean1 = ref(true)
    const arr1 = ref([])
    const arr2 = ref([1,2,3])
    const obj1 = ref({})
    const obj2 = ref({name:'hhh'})

    return { num1,str1,boolean1,arr1,arr2,obj1,obj2 }
} }
</script>
```
#### 使用ref声明的变量 
<template></template>模板中直接使用该变量名，如：
```js
<template>
  <div>
    {{num1}}
  </div>
</template>
```
在setup的其他地方使用的话，需要加.value,这是因为ref函数会默认把值用对象包裹起来，把值放在对象的value属性上。如:
```js
import { ref } from 'vue'
const num1 = ref(0) //定义number类型，初始值为0
consle.log(num1)  // 输出的是一个对象{value:0}
console.log(num1.value)  // 输出我们想要的值 0
num1.value = 1     //修改值


return { num1 }
```

#### 借助reactive函数定义data变量
一般用reactive来定义复杂类型的变量，如定义数组，定义对象。
```js
import { reactive } from 'vue'
const arr1 = reactive([])
const arr2 = reactive([1,2,3])
const obj1 = reactive({})
const obj2 = reactive({name:'hhh'})

return { arr1,arr2,obj1,obj2 }
```
#### 使用reactive声明的变量
<template></template>模板中直接使用该变量名，如：

```js
<template>
  <div>
    {{obj2.name}}
  </div>
</template>
```

在setup的其他地方使用的话，也是直接使用该变量名(不需要像ref要加.value),如:
```js
import { reactive } from 'vue'
const arr2 = reactive([1,2,3])
console.log(arr2)  // 输出我们想要的值 [1,2,3]
arr2 = [3,2,1]     //修改值

return { num1 }
```
**所以我们一般使用ref定义一个基础类型的响应式变量(Number,String,Boolean)
使用reactive定义复杂类型的的响应式变量(Arrary,Object)**

### 定义方法

```js
<script>
export default {
  name: 'App',
  setup () {
  const fn1 = () => {console.log('这是方法1')}
  const fn2 = () => {console.log('这是方法2')}
  return { fn1,fn2 }
  }
}
</script>
```
### 使用组件生命周期
官网的生命周期表：

![1636014740(1).png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca114adc15fb45d7a0f3d79b4a1eb707~tplv-k3u1fbpfcp-watermark.image?)
在setup中可以通过在生命周期钩子前面加上 “on” 来访问组件的生命周期钩子。`setup` 是围绕 `beforeCreate` 和 `created` 生命周期钩子运行的，所以想要在`beforeCreate` 和 `created`这两个钩子里写的代码都可以放在setup里直接写。
例子如下：
```
export default {
  setup() {
   //beforeCreate或created的生命周期中
    console.log('beforeCreate或created两个生命周期的方法都可以在setup中直接写')
    
    // mounted生命周期
    onMounted(() => {
      console.log('Component is mounted!')
    })
  }
}
```
### 子组件向父组件传参
子组件向父组件传参，需要在`setup`中`emit`出去，

```js
export default {
    emits: ['showEmit'],  // 通过 `emits` 选项来定义组件可触发的事件
    setup (props, { emit }) {
    const showEmit = () => {
      emit('showEmit', '传出的参数')   //第一个参数为抛出去的方法名，第二个为抛出去的参数
    }
    return { showEmit }
    }
  }
```
### 获取dom节点
获取dom节点我们可以借助ref函数，我们还可以调用子组件的方法，如下例子

```js
<template>
    <div ref="domRef"> </div>
    <ExhibitionTitle ref="exhiRef/>
</template>
<script>
import { ref } from 'vue'
import ExhibitionTitle from '@/components/ExhibitionTitle'  //导入组件
export default {
  name: 'App',
    components: {
    ExhibitionTitle
  },
  setup () {
    const domRef = ref(null)  // domRef就获取到了div元素
    const exhiRef = ref('')   // exhiRef就获取到了子组件ExhibitionTitle
    
    onMounted(() => {
     console.log(domRef)  // 在页面加载时输出一下节点信息
     exhiRef.value.fn1()   //调用子组件自身的fn1方法
    })
    return { domRef , exhiRef}
  }
}
</script>
```

### 计算属性computed
计算属性一般是一个或多个响应式变量通过计算而产生的新的响应式变量。依赖的响应式变量不变，计算属性变量就不会重新计算，从而减少运算成本，提高程序运行速度，而且在模板可以用一个变量名代替一连串的计算表达式，达到了代码美观和便于理解的目的。
##### 只需要获取计算属性(getter)
借助computed方法，传递一个函数(getter函数)，函数返回计算后的值
```js
<template>
  <div>{{ count }}</div>      //计算属性像响应式变量一样使用
  <div>{{ minus }}</div>
</template>

<script>
import { ref, computed } from "vue";
export default {
  setup() {
    const a = ref(1);
    const b = ref(2);
    const count = computed(() => {     //计算属性 count
      return a.value + b.value; 
    });
    const minus = computed(() => {     //计算属性 minus
      return a.value - b.value;
    });

    return { a, b, count, minus };
  },
};
</script>
```
##### 既需要获取计算属性(getter)，又需要当计算属性变化时做一些操作(setter)
借助computed方法，传递一个对象(包含set、get)，set、get为对应相应的函数
```js
<template>
  <div>{{ a }}</div>
  <div>{{ count }}</div>
  <div @click="setCount">点击设置改变计算属性count</div>
</template>

<script>
import { ref, computed } from "vue";
export default {
  setup() {
    const a = ref(1);
    const b = ref(2);

    const count = computed({
      get: () => {
        return a.value + 5;
      },
      set: (val) => {         //当计算属性被改变时可以进行操作，如改变a的值
        console.log(val);     //参数val是被设置的值，这里被设置为了10，val也就为10
        a.value = 3;               
      },
    });

    const setCount = () => {
      count.value = 10;
    };

    return { a, b, count, setCount };
  },
};
</script>
```
### 侦听器watch
侦听某些响应式变量data，当data发生变化时，执行一些我们想要的操作，如接口请求，改变其他变量等等
##### watch(val,fn,options)，
- 参数`val`是我们想要侦听的响应式变量(ref变量、函数返回的变量、reactive包裹的数组或对象)
- 参数`fn`是我们想要执行的方法
- 参数`options`是一些配置参数，如{ deep: true }深度侦听，非必要参数可省略
**侦听单个ref变量数据源**
```js
<template>
  <div>{{ a }}</div>
  <div>{{ b }}</div>
  <button @click="setA">点击改变a的值</button>
</template>

<script>
import { ref, watch } from "vue";
export default {
  setup() {
    const a = ref(1);
    const b = ref(2);
    //写法一
    watch(a, (val, preval) => {    // 直接侦听ref变量 a
      console.log(val, preval);    // val是改变后的值，preval是改变前的值
      b.value = 3;
    });
    //写法二
     watch(()=>b, (val, preval) => {    // 侦听使用函数返回的ref变量 b
     console.log(val, preval);     
    });

    const setA = () => {
      a.value = 10;
    };

    return { a, b, setA };
  },
};
</script>
```

**侦听reactive数组变量**

```js
<template>
  <div>{{ numbers }}</div>
  <button @click="setVal">点击改变值</button>
</template>

<script>
import { reactive, watch } from "vue";
export default {
  setup() {
    const numbers = reactive([1, 2, 3, 4]);

    watch(
      () => [...numbers],
      (numbers, prevNumbers) => {
        console.log(numbers, prevNumbers);
      }
    );

    //  watch(
    //   numbers,
    //   (numbers, prevNumbers) => {
    //     console.log(numbers, prevNumbers);
    //   }
    // );

    const setVal = () => {
      numbers.push(5);
    };

    return { numbers, setVal };
  },
};
</script>
```

**侦听reactive对象变量**
- 情况一：侦听整个对象
- 情况二：侦听对象里的某个属性是否变化，尝试检查深度嵌套对象或数组中的 property 变化时，仍然需要 `deep` 选项设置为 true。

```js
<template>
  <div>{{ obj }}</div>
  <button @click="setVal">点击改变值</button>
</template>

<script>
import { reactive, watch } from "vue";
export default {
  setup() {
    const obj = reactive({ name: "obj", age: 18 });
    const obj1 = reactive({ name: "obj1", age: 18 });
    //直接侦听obj对象里的name属性
    watch(            
      () => obj.name,                   
      (name, prevname) => {
        console.log(name, prevname);
      }
    );
    //侦听obj1整个对象，不管是name或age变化都会引发函数执行
    watch(obj1, (obj1, prevObj1) => {
      console.log(obj1, prevObj1);
    },
    { deep: true }               //是否开启深度侦听
    );

    const setVal = () => {
      obj.name = "xixi";
    };

    return { obj, obj1, setVal };
  },
};
</script>
```
错误写法

```js
// 侦听某个对象里的属性，应该使用函数返回，下面会引起警告，并且不生效
watch(obj.name, (name, prevname) => {  
      console.log(name, prevname);
    });
```
出现下图的警告

![1636097666(1).png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30e86c21d35143278fcbee49642d8765~tplv-k3u1fbpfcp-watermark.image?)
**侦听多个数据源**

侦听多个数据要用数组包起来，然后只要是其中一个数据发生变化就会触发函数。

```js
<template>
  <div>{{ a }}</div>
  <div>{{ b }}</div>
  <button @click="a = 10">点我改变a</button>
  <button @click="b = 11">点我改变b</button>
</template>

<script>
import { ref, watch } from "vue";
export default {
  name: "App",
  setup() {
    const a = ref(1);
    const b = ref(2);

    //侦听多个数据源使用数组,如同时监听了a和b两个变量，不管是a或b的值变了，都会触发函数
    //newA,newB：改变后的的值，preA,preB:改变前的值
    watch([a, b], ([newA, newB], [prevA, prevB]) => {
      console.log(newA, newB, prevA, prevB);
    });

    return { a, b };
  },
};
</script>
```


### 使用router
因为我们在 `setup` 里面没有访问 `this`，所以我们不能再直接访问 `this.$router` 或 `this.$route`。作为替代，我们使用 `useRouter`，`useRoute` 函数：

```js
<script>
import { useRouter, useRoute } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    console.log(router.getRoutes())   //可以获取路由表之类的
    console.log(route);                    //可以获取路由参数之类的

    const goAbout = () => {        //跳转路由的方法
      router.push("/about");      
    };

    return { goAbout };           
  },
};
</script>
```

### 使用vuex
vue官方推荐我们使用计算属性去使用vuex的状态
#### 访问 State 和 Getter
- vuex中有存放状态的state和getter，state相当于页面的data，而getter相当于页面的计算属性。
```js
import { computed } from 'vue'        //不要忘记引入
import { useStore } from 'vuex'    
export default {
  setup () {
    const store = useStore()          //使用

    return {
      // 在 computed 函数中访问 state状态
      count: computed(() => store.state.count),

      // 在 computed 函数中访问 getter状态
      double: computed(() => store.getters.double)
    }
  }
}

```
 #### Mutation 和 Action修改vuex中的state
-  更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。 Action 提交的是 mutation，而不是直接变更状态。
 
```js
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()

    return {
      // 定义fn1方法，调用vuex中mutation中的increment方法，用于同步操作
      fn1: () => store.commit('increment'),

      // 定义fn2方法，调用vuex中action中的asyncIncrement方法，用于异步操作
      fn2: () => store.dispatch('asyncIncrement')
    }
  }
}
```
### 结束语
相信看到这里的你对vue3组合式api的基础使用有了一定的了解，这里是使用笔记总结分享，还有一些其他api,如：readonly只读属性，toRefs,toRef，watchEffect等没有列出来，想要更全面更深入学习了解，建议看一下vue3官方文档。更简单的写法可以查看官方文档的`<script setup>`，后面我会出一份单文件组件`<script setup>`语法糖的笔记分享。

