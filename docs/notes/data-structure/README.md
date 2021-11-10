---
theme: vuepress
---
#### 时间复杂度
定性计算算法运行的时间，用大写的O表示，代码执行一次为O(1),代码循环n次，就为O(n)
#### 空间复杂度
定性计算算法运行的空间，用大写的O表示，代码中使用了一个临时变量，那就是O(1),如果是一个长度为n的数组，那就是O(n)
#### 栈
特点：后进先出，用数组，常用场景：函数调用堆栈， 十进制转二进制，判断字符串的括号是否有效
##### 队列
特点：先进先出，用数组，常用场景：js任务队列，计算最近请求次数
#### 链表
特点：多个元素组成的列表，元素存储不连续，使用next指针串起来。可用Object模拟链表，数组vs链表：数组增删非首尾元素需要往往需要移动元素，链表增删非首尾元素不需要移动元素，只需要改变next的指向就可。
常用最多的是遍历链表。
#### 集合
特点：无序且唯一，用set,常用场景:数组等去重，取交集，取差集

-  去重：[...new Set(arr)]
-  交集：[...new Set(arr)].filter(item =>{ return arr2.includes(item) })
-  差集：[...new Set(arr)].filter(item =>{ return !arr2.includes(item) })
#### 字典
特点：无序且唯一的键值对。用Map,与集合类似，子典也是一种存储唯一值的数据结构，但它是以键值对的形式来存储的。
- 字典的常用操作：键值对的增删改查。 
```js
    const m = new Map()   //新建字典
    m. set('a' , 'aa')  //增
    m.get('a')  //获取
    m.delete('a')   //删
    m.clear()    //删除全部
    m.set('a' , 'aaa')  //改，也是用set方法
    m.size()  // 大小
    map.has() // 判断是否拥有
```
#### 树
特点：一种分层数据的抽象模型

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e14ccb8fafe145a2a53578c2849c5d71~tplv-k3u1fbpfcp-watermark.image?)
- 深度优先遍历(天然递归)(上图的顺序为 8 3 1 6 4 7 10 14 13 )

```js
const dfs = (root) =>{ console.log(root.val) root.children.forEach(dfs) }
```
- 广度优先遍历 (上图顺序为 8 3 10 1 6 14 4 7 13 )
1. 新建一个队列，把根节点入队
2. 把队头出队并访问
3. 把队头的children挨个入队
4. 重复第二、三步，直到队列为空

```js
const bfs = (root) =>{
  const q = [root]
  while(q.length>0){
  const n = q.shift()
  console.log(n.val)
  n.children.forEach(item => {
  q.push(item)
      })
  }}
```
##### 二叉树
特点：树中每个节点最多只能有两个子节点，在JS中通常用Object来模拟二叉树
##### 先中后序遍历(递归)
- 先序遍历
1. 访问根节点
2. 对根节点的左子树进行先序遍历
3. 对根节点的右子树进行先序遍历
```js
const preorder = (root) =>{
if(!root){
 return
}
console.log(root.val)
preorder(root.left)
preorder(root.right)
}
```
- 中序遍历
1. 对根节点的左子树进行中序遍历
2. 访问根节点
3. 对根节点的右子树进行中序遍历
```js
constinorder = (root) => {
 if(!root ) { return }
inorder(root.left)
console.log(root.val)
inorder(root.right)
}
```

- 后序遍历
1. 对根节点的左子树进行后序遍历
2. 对根节点的右子树进行后序遍历
3. 访问根节点

```js
const postorder= (root) => {
if( !root ) => { return }
postorder(root.left)
postorder(root.right)
console.log(root.val)
}
```
##### 先中后序遍历(非递归)
用堆栈模拟递归的过程
- 先序遍历 (把节点出栈，右节点先入栈，左节点后入栈，然后重复上面，每次出栈的顺序就是前序遍历的顺序)

```js
constpreorder = (root) =>{
if(!root){
return
}
const stack = [root]
while(stack.length){
const n = stack.pop()
console.log(n.val)
if(n.right) stack.push(n.right)
if(n.left) stack.push(n.left)
}
}
```
- 中序遍历

```js
const inorder = (root) =>{
if(!root){
return
}
const stack = []
let p = root
while(stack.length || p){
while(p){
stack.push(p)
 p = p.left
}
const n = stack.pop()
console.log(n.val)
p = n.right
}
}
```
- 后序遍历(利用先序遍历然后颠倒)

```js
const postorder = (root) =>{
if(!root) { return }
const outStack = []
const stack = [root]
while(stack.length){
const n = stack.pop()
outStack.push(n)
if(n.left) stack.push(n.left)
if(n.right) stack.push(n.right)
 }
while(outStack.length){
const n = outStack.pop()
console.log(n.val)
 }
 }
```

#### 图
特点：图是网络结构的抽象模型，是一组由边连接的节点
图可以表示任何二次元关系，比如道路、航班
js中没有图，可以用Object和Array构建图
图的表示法：邻接矩阵、邻接表、关联矩阵...

- 深度优先遍历
1. 访问根节点
2. 对根节点的没访问过的相邻节点挨个进行深度优先遍历

```js
const graph = {
0:[1,2],
1:[2],
2:[0,3],
3:[3]
}
const visited = new Set()
const dfs = (node) =>{
console.log(node)
visited.add(node)
graph[node].forEach( c=>{
if(!visited.has(c)){
dfs(c)
}
})
}
dfs(2)
```

- 广度优先遍历
1. 新建一个队列，把根节点入队
2. 把队头出队并访问
3. 把队头的没访问过的相邻节点入队
```js
const graph = {
0:[1,2],
1:[2],
2:[0,3],
3:[3]
}
const visited = new Set()
visited.add(2)
const q = [2]
while(q.length){
const n = q.shift()
console.log(n)
graph[n].forEach(item =>{
if(!visited.has(item)){
q.push(item)
visited.add(item)
}
})
}
```
#### 堆
特点：堆是一种特殊的完全二叉树
每一次都填满，最后一层可以缺少右边节点
所有的节点都大于等于(最大堆)或小于等于(最小堆)它的子节点
js中通常使用数组表示堆(按广度优先遍历)\
左侧子节点的位置是2*index+1（这里的位置指index顺序）
右侧子节点的位置是2*index+2
堆的应用
堆能高效、快速地找出 最大值和最小值，时间复杂度：O(1),如堆顶元素不是最大值就是最小值
- 找出第k个最大值或最小的元素
- 第k个最大元素
构建一个最小堆，并将元素依此插入堆中
当堆的容量超过K，就删除堆顶
插入结束后，堆顶就是第k个最大元素

- js实现最小堆类
在类里，声明一个数组，用来装元素
主要方法：插入、删除堆顶、获取堆顶、获取堆大小
插入：将值插入堆的底部，即数组的尾部
然后上移：将这个值和它的父节点进行交换，直到父节点小于等于这个插入的值。







