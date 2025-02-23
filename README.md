# cjlint-sarif

[![NPM Version](https://img.shields.io/npm/v/cjlint-sarif)](https://www.npmjs.com/package/cjlint-sarif)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/Zxilly/cjlint-sarif/test.yml?branch=master)](https://github.com/Zxilly/cjlint-sarif/actions)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/cjlint-sarif/cjlint-sarif/pulls)
[![Node Version](https://img.shields.io/node/v/cjlint-sarif)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg)](https://pnpm.io/)

一个将 cjlint 输出转换为 SARIF 格式的工具。

## 功能特点

- 将 cjlint 的检查结果转换为标准的 SARIF 格式
- 支持命令行使用
- 支持 CommonJS 和 ES Module 两种导入方式
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

## 技术栈

- TypeScript
- Rollup
- Vitest

## 许可证

本项目使用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解更多详情。
