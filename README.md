This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## `安装说明`

### `安装依赖`
先使用`npm i`安装相关依赖
### `数据库`
可以在数据库中直接运行`todolist.sql`文件
### `调试`
将`package.json`里的`proxy:`后的路径改成你自己的域名+mysql.js中定义的端口号

把mysql.js中的数据库的用户名密码改成你自己的数据库的用户名密码

进入`server`目录下使用`node mysql.js`命令

然后使用命令`npm start`

会自动打开`localhost:3000`进行调试
### `build`
调试完成后，运行`npm run build`，生成打包文件夹`build`。
### `服务器`
可以采用nginx或apache，因为要解决跨域问题，所以要用到端口转发，用这两个会比较方便一些

接着将`build`文件夹下的所有文件放到nginx或apache指定的目录下，或者修改nginx或apache的访问路径

然后监听默认端口，当访问路径为`/api/`时，转发到mysql.js中定义的端口号

### `运维`
先安装pm2，`npm install -g pm2`

再进入`server`目录下使用`pm2 start mysql.js --watch`命令

加上`--watch`可以实时监控对应文件是否发生变化，可以自动重载

可以使用`pm2 monit 0（对应进程号）'实时监控该进程

## `设计文档`
### `数据管理`
有3种数据管理方式模板，`component state`，`hooks`和`redux`，开发时可选用，或结合使用
### `页面路由`
使用`HashRouter`，此时会在路径中加一个`/#`，如果直接使用`BrowserRouter`的话可能会造成无法访问到页面，因为服务器端的绝对路径并不存在对应文件。
### `数据库`
使用`mysql`数据库，因为跟它的接触时间比较长，所以选择用它，当然，因为这个项目并不需要多么复杂强大的功能，用它也比较方便。

初步划分成四个表，`user`储存用户数据，`list`储存用户的todo数据，`load_time`储存用户的页面加载耗时，`login_times_daily`储存每日活动用户数
### `登录页面`
先查询`localStorage`中是否有`loginInfo`，若有，则先对用户的`apikey`进行前端初步鉴权

这里apikey直接使用当前时间戳，apikey过期时间为60\*1000\*1000ms，若过期，则`销毁loginInfo`，
若不过期则使用`当前loginInfo`登录，后续的每一步操作都由后端对`数据库中的apikey`进行鉴权，即`mysql.js`里的`checkapikey`

若使用用户名密码进行登录会获取到一个新的apikey更新到数据库和localStorage中。
在不同设备登录时，前一设备的apikey会失效，无法进行操作并强制退出登录。

密码会经过`MD5和加盐`加密，加密方法在`src/common/js/api.js`文件中，我认为前端直接加密可以减小密码泄露的风险，当然还有更加安全的加密方法，可以加入随机数加密等，这里暂时不做。

当天首次使用用户名密码登录时会视为活动用户，并将`login_times_daily`表中对应日期的`times`+1

### `注册页面`
会先查询数据库中是否含有相同的`username`，若有，则注册失败，即用户名不能重复。

密码同样会经过在`src/common/js/api.js`文件中的加密方法进行加密。

注册时也会视为活动用户，并将`login_times_daily`表中对应日期的`times`+1

### `TodoList页面`
设计了添加、删除、修改任务名、修改任务状态（完成/未完成）、登出，五个动作。

在`TodoItems`中使用map函数对每个item进行操作，根据item的属性返回相应的tag，达到对其属性的可视化显示。

#### `添加任务`
检测输入框变化，用`OnChange`实时将输入的数据保存到`this.inputElement`，
用`Onkeydown`检测到按下回车键提交添加，数据传入后端时，后端进行`apikey`鉴权，通过则添加，不通过则返回失败，并强制退出登录。
#### `修改任务名`
先利用`settimeout`方式检测鼠标是单击或双击，单击修改，双击则删除，当然也可以设计三击作其他用途

单击对应item时，将其`isChange`改为`true`，然后触发render重新加载数据，此时该item的标签会被设置为input，就可以对其进行修改

apikey鉴权与上面一致
#### `删除任务`
当检测到鼠标双击，则触发删除函数，删除该item并重新render

#### `修改任务状态`
使用`checkbox`,勾选或取消勾选则触发对应函数，将数据传给后端，以上方法都必须在后端确认数据库中数据已修改成功才会触发render更新界面。

#### `登出`
直接销毁localStorage中的loginInfo，并返回到登录界面

### `api请求`
所有的`后端api请求`都在`src/common/js/action.js`里，并且让登录，注册，添加，获取，删除,修改任务都经过同一个函数，使得设计更加结构化，也简化了代码。

## `使用说明`
DEMO：[TodoList](https://www.xinony.cn).
首页为登录界面，若无用户名密码则需先注册，注册完后自动登录
登录之后在输入框中输入`你的Task`，并按`ENTER`键即可添加任务，添加完任务后，可对任务进行操作：

单击修改，双击删除，勾选完成，取消勾选未完成。
使用完可以登出，若不登出，在不删除localStorage的情况下，下次可无需登录，但是账号登录有效时间为1000分钟，超时也需重新登录。
