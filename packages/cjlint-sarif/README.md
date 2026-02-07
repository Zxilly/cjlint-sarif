# cjlint-sarif

[![NPM Version](https://img.shields.io/npm/v/cjlint-sarif)](https://www.npmjs.com/package/cjlint-sarif)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

将 cjlint 输出转换为 SARIF 格式的工具库。

## 安装

```bash
npm install cjlint-sarif
# or
pnpm add cjlint-sarif
```

## 使用方法

### 命令行

```bash
npx cjlint-sarif <input-file> -o <output-file>
```

### 作为模块

```typescript
import { convert } from "cjlint-sarif";

const cjlintOutput = { /* cjlint JSON output */ };
const sarifLog = convert(cjlintOutput);
```

## GitHub Action

如需在 GitHub Actions 中使用，请参考 [cjlint-sarif-action](https://github.com/Zxilly/cjlint-sarif)。

## 许可证

MIT
