1.本项目涉及 node + express + mongodb + sass + markdown + vue + webpack 多页面打包 + elementui
2.首先，使用vuejs创建一个带webpack的项目
 创建命令： vue init webpack fjzf
3.进入项目，安装依赖
命令： npm install

安装axios
npm install axios -S
安装elementui
npm install element-ui -S

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
***使用 npm run dev 、 npm run server 同时开启前端和服务端



github推送本地工程到github仓库
1-git init                 # 本地仓库初始化，执行完后会在工程目录下生成一个.git的隐藏目录

2-git add .               # 添加所有文件到本地索引，命令用法：git add <file>

3-git commit -m "My first commit operation"   # 提交修改到本地仓库，-m选项添加提交注释

4-git remote add origin git@github.com:mayouchen123/learngit.git   # 添加远程仓库地址，保存在origin变量中


5-git push origin master      # 按照前一条命令中origin给定的github地址推送到github仓库的master分支