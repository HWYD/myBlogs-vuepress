---
theme: channing-cyan
---

#### 前言
  git是现在很流行的代码版本管理工具，我们需要学习并且掌握好它。我们在项目中使用git会遇到非常多种情况，本文分类了一下常见的情况，感兴趣的你也来看看吧!

### 本地项目进行git 初始化
 如果要对本地的某个项目进行git管理
 
```js
    git init
```


### 创建新项目加入git管理
1.在github或gitee上创建一个新的仓库用来存放项目，成功后也就是这个项目的文件夹了

![cangku.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/625db88857a54d2f891e83a4e0a28e01~tplv-k3u1fbpfcp-watermark.image?)

在自己电脑拉取项目文件，然后进行在该文件夹下可以进行写代码(搭建项目，写业务)
```js
  git clone '项目地址'  
```
然后在该项目文件夹下有文件更新后,再提交到远程

```js
git add .
git commit -m '你的描述'
git push 
```

2. 本地有git开发了(开发到一半或完成)的项目，没有远程仓库，想创建远程仓库，并进行关联。
  
 - 创建远程仓库，不要初始化，也就是一个没有提交记录的空仓库，然后进行关联和推送
```js
git remote add origin 远程仓库地址   // origin 是远程仓库别名
git push -u origin "master"      
```


### 添加ssh公钥？
如果是使用https，而不是用ssh的话，那么每次push代码都得填写用户名和密码，要是设置了ssh密钥的话，就不用，方便一点。

### 加入项目团队，需要拉取远程代码
- 刚加入项目组或新入职，都会让你拉取现有的项目到个人的电脑

```js
  git clone '项目ssh的地址'
  
  或者
  git clone '项目https的地址'
```
### 检测当前文件状态
    
```js
  git status
```

### 查看之前跟踪过(已提交)的文件，现在修改了，但还没缓存，这些文件修改了什么

```js
git diff
```
### 查看本地现有分支(带*号当前所处的分支)

```js
git branch
```
如下图有四个分支，带*表示当前处于该分支

![1.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1f17f2b56c3493795d141efcbeda4b3~tplv-k3u1fbpfcp-watermark.image?)

### 查看远程现有分支
```js
git branch -r
```
如下图远程只有一个master分支

![branch-r.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5043627e67d64f32a9b837fa8317d855~tplv-k3u1fbpfcp-watermark.image?)

### 查看所有分支

```js
git branch -a
```
### 查看本地和远程分支是否同步和关联
- 建议在每次修改代码想要提交前都查询一次

```js
git fetch         // 这个是用来获取远程分支的最新数据，不会对本地代码有影响
git branch -vv    //列出所有分支及对应的远程分支的情况
```
如图，分支abc本地落后(behind)远程2个提交记录
![本地落后远程的.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c976c33fc2e8470fa17dde435f64d071~tplv-k3u1fbpfcp-watermark.image?)
如图，分支abc本地领先(ahead)远程2个提交记录

![本地领先远程的.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d756effd905a4e5f8653e06eadbad1df~tplv-k3u1fbpfcp-watermark.image?)

### 设置对应的远程分支推送
这个可以设置本地的某些分支对应远程的某些分支，如下面本地develop对应远程develop

- origin是仓库别名，develop是分支名(如果改过仓库别名，请对应替换)
- 这样子的好处是每次push,只需要写git push,而不用写git push origin dev
#### 设置前

```js
git push origin develop    
```
#### 进行设置
```js
git push -u origin develop    // 本地有develop分支，远程没有的情况下
或
git push --set-upstream origin develop  //本地远程都有develop分支的情况下
```

#### 设置后(就不用带上仓库名和分支了)
```js
git push  
```


### 本地代码没有修改或更新，远程代码更新了,本地代码想获取最新


```js
git fetch
git pull
```


### 同一个分支远程代码没有更新，本地更新了代码，想要更新上去

```js
git add .
git commit -m '写你想描述的信息'
git push
```

### 同一个分支本地有更新，远程也有更新
这种情况假设你和同学都在develop分支上工作，当你改好代码想要推送时，发现同学已经在远程develop分支推送更新过了，那么你可以先把你修改的储存起来，然后进行代码拉去，然后再把你的储存放出来，进行推送操作。注：这也使用其他情况，如：开发到一半需要去别的分支解决bug

```js
git stash -a -m '描述储存的信息'    // -a是表示所有改动包括新建文件这些没有跟踪过的
git stash list      // 查看所有储存，根据提交的信息找到想要的
git stash apply  储存的id      //这是将之前储存的文件放出来，这个操作在别的分支也可以做
```
如图，通过git stash list 看到储存列表，红色框的 stash@{0} 就是储存id

![stash.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e228a909b8e4633a134e673195dfc96~tplv-k3u1fbpfcp-watermark.image?)
### 合并代码(在本分支把其他分支的代码合并过来)

```js
// 假设在master分支操作
git merge develop   // 合并本地的 develop
// 或你也可以合并远程的
git merge origin develop
```
如果合并后没有问题，就可以push推送到远程分支。


### 合并的代码有冲突

- 这是你要合并进来的分支的内容跟你这个分支修改了同一个地方，所以需要你手动进行选择，去采用合并进来的，还是你这个分支原有的，或者你还可以修改其他。
- 修改后就再进行一次提交，就可以解决冲突了。
如图，如果有冲突，可以在vscode等编辑器看到类似这种情况
1. Accept Current Change:用这个分支之前的修改；
2. Accept Incoming Change:引用其他分支的合并进来(传进来)的修改，
3. Accept Both Changes:两边修改都接受；
4. Compare Changes:你可以看一下两者的对比情况

![合并冲突.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e791cb4df6348f3b90c4f52096ad003~tplv-k3u1fbpfcp-watermark.image?)

### 回退到上一个版本
```js
    git reset HEAD^ 
```  

### 本地仓库回退到指定版本
一般我们git log 查找一下我们要回退的版本的id，下图一串长长的数字就是那个id

![log.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/909aa01c79154aebba360f61fd33071e~tplv-k3u1fbpfcp-watermark.image?)

```js

git reset 版本的id
```

### 远程仓库回退

```js
 git reset --hard '提交版本id'  // 本地先回退到对应版本   
 git push -f    //强制推送到远程，也就实现了回退
```
    


### 创建本地新分支
```js
    git branch (branchname)
``` 
### 新建远程分支
如果本地有该分支，远程没有(如果本地也没有，那么就先新建本地的)

```js
  git push -u origin 分支名
```
### 切换分支
```js
    git checkout (branchname)
    或
    git switch (branchname)
``` 
### 删除本地某个分支

```js
git branch -d 分支名
```
### 删除远程某个分支

```js
git push origin --delete 分支名
```
#### 结束语

本文分享了一些git的常用场景，如果对你有所帮助，我很开心。如果你也在学习git，我建议深入阅读git的官方文档，并自己创建仓库进行实践。
[git官方文档](https://git-scm.com/book/zh/v2)
    







