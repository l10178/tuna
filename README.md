# tuna

庄周吃鱼，利用 AI、大数据、云计算、区块链等技术，解决 X 条件下如何选择 Y 的问题。

应用场景：

1. 摇一摇吃什么，摇出你的食谱，如有多人同时摇再根据食谱中的石头、剪刀、步确定胜负。
2. 随机摇色子，年会抽奖，班级点名。
3. 生存还是毁灭，二选一。

## 本地开发

本项目使用 [OpenSaas](https://opensaas.sh) 开发。

项目结构：

1. `app` - 应用的 Web 页面，基于 [Wasp](https://wasp-lang.dev)。
2. `e2e-tests` - Test，基于 [Playwright](https://playwright.dev/).
3. `blog` - Blog 和 Doc，基于 [Astro](https://docs.astro.build) 的 [Starlight](https://starlight.astro.build/) 模板 。

### 开发环境准备

1. 安装 Node.js 20+，建议使用 [nvm](https://github.com/nvm-sh/nvm) 安装和管理。
2. 安装 Wasp，参考 [此文档](https://docs.opensaas.sh/start/getting-started/)。
3. 安装并启动 Docker，下面的 DB 服务使用 Docker 启动。

### 本地启动

启动前请参考 [OpenSaas 官方文档](<https://docs.opensaas.sh/start/getting-started/>)。

```bash
# 1. 先启动 DB 服务
cd app
wasp start db

# 2. 启动 Web App
cd app
# app run http://localhost:3000
wasp start

# 如果想启动 Blog and Docs
cd blog
npm install
# blog run https://localhost:4321/
npm run dev

```

## 概念介绍

Recipe，食谱，一个食谱就是一组规定好的 Api，确定基于哪些条件摇出什么样的结果。举例如下。

- 干不干：这里有硬币的正反面，只能得出一种结果。顺便说明一下，再摇 10 次也是这个结果。
- 中午吃什么：基于食谱菜单选出一种组合，如果需要可能附带下午茶。
- 周末去哪玩：五棵松方圆 10 公里的公园应该去哪一个。
- 宝宝吃什么：基于（你或网友）精心收集的宝宝餐，根据当前时间，确定现在适合吃哪几种。友情提醒宝宝适合一日多餐，且需自行把控菜单列表。

所以你懂了，你应该 fork 此项目定制自己的食谱。

定制自己的规则，请实现以下 API：

- catalog
- recipes

## 私有化部署

## TODO

- 首页体验优化
- 代码风格统一
- 插件化开发，每个人可完全自定义实现

## License

基于 Apache-2.0 License。
