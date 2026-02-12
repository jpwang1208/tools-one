#!/bin/bash

# 版本号同步脚本
# 用法: ./scripts/bump-version.sh 1.0.5

NEW_VERSION=$1

if [ -z "$NEW_VERSION" ]; then
    echo "❌ 请提供版本号，例如: ./scripts/bump-version.sh 1.0.5"
    exit 1
fi

echo "🚀 升级版本到 $NEW_VERSION"

# 更新 package.json
sed -i '' "s/\"version\": \"[0-9.]*\"/\"version\": \"$NEW_VERSION\"/" package.json
echo "✅ package.json"

# 更新 Cargo.toml
sed -i '' "s/^version = \"[0-9.]*\"/version = \"$NEW_VERSION\"/" src-tauri/Cargo.toml
echo "✅ Cargo.toml"

# 更新 tauri.conf.json
sed -i '' "s/\"version\": \"[0-9.]*\"/\"version\": \"$NEW_VERSION\"/" src-tauri/tauri.conf.json
echo "✅ tauri.conf.json"

# 更新 version.ts
sed -i '' "s/APP_VERSION = '[0-9.]*'/APP_VERSION = '$NEW_VERSION'/" src/config/version.ts
echo "✅ version.ts"

# 提交更改
git add -A
git commit -m "chore: bump version to $NEW_VERSION"

echo ""
echo "✨ 版本升级完成！"
echo "📦 现在可以创建 tag 并推送:"
echo "   git tag v$NEW_VERSION"
echo "   git push origin main v$NEW_VERSION"
