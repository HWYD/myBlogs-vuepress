##### 一个三维模型的渲染由几个主要的模块组成
- 渲染器:WebGLRenderer,用来承载场景的，需要挂载DOM节点
- 场景：scene,这个是用来放置物体、灯光和摄像机的地方。
- 相机：camera,相机能看到什么，浏览器就展示什么
- 灯光：light,这是光源，可以设置各种灯光，如果没有灯光，那么可能黑乎乎的，看不到物体。
**个人觉得三维模型渲染可以想象成现实生活场景。**

一个模型加载到呈现的流程大致如下：

新建渲染器：
```js
renderer = new THREE.WebGLRenderer()
```
新建场景
```js
const scene = new THREE.Scene()  //后面的模型，灯光都需要添加进这场景中
```
添加相机
```js
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100000)
```
添加轨道控制器
```js
controls = new OrbitControls(camera, renderer.domElement)  //renderer.domElement是挂载的DOM
//可以理解轨道控制器装着相机，可以控制相机的旋转移动等
```
模型加载

```js
const loader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('gltf-pipeline路径')  //本地要放public文件夹，也可放云端
      loader.setDRACOLoader(dracoLoader)
      loader.load('模型地址'，(gltf) => {
        modelData = gltf.scene
        scene.add(modelData)   //模型数据要添加到场景scene中才能显示
      }, (val) => {
        const loadProgress = (val.loaded / val.total) * 100
        //这里可以做模型加载进度的操作，如loading
      })
    },

```
添加灯光

```js
const ambient = new THREE.AmbientLight('#FFFFFF')
scene.add(ambient) 
```
记录一下遇到的一些小问题：
##### 1、把模型加载进去后，浏览器显示一篇空白，也没有报错？
一般是相机没有对准物体，或相机离太近导致穿模，或者太远导致看到的物体太小，这个时候需要设置相机位置来调整模型物体的距离。忘记添加灯光也有可能导致看不到哦!

##### 2、当屏幕大小变化时。要让模型物体居中，并且让模型一开始一定比例展示出来
要通过设置相机的位置，从而实现模型的居中和初次渲染的显示大小比例，相机的位置可以通过模型的长度，然后分别设置相机的x,y,z轴的位置
```js
const box3 = new THREE.Box3()
      box3.expandByObject(model)    //新建一个Box3包裹盒把模型包裹起来
const center = box3.getCenter()     //获取模型的中心点
const modelSize = box3.getSize().length()  //综合计算出模型的长度值，利用它设置相机位置
camera.position.set(modelSize / 6, modelSize / 6, modelSize / 6) //根据情况设置相机距离
camera.lookAt(center)  //让相机一直看向模型
```
##### 3、当模型放大可能形成穿透，如何解决？
通过设置minDIstance(允许相机向前移动多少)，来让相机镜头和模型保持一个不会穿透的距离，距离可以通过获取模型的长度，然后设置这个距离为长度的多少倍

```js
controls.minDistance = modelSize / 10  //设置相机的可放置的最近最远距离
controls.maxDistance = modelSize / 2   //modelSzie为上面计算模型的长度值，比例根据情况设置
```
##### 4、同一个组件(例如vue)切换模型(加载不同模型)时遇到的一点小问题。
- 最初始的部分如渲染器，灯光，场景初始化可以只执行一次，其他需要销毁重新加载，不然累计加载，会造成渲染异常(几个模型同时存在，多重灯光变凉等)和浪费内存。
- 之前的动画函数还在调用执行，再进行调用的话，动画的频率会加大，导致动画很快，所以要及时解绑函数

```js
watch: {
    modelUrl() {
      cancelAnimationFrame(reqAF)  //这里的reqAF是上个模型用到的动画reqAF = requestAnimationFrame(这里是动画函数名）
      scene.remove(modelData, tipGroup, coneGroup) //前面场景是add()添加，这里用remove移除前面添加的模型，灯光等。不然之前的会累加，导致多个模型或者重复灯光(会变很亮)。
    }
  },
```


