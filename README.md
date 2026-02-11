# Tools One - 开发者工具集成平台

基于 Tauri + React + TypeScript 构建的跨平台桌面工具集。

## 项目结构

```
tools-one/
├── src/
│   ├── components/          # 共享组件
│   │   ├── Sidebar.tsx      # 侧边栏导航
│   │   └── Sidebar.css
│   ├── tools/               # 工具集合
│   │   ├── index.ts         # 工具注册表
│   │   ├── JSONFormatter.tsx    # JSON 格式化工具
│   │   └── JSONFormatter.css
│   ├── utils/               # 工具函数
│   │   └── jsonUtils.ts
│   ├── types/               # 类型定义
│   │   └── index.ts
│   ├── App.tsx              # 主应用
│   ├── App.css
│   └── main.tsx
├── src-tauri/               # Tauri/Rust 后端
└── package.json
```

## 已集成工具

- **JSON 格式化工具** - JSON 格式化、验证、压缩、转义、Unicode 转换

## 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run tauri:dev

# 构建应用
npm run tauri:build
```

## 添加新工具

1. 在 `src/tools/` 创建工具组件
2. 在 `src/tools/index.ts` 注册工具
3. 工具自动出现在侧边栏

