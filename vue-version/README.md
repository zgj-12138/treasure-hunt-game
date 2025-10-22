# 寻宝小游戏 - Vue版

基于Vue.js 3.x开发的寻宝小游戏，采用组件化架构设计。

## 项目结构

```
vue-version/
├── index.html              # 入口HTML文件
├── main.js                 # Vue应用入口
├── App.vue                 # 根组件
├── package.json            # 项目配置
├── vite.config.js          # Vite构建配置
├── jsconfig.json           # JavaScript配置
└── components/             # 组件目录
    ├── GameMap.vue         # 游戏地图组件
    ├── UserAuth.vue        # 用户认证组件
    ├── CollectionRoom.vue  # 收藏室组件
    └── Leaderboard.vue     # 排行榜组件
```

## 安装依赖

```bash
npm install
```

## 开发运行

```bash
npm run dev
```

## 构建生产版本

```bash
npm run build
```

## 技术栈

- Vue.js 3.x
- Vite (构建工具)
- ES6+ 模块
- localStorage (数据存储)

## 功能特性

- 用户注册/登录系统
- 地图探索功能
- 随机事件系统
- 宝藏收集系统
- 排行榜功能
- 背景音乐系统
