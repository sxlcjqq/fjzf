1.本项目涉及 node + express + mongodb + sass + markdown + vue + webpack 多页面打包 + elementui
2.首先，使用vuejs创建一个带webpack的项目
 创建命令： vue init webpack fjzf
3.进入项目，安装依赖
命令： npm install

安装axios
npm install axios -S
安装elementui
npm install element-ui -S
npm install --save element-ui element-ui/lib/them-chalk/index.css
4.使用express generator生成器生成后端服务框架
命令：express server -e //-e为ejs模板，即html；-j为jade模板

    打开View 文件发现index.ejs比较不习惯，所以对app.js进行小改动：
“app.set('view engine', 'ejs');” 变成 “app.engine('.html', ejs.__express);app.set('view engine', 'html');”
上一行出现的ejs变量需要require ejs模块，增加代码“var ejs = require('ejs');”
5.进入生成的server目录，使用npm i 命令安装express的依赖
6.运行express：
cd ../ 到项目根目录
node server/bin/www  // 启动服务
7.用浏览器访问 http://localhost:3000/#/ ，就可以看到express运行页面了
8.在外面的package中配置"server": "node ./server/bin/www"方便运行服务
***使用 npm run dev 、 npm run server 同时开启前端和服务端（使用nodemon run 开启服务端，可以热更新）


9.安装mongodb
 cnpm install mongodb


github推送本地工程到github仓库
0-rm -fr .git  #删除本地仓库.git
1-git init                 # 本地仓库初始化，执行完后会在工程目录下生成一个.git的隐藏目录

2-git add .               # 添加所有文件到本地索引，命令用法：git add <file>

3-git commit -m "My first commit operation"   # 提交修改到本地仓库，-m选项添加提交注释

4-git remote add origin git@github.com:mayouchen123/learngit.git   # 添加远程仓库地址，保存在origin变量中


5-git push origin master      # 按照前一条命令中origin给定的github地址推送到github仓库的master分支



mongodb
1--开启mongo服务
命令：mongod
2--再开一个终端，开启mongodb命令行
命令：mongo
3--查看所有库
show dbs
4--切换到某库（myList）
use myList
5--查看某张表（users）
db.users.find()
6--往表（users）中插入数据
db.users.insert({“name”:“jqq”,“password”:“111”})
7--从表（users）中删除数据 （justOne如果设为 true 或 1，则只删除一个文档。）
db.users.remove({'name':'jqq'},{justOne:1})
8--为表（types）设置索引（字段名为text，值为1为指定按升序创建索引，如果你想按降序来创建索引指定为-1即可）
db.types.ensureIndex({“text”:1},{unique:true})
9--查看表（types）索引
db.types.getIndexes()
10--删除表（types）索引
db.types.dropIndex({"text":1})
11--关闭mongodb服务
db.shutdownServer()
12--删除集合mycollection
db.mycollection.drop()
13--查看可用集合
show collections



登陆验证。每个接口的登陆验证还没做。。。。。
