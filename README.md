# cjlint-sarif

[![NPM Version](https://img.shields.io/npm/v/cjlint-sarif)](https://www.npmjs.com/package/cjlint-sarif)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/Zxilly/cjlint-sarif/test.yml?branch=main)](https://github.com/Zxilly/cjlint-sarif/actions)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/cjlint-sarif/cjlint-sarif/pulls)
[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg)](https://pnpm.io/)

一个将 cjlint 输出转换为 SARIF 格式的工具。

## 功能特点

- 将 cjlint 的检查结果转换为标准的 SARIF 格式
- 支持命令行使用
- 支持 CommonJS 和 ES Module 两种导入方式
- 支持 GitHub Actions
- 完整的测试覆盖

## 安装

```bash
# 使用 npm
npm install cjlint-sarif

# 使用 pnpm
pnpm add cjlint-sarif

# 使用 yarn
yarn add cjlint-sarif
```

## 使用方法

### 命令行使用

```bash
cjlint-sarif <input-file> -o <output-file>
```

### 作为模块使用

```typescript
// ES Module
import { convert } from 'cjlint-sarif';

// CommonJS
const { convert } = require('cjlint-sarif');
```

### GitHub Actions

您可以在 GitHub Actions 工作流中使用此工具来转换 cjlint 的输出：

```yaml
- name: Convert CJLint to SARIF
  uses: Zxilly/cjlint-sarif@v1
  with:
    input-file: 'path/to/cjlint-output.json'
    output-file: 'output.sarif'
```

#### 输入参数

- `input-file`：（必需）cjlint JSON 输出文件的路径
- `output-file`：（可选）SARIF 输出文件的路径，默认为 'cjlint-output.sarif'

#### 版本标签

本项目使用语义化版本标签。当发布新版本时（如 `v1.2.3`），会自动更新以下标签：
- `v1`：指向最新的 1.x.x 版本
- `v1.2`：指向最新的 1.2.x 版本

您可以在工作流中使用这些标签来获取不同级别的更新：
- `@v1`：始终使用最新的主版本
- `@v1.2`：使用特定的次版本系列
- `@v1.2.3`：锁定到特定版本

#### 示例工作流

```yaml
name: Code Quality

on: [push, pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      # 运行 cjlint 并生成 JSON 输出
      - name: Run CJLint
        run: cjlint . --json > cjlint-output.json
        
      # 转换为 SARIF 格式
      - name: Convert to SARIF
        uses: Zxilly/cjlint-sarif@v1
        with:
          input-file: 'cjlint-output.json'
          output-file: 'cjlint.sarif'
          
      # 上传 SARIF 结果到 GitHub
      - name: Upload SARIF file
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: cjlint.sarif
```

## 开发

```bash
# 安装依赖
pnpm install

# 运行测试
pnpm test

# 运行测试覆盖率报告
pnpm test:coverage

# 构建项目
pnpm build

# 本地开发
pnpm dev
```

### 构建 GitHub Action

如果您要修改 GitHub Action 的代码，需要注意：

1. Action 的构建输出（`dist/action.js`）需要被提交到版本控制中
2. 每次修改 Action 相关代码后，请执行以下步骤：
   ```bash
   # 构建 Action
   pnpm build
   
   # 提交更改，包括 dist/action.js
   git add dist/action.js
   git commit -m "chore: update action distribution"
   ```

### 发布新版本

1. 更新 `package.json` 中的版本号
2. 提交更改并创建对应的版本标签：
   ```bash
   git add package.json
   git commit -m "chore: bump version to X.Y.Z"
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```
3. GitHub Actions 会自动：
   - 验证版本号匹配
   - 运行测试
   - 发布到 npm
   - 创建 GitHub Release
   - 更新主版本和次版本标签

## 技术栈

- TypeScript
- Rollup
- Vitest
- GitHub Actions

## 许可证

本项目使用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解更多详情。
