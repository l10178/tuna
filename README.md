# tuna

庄周吃鱼，利用 AI、大数据、云计算、区块链等技术，解决 X 条件下如何选择 Y 的问题。

应用场景：

1. 中午吃什么，摇出你的食谱，如有多人同时摇再根据食谱中的石头、剪刀、步确定胜负。
2. 随机摇色子，年会抽奖，班级点名。
3. 生存还是毁灭，二选一。
4. 周末去哪玩：五棵松方圆 10 公里的公园应该去哪一个。
5. 宝宝吃什么：基于（你或网友）精心收集的宝宝餐，根据当前时间，确定现在适合吃哪几种。友情提醒宝宝适合一日多餐，且需自行把控菜单列表。

## 本地开发

### 项目结构

1. `app` - 应用的 Web 页面，基于 [React](https://react.dev/) 开发，需要本地安装 Node.js 20+，建议使用 [nvm](https://github.com/nvm-sh/nvm) 安装和管理。
2. `backend` - 后端服务，Spring Boot 3，需要本地安装Java，建议使用 [sdkman](https://sdkman.io/) 安装和管理。
3. `blog` - 本项目相关 Blog 和 Docs，使用 [Hugo](https://gohugo.io/) 开发。

### 前端项目

```bash
# 安装依赖包
npm install
# 启动项目
npm start

```

## 概念介绍

- recipe
- recipe collections
- policy
- application = policy + recipe collections
- marketing
- plugin

## 私有化部署

## TODO

- 首页体验优化
- 代码风格统一
- 插件化开发，每个人可完全自定义实现

## License

基于 Apache-2.0 License。保留**庄周吃鱼**项目所有权。
