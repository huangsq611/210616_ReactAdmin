### 初始化项目

`create react-app 项目名称`

### git管理代码

#### 1.新建git远程仓库

![image-20210617141758044](C:\Users\86152\AppData\Roaming\Typora\typora-user-images\image-20210617141758044.png)

#### 2.新建本地仓库

点击**Git Bash Here**或者**cmd**，运行命令

`git init`

`git commit -m "init app"`

`git remote add origin https://github.com/huangsq611/210616_ReactAdmin.git`

`git push origin master`			上传第一个分支为master

![image-20210617144409046](C:\Users\86152\AppData\Roaming\Typora\typora-user-images\image-20210617144409046.png)

![image-20210617144833193](C:\Users\86152\AppData\Roaming\Typora\typora-user-images\image-20210617144833193.png)

`git checkout -b dev`			创建一个新的分支为dev

`git push origin dev`             推送到远程仓库，后续开发在dev基础上开发

`git clone https://github.com/huangsq611/210616_ReactAdmin.git`         将指定仓库代码克隆下来

`git branch`			查看当前分支是哪个

`git checkout -b dev origin/dev` 			根据远程dev分支生成本地dev分支（拉master时也拉了dev）

![image-20210617150308035](C:\Users\86152\AppData\Roaming\Typora\typora-user-images\image-20210617150308035.png)

`git pull origin dev`  				从远程dev拉取到本地dev（更新）

#### 3.目录结构介绍

<img src="C:\Users\86152\AppData\Roaming\Typora\typora-user-images\image-20210617153408977.png" alt="image-20210617153408977" style="zoom:50%;" />



### 引入Antd

#### 1.下载组件库包

`yarn add antd`

#### 2.实现组件的按需打包

##### 下载相关依赖包

`yarn add react-app-rewired customize-cra babel-plugin-import`

##### **创建配置文件config-overrides.js**

`const { override, fixBabelImports } = require('customize-cra');`

`module.exports = override(`

 `// 针对antd实现按需打包：根据import来打包`

 `fixBabelImports('import', {`

  `libraryName: 'antd',`

  `libraryDirectory: 'es',`

  `style: 'css',`

 `}),`

`);`

修改配置文件package.json文件中的打包命令

![image-20210627170500620](C:\Users\86152\AppData\Roaming\Typora\typora-user-images\image-20210627170500620.png)

#### 3.自定义antd主题

使antd的默认基本颜色从blue变为green

##### 3.1.下载工具包

`yarn addless less-loader`

##### 3.2.修改config-overrides.js

``onst {override, fixBabelImports, addLessLoader} = require('customize-cra');`

`module.exports = override(`

 `fixBabelImports('import', {`

  `libraryName: 'antd',`

  `libraryDirectory: 'es',`

  `style: true,`//由原来的css改为true

 `}),`

 `addLessLoader({`

  `javascriptEnabled: true,`

  `modifyVars: {'@primary-color': '#1DA57A'}`

 `})`

`);`

##### 3.3.报错

**报错**：安装less-loader后重新打包报错，TypeError: this.getOptions is not a function

![image-20210627175722828](C:\Users\86152\AppData\Roaming\Typora\typora-user-images\image-20210627175722828.png)

**原因：** less-loader安装的版本过高
**解决方案：** 

1.卸载   npm uninstall less-loader  或yarn remove less-loader --dev
2.安装低版本   npm install less-loader@6.0.0      或yarn add less-loader@5.0.0 --dev

### 引入路由

#### 1.下载路由包：react-router-dom

`yarn add react-router-dom`



### antd升级为4.0

#### 1、icon组件

**关于antd升级为4.0 不再内置icon组件， 循环渲染动态icon的解决方案**

方法一：数据库存储时就存储组件   

`icon: <MailOutlined />`		

需要导入图标库

方法二：写一个方法获取icon

第一种：

```react
export const getIcon = string => {
    return {
        AuditOutlined:<AuditOutlined/>,
        AppstoreAddOutlined:<AppstoreAddOutlined/>,
        ContactsOutlined:<ContactsOutlined />,
        ControlOutlined:<ControlOutlined/>,
        FormOutlined:<FormOutlined/>,
        FileTextOutlined:<FileTextOutlined/>,
        HighlightOutlined:<HighlightOutlined/>,
        ProfileOutlined:<ProfileOutlined/>,
        TeamOutlined:<TeamOutlined/>,
        TagsOutlined:<TeamOutlined/>,
        CopyOutlined:<CopyOutlined/>,
        CheckCircleOutlined:<CheckCircleOutlined/>,
        ExclamationCircleOutlined:<ExclamationCircleOutlined/>,
        BlockOutlined:<BlockOutlined/>
    }[string]}

<MenuItem key={item.key} icon={getIcon(item.icon)}>{item.name}</MenuItem>
```

第二种：没成功，报错！！！

`import * as Icons from "@ant-design/icons";`

`const renderIcon = (iconName) => {`

​	`return React.createElement(Icons[iconName])` 

`}`

![image-20210706171546231](C:\Users\86152\AppData\Roaming\Typora\typora-user-images\image-20210706171546231.png)

#### 2、Form.create()--已弃用  

包装组件，传入特点属性form，v4 的 Form 不再需要通过 `Form.create()` 创建上下文。Form 组件现在自带数据域，因而 `getFieldDecorator` 也不再需要，直接写入 Form.Item 即可

![image-20210630155829976](C:\Users\86152\AppData\Roaming\Typora\typora-user-images\image-20210630155829976.png)

### Promise简单介绍

https://www.jianshu.com/p/270fec5b33ce

1、`Promise` 对象是一个代理对象（代理一个值），被代理的值在`Promise`对象创建时可能是未知的。它允许你为异步操作的成功和失败分别绑定相应的处理方法（`handlers`）。

2、一个 `Promise`有以下几种状态:
 (1) `pending`: 意味着操作正在进行。
 (2) `fulfilled`: 意味着操作成功。
 (3) `rejected`: 意味着操作失败。

`pending` 状态的 `Promise` 对象可能触发`fulfilled` 状态并传递一个值给相应的状态处理方法，也可能触发失败状态（`rejected`）并传递失败信息。当其中任一种情况出现时，`Promise` 对象的`then` 方法绑定的处理方法（`handlers` ）就会被调用（`then`方法包含两个参数：`onfulfilled` 和 `onrejected`（可选参数），它们都是 `Function` 类型。

resolve()----成功		callback()---成功

reject()----失败				callback('...')---失败，提示信息



在外层包一个自己创建的promise对象，在请求出错时，不reject(error)，而是显示错误提示

`export default function  ajax(url, data = {}, method = 'GET') {` 

​	`return new Promise(function (resolve, reject) {` 

​		`let promise //执行异步ajax请求` 

​		`if (method === 'GET') {`

​			`promise = axios.get(url, {params: data}) // params 配置指定的是 query 参数` 

​		`} else {` 

​			`promise = axios.post(url, data)` 

​		`}`

​		`promise.then(response => {` 

​			`//如果成功了,调用 resolve(response.data)`

​			`resolve(response.data)` 

​		`}).catch(error => { // 对所有 ajax 请求出错做统一处理,外层就不用再处理错误了`

​			`// 如果失败了, 提示请求后台出错`

​			`message.error('请求错误: ' + error.message)` 

​		`})` 

​	`})` 

`}`

### 前后台交互ajax

下载依赖包

`yarn add axios`

封装ajax请求模块



 代理，解决跨域问题		proxy



### asyc和await

消灭回调函数

#### 1.作用

简化promise对象的使用：不用再使用then()来指定成功/失败的回调函数

以同步编码（没有回调函数了）方式来实现异步编程 

#### 2.哪里写await

在返回promise表达式的左侧写await：不想要promise，想要promise异步执行成功的value数据

#### 3.哪里写asyc

await所在函数（最近的）定义的左侧写aysc

### store库

`yarn add store`

基本支持所有浏览器，且写法比Local Storage简洁



### jsonp

下载依赖：`yarn add jsonp`

引入：`import jsonp from 'jsonp'`

**用来解决跨域问题，但是只能解决GET类型的ajax请求跨域问题**

jsonp请求不是ajax请求，而是一般的get请求

**原理**：利用<script>标签没有跨域限制的“漏洞”来达到与第三方通讯的目的

​	浏览器端：

​		**动态生成<script>**来请求后台接口（src就是接口的url）

​		定义好用于接收相应数据的函数，并**将函数名通过请求参数提交给后台**（如：callback=fn）

​	服务器端：

​		接收到请求处理产生结果数据后，**返回一个函数调用的js代码**，并将结果数据作为实参传入函数调用

​	浏览器端：

​		收到响应自动执行函数调用的js代码，也就执行了提前定义好的回调函数，并得到了需要的结果数据

![image-20210708112912802](C:\Users\86152\AppData\Roaming\Typora\typora-user-images\image-20210708112912802.png)

使用：

![image-20210708113109443](C:\Users\86152\AppData\Roaming\Typora\typora-user-images\image-20210708113109443.png)

### 随手写一写

维持登录、免登录（刷新、关闭浏览器、关闭电脑后还是登录状态）

Local Storage

Cookie

Session Storage



阻止事件的默认行为		event.preventDefault();

alt+方向左键<----    回退



#### 页面跳转

1、事件回调函数中跳转用history

`this.props.history.replace()`   不可以回退

`his.props.history.push()`   可以回退

2、自动跳转到登录页面（在render()中使用）

`return <Redirect to='/login' />`

https://tianqiapi.com/api?version=v6&appid=15991749&appsecret=3Ck5IKrt&city=深圳



#### **map**



#### **reduce**

https://blog.csdn.net/weixin_28951585/article/details/112413874

定义：对数组中的每个元素执行一个自定义的累计器，将其结果汇总为单个返回值

形式：array.reduce((t, v, i, a) => {}, initValue)

参数

callback：回调函数(必选)
initValue：初始值(可选)
回调函数的参数

total(t)：累计器完成计算的返回值(必选)

value(v)：当前元素(必选)

index(i)：当前元素的索引(可选)

array(a)：当前元素所属的数组对象(可选)

过程

以t作为累计结果的初始值，不设置t则以数组第一个元素为初始值

开始遍历，使用累计器处理v，将v的映射结果累计到t上，结束此次循环，返回t

进入下一次循环，重复上述操作，直至数组最后一个元素

结束遍历，返回最终的t

reduce的精华所在是将累计器逐个作用于数组成员上，把上一次输出的值作为下一次输入的值。

reduce实质上是一个累计器函数，通过用户自定义的累计器对数组的元素进行自定义累计，得出一个由累计器生成的值。另外reduce还有一个胞弟reduceRight，两个方法的功能其实是一样的，只不过reduce是升序执行，reduceRight是降序执行。

对空数组调用reduce()和reduceRight()是不会执行其回调函数的，可认为reduce()对空数组无效



**非路由组件，没有location属性，引起报错的解决办法**

![image-20210707104437809](C:\Users\86152\AppData\Roaming\Typora\typora-user-images\image-20210707104437809.png)

**withRouter()**   高阶组件：

包装非路由组件，返回一个新的组件，新的组件向非路由组件，传递三个属性：history/location/match

![image-20210707105726134](C:\Users\86152\AppData\Roaming\Typora\typora-user-images\image-20210707105726134.png)



**向下箭头----添加伪元素**

![image-20210707165010717](C:\Users\86152\AppData\Roaming\Typora\typora-user-images\image-20210707165010717.png)

`.header-bottom-left{`

​      `position: relative;`

​      `width: 25%;`

​      `text-align: center;`

​      `font-size: 20px;`

​      `&::after {`

​        `content: '';`

​        `position: absolute;`

​        `top: 100%;`

​        `right: 50%;`

​        `transform: translateX(50%);`

​        `border-top: 20px solid white;`

​        `border-right: 20px solid transparent;`

​        `border-bottom: 20px solid transparent;`

​        `border-left: 20px solid transparent;`

​      `}`

​    `}`
