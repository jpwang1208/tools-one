# Tools One - 开发者工具集成平台

基于 Tauri + React + TypeScript 构建的跨平台桌面工具集。

## 功能特性

### 🔧 JSON 格式化工具
- JSON 格式化、验证、压缩
- JSON 转义/去转义
- Unicode 转换
- 树形视图浏览
- 历史记录管理

### 🔐 加密工具

#### 哈希算法
- **MD5** - 生成 MD5 哈希值
- **SHA256** - 生成 SHA-256 哈希值
- **SHA512** - 生成 SHA-512 哈希值

#### 编解码
- **Base64** - Base64 编码/解码
- **Hex** - 十六进制编码/解码
- **URL** - URL 编码/解码

#### 对称加密
- **AES-256-CBC** - 使用 AES-256-CBC 模式进行加密/解密
- 自动生成密钥和 IV

#### 非对称加密
- **RSA** - RSA 加密/解密 (支持 1024/2048/4096 位)
- **ECC** - 椭圆曲线加密 (P-256 曲线，ECIES 方案)

#### 密钥生成器
- AES 256 位密钥生成
- AES 128 位 IV 生成
- RSA 密钥对生成 (1024/2048/4096 位)
- ECC P-256 密钥对生成
- 随机密钥生成 (16/32/64 字节)

## 项目结构

```
tools-one/
├── src/
│   ├── components/          # 共享组件
│   │   ├── Sidebar.tsx      # 侧边栏导航
│   │   └── Sidebar.css
│   ├── tools/               # 工具集合
│   │   ├── index.ts         # 工具注册表
│   │   ├── json/            # JSON 工具
│   │   │   └── components/
│   │   │       └── JSONFormatter.tsx
│   │   └── crypto/          # 加密工具
│   │       └── components/
│   │           └── CryptoTool.tsx
│   ├── utils/               # 工具函数
│   │   └── jsonUtils.ts
│   ├── types/               # 类型定义
│   │   └── index.ts
│   ├── App.tsx              # 主应用
│   ├── App.css
│   └── main.tsx
├── src-tauri/               # Tauri/Rust 后端
│   └── src/
│       └── crypto.rs        # 加密功能 Rust 实现
└── package.json
```

## 版本历史

### v1.0.1
- 新增加密工具功能
- 支持 MD5/SHA256/SHA512 哈希
- 支持 Base64/Hex/URL 编解码
- 支持 AES-256-CBC 对称加密
- 支持 RSA/ECC 非对称加密
- 支持密钥对生成

### v1.0.0
- 初始版本
- JSON 格式化工具

## 技术栈

- **前端**: React + TypeScript + Vite
- **后端**: Rust + Tauri
- **UI**: 自定义 CSS
- **加密**: Rust crypto 库 (aes, rsa, p256, sha2, md5 等)

## 下载

从 [GitHub Releases](https://github.com/jpwang1208/tools-one/releases) 下载各平台安装包。

支持平台：
- Windows
- macOS (Intel & Apple Silicon)
- Linux

## License

MIT

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

